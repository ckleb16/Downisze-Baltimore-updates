import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";

/**
 * Harbor House Editorial — Contact page.
 * A calm invitation into conversation: generous paper space, one human portrait,
 * gold rules, and a clear Calendly-first path instead of lead-generation pressure.
 */

const wideLogo = "/manus-storage/DownsizeBaltimoreWide-YelWhite_e501a303.png";
const verticalLogo = "/manus-storage/DownsizeBaltimoreB-YelWhite_850df9b1.png";
const heroImage = "/manus-storage/mary-lynch-contact-chair_dd829984.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4.png";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";
const phoneNumber = "(410) 375-1400";
const emailAddress = "mary@downsizebaltimore.com";

const currentPath = "/contact";
const navItems = [
  ["Home", "/"],
  ["Downsizing Services", "/downsizing-services"],
  ["Aging in Place", "/aging-in-place"],
  ["Buying & Selling", "/buying-selling"],
  ["Resource Center", "/resource-center"],
  ["Meet Mary", "/meet-mary"],
  ["Contact", "/contact"],
];
const footerNavItems = [["Home", "/"], ["Downsizing Services", "/downsizing-services"], ["Aging in Place", "/aging-in-place"], ["Buying & Selling", "/buying-selling"], ["Resource Center", "/resource-center"], ["Meet Mary", "/meet-mary"], ["Contact", "/contact"]];

const conversationTopics = ["Downsizing & Moving", "Buying & Selling", "Aging in Place", "Helping a Parent or Loved One", "Exploring Housing Options", "Speaking & Education"];
const formTopics = ["I'm considering downsizing or moving", "I'm buying or selling a home", "I'm exploring aging in place", "I'm helping a parent or loved one", "I'm exploring housing options", "I'm looking for a trusted resource", "I'm interested in speaking or educational programs", "I'm interested in NAIPC or community collaboration", "Something else"];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) {
  return <a className={`contact-button contact-button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} /></a>;
}

function Brand({ footer = false }: { footer?: boolean }) {
  return <a href="/" className={`contact-brand ${footer ? "contact-brand--footer" : ""}`} aria-label="Downsize Baltimore home"><img src={footer ? verticalLogo : wideLogo} alt="Downsize Baltimore" /></a>;
}

function Footer() {
  return <footer className="contact-footer"><div className="contact-footer__top"><div><Brand footer /><p>A Clear Plan for What Comes Next.<br /><i>Anchored in Baltimore.</i></p></div><div className="contact-footer__details"><a className="contact-footer__phone" href="tel:+14103751400"><Phone size={15} /> {phoneNumber}</a><a href={`mailto:${emailAddress}`}>{emailAddress}</a><div><strong>Cummings &amp; Co. Realtors</strong><span>108 W. Timonium Road<br />Timonium, MD 21093</span><span>Office <a href="tel:+14108230033">(410) 823-0033</a></span></div><ButtonLink>Schedule a Conversation</ButtonLink></div></div><div className="contact-footer__bottom"><div>{footerNavItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined}>{label}</a>)}</div><span>© 2026 Downsize Baltimore. All rights reserved.</span><span>Real estate services provided in affiliation with a licensed brokerage.</span></div></footer>;
}

export default function Contact() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const topic = String(data.get("topic") || "").trim();
    const message = String(data.get("message") || "").trim();
    const messageField = event.currentTarget.elements.namedItem("message") as HTMLTextAreaElement;
    messageField.setCustomValidity(message ? "" : "Please tell Mary a little about what is on your mind.");
    if (!event.currentTarget.reportValidity()) return;
    const subject = encodeURIComponent("A note for Mary from Downsize Baltimore");
    const body = encodeURIComponent(`Name: ${data.get("name") || ""}\nEmail: ${data.get("email") || ""}\nPhone: ${data.get("phone") || ""}\nWhat brings me here: ${topic}\n\n${message}`);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return <div className="contact-page">
    <header className="contact-header"><div className="contact-header__top"><Brand /><div><ButtonLink>Talk to Mary</ButtonLink><button ref={menuButtonRef} type="button" className="contact-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="contact-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div></div><nav className="contact-nav" aria-label="Primary navigation">{navItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined}>{label}</a>)}</nav><nav id="contact-mobile-navigation" className="contact-mobile-nav" aria-label="Mobile navigation" hidden={!mobileOpen} onKeyDown={(event) => { if (event.key === "Escape") { setMobileOpen(false); menuButtonRef.current?.focus(); } }}>{navItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined} onClick={() => setMobileOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}<ButtonLink>Talk to Mary</ButtonLink></nav></header>

    <main id="main-content" tabIndex={-1}>
      <section className="contact-hero"><div className="contact-hero__copy"><p className="contact-eyebrow">A place to begin</p><h1>Let’s Talk About<br /><i>What Comes Next.</i></h1><div className="contact-rule" /><p>You don’t need to have all the answers before you reach out.</p><p>Whether you’re considering a move, helping someone you love, wondering if your current home still works for you, or simply trying to understand your options, let’s start with a conversation.</p><ButtonLink>Schedule a Conversation</ButtonLink><small>No pressure. No obligation. Just a place to start.</small></div><div className="contact-hero__photo"><img src={heroImage} alt="Mary Lynch seated in a cane chair in a bright home" /><span>01 / A conversation can be the beginning.</span></div></section>

      <section className="contact-topics"><div className="contact-section-heading"><p className="contact-eyebrow">Bring what’s on your mind</p><h2>What Can We<br /><i>Talk About?</i></h2><p>You do not have to arrive with the right words. These are simply a few of the conversations Mary often helps families begin.</p></div><div className="contact-topic-list">{conversationTopics.map((topic, index) => <div key={topic}><span>0{index + 1}</span><p>{topic}</p></div>)}</div></section>

      <section className="contact-form-section"><div className="contact-form-intro"><p className="contact-eyebrow">A quieter way to reach out</p><h2>Rather Send<br /><i>Me a Note?</i></h2><p>That’s perfectly fine, too. Fill in the details below and we’ll prepare a draft in your email app for you to review and send.</p><div className="contact-form-note"><Mail size={19} strokeWidth={1.3} /><span>This form opens an email draft on your device; it does not send automatically. If no email app opens, email <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</span></div></div><form className="contact-form" onSubmit={handleSubmit}><label>Name <span className="contact-form__requirement">(required)</span><input name="name" type="text" autoComplete="name" required /></label><label>Email <span className="contact-form__requirement">(required)</span><input name="email" type="email" autoComplete="email" required /></label><label>Phone <span className="contact-form__requirement">(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label><label>What brings you here? <span className="contact-form__requirement">(required)</span><select name="topic" defaultValue="" required><option value="" disabled>Select one</option>{formTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label><label className="contact-form__message">Tell me a little about what’s on your mind. <span className="contact-form__requirement">(required)</span><textarea name="message" rows={5} required onInput={(event) => event.currentTarget.setCustomValidity("")} /></label><button type="submit" className="contact-button contact-button--gold"><Mail size={15} /> Open Email Draft <ArrowUpRight size={16} /></button>{sent && <p className="contact-form__status" role="status">Your email app should now be open with a draft addressed to Mary. Review it, then choose Send. If it did not open, email <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</p>}</form></section>

      <section className="contact-direct" style={{ backgroundImage: `url(${paperTexture})` }}><div className="contact-direct__frame"><div><p className="contact-eyebrow">Prefer to call or email?</p><h2>Sometimes It’s<br /><i>Just Easier.</i></h2></div><div className="contact-direct__info"><p>Sometimes it’s just easier to pick up the phone. You’re always welcome to reach out directly.</p><a className="contact-direct__phone" href="tel:+14103751400"><Phone size={18} /> {phoneNumber}</a><a className="contact-direct__email" href={`mailto:${emailAddress}`}>{emailAddress}</a></div></div></section>
    </main>
    <Footer />
  </div>;
}
