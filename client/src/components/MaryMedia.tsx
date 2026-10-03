import { PlayCircle } from "lucide-react";
import { useState } from "react";

const youtubeAppearances = [
  {
    outlet: "Maryland REALTORS®",
    title: "ADUs: A Common Sense Solution",
    href: "https://www.youtube.com/watch?v=jpiIDQua0-c&t=76s",
    thumbnail: "/media-thumbnails/jpiIDQua0-c.jpg",
  },
  {
    outlet: "Cummings Cast · Episode 29",
    title: "Mary Interviews Dave Cummings",
    href: "https://www.youtube.com/watch?v=m41j6VmL_mg&t=4s",
    thumbnail: "/media-thumbnails/m41j6VmL_mg.jpg",
  },
  {
    outlet: "Always Ageless",
    title: "From Caregiver to Community Leader",
    href: "https://www.youtube.com/watch?v=qR3lqYb2ccQ",
    thumbnail: "/media-thumbnails/qR3lqYb2ccQ.jpg",
  },
  {
    outlet: "Embracing Life After 60 · Episode 70",
    title: "Caregiving Happens Overnight: Why Housing Is Health",
    href: "https://www.youtube.com/watch?v=aPHhPauX7NA",
    thumbnail: "/media-thumbnails/aPHhPauX7NA.jpg",
  },
  {
    outlet: "The PUSH for More Podcast · Episode 15",
    title: "A Conversation with Mary Lynch",
    href: "https://www.youtube.com/watch?v=kWwuoItWX-Q",
    thumbnail: "/media-thumbnails/kWwuoItWX-Q.jpg",
  },
  {
    outlet: "Cummings Cast · Episode 1",
    title: "Dave Cummings Interviews Mary",
    href: "https://www.youtube.com/watch?v=fq4pMnuPFDA&t=4s",
    thumbnail: "/media-thumbnails/fq4pMnuPFDA.jpg",
  },
];

function VideoPreview({ thumbnail }: { thumbnail: string }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <span className="meet-media__preview" aria-hidden="true">
      <PlayCircle size={48} strokeWidth={1.25} />
      {!imageFailed && (
        <img
          src={thumbnail}
          width="480"
          height="360"
          loading="lazy"
          decoding="async"
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}
    </span>
  );
}

export default function MaryMedia() {
  return (
    <section id="mary-in-the-media" className="meet-media" aria-labelledby="meet-media-heading">
      <div className="meet-media__heading">
        <p className="meet-eyebrow">Conversations beyond the closing table</p>
        <h2 id="meet-media-heading">Mary in the <i>Media</i></h2>
        <p>Conversations about housing, caregiving and planning for what comes next.</p>
      </div>

      <div className="meet-media__features">
        <a className="meet-media__feature" href="https://www.pbs.org/video/empowering-seniors-episode-603-mj4kan/" target="_blank" rel="noopener noreferrer">
          <span className="meet-media__brand-name">PBS</span>
          <div>
            <h3>Empowering Seniors</h3>
            <p>Mary joins the conversation on aging in place.</p>
            <span className="meet-media__action">Watch on PBS<span className="sr-only"> (opens in a new tab)</span></span>
          </div>
        </a>
        <a className="meet-media__feature" href="https://www.youtube.com/watch?v=m41j6VmL_mg&t=4s" target="_blank" rel="noopener noreferrer">
          <img src="/manus-storage/cummings-and-co-realtors-circle.png" width="300" height="300" loading="lazy" decoding="async" alt="Cummings & Co. Realtors" />
          <div>
            <h3>Cummings Cast</h3>
            <p>Mary and Dave Cummings talk real estate.</p>
            <span className="meet-media__action">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span></span>
          </div>
        </a>
        <a className="meet-media__feature" href="https://www.wmar2news.com/middaymaryland/vital-sign-home-care-joins-the-national-aging-in-place-council-of-greater-baltimore" target="_blank" rel="noopener noreferrer">
          <span className="meet-media__brand-name meet-media__brand-name--wmar">WMAR<br />2 News</span>
          <div>
            <h3>Midday Maryland</h3>
            <p>Vital Sign Home Care and the National Aging in Place Council of Greater Baltimore.</p>
            <span className="meet-media__action">View on WMAR<span className="sr-only"> (opens in a new tab)</span></span>
          </div>
        </a>
      </div>

      <div className="meet-media__videos">
        {youtubeAppearances.map(({ outlet, title, href, thumbnail }) => (
          <a className="meet-media__video" key={href} href={href} target="_blank" rel="noopener noreferrer">
            <VideoPreview thumbnail={thumbnail} />
            <div className="meet-media__video-top"><span>{outlet}</span></div>
            <h3>{title}</h3>
            <span className="meet-media__action">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}
