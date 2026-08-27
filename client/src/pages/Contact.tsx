import { FormEvent, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import DeferredBackground from "@/components/DeferredBackground";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

/**
 * Harbor House Editorial — Contact page.
 * A calm invitation into conversation: generous paper space, one human portrait,
 * gold rules, and a clear Calendly-first path instead of lead-generation pressure.
 */

const heroImage = "/manus-storage/mary-lynch-contact-chair_dd829984.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";
const phoneNumber = "(410) 375-1400";
const emailAddress = "mary@downsizebaltimore.com";

const currentPath = "/contact";
const conversationTopics = ["Downsizing & Moving", "Buying & Selling", "Aging in Place", "Helping a Parent or Loved One", "Exploring Housing Options", "Speaking & Education"];
const formTopics = ["I'm considering downsizing or moving", "I'm buying or selling a home", "I'm exploring aging in place", "I'm helping a parent or loved one", "I'm exploring housing options", "I'm looking for a trusted resource", "I'm interested in speaking or educational programs", "I'm interested in NAIPC or community collaboration", "Something else"];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) {
  return <a className={`contact-button contact-button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} /></a>;
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const topic = String(data.get("topic") || "").trim();
    const message = String(data.get("message") || "").trim();
    const nameField = event.currentTarget.elements.namedItem("name") as HTMLInputElement;
    const emailField = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const phoneField = event.currentTarget.elements.namedItem("phone") as HTMLInputElement;
    const messageField = event.currentTarget.elements.namedItem("message") as HTMLTextAreaElement;
    nameField.value = name;
    emailField.value = email;
    phoneField.value = phone;
    messageField.value = message;
    nameField.setCustomValidity(name ? "" : "Please enter your name, not only spaces.");
    messageField.setCustomValidity(message ? "" : "Please tell Mary a little about what is on your mind.");
    if (!event.currentTarget.reportValidity()) return;
    const subject = encodeURIComponent("A note for Mary from Downsize Baltimore");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nWhat brings me here: ${topic}\n\n${message}`);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return <div className="contact-page">
    <SiteHeader currentPath={currentPath} />

    <main id="main-content" tabIndex={-1}>
      <section className="contact-hero"><div className="contact-hero__copy"><p className="contact-eyebrow">A place to begin</p><h1>Let’s Talk About<br /><i>What Comes Next.</i></h1><div className="contact-rule" /><p>You don’t need to have all the answers before you reach out.</p><p>Whether you’re considering a move, helping someone you love, wondering if your current home still works for you, or simply trying to understand your options, let’s start with a conversation.</p><ButtonLink>Schedule a Conversation</ButtonLink><small>No pressure. No obligation. Just a place to start.</small></div><div className="contact-hero__photo"><ResponsiveImage src={heroImage} sizes="(max-width: 900px) 100vw, 50vw" priority alt="Mary Lynch seated in a cane chair in a bright home" /><span>01 / A conversation can be the beginning.</span></div></section>

      <section className="contact-topics"><div className="contact-section-heading"><p className="contact-eyebrow">Bring what’s on your mind</p><h2>What Can We<br /><i>Talk About?</i></h2><p>You do not have to arrive with the right words. These are simply a few of the conversations Mary often helps families begin.</p></div><div className="contact-topic-list">{conversationTopics.map((topic, index) => <div key={topic}><span>0{index + 1}</span><p>{topic}</p></div>)}</div></section>

      <section className="contact-form-section"><div className="contact-form-intro"><p className="contact-eyebrow">A quieter way to reach out</p><h2>Rather Send<br /><i>Me a Note?</i></h2><p>That’s perfectly fine, too. Fill in the details below and we’ll prepare a draft in your email app for you to review and send.</p><div className="contact-form-note"><Mail size={19} strokeWidth={1.3} /><span>This form opens an email draft on your device; it does not send automatically. If no email app opens, email <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</span></div></div><form className="contact-form" noValidate onSubmit={handleSubmit}><label>Name <span className="contact-form__requirement">(required)</span><input name="name" type="text" autoComplete="name" required onInput={(event) => event.currentTarget.setCustomValidity("")} /></label><label>Email <span className="contact-form__requirement">(required)</span><input name="email" type="email" autoComplete="email" required /></label><label>Phone <span className="contact-form__requirement">(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label><label>What brings you here? <span className="contact-form__requirement">(required)</span><select name="topic" defaultValue="" required><option value="" disabled>Select one</option>{formTopics.map((topic) => <option key={topic} value={topic}>{topic}</option>)}</select></label><label className="contact-form__message">Tell me a little about what’s on your mind. <span className="contact-form__requirement">(required)</span><textarea name="message" rows={5} required onInput={(event) => event.currentTarget.setCustomValidity("")} /></label><button type="submit" className="contact-button contact-button--gold"><Mail size={15} /> Open Email Draft <ArrowUpRight size={16} /></button>{sent && <p className="contact-form__status" role="status">Your email app should now be open with a draft addressed to Mary. Review it, then choose Send. If it did not open, email <a href={`mailto:${emailAddress}`}>{emailAddress}</a>.</p>}</form></section>

      <DeferredBackground className="contact-direct" backgroundImage={`url(${paperTexture})`}><div className="contact-direct__frame"><div><p className="contact-eyebrow">Prefer to call or email?</p><h2>Sometimes It’s<br /><i>Just Easier.</i></h2></div><div className="contact-direct__info"><p>Sometimes it’s just easier to pick up the phone. You’re always welcome to reach out directly.</p><a className="contact-direct__phone" href="tel:+14103751400"><Phone size={18} /> {phoneNumber}</a><a className="contact-direct__email" href={`mailto:${emailAddress}`}>{emailAddress}</a></div></div></DeferredBackground>
    </main>
    <SiteFooter currentPath={currentPath} />
  </div>;
}
