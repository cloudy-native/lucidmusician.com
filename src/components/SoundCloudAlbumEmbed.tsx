import { Link } from "@heroui/link";

type SoundCloudAlbumEmbedProps = {
	albumId: string | number;
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
	albumTitle?: string;
	albumUrl?: string;
};

const USER_NAME = "LucidHarmony";
const USER_URL = "https://soundcloud.com/lucidharmony";

const buildSoundCloudAlbumSrc = ({
	albumId,
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
		SoundCloudAlbumEmbedProps,
		| "albumId"
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
	const targetUrl = `https://api.soundcloud.com/playlists/soundcloud:playlists:${encodeURIComponent(
		String(albumId)
	)}`;

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

export default function SoundCloudAlbumEmbed({
	albumId,
	height = 300,
	visual = true,
	autoPlay = false,
	color = "#ff5500",
	showComments = true,
	showUser = true,
	showReposts = false,
	hideRelated = false,
	showTeaser = true,
	className,
	containerClassName,
	label = "Listen on SoundCloud",
	albumTitle,
	albumUrl,
}: SoundCloudAlbumEmbedProps) {
	if (!albumId) {
		return null;
	}

	const src = buildSoundCloudAlbumSrc({
		albumId,
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
				title="SoundCloud album player"
				className={
					className || "w-full overflow-hidden rounded-xl border border-divider"
				}
				src={src}
			/>
			<div className="mt-2 text-xs text-default-500">
				<Link
					href={USER_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline"
				>
					{USER_NAME}
				</Link>
				{albumTitle && albumUrl ? (
					<>
						<span className="mx-2">·</span>
						<Link
							href={albumUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							{albumTitle}
						</Link>
					</>
				) : null}
			</div>
		</div>
	);
}
