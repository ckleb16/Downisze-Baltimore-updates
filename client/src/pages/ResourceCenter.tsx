import { useRef, useState } from "react";
import { ArrowUpRight, BookOpen, ChevronDown, Anchor, Home, Menu, Phone, Scale, ShieldCheck, Users, X } from "lucide-react";

/**
 * Harbor House Editorial — Resource Center.
 * A growing library of answers: question-led pathways, generous paper space,
 * calm navigation, and clear development states instead of a downloads warehouse.
 */

const wideLogo = "/manus-storage/DownsizeBaltimoreWide-YelWhite_e501a303.png";
const verticalLogo = "/manus-storage/DownsizeBaltimoreB-YelWhite_850df9b1.png";
const heroImage = "/manus-storage/mary-lynch-resource-center_4f151291.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4.png";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7.png";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";
const phoneNumber = "(410) 375-1400";
const emailAddress = "mary@downsizebaltimore.com";

const currentPath = "/resource-center";
const navItems = [["Home", "/"], ["Downsizing Services", "/downsizing-services"], ["Aging in Place", "/aging-in-place"], ["Buying & Selling", "/buying-selling"], ["Resource Center", "/resource-center"], ["Meet Mary", "/meet-mary"], ["Contact", "/contact"]];
const footerNavItems = [["Home", "/"], ["Downsizing Services", "/downsizing-services"], ["Aging in Place", "/aging-in-place"], ["Buying & Selling", "/buying-selling"], ["Resource Center", "/resource-center"], ["Meet Mary", "/meet-mary"], ["Contact", "/contact"]];

type ResourcePathwayKey = "stay" | "downsizing" | "family" | "housing" | "probate" | "local";

type FeaturedResource = {
  title: string;
  body: string;
  status: string;
  href: string;
  tags: ResourcePathwayKey[];
};

type UpcomingEvent = {
  title: string;
  date: string;
  details: string;
  href?: string;
};

const pathways = [
  { key: "stay", icon: ShieldCheck, question: "Can I Stay in My Home?", body: "Resources for evaluating whether your current home can continue to support the way you want to live.", topics: "Home safety · Aging in place · Home modifications · Universal design · Technology · Staying versus moving", action: "Show related resources" },
  { key: "downsizing", icon: Scale, question: "I’m Thinking About Downsizing. Where Do I Start?", body: "Practical help for making a plan, dealing with belongings, and taking manageable steps before a move becomes urgent.", topics: "Downsizing planning · Decluttering · Donation · Estate sales · Move management · Preparing a home for sale", action: "Show related resources" },
  { key: "family", icon: Users, question: "I’m Helping Someone I Love", body: "Resources for adult children, caregivers, and families trying to help without taking over.", topics: "Starting the housing conversation · Caregiver resources · Planning together · Local Baltimore-area support", action: "Show related resources" },
  { key: "housing", icon: Home, question: "What Are My Housing Options?", body: "Clear explanations of the different ways and places we can live as our needs and priorities change.", topics: "55+ communities · One-level living · Condos · Independent living · Multigenerational living · ADUs", action: "Show related resources" },
  { key: "probate", icon: BookOpen, question: "I’m Handling an Estate or Probate. Where Do I Start?", body: "Educational resources for families and personal representatives responsible for a home and its contents.", topics: "Maryland probate basics · Probate timeline · Terminology · Estate property · Out-of-state property", action: "Show related resources" },
  { key: "local", icon: Anchor, question: "I Need a Trusted Local Resource", body: "You do not need to diagnose which professional you need before reaching out. We can start with the question.", topics: "Home modifications · Move management · Estate planning · Home care · Occupational therapy · Housing options", action: "Show related resources" },
];

const featured: FeaturedResource[] = [
  { title: "Should I Stay or Should I Go?", body: "Is your home still working for the life you want to live? A thoughtful self-evaluation covering home fit, maintenance, mobility, transportation, health, connection, support, finances, and resilience.", status: "Interactive", href: "/aging-in-place#self-evaluation", tags: ["stay", "housing", "family"] },
  { title: "The Forever Home Playbook", body: "What makes a home work for the years ahead? A practical look at features that can make a home safer, easier, and more comfortable over time.", status: "In development", href: "#", tags: ["stay", "housing"] },
  { title: "What Do I Do With All This Stuff?", body: "Practical options for sorting, sharing, selling, donating, and letting go without trying to tackle everything at once.", status: "In development", href: "#", tags: ["downsizing", "family"] },
  { title: "How Do I Start the Conversation?", body: "For older adults and adult children who know there are things they should probably talk about, but are not sure how to begin.", status: "In development", href: "#", tags: ["family", "local"] },
  { title: "Maryland Probate: Where Do I Start?", body: "A practical starting point for someone who has inherited responsibility for an estate or property and is not sure what happens next.", status: "In development", href: "#", tags: ["probate", "local"] },
];

const availableFeatured = featured.filter(({ href }) => href !== "#");
const upcomingEvents: UpcomingEvent[] = [];

const faqs = [
  ["How do I know if it’s time to downsize or if I just need to modify my home?", "Start by looking at the life you want to live, the work your current home requires, and the changes that might make staying easier. There is no single right answer, which is why understanding both paths matters."],
  ["How do I talk to my parents about their house without starting a fight?", "Begin with curiosity rather than a solution. Ask what is working, what feels harder, and what they want the next few years to look like. A conversation can begin long before a decision is required."],
  ["Is it better to move while I’m healthy or wait until I have to?", "That depends on your priorities, resources, support system, and the home itself. Planning early gives you more choices; it does not mean you have to move now."],
  ["What do I do with all my furniture when I downsize?", "Begin with the destination. Knowing the rooms, measurements, and way you want to live next makes decisions about furniture much clearer than sorting in the abstract."],
  ["How do I empty an entire house when I live out of state?", "Create a sequence before calling everyone at once. A local plan may involve sorting, valuation, donation, clean-out, repairs, sale preparation, and regular communication with the people responsible for each step."],
];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) { return <a className={`resource-button resource-button--${variant}`} href={href}>{children}<ArrowUpRight size={16} /></a>; }
function Brand({ footer = false }: { footer?: boolean }) { return <a href="/" className={`resource-brand ${footer ? "resource-brand--footer" : ""}`} aria-label="Downsize Baltimore home"><img src={footer ? verticalLogo : wideLogo} alt="Downsize Baltimore" /></a>; }
function Footer() { return <footer className="resource-footer"><div className="resource-footer__top"><div><Brand footer /><p>A Clear Plan for What Comes Next.<br /><i>Anchored in Baltimore.</i></p></div><div className="resource-footer__contact"><a className="resource-footer__phone" href="tel:+14103751400"><Phone size={15} /> {phoneNumber}</a><a href={`mailto:${emailAddress}`}>{emailAddress}</a><div><strong>Cummings &amp; Co. Realtors</strong><span>108 W. Timonium Road<br />Timonium, MD 21093</span><span>Office <a href="tel:+14108230033">(410) 823-0033</a></span></div><ButtonLink>Schedule a Conversation</ButtonLink></div></div><div className="resource-footer__bottom"><div>{footerNavItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined}>{label}</a>)}</div><span>© 2026 Downsize Baltimore. All rights reserved.</span><span>Real estate services provided in affiliation with a licensed brokerage.</span></div></footer>; }

export default function ResourceCenter() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activePathway, setActivePathway] = useState<ResourcePathwayKey | null>(() => {
    const requestedPath = new URLSearchParams(window.location.search).get("path") as ResourcePathwayKey | null;
    return requestedPath && availableFeatured.some(({ tags }) => tags.includes(requestedPath)) ? requestedPath : null;
  });
  const filteredFeatured = activePathway ? availableFeatured.filter(({ tags }) => tags.includes(activePathway)) : availableFeatured;
  const choosePathway = (key: ResourcePathwayKey) => {
    setActivePathway(key);
    window.setTimeout(() => {
      const library = document.getElementById("resource-library");
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      library?.scrollIntoView({ behavior, block: "start" });
      library?.focus({ preventScroll: true });
    }, 0);
  };
  return <div className="resource-page">
    <header className="resource-header"><div className="resource-header__top"><Brand /><div><ButtonLink>Talk to Mary</ButtonLink><button ref={menuButtonRef} type="button" className="resource-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="resource-mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button></div></div><nav className="resource-nav" aria-label="Primary navigation">{navItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined}>{label}</a>)}</nav><nav id="resource-mobile-navigation" className="resource-mobile-nav" aria-label="Mobile navigation" hidden={!mobileOpen} onKeyDown={(event) => { if (event.key === "Escape") { setMobileOpen(false); menuButtonRef.current?.focus(); } }}>{navItems.map(([label, href]) => <a key={label} href={href} className={href === currentPath ? "is-active" : undefined} aria-current={href === currentPath ? "page" : undefined} onClick={() => setMobileOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}<ButtonLink>Talk to Mary</ButtonLink></nav></header>
    <main id="main-content" tabIndex={-1}>
      <section className="resource-hero"><div className="resource-hero__copy"><p className="resource-eyebrow">A library of answers</p><h1>Resources for<br /><i>Whatever Comes Next.</i></h1><div className="resource-rule" /><p>You don’t have to figure everything out at once.</p><p>Start with the question that’s on your mind, then explore the practical guidance available now to help you understand your options and decide what comes next.</p><ButtonLink href="#questions">Start With Your Question</ButtonLink></div><div className="resource-hero__photo"><img src={heroImage} alt="Mary Lynch seated at a table with an open laptop" /><span>01 / Start with the question.</span></div></section>

      <section id="questions" className="resource-pathways"><div className="resource-section-heading"><p className="resource-eyebrow">Start with your question</p><h2>What Can I Help You<br /><i>Figure Out?</i></h2><p>Think of these as doors into different parts of the Resource Center. Choose the one that feels closest to what is on your mind.</p></div><div className="resource-pathway-grid">{pathways.map(({ key, icon: Icon, question, body, topics, action }, index) => {
        const pathwayKey = key as ResourcePathwayKey;
        const hasAvailableResource = availableFeatured.some(({ tags }) => tags.includes(pathwayKey));
        return <article className={activePathway === pathwayKey ? "is-selected" : ""} key={question}><div className="resource-pathway__top"><span>0{index + 1}</span><Icon size={25} strokeWidth={1.15} /></div><h3>{question}</h3><p>{body}</p><small>{topics}</small>{hasAvailableResource ? <button type="button" className="resource-pathway__action" aria-label={`${action} for ${question}`} aria-controls="resource-library" aria-pressed={activePathway === pathwayKey} onClick={() => choosePathway(pathwayKey)}>{action}<ArrowUpRight size={16} /></button> : <a className="resource-pathway__action" href="/contact" aria-label={`Ask Mary about ${question}`}>Ask Mary this question<ArrowUpRight size={16} /></a>}</article>;
      })}</div></section>

      <section id="resource-library" className="resource-featured" tabIndex={-1} aria-labelledby="resource-library-heading"><div className="resource-featured__head"><div><p className="resource-eyebrow resource-eyebrow--gold">A good place to start</p><h2 id="resource-library-heading">Practical Tools<br /><i>for the Road Ahead.</i></h2></div><div><p>Begin with the interactive self-evaluation available now, designed to help you understand your options and decide what comes next.</p>{activePathway && <button type="button" className="resource-filter-reset" onClick={() => setActivePathway(null)}>Show all resources</button>}</div></div><div className="resource-featured-grid">{filteredFeatured.map(({ title, body, status, href }) => <article key={title}><span className="resource-status">{status}</span><h3>{title}</h3><p>{body}</p><a href={href}>Explore this resource <ArrowUpRight size={16} /></a></article>)}</div></section>

      <section id="club" className="resource-club" style={{ backgroundImage: `linear-gradient(rgba(16,42,67,.96),rgba(16,42,67,.96)),url(${contourTexture})` }}><div className="resource-club__mark"><Anchor size={26} strokeWidth={1.1} /><span>03</span></div><div className="resource-club__content"><p className="resource-eyebrow resource-eyebrow--gold">Learn about the club</p><h2>Not Ready to Move?<br /><i>You Can Still Start Getting Ready.</i></h2><p>The Downsizers Club of Baltimore is designed for people who are thinking about a move in the next few years and want to prepare a little at a time.</p><p>Participants receive practical education, local resources, and manageable action steps covering the things that tend to make downsizing feel overwhelming.</p><div className="resource-club__topics"><span>Decluttering &amp; belongings</span><span>Important paperwork</span><span>Home preparation</span><span>Housing options</span><span>Move planning</span><span>What to do now versus later</span></div><ButtonLink variant="light" href="/contact">Ask About the Club</ButtonLink></div></section>

      <section id="faq" className="resource-faq"><div className="resource-section-heading"><p className="resource-eyebrow">Questions people really ask</p><h2>Chances Are,<br /><i>Someone Else Asked It Too.</i></h2><p>Answers should be easy to find, useful on their own, and able to grow as the Resource Center grows.</p></div><div className="resource-faq-list">{faqs.map(([question, answer], index) => {
        const buttonId = `resource-faq-button-${index}`;
        const panelId = `resource-faq-panel-${index}`;
        const isOpen = openFaq === index;
        return <div className={`resource-faq-item ${isOpen ? "is-open" : ""}`} key={question}><h3><button id={buttonId} type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={panelId}><span>{question}</span><ChevronDown size={18} /></button></h3><div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}><p>{answer}</p></div></div>;
      })}</div></section>

      <section className="resource-learn"><div><p className="resource-eyebrow">Learn with Mary</p><h2>Prefer to<br /><i>Learn Together?</i></h2></div><div><p>Mary regularly brings education into Greater Baltimore communities through library programs, workshops, community events, and the National Aging in Place Council, Greater Baltimore Chapter.</p><div className="resource-learn__topics"><span>Aging in place</span><span>Downsizing</span><span>Housing options</span><span>Planning ahead</span><span>Home safety</span><span>Caregiving</span></div><ButtonLink href="/contact">Ask About Classes &amp; Events</ButtonLink></div></section>

      {upcomingEvents.length > 0 && <section id="upcoming-classes-events" className="resource-events"><div><p className="resource-eyebrow resource-eyebrow--gold">Upcoming Classes &amp; Events</p><h2>Learn with Mary,<br /><i>in good company.</i></h2></div><div>{upcomingEvents.map(({ title, date, details, href }) => <article key={`${date}-${title}`}><span className="resource-events__status">{date}</span><h3>{title}</h3><p>{details}</p>{href && <a href={href}>Registration details <ArrowUpRight size={16} /></a>}</article>)}</div></section>}

      <aside id="probate" className="resource-disclaimer" aria-label="Educational disclaimer"><p>These resources are shared for education and convenience. For legal, financial, or medical questions, please consult the appropriate professional. I’m happy to help connect you with trusted specialists when needed.</p></aside>
      <section className="resource-final" style={{ backgroundImage: `url(${paperTexture})` }}><div className="resource-final__frame"><p className="resource-eyebrow">Still not sure where to start?</p><h2>You Don’t Need to Know<br /><i>Which Door to Open.</i></h2><p>Sometimes the best first step is simply a conversation.</p><div><ButtonLink>Schedule a Conversation</ButtonLink></div></div></section>
    </main><Footer /></div>;
}
