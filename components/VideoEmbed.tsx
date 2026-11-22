import { Icon } from "./Icon";

/* Turns a TikTok or Instagram link into the platform's official embed player. */
export function embedFor(url: string) {
  const tt = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (tt) return { platform: "tiktok", src: `https://www.tiktok.com/player/v1/${tt[1]}?description=1&music_info=0` };
  const ig = url.match(/instagram\.com\/(p|reel|reels)\/([\w-]+)/);
  if (ig) return { platform: "instagram", src: `https://www.instagram.com/${ig[1] === "reels" ? "reel" : ig[1]}/${ig[2]}/embed/` };
  return null;
}

export function VideoEmbed({ url, views, index }: { url: string; views?: string; index: number }) {
  const e = embedFor(url);
  if (!e) return null;
  return (
    <figure className="vid">
      <div className={`frame ${e.platform}`}>
        <iframe
          src={e.src}
          title={`Top video ${index + 1}`}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption>
        <Icon name={e.platform} />
        {views ? (
          <span>
            <b>{views}</b> views
          </span>
        ) : (
          <span>Top {index + 1}</span>
        )}
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label="Open on the app">
          <Icon name="arrow" />
        </a>
      </figcaption>
    </figure>
  );
}

export function VideoGrid({ videos }: { videos: { url: string; views?: string }[] }) {
  return (
    <div className="vids">
      {videos.map((v, i) => (
        <VideoEmbed key={v.url} url={v.url} views={v.views} index={i} />
      ))}
    </div>
  );
}
