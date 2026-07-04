import {
	CfnOutput,
	Duration,
	RemovalPolicy,
	Size,
	Stack,
	type StackProps,
} from "aws-cdk-lib";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
	CachePolicy,
	Distribution,
	Function,
	FunctionCode,
	FunctionEventType,
	HeadersFrameOption,
	HeadersReferrerPolicy,
	OriginAccessIdentity,
	ResponseHeadersPolicy,
	ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import type { Construct } from "constructs";

export interface LucidMusicianStackProps extends StackProps {
	domainName: string;
}

export class LucidMusicianStack extends Stack {
	constructor(scope: Construct, id: string, props: LucidMusicianStackProps) {
		super(scope, id, props);

		const { domainName } = props;

		// Create S3 bucket for website hosting (private; served only via CloudFront)
		const websiteBucket = new Bucket(this, "WebsiteBucket", {
			blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		// Deploy built website files (from ../dist) to S3 bucket
		new BucketDeployment(this, "WebsiteDeployment", {
			sources: [Source.asset("../dist")],
			destinationBucket: websiteBucket,
			prune: false,
			memoryLimit: 1024,
			ephemeralStorageSize: Size.gibibytes(2),
		});

		const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
			domainName,
		});

		// Create SSL certificate covering apex + www
		const certificate = new Certificate(this, "Certificate", {
			domainName,
			subjectAlternativeNames: [`www.${domainName}`],
			validation: CertificateValidation.fromDns(hostedZone),
		});

		// Create origin access identity for S3
		const originAccessIdentity = new OriginAccessIdentity(
			this,
			"OriginAccessIdentity",
		);
		websiteBucket.grantRead(originAccessIdentity);

		// CloudFront Function: redirect www -> apex + ensure https (defense in depth)
		const normalizeHostFunction = new Function(this, "NormalizeHostFunction", {
			comment: "Redirect www to apex and enforce https",
			code: FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var headers = request.headers;
  var hostHeader = headers.host ? headers.host.value : '';
  var uri = request.uri || '/';

  // Redirect www to non-www (apex)
  if (hostHeader.startsWith('www.')) {
    var apexHost = hostHeader.slice(4);
    var location = 'https://' + apexHost + uri;
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        'location': { value: location },
        'cache-control': { value: 'max-age=3600' }
      }
    };
  }

  // If somehow http reached here, force https (viewer policy usually handles this)
  // We do not inspect scheme here; CloudFront adds cloudfront-viewer-https or similar in some events.
  return request;
}
			`),
		});

		// Security headers policy including HSTS (helps Google/browsers prefer HTTPS)
		const securityHeadersPolicy = new ResponseHeadersPolicy(this, "SecurityHeadersPolicy", {
			comment: "Security headers + HSTS for lucidmusician.com",
			securityHeadersBehavior: {
				strictTransportSecurity: {
					override: true,
					accessControlMaxAge: Duration.days(365),
					includeSubdomains: true,
					preload: true,
				},
				contentTypeOptions: {
					override: true,
				},
				frameOptions: {
					override: true,
					frameOption: HeadersFrameOption.DENY,
				},
				referrerPolicy: {
					override: true,
					referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
				},
			},
		});

		// Create CloudFront distribution for website
		const websiteDistribution = new Distribution(this, "WebsiteDistribution", {
			certificate: certificate,
			domainNames: [domainName, `www.${domainName}`],
			defaultRootObject: "index.html",
			defaultBehavior: {
				origin: new S3Origin(websiteBucket, { originAccessIdentity }),
				viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				cachePolicy: CachePolicy.CACHING_OPTIMIZED,
				functionAssociations: [
					{
						function: normalizeHostFunction,
						eventType: FunctionEventType.VIEWER_REQUEST,
					},
				],
				responseHeadersPolicy: securityHeadersPolicy,
			},
			errorResponses: [
				{
					httpStatus: 403,
					responseHttpStatus: 404,
					responsePagePath: "/404.html",
					ttl: Duration.seconds(10),
				},
				{
					httpStatus: 404,
					responseHttpStatus: 404,
					responsePagePath: "/404.html",
					ttl: Duration.seconds(10),
				},
			],
		});

		// Create DNS records for website
		new ARecord(this, "RootDomainARecord", {
			zone: hostedZone,
			recordName: domainName,
			target: RecordTarget.fromAlias(new CloudFrontTarget(websiteDistribution)),
		});

		new ARecord(this, "WwwARecord", {
			zone: hostedZone,
			recordName: `www.${domainName}`,
			target: RecordTarget.fromAlias(new CloudFrontTarget(websiteDistribution)),
		});

		new CfnOutput(this, "WebsiteDistributionDomainName", {
			description: "The domain name of the website distribution",
			value: websiteDistribution.domainName,
		});

		new CfnOutput(this, "WebsiteBucketName", {
			description: "The name of the website bucket",
			value: websiteBucket.bucketName,
		});

    new CfnOutput(this, "CertificateArn", {
      description: "The ARN of the certificate",
      value: certificate.certificateArn,
    });
	}
}
