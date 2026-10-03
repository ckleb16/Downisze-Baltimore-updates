import { PlayCircle } from "lucide-react";

const youtubeAppearances = [
  {
    outlet: "Maryland REALTORS®",
    title: "ADUs: A Common Sense Solution",
    href: "https://www.youtube.com/watch?v=jpiIDQua0-c&t=76s",
  },
  {
    outlet: "Cummings Cast · Episode 29",
    title: "Mary Interviews Dave Cummings",
    href: "https://www.youtube.com/watch?v=m41j6VmL_mg&t=4s",
  },
  {
    outlet: "Always Ageless",
    title: "From Caregiver to Community Leader",
    href: "https://www.youtube.com/watch?v=qR3lqYb2ccQ",
  },
  {
    outlet: "Embracing Life After 60 · Episode 70",
    title: "Caregiving Happens Overnight: Why Housing Is Health",
    href: "https://www.youtube.com/watch?v=aPHhPauX7NA",
  },
  {
    outlet: "The PUSH for More Podcast · Episode 15",
    title: "A Conversation with Mary Lynch",
    href: "https://www.youtube.com/watch?v=kWwuoItWX-Q",
  },
  {
    outlet: "Cummings Cast · Episode 1",
    title: "Dave Cummings Interviews Mary",
    href: "https://www.youtube.com/watch?v=fq4pMnuPFDA&t=4s",
  },
];

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
      </div>

      <div className="meet-media__videos">
        {youtubeAppearances.map(({ outlet, title, href }) => (
          <a className="meet-media__video" key={href} href={href} target="_blank" rel="noopener noreferrer">
            <div className="meet-media__video-top"><span>{outlet}</span><PlayCircle size={25} strokeWidth={1.25} aria-hidden="true" /></div>
            <h3>{title}</h3>
            <span className="meet-media__action">Watch on YouTube<span className="sr-only"> (opens in a new tab)</span></span>
          </a>
        ))}
      </div>
    </section>
  );
}
