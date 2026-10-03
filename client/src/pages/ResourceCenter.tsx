import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ResponsiveImage from "@/components/ResponsiveImage";
import DeferredBackground from "@/components/DeferredBackground";
import LatestInsights from "@/components/LatestInsights";
import ResourceGuides from "@/components/ResourceGuides";
import { ArrowUpRight, BookOpen, ChevronDown, Anchor, Home, Scale, ShieldCheck, Users } from "lucide-react";

/**
 * Harbor House Editorial — Resource Center.
 * A growing library of answers: question-led pathways, generous paper space,
 * calm navigation, and clear development states instead of a downloads warehouse.
 */

const heroImage = "/manus-storage/mary-lynch-resource-center_4f151291.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";
const currentPath = "/resource-center";

const pathways = [
  { icon: ShieldCheck, question: "Can I Stay in My Home?", body: "Resources for evaluating whether your current home can continue to support the way you want to live.", topics: "Home safety · Aging in place · Home modifications · Universal design · Technology · Staying versus moving", action: "Try the self-evaluation", href: "/aging-in-place#self-evaluation" },
  { icon: Scale, question: "I’m Thinking About Downsizing. Where Do I Start?", body: "Practical help for making a plan, dealing with belongings, and taking manageable steps before a move becomes urgent.", topics: "Downsizing planning · Decluttering · Donation · Estate sales · Move management · Preparing a home for sale", action: "Explore downsizing services", href: "/downsizing-services" },
  { icon: Users, question: "I’m Helping Someone I Love", body: "Resources for adult children, caregivers, and families trying to help without taking over.", topics: "Starting the housing conversation · Caregiver resources · Planning together · Local Baltimore-area support", action: "Ask Mary this question", href: "/contact" },
  { icon: Home, question: "What Are My Housing Options?", body: "Clear explanations of the different ways and places we can live as our needs and priorities change.", topics: "55+ communities · One-level living · Condos · Independent living · Multigenerational living · ADUs", action: "Talk through your options", href: "/contact" },
  { icon: BookOpen, question: "I’m Handling an Estate or Probate. Where Do I Start?", body: "Educational resources for families and personal representatives responsible for a home and its contents.", topics: "Maryland probate basics · Probate timeline · Terminology · Estate property · Out-of-state property", action: "Ask Mary this question", href: "/contact" },
  { icon: Anchor, question: "I Need a Trusted Local Resource", body: "You do not need to diagnose which professional you need before reaching out. We can start with the question.", topics: "Home modifications · Move management · Estate planning · Home care · Occupational therapy · Housing options", action: "Ask Mary for a connection", href: "/contact" },
];

const faqs = [
  ["How do I know if it’s time to downsize or if I just need to modify my home?", "Start by looking at the life you want to live, the work your current home requires, and the changes that might make staying easier. There is no single right answer, which is why understanding both paths matters."],
  ["How do I talk to my parents about their house without starting a fight?", "Begin with curiosity rather than a solution. Ask what is working, what feels harder, and what they want the next few years to look like. A conversation can begin long before a decision is required."],
  ["Is it better to move while I’m healthy or wait until I have to?", "That depends on your priorities, resources, support system, and the home itself. Planning early gives you more choices; it does not mean you have to move now."],
  ["What do I do with all my furniture when I downsize?", "Begin with the destination. Knowing the rooms, measurements, and way you want to live next makes decisions about furniture much clearer than sorting in the abstract."],
  ["How do I empty an entire house when I live out of state?", "Create a sequence before calling everyone at once. A local plan may involve sorting, valuation, donation, clean-out, repairs, sale preparation, and regular communication with the people responsible for each step."],
];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) { return <a className={`resource-button resource-button--${variant}`} href={href}>{children}<ArrowUpRight size={16} aria-hidden="true" /></a>; }

export default function ResourceCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return <div className="resource-page">
    <SiteHeader currentPath={currentPath} />
    <main id="main-content" tabIndex={-1}>
      <section className="resource-hero"><div className="resource-hero__copy"><p className="resource-eyebrow">A library of answers</p><h1>Resources for<br /><i>Whatever Comes Next.</i></h1><div className="resource-rule" /><p>You don’t have to figure everything out at once.</p><p>Start with the question that’s on your mind, then explore the practical guidance available now to help you understand your options and decide what comes next.</p><ButtonLink href="#questions">Start With Your Question</ButtonLink></div><div className="resource-hero__photo"><ResponsiveImage src={heroImage} sizes="(max-width: 1180px) 100vw, 50vw" priority alt="Mary Lynch seated at a table with an open laptop" /><span className="resource-hero__caption">Start with the question.</span></div></section>

      <section id="questions" className="resource-pathways"><div className="resource-section-heading"><p className="resource-eyebrow">Start with your question</p><h2>What Can I Help You <i>Figure Out?</i></h2><p>Think of these as doors into different parts of the Resource Center. Choose the one that feels closest to what is on your mind.</p></div><div className="resource-pathway-grid">{pathways.map(({ icon: Icon, question, body, topics, action, href }, index) => {
        return <article key={question}><div className="resource-pathway__top"><span>0{index + 1}</span><Icon size={25} strokeWidth={1.15} aria-hidden="true" /></div><h3>{question}</h3><p>{body}</p><small>{topics}</small><a className="resource-pathway__action" href={href}>{action}<ArrowUpRight size={16} aria-hidden="true" /></a></article>;
      })}</div></section>

      <ResourceGuides />

      <DeferredBackground id="resource-library" className="resource-featured resource-insights" aria-labelledby="resource-library-heading" backgroundImage={`url(${contourTexture})`}><div className="resource-featured__head"><div><p className="resource-eyebrow resource-eyebrow--gold">Insights &amp; Advice</p><h2 id="resource-library-heading">A Little Clarity<br /><i>for the Road Ahead.</i></h2></div><div><p>Read Mary’s latest thoughts on downsizing, aging in place, family conversations, and the choices that shape what comes next.</p><a className="resource-insights__all" href="/insights-advice">Read More Insights &amp; Advice <ArrowUpRight size={16} aria-hidden="true" /></a></div></div><LatestInsights /></DeferredBackground>

      <DeferredBackground id="club" className="resource-club" backgroundImage={`linear-gradient(rgba(16,42,67,.96),rgba(16,42,67,.96)),url(${contourTexture})`}><div className="resource-club__mark"><Anchor size={26} strokeWidth={1.1} aria-hidden="true" /></div><div className="resource-club__content"><p className="resource-eyebrow resource-eyebrow--gold">Learn about the club</p><h2>Not Ready to Move?<br /><i>You Can Still Start Getting Ready.</i></h2><p>The Downsizers Club of Baltimore is designed for people who are thinking about a move in the next few years and want to prepare a little at a time.</p><p>Participants receive practical education, local resources, and manageable action steps covering the things that tend to make downsizing feel overwhelming.</p><ul className="resource-club__topics" role="list"><li><span>Decluttering &amp; belongings</span></li><li><span>Important paperwork</span></li><li><span>Home preparation</span></li><li><span>Housing options</span></li><li><span>Move planning</span></li><li><span>What to do now versus later</span></li></ul><ButtonLink variant="light" href="/contact">Join for Free</ButtonLink></div></DeferredBackground>

      <section id="faq" className="resource-faq"><div className="resource-section-heading"><p className="resource-eyebrow">Questions people really ask</p><h2>Chances Are,<br /><i>Someone Else Asked It Too.</i></h2><p>Start with the question closest to yours. Each answer offers a practical place to begin.</p></div><div className="resource-faq-list">{faqs.map(([question, answer], index) => {
        const buttonId = `resource-faq-button-${index}`;
        const panelId = `resource-faq-panel-${index}`;
        const isOpen = openFaq === index;
        return <div className={`resource-faq-item ${isOpen ? "is-open" : ""}`} key={question}><h3><button id={buttonId} type="button" onClick={() => setOpenFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={panelId}><span>{question}</span><ChevronDown size={18} aria-hidden="true" /></button></h3><div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}><p>{answer}</p></div></div>;
      })}</div></section>

      <aside id="probate" className="resource-disclaimer" aria-label="Educational disclaimer"><p>These resources are shared for education and convenience. For legal, financial, or medical questions, please consult the appropriate professional. I’m happy to help connect you with trusted specialists when needed.</p></aside>
      <DeferredBackground className="resource-closing site-closing-strip" backgroundImage={`url(${paperTexture})`}><div className="site-closing-strip__content"><div className="site-closing-strip__heading"><p className="resource-eyebrow">Still not sure where to start?</p><h2>You Don’t Need to Know <i>Which Door to Open.</i></h2></div><div className="site-closing-strip__copy"><p>Sometimes the best first step is simply a conversation.</p></div></div></DeferredBackground>
    </main><SiteFooter currentPath={currentPath} /></div>;
}
