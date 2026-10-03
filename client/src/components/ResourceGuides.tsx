import { RESOURCE_GUIDES, guideCoverPath, guideFileDetails, guidePath } from "@/lib/resourceGuides";
import { useEffect, useRef } from "react";

export default function ResourceGuides() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The route loads lazily, so the browser's initial fragment jump is too early.
    if (window.location.hash === "#downloadable-guides") {
      sectionRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    }
  }, []);

  return (
    <section ref={sectionRef} id="downloadable-guides" className="resource-guides" aria-labelledby="resource-guides-heading">
      <header className="resource-guides__heading">
        <p className="resource-eyebrow">Chart your course</p>
        <h2 id="resource-guides-heading">Downloadable <i>Guides.</i></h2>
        <p>Practical guides from Mary to read, save or print. Start with the question closest to yours.</p>
      </header>
      <div className="resource-guides__grid">
        {RESOURCE_GUIDES.map((guide) => (
          <article className="guide-card" key={guide.slug}>
            <div className="guide-card__cover">
              <img src={guideCoverPath(guide)} alt={`Cover of ${guide.title}`} width={696} height={900} loading="lazy" decoding="async" />
            </div>
            <div className="guide-card__body">
              <p className="guide-file-details">{guideFileDetails(guide)}</p>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <a className="guide-link" href={guidePath(guide)} aria-label={`Read about and download ${guide.title}`}>Explore this guide</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
