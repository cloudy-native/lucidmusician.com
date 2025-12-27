#!/opt/homebrew/opt/node/bin/node
import { App } from "aws-cdk-lib";
import { LucidMusicianStack } from "../lib/lucidmusician.com-stack";

const app = new App();

const tags = {
  Project: "lucidmusician.com",
  Environment: "production",
  Author: "stephen",
};

const domainName = "lucidmusician.com";

new LucidMusicianStack(app, "LucidMusicianStack", {
  domainName,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tags,
  description: "lucidmusician.com",
});
