// Harbor House Editorial: warm editorial layout, Baltimore navy, cream paper, antique gold, restrained motion.
import { useState } from "react";
import {
  ArrowUpRight,
  Baby,
  BookOpen,
  ChevronDown,
  Anchor,
  Home as HomeIcon,
  Menu,
  MoveRight,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const heroImage = "/manus-storage/AugustwebsiteHOMEphoto_6750abaf.png";
const markImage = "/manus-storage/downsize-baltimore-mark_c3769b0a.png";
const wideLogo = "/manus-storage/DownsizeBaltimoreWide-YelWhite_e501a303.png";
const verticalLogo = "/manus-storage/DownsizeBaltimoreB-YelWhite_850df9b1.png";
const maryPortrait = "/manus-storage/Mary_Lynch_3d838598.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4.png";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7.png";
const washTexture = "/manus-storage/downsize-baltimore-warm-wash_0631c386.png";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";

const navItems = [
  ["Downsizing Services", "/downsizing-services"],
  ["Aging in Place", "/aging-in-place"],
  ["Buying & Selling", "/buying-selling"],
  ["Resource Center", "/resource-center"],
  ["Meet Mary", "/meet-mary"],
  ["Contact", "/contact"],
];
const footerNavItems = [["Home", "/"], ...navItems];

const ways = [
  {
    icon: Scale,
    number: "01",
    title: "I’m Thinking About Downsizing",
    body: "Whether you’re ready now or just beginning to wonder what life with less house might look like, we can create a plan that works on your timeline.",
    link: "Explore Downsizing",
    href: "/downsizing-services",
  },
  {
    icon: HomeIcon,
    number: "02",
    title: "I’m Buying or Selling",
    body: "Real estate decisions later in life often involve more than bedrooms, bathrooms, and price. I’ll help you look at the whole picture.",
    link: "Explore Buying & Selling",
    href: "/buying-selling",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "I’m Trying to Stay in My Home",
    body: "Moving isn’t always the answer. Sometimes the right plan is making your current home safer, easier, and better suited to the years ahead.",
    link: "Explore Aging in Place",
    href: "/aging-in-place",
  },
];

const resources = [
  ["Aging in Place", "Ideas and resources for making home safer and more comfortable.", ShieldCheck, "/resource-center?path=stay#resource-library"],
  ["Downsizing & Moving", "Where to begin, what to keep, and how to make the process manageable.", MoveRight, "/resource-center?path=downsizing#resource-library"],
  ["55+ & Senior Living", "Understanding communities, housing options, and what might fit your lifestyle.", Sparkles, "/resource-center?path=housing#resource-library"],
  ["Buying & Selling", "Real estate guidance for moves that often involve more than real estate.", HomeIcon, "/buying-selling"],
  ["ADUs & Multigenerational Living", "Creative housing solutions that can keep families connected while maintaining independence.", Baby, "/resource-center?path=housing#resource-library"],
  ["Probate & Estate Resources", "Guidance and trusted professionals when a home is part of a larger family transition.", BookOpen, "/resource-center?path=probate#resource-library"],
];

function Brand({ compact = false, footer = false }: { compact?: boolean; footer?: boolean }) {
  return (
    <a href="#top" className={`brand ${compact ? "brand--compact" : ""} ${footer ? "brand--footer" : ""}`} aria-label="Downsize Baltimore home">
      <img src={footer ? verticalLogo : wideLogo} alt="Downsize Baltimore" className={footer ? "brand__footer-logo" : "brand__wide-logo"} />
    </a>
  );
}

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "light" | "outline" }) {
  return <a className={`button button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} /></a>;
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div id="top" className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <div className="header-top">
            <Brand />
            <div className="header-actions">
              <ButtonLink>Talk to Mary</ButtonLink>
              <button className="menu-toggle" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          </nav>
        </div>
        {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMobileOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}
          <ButtonLink>Talk to Mary</ButtonLink>
        </nav>}
      </header>

      <main>
        <section className="hero">
          <img src={heroImage} alt="A welcoming navy blue home at golden hour in a Baltimore neighborhood" className="hero__image" />
          <div className="hero__veil" />
          <div className="hero__content">
            <p className="eyebrow eyebrow--light"><span /> Baltimore-area real estate guidance</p>
            <h1>A Clear Plan<br /><i>for What Comes Next.</i></h1>
            <p className="hero__copy">Downsizing, staying put, or figuring out what the next home might look like can feel overwhelming. You don’t have to have all the answers before you begin.</p>
            <p className="hero__copy hero__copy--second">I help Baltimore-area families understand their options, make a plan, and move forward with confidence.</p>
            <ButtonLink>Schedule a Conversation</ButtonLink>
          </div>
          <div className="hero__caption"><span>30 YEARS</span><span>Helping Baltimore-area families make thoughtful real estate decisions.</span></div>
        </section>

        <section className="intro section-paper" style={{ backgroundImage: `url(${paperTexture})` }}>
          <div className="intro__label"><Anchor size={15} strokeWidth={1.4} /><span className="rule" /> START WHERE YOU ARE</div>
          <div className="intro__copy">
            <h2>You don’t have to know the answer yet. <i>Start here.</i></h2>
          </div>
        </section>

        <section id="ways-to-begin" className="ways section-paper">
          <div className="section-heading"><p className="eyebrow">Three ways to begin</p><p className="section-heading__aside">A thoughtful next step<br />doesn’t need to be a big one.</p></div>
          <div className="way-grid">
            {ways.map(({ icon: Icon, number, title, body, link, href }) => <article className="way-card" key={title}>
              <div className="way-card__top"><span>{number}</span><Icon size={29} strokeWidth={1.2} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
              <a href={href}>{link}<MoveRight size={17} /></a>
            </article>)}
          </div>
        </section>

        <section className="questions-strip section-paper">
          <div className="questions-strip__marker"><Anchor size={23} strokeWidth={1.2} /><span>02 / QUESTIONS I HEAR EVERY DAY…</span></div>
          <div className="questions-strip__copy"><p>Should Mom stay in her home?</p><p>Would downsizing make life easier?</p><p>Where do we even begin?</p></div>
        </section>

        <section id="meet-mary" className="mary-section">
          <div className="mary__image-panel" style={{ backgroundImage: `url(${washTexture})` }}>
            <div className="mary__portrait-frame"><img src={maryPortrait} alt="Mary Lynch seated on a cream sofa" className="mary__portrait" /><div className="mary__portrait-caption"><span>Mary Lynch</span><small>Founder, Downsize Baltimore</small></div></div>
          </div>
          <div className="mary__copy">
            <p className="eyebrow">A clear-eyed, human approach</p>
            <h2>Why Families<br /><i>Choose Mary</i></h2>
            <div className="gold-rule" />
            <p>For nearly three decades, I’ve helped Baltimore families buy and sell homes.</p>
            <p>Over time, that work became about much more than real estate.</p>
            <p>Downsize Baltimore grew from seeing how overwhelming housing decisions can become when family, aging, finances, belongings, and the future all collide at once.</p>
            <p>My role isn’t to convince you to move. It’s to help you understand your options, connect you with the right resources, and create a clear plan for whatever comes next.</p>
            <div className="credentials" aria-label="Mary's credentials and specialties"><p className="credentials__eyebrow">Credentials &amp; specialties</p><div className="credentials__grid credentials__grid--balanced"><span>Certified Senior Advisor</span><span>Chair &amp; Founder, National Aging in Place Council for Greater Baltimore</span><span>Seniors Real Estate Specialist</span><span>Senior Home Coach</span><span>Certified Probate Real Estate Specialist</span></div></div>
            <a className="text-link" href="/meet-mary">Meet Mary <ArrowUpRight size={16} /></a>
          </div>
        </section>
        <section className="testimonial-reserve" aria-label="Kind Words From People I've Helped"><div><p className="eyebrow">A quiet place for client perspective</p><h2>Kind Words From People I’ve Helped</h2></div><div className="testimonial-reserve__slots" aria-hidden="true"><span /><span /><span /></div></section>
        <section id="resources" className="resources" style={{ backgroundImage: `linear-gradient(rgba(16,42,67,.97), rgba(16,42,67,.97)), url(${contourTexture})` }}>
          <div className="resources__head"><div><p className="eyebrow eyebrow--gold">Resources for the road ahead</p><h2>Chart<br /><i>the Course.</i></h2></div><div className="resources__intro">There isn’t one right answer when it comes to housing, aging, and what comes next.<br /><br />That’s why I’ve built a collection of practical resources to help you understand your options before you need them.</div></div>
          <div className="resource-grid">            {resources.map(([title, body, Icon, href]) => <a className="resource-card" href={href as string} key={title as string}><Icon size={24} strokeWidth={1.2} /><h3>{title as string}</h3><p>{body as string}</p><ArrowUpRight className="resource-card__arrow" size={17} /></a>)}
</div>
          <div className="resources__cta"><ButtonLink variant="light" href="/resource-center">Visit the Resource Center</ButtonLink></div>
        </section>

        <section id="contact" className="final-cta section-paper" style={{ backgroundImage: `url(${paperTexture})` }}>
          <div className="final-cta__mark"><Anchor size={28} strokeWidth={1.2} /><span>02</span></div>
          <div className="final-cta__content"><p className="eyebrow">A conversation can be the beginning</p><h2>You Don’t Need a<br /><i>Perfect Plan.</i></h2><p>Whether you’re thinking about a move next month, next year, or simply wondering what your options might be, let’s talk.</p><div className="final-cta__buttons"><ButtonLink>Schedule a Conversation</ButtonLink></div></div>
        </section>
      </main>

      <footer id="newsletter" className="footer" style={{ backgroundImage: `linear-gradient(rgba(16,42,67,.98), rgba(16,42,67,.98)), url(${paperTexture})` }}>
        <div className="footer__top"><Brand compact footer /><p className="footer__statement">A Clear Plan for What Comes Next.<br /><i>Anchored in Baltimore.</i></p><div className="footer__contact"><a className="footer__phone" href="tel:+14103751400"><Phone size={15} /> (410) 375-1400</a><a href="mailto:mary@downsizebaltimore.com">mary@downsizebaltimore.com</a><div className="footer__brokerage"><strong>Cummings &amp; Co Realtors</strong><span>108 W. Timonium Road<br />Timonium, MD 21093</span><span>Office <a href="tel:+14108230033">(410) 823-0033</a></span></div><ButtonLink variant="gold">Schedule a Conversation</ButtonLink></div></div>
        <div className="footer__bottom"><div className="footer__links">{footerNavItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div><p>© 2026 Downsize Baltimore. All rights reserved.</p><p>Real estate services provided in affiliation with a licensed brokerage.</p></div>
      </footer>
    </div>
  );
}
