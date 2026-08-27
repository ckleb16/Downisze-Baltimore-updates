import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SITE_ASSETS, SITE_CONTACT } from "@/lib/siteConfig";
import { SITE_ROUTES, canonicalizeRecognizedPath } from "@/lib/siteRoutes";

type SiteHeaderProps = {
  currentPath: string;
};

export default function SiteHeader({ currentPath }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const restoreFocusAfterClose = useRef(false);
  const canonicalPath = canonicalizeRecognizedPath(currentPath) ?? currentPath;
  const navId = `site-mobile-navigation-${canonicalPath === "/" ? "home" : canonicalPath.slice(1)}`;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      restoreFocusAfterClose.current = true;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open || !restoreFocusAfterClose.current) return;
    restoreFocusAfterClose.current = false;
    toggleRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const closeOnDesktop = () => {
      if (desktop.matches || window.innerWidth >= 821) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, []);

  const navigation = (mobile = false) =>
    SITE_ROUTES.map((route) => (
      <a
        key={route.path}
        href={route.path}
        className={route.path === canonicalPath ? "is-active" : undefined}
        aria-current={route.path === canonicalPath ? "page" : undefined}
        onClick={mobile ? () => setOpen(false) : undefined}
      >
        <span>{route.label}</span>
        {mobile ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
      </a>
    ));

  return (
    <header className="site-header-v2">
      <div className="site-header-v2__top">
        <a className="site-header-v2__brand" href="/" aria-label="Downsize Baltimore home">
          <img
            src={SITE_ASSETS.wideLogo}
            alt="Downsize Baltimore"
            width="900"
            height="300"
            decoding="async"
          />
        </a>
        <div className="site-header-v2__actions">
          <a className="site-header-v2__cta" href={SITE_CONTACT.calendlyUrl}>
            Talk to Mary <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="site-header-v2__toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls={navId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav className="site-header-v2__desktop-nav" aria-label="Primary navigation">
        {navigation()}
      </nav>
      <nav
        id={navId}
        className="site-header-v2__mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {navigation(true)}
        <a className="site-header-v2__mobile-cta" href={SITE_CONTACT.calendlyUrl}>
          Talk to Mary <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
