import { Download, FileText } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsletterSignup from "@/components/NewsletterSignup";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { guideCoverPath, guideFileDetails, guidePdfPath, type ResourceGuide as Guide } from "@/lib/resourceGuides";
import { useState } from "react";

export default function ResourceGuide({ guide }: { guide: Guide }) {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  return (
    <div className="guide-page">
      <SiteHeader currentPath="/resource-center" />
      <main id="main-content" className="guide-landing" tabIndex={-1}>
        <a className="guide-back" href="/resource-center#downloadable-guides">Back to Resource Center</a>
        <article className="guide-landing__grid" aria-labelledby="guide-title">
          <div className="guide-landing__copy">
            <p className="resource-eyebrow">Chart your course</p>
            <h1 id="guide-title">{guide.title}</h1>
            <p className="guide-landing__description">{guide.description}</p>
            <p className="guide-landing__byline">By Mary Lynch · Downsize Baltimore</p>
            <p className="guide-file-details">{guideFileDetails(guide)}</p>
            <div className="guide-landing__actions">
              <a className="guide-button" href={guidePdfPath(guide)} target="_blank" rel="noopener noreferrer" onClick={() => setNewsletterOpen(true)}>
                <Download size={18} aria-hidden="true" /> Download PDF
              </a>
              <a className="guide-link" href={guidePdfPath(guide)} target="_blank" rel="noopener noreferrer">
                <FileText size={18} aria-hidden="true" /> Read PDF <span className="guide-new-tab">(opens in a new tab)</span>
              </a>
            </div>
            <section className="guide-landing__contents" aria-labelledby="guide-contents-heading">
              <h2 id="guide-contents-heading">Inside this guide</h2>
              <ul>{guide.contents.map((content) => <li key={content}>{content}</li>)}</ul>
            </section>
          </div>
          <figure className="guide-landing__cover">
            <img src={guideCoverPath(guide)} alt={`Cover of ${guide.title}`} width={696} height={900} decoding="async" />
            <figcaption>Ready to read, save or print, with a fillable worksheet.</figcaption>
          </figure>
        </article>
        <aside className="guide-landing__disclaimer" aria-label="Educational disclaimer">
          These guides are shared for education. For legal, financial or medical questions, please consult the appropriate professional.
        </aside>
      </main>
      <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
        <DialogContent className="guide-signup" aria-describedby="guide-signup-description">
          <DialogTitle>Enjoy your guide!</DialogTitle>
          <DialogDescription id="guide-signup-description">Want more like this? Join The Anchored Home for real stories, practical tips, and trusted local resources from Mary.</DialogDescription>
          <NewsletterSignup source="guide" />
          <DialogClose className="guide-signup__dismiss">No thanks, just the guide</DialogClose>
        </DialogContent>
      </Dialog>
      <SiteFooter currentPath="/resource-center" />
    </div>
  );
}
