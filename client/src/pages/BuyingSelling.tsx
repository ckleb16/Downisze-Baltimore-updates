import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import DeferredBackground from "@/components/DeferredBackground";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Home,
  Scale,
} from "lucide-react";

/**
 * Harbor House Editorial — Buying & Selling page.
 * This page uses a more decisive, transaction-led composition than Downsizing Services:
 * navy structure, cream paper, antique-gold rules, and asymmetric editorial panels.
 */

const heroImage = "/manus-storage/mary-lynch-buying-selling-hero_41a29217.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";

const buyingTopics = [
  ["Rightsizing", "Finding a smaller or easier home that better fits the way you want to live now."],
  ["55+ Communities & Condominiums", "Comparing amenities, fees, housing styles, location, lifestyle, and long-term fit."],
  ["One-Level & Accessible Living", "Ranchers, villas, main-level suites, elevators, and homes with fewer physical barriers."],
  ["Multigenerational Living", "Homes that let generations stay connected while preserving privacy and independence."],
  ["ADUs", "Accessory Dwelling Units can create another option for family, support, or flexibility."],
];

const sellingTopics = [
  ["Strategic Preparation", "Understand what is worth doing before market—and what is not—before spending time or money."],
  ["Thoughtful Positioning", "Present the home honestly and attractively, with a strategy grounded in its real strengths."],
  ["Timing & Logistics", "Coordinate preparation, showings, offers, settlement, and the next chapter with a clear sequence."],
  ["Negotiation", "Protect your priorities while navigating price, terms, inspections, repairs, and timing."],
  ["A Move That Makes Sense", "The goal is not simply to sell. It is to move forward in a way that works for your life."],
];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) {
  return <a className={`bs-button bs-button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} /></a>;
}

export default function BuyingSelling() {
  return (
    <div id="top" className="bs-page">
      <SiteHeader currentPath="/buying-selling" />

      <main id="main-content" tabIndex={-1}>
        <section className="bs-hero">
          <div className="bs-hero__copy"><p className="bs-eyebrow">Buying &amp; selling with perspective</p><h1>The Agent You Need for Your First Home Is Very Different From the Agent You Need for Your <i>Last.</i></h1><div className="bs-rule" /><p>Selling a longtime home or buying the place that comes next is very different from buying your first house.</p><p>The stakes can feel higher. The emotions can run deeper. And the decisions often affect much more than real estate.</p><ButtonLink>Let’s Talk About Your Plan</ButtonLink><p className="bs-hero__note"><span>30</span> years of helping Baltimore-area families make thoughtful real estate decisions.</p></div>
          <div className="bs-hero__photo"><ResponsiveImage src={heroImage} sizes="(max-width: 900px) 100vw, 50vw" priority alt="Mary Lynch working on the phone beside an open laptop" /><span className="bs-hero__caption">01 / The move, handled well.</span></div>
        </section>

        <section id="choose" className="bs-choice">
          <div className="bs-section-intro"><p className="bs-eyebrow">Choose your path</p><h2>When the decision is clear,<br /><i>the next step can be too.</i></h2><p>Whether you are preparing to sell, beginning to look, or considering both at once, Mary brings the transaction experience and the perspective to help you move with intention.</p></div>
          <div className="bs-choice__grid">
            <article className="bs-choice-card"><div className="bs-choice-card__top"><span>01</span><Home size={28} strokeWidth={1.1} /></div><h3>I’m <i>Buying</i></h3><p>Know your <strong>why</strong> before you start looking. When you are clear about the life you want to live, finding the right home becomes much easier.</p><a href="#buying">Explore Buying <ArrowDownRight size={17} /></a></article>
            <article className="bs-choice-card bs-choice-card--dark"><div className="bs-choice-card__top"><span>02</span><Scale size={28} strokeWidth={1.1} /></div><h3>I’m <i>Selling</i></h3><p>Your home does not have to be perfect to sell. It needs the right strategy, honest positioning, and a plan that makes sense for the property and for you.</p><a href="#selling">Explore Selling <ArrowDownRight size={17} /></a></article>
          </div>
        </section>

        <section id="buying" className="bs-buying">
          <div className="bs-section-number">02 <span>/</span> BUYING</div>
          <div className="bs-split-heading"><div><p className="bs-eyebrow">The home is part of the plan</p><h2>Find the Home<br />That Fits the Life<br /><i>You Want Now.</i></h2></div><div className="bs-split-heading__copy"><p>Buying is not simply about bedrooms, bathrooms, and square footage. Mary helps clients think about both the real estate decision and the life surrounding it.</p><p>That may mean one-level living, less maintenance, proximity to family or healthcare, a more social community, or a home that can adapt if needs change.</p><ButtonLink href={calendlyUrl} variant="outline">Talk Through the Possibilities</ButtonLink></div></div>
          <div className="bs-question-band"><p>Questions worth asking</p><div>{["Do I want one-level living?", "How much maintenance do I want?", "Would I like to be closer to family?", "What happens if I drive less someday?", "Is healthcare nearby?", "Could this home adapt if my needs change?"] .map((q) => <span key={q}><Check size={15} />{q}</span>)}</div></div>
          <div className="bs-topic-grid">{buyingTopics.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
        </section>

        <DeferredBackground id="selling" className="bs-selling" backgroundImage={`linear-gradient(rgba(16,42,67,.96), rgba(16,42,67,.96)), url(${contourTexture})`}>
          <div className="bs-section-number bs-section-number--light">03 <span>/</span> SELLING</div>
          <div className="bs-selling__intro"><p className="bs-eyebrow bs-eyebrow--gold">Clarity before the sign goes up</p><h2>Sell the Home.<br /><i>Protect the Life Around It.</i></h2><p>Your home does not have to be perfect to sell. It needs the right strategy, honest positioning, and a plan that makes sense for the property and for you.</p><p>Mary helps sellers understand their options before deciding how much work, if any, should happen before going to market.</p></div>
          <div className="bs-selling__grid">{sellingTopics.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          <div className="bs-selling__close"><p>Good preparation is not about making a home look like someone else’s. It is about making the right decisions, in the right order, for the home you have and the future you are creating.</p><ButtonLink variant="light">Create a Selling Plan</ButtonLink></div>
        </DeferredBackground>

        <section className="bs-guidance"><div className="bs-guidance__mark"><ChevronDown size={27} strokeWidth={1.1} /><span>04</span></div><div><p className="bs-eyebrow">Experienced guidance, without pressure</p><h2>Real estate is the transaction.<br /><i>The plan is the bigger picture.</i></h2><p>Mary brings 30 years of residential real estate experience to the table, along with the patience to understand what surrounds the move: family, timing, belongings, finances, and what you want daily life to feel like next.</p><ButtonLink>Schedule a Conversation</ButtonLink></div></section>

        <DeferredBackground className="bs-final" data-testimonial-reserve="buying-selling-closing" backgroundImage={`url(${paperTexture})`}><div className="bs-final__frame"><p className="bs-eyebrow">A thoughtful next step</p><h2>You Don’t Need to<br /><i>Figure It Out Alone.</i></h2><p>Whether you are ready to buy, preparing to sell, or still making sense of the options, a conversation can help bring the whole picture into focus.</p><div><ButtonLink>Schedule a Conversation</ButtonLink></div></div></DeferredBackground>
      </main>
      <SiteFooter currentPath="/buying-selling" />
    </div>
  );
}
