import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import DeferredBackground from "@/components/DeferredBackground";
import { ArrowUpRight, Check, Anchor } from "lucide-react";

// Harbor House Editorial: reuse the approved Home page system — navy, cream, taupe, antique gold,
// Cormorant-led headlines, quiet rules, restrained compass details, generous editorial pacing.
const heroPhoto = "/manus-storage/downsizing-hero_718d6bc8.jpeg";
const roomPhoto = "/manus-storage/downsizing-room_d33a128b.jpeg";
const maryPhoto = "/manus-storage/mary-lynch-downsizing_b73a2d4f.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";

const steps = [
  ["01", "Start With the Conversation", "We talk about what’s working, what isn’t, your timeline, your concerns, and what you would like life to look like next."],
  ["02", "Explore Where You’re Going", "Before deciding what stays or goes, we look at your options — from a smaller home or condo to a 55+ community, senior living, multigenerational home, or staying where you are."],
  ["03", "Build the Plan", "Once we understand the destination, we create a realistic timeline. Instead of one enormous project, we create manageable steps."],
  ["04", "Decide What Comes With You", "We look at the new space and make decisions based on where you are going, not simply on what you currently own."],
  ["05", "Handle What’s Left", "Mary can connect you with trusted local professionals who can help with sorting, estate sales, donations, clean-outs, moving, repairs, and other pieces of the transition."],
  ["06", "Prepare, Sell, and Get Settled", "If selling the current home is part of the plan, Mary manages the real estate piece from preparation and pricing through settlement."],
  ["07", "Make the Transition", "With the moving pieces in the right order, we coordinate the handoff from the current home to the next chapter."],
  ["08", "Settle Into What’s Next", "The plan continues after the move, with time to make the new home and the new rhythm feel like your own."],
];

const possibilities = ["Less maintenance", "More freedom to travel", "Living closer to family and friends", "More opportunities for connection", "A safer, easier home", "Lower or more predictable expenses", "One-level living", "A community that fits the life you want now", "Simply having less house to take care of"];
const questions = ["Is the house requiring more maintenance than you want to manage?", "Are there rooms you rarely use?", "Would you like to live closer to family, friends, activities, or healthcare?", "Are stairs or other features becoming less convenient?", "Would a different home give you more freedom or simplicity?", "Could your current home be modified successfully instead?"];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) {
  return <a className={`ds-button ds-button--${variant}`} href={href}>{children}<ArrowUpRight size={15} /></a>;
}

export default function Downsizing() {
  return <div className="ds-page"><SiteHeader currentPath="/downsizing-services" /><main id="main-content" tabIndex={-1}>
    <section className="ds-hero"><ResponsiveImage className="ds-hero__image" src={heroPhoto} sizes="100vw" priority alt="" aria-hidden="true" /><div className="ds-hero__content"><p className="ds-eyebrow ds-eyebrow--light"><span /> Downsizing Services</p><h1>Downsizing Doesn’t Have to Be <i>Overwhelming.</i></h1><p>The biggest mistake is trying to tackle everything at once.</p><p>A successful move starts with understanding <strong>where you’re going, how you want to live, and what you’ll need when you get there.</strong> From there, we can create a clear plan for everything else.</p><ButtonLink>Start With a Conversation</ButtonLink></div><div className="ds-hero__caption">Destination first. Plan second. Stuff third.</div></section>

    <DeferredBackground className="ds-plan" backgroundImage={`url(${paperTexture})`}><div className="ds-plan__label"><Anchor size={15} /><span /> START WITH YOU</div><div className="ds-plan__body"><p className="ds-eyebrow">It all starts with a plan.</p><h2>So we don’t begin<br />with the house.</h2><div className="ds-plan__copy"><p>A house full of belongings can make downsizing feel like an impossible place to begin.</p><p>So we don’t begin with the house.<br />We begin with <i>you.</i></p><div className="ds-questions">{["Where do you want to live?", "What do you want your days to look like?", "How much space do you really need?", "What do you want to spend your time and money on?", "What needs to be easier than it is today?"] .map(q => <span key={q}>{q}</span>)}</div><p>Once we know where you’re headed, the decisions about what comes with you become much clearer.</p></div></div><div className="ds-callout"><span /> Destination first. Plan second. Stuff third. <span /></div></DeferredBackground>

    <section className="ds-destination"><div className="ds-destination__image"><ResponsiveImage src={roomPhoto} sizes="(max-width: 820px) 100vw, 50vw" alt="A sunlit living room with packed moving boxes" /><span className="ds-image-label">02 / A POSSIBLE NEXT HOME</span></div><div className="ds-destination__copy"><p className="ds-eyebrow">What are you moving toward?</p><h2>Downsizing Is About More Than a <i>Smaller House.</i></h2><p>For many people, the goal isn’t simply less square footage.</p><p>It may be making room for:</p><div className="ds-possibilities">{possibilities.map((item, i) => <span key={item}><b>0{i + 1}</b>{item}</span>)}</div><blockquote>The goal is not simply to give something up. It is to decide what you want to make room for.</blockquote></div></section>

    <section className="ds-steps"><div className="ds-section-head"><div><p className="ds-eyebrow ds-eyebrow--gold">A clear path forward</p><h2>One Step<br /><i>at a Time.</i></h2></div><p>You don’t have to solve everything today.<br />We put the pieces in the right order.</p></div><div className="ds-step-grid">{steps.map(([num, title, copy]) => <article className="ds-step-card" key={num}><div className="ds-step-card__top"><span>{num}</span><Anchor size={17} /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <DeferredBackground className="ds-small" backgroundImage={`linear-gradient(90deg,rgba(16,42,67,.92),rgba(16,42,67,.78)),url(${paperTexture})`}><p className="ds-eyebrow ds-eyebrow--light">A gentler place to begin</p><h2>You Don’t Have to Tackle<br />the Whole House <i>Today.</i></h2><p>One of the best ways to reduce overwhelm is to stop thinking about “the whole house.” Start with one drawer. One closet. One room.</p><div className="ds-small__line">Keep. Give. Sell. Donate. Digitize. Let Go.</div></DeferredBackground>

    <section className="ds-help"><div className="ds-help__placeholder"><div className="ds-portrait-frame"><ResponsiveImage src={maryPhoto} sizes="(max-width: 900px) 76vw, 400px" alt="Mary Lynch smiling in a warm, light-filled room" /></div></div><div className="ds-help__copy"><p className="ds-eyebrow">A coordinated network of support</p><h2>The Right Help,<br /><i>at the Right Time.</i></h2><p>Downsizing often involves more than one professional.</p><p>Depending on your situation, your plan may include:</p><div className="ds-help__grid">{["Move managers", "Professional organizers", "Estate sale professionals", "Donation and clean-out services", "Movers", "Contractors and repair professionals", "Occupational therapists", "Home modification specialists", "55+ and senior living resources", "Elder law and estate professionals", "Financial professionals", "Home care and community resources"].map(item => <span key={item}><Check size={13} />{item}</span>)}</div><blockquote>My job isn’t to hand you a giant vendor list. It is to help identify which help you need, and when you need it.</blockquote></div></section>

    <section className="ds-not-sure"><div className="ds-not-sure__head"><p className="ds-eyebrow ds-eyebrow--gold">You can start before you decide</p><h2>Not Sure If It’s <i>Time Yet?</i></h2><p>You may be wondering whether moving would actually make life better. That is exactly the right time to start exploring your options.</p></div><div className="ds-question-grid">{questions.map((q, i) => <div key={q}><span>0{i + 1}</span><p>{q}</p></div>)}</div><p className="ds-not-sure__close">You do not need to decide today. You just need enough information to make a good decision when the time is right.</p><div className="ds-button-row"><ButtonLink>Schedule a Conversation</ButtonLink><ButtonLink variant="outline" href="/aging-in-place">Explore Aging in Place</ButtonLink></div></section>

    <DeferredBackground id="resources" className="ds-resources" backgroundImage={`linear-gradient(rgba(16,42,67,.97),rgba(16,42,67,.97)),url(${contourTexture})`}><div className="ds-resources__head"><div><p className="ds-eyebrow ds-eyebrow--gold">A little more clarity</p><h2>Want to Dig<br /><i>a Little Deeper?</i></h2></div><p>Explore the guidance available now, or ask Mary which practical next step fits your situation. New tools will be added only after they are ready to use.</p></div><div className="ds-button-row"><ButtonLink variant="light" href="/resource-center">Visit the Resource Center</ButtonLink><ButtonLink variant="outline" href="/resource-center#club">Learn About the Downsizers Club</ButtonLink></div></DeferredBackground>

    <DeferredBackground className="ds-final site-closing-strip" data-testimonial-reserve="downsizing-closing" backgroundImage={`url(${paperTexture})`}>
      <div className="site-closing-strip__content">
        <div className="site-closing-strip__heading">
          <p className="ds-eyebrow">A conversation can be the beginning</p>
          <h2>One Conversation Can Make the Whole Thing Feel <i>More Manageable.</i></h2>
        </div>
        <div className="site-closing-strip__copy">
          <p>You don’t need to know where you’re moving. You don’t need to have cleaned out the basement. And you certainly don’t need to have all the answers.</p>
          <p>We can start by talking about what you want life to look like next.</p>
        </div>
      </div>
    </DeferredBackground>
  </main><SiteFooter currentPath="/downsizing-services" /></div>;
}
