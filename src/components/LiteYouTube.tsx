import { useEffect, useRef } from "react";
import "lite-youtube-embed/src/lite-yt-embed.css";

interface LiteYouTubeProps {
  videoId: string;
  title: string;
  className?: string;
}

/**
 * Lightweight YouTube embed facade. Renders a static thumbnail with a play button.
 * Only loads the full YouTube iframe when the user clicks play.
 * This dramatically improves page load performance and Core Web Vitals.
 */
export default function LiteYouTube({ videoId, title, className }: LiteYouTubeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import the custom element definition (only once)
    import("lite-youtube-embed");
  }, []);

  return (
    <div ref={ref} className={className} style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* @ts-expect-error lite-youtube is a custom element */}
      <lite-youtube
        videoid={videoId}
        playlabel={`Play: ${title}`}
      >
        <button type="button" className="lyt-playbtn" aria-label={`Play: ${title}`}>
          <span className="lyt-visually-hidden">Play</span>
        </button>
      {/* @ts-expect-error lite-youtube is a custom element */}
      </lite-youtube>
    </div>
  );
}
