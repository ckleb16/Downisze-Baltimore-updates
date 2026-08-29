import { ArrowUpRight, Phone } from "lucide-react";
import { SITE_ASSETS, SITE_CONTACT } from "@/lib/siteConfig";
import { SITE_ROUTES, canonicalizeRecognizedPath } from "@/lib/siteRoutes";

type SiteFooterProps = {
  currentPath: string;
};

export default function SiteFooter({ currentPath }: SiteFooterProps) {
  const canonicalPath = canonicalizeRecognizedPath(currentPath) ?? currentPath;

  return (
    <footer className="site-footer-v2" id="site-footer">
      <div className="site-footer-v2__top">
        <a className="site-footer-v2__brand" href="/" aria-label="Downsize Baltimore home">
          <img
            src={SITE_ASSETS.verticalLogo}
            alt="Downsize Baltimore"
            width="750"
            height="750"
            loading="lazy"
            decoding="async"
          />
        </a>
        <p className="site-footer-v2__statement">
          A Clear Plan for What Comes Next.<br />
          <i>Anchored in Baltimore.</i>
        </p>
        <div className="site-footer-v2__contact">
          <a className="site-footer-v2__phone" href={SITE_CONTACT.phoneHref}>
            <Phone size={16} aria-hidden="true" /> {SITE_CONTACT.phoneDisplay}
          </a>
          <a className="site-footer-v2__email" href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
          <div className="site-footer-v2__brokerage">
            <strong>{SITE_CONTACT.brokerage}</strong>
            <span>
              {SITE_CONTACT.brokerageAddress}<br />
              {SITE_CONTACT.brokerageCity}
            </span>
            <span>
              Office <a href={SITE_CONTACT.brokeragePhoneHref}>{SITE_CONTACT.brokeragePhoneDisplay}</a>
            </span>
          </div>
          <a className="site-footer-v2__cta" href={SITE_CONTACT.calendlyUrl}>
            Schedule a Conversation <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="site-footer-v2__bottom">
        <nav aria-label="Footer navigation">
          {SITE_ROUTES.map((route) => (
            <a
              key={route.path}
              href={route.path}
              className={route.path === canonicalPath ? "is-active" : undefined}
              aria-current={route.path === canonicalPath ? "page" : undefined}
            >
              {route.label}
            </a>
          ))}
        </nav>
        <span>© 2026 Downsize Baltimore. All rights reserved.</span>
        <span>Real estate services provided in affiliation with a licensed brokerage.</span>
      </div>
    </footer>
  );
}
