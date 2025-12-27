import { Link } from "@heroui/link";

type SoundCloudEmbedProps = {
	trackId?: string | number;
	url?: string;
	height?: number;
	visual?: boolean;
	autoPlay?: boolean;
	color?: string;
	showComments?: boolean;
	showUser?: boolean;
	showReposts?: boolean;
	hideRelated?: boolean;
	showTeaser?: boolean;
	className?: string;
	containerClassName?: string;
	label?: string;
	attribution?: {
		userName: string;
		userUrl: string;
		trackTitle: string;
		trackUrl: string;
	};
};

const buildSoundCloudSrc = ({
	trackId,
	url,
	color,
	autoPlay,
	hideRelated,
	showComments,
	showUser,
	showReposts,
	showTeaser,
	visual,
}: Required<
	Pick<
		SoundCloudEmbedProps,
		| "trackId"
		| "url"
		| "color"
		| "autoPlay"
		| "hideRelated"
		| "showComments"
		| "showUser"
		| "showReposts"
		| "showTeaser"
		| "visual"
	>
>) => {
	const targetUrl = url
		? url
		: `https://api.soundcloud.com/tracks/${encodeURIComponent(String(trackId))}`;

	const params = new URLSearchParams({
		url: targetUrl,
		color,
		auto_play: autoPlay ? "true" : "false",
		hide_related: hideRelated ? "true" : "false",
		show_comments: showComments ? "true" : "false",
		show_user: showUser ? "true" : "false",
		show_reposts: showReposts ? "true" : "false",
		show_teaser: showTeaser ? "true" : "false",
		visual: visual ? "true" : "false",
	});

	return `https://w.soundcloud.com/player/?${params.toString()}`;
};

export default function SoundCloudEmbed({
	trackId,
	url,
	height = 300,
	visual = true,
	autoPlay = false,
	color = "#0066cc",
	showComments = true,
	showUser = true,
	showReposts = false,
	hideRelated = false,
	showTeaser = true,
	className,
	containerClassName,
	label = "Listen to a sample",
	attribution,
}: SoundCloudEmbedProps) {
	if (!trackId && !url) {
		return null;
	}

	const src = buildSoundCloudSrc({
		trackId: trackId ?? "",
		url: url ?? "",
		color,
		autoPlay,
		hideRelated,
		showComments,
		showUser,
		showReposts,
		showTeaser,
		visual,
	});

	return (
		<div className={containerClassName}>
			{label ? (
				<div className="mb-2 text-lg font-semibold text-default-700">
					{label}
				</div>
			) : null}
			<iframe
				width="100%"
				height={height}
				scrolling="no"
				frameBorder={0}
				allow="autoplay"
				loading="lazy"
				title="SoundCloud player"
				className={
					className || "w-full overflow-hidden rounded-xl border border-divider"
				}
				src={src}
			/>
			{attribution ? (
				<div className="mt-2 text-xs text-default-500">
					<Link
						href={attribution.userUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						{attribution.userName}
					</Link>
					<span className="mx-2">·</span>
					<Link
						href={attribution.trackUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline"
					>
						{attribution.trackTitle}
					</Link>
				</div>
			) : null}
		</div>
	);
}
