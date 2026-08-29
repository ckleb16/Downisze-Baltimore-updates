// Harbor House Editorial: warm editorial layout, Baltimore navy, cream paper, antique gold, restrained motion.
import { useState } from "react";
import DeferredBackground from "@/components/DeferredBackground";
import ResponsiveImage from "@/components/ResponsiveImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  ArrowUpRight,
  Baby,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Anchor,
  Home as HomeIcon,
  MoveRight,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const heroImage = "/manus-storage/AugustwebsiteHOMEphoto_6750abaf.png";
const maryPortrait = "/manus-storage/Mary_Lynch_3d838598.jpg";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7-1920w.webp";
const washTexture = "/manus-storage/downsize-baltimore-warm-wash_0631c386-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";

const dailyQuestions = [
  "Should Mom stay in her home?",
  "Would downsizing make life easier?",
  "Where do we even begin?",
];

type ApprovedTestimonial = {
  quote: string;
  name: string;
  context?: string;
};

// Keep client endorsements off the live site until the wording and attribution
// have been explicitly approved. Adding an approved entry restores the section.
const approvedTestimonials: ApprovedTestimonial[] = [];

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
  ["Aging in Place", "Ideas and resources for making home safer and more comfortable.", ShieldCheck, "/aging-in-place#self-evaluation", "Take the self-evaluation"],
  ["Downsizing & Moving", "Where to begin, what to keep, and how to make the process manageable.", MoveRight, "/downsizing-services", "Explore downsizing services"],
  ["55+ & Senior Living", "Understanding communities, housing options, and what might fit your lifestyle.", Sparkles, "/contact", "Ask Mary about options"],
  ["Buying & Selling", "Real estate guidance for moves that often involve more than real estate.", HomeIcon, "/buying-selling", "Explore buying & selling"],
  ["ADUs & Multigenerational Living", "Creative housing solutions that can keep families connected while maintaining independence.", Baby, "/contact", "Ask Mary about ADUs"],
  ["Probate & Estate Resources", "Guidance and trusted professionals when a home is part of a larger family transition.", BookOpen, "/contact", "Ask Mary for guidance"],
];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "light" | "outline" }) {
  return <a className={`button button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} /></a>;
}

export default function Home() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const showQuestion = (index: number) => {
    setActiveQuestion((index + dailyQuestions.length) % dailyQuestions.length);
  };

  return (
    <div id="top" className="site-shell">
      <SiteHeader currentPath="/" />

      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <ResponsiveImage src={heroImage} sizes="100vw" priority alt="A welcoming navy blue home at golden hour in a Baltimore neighborhood" className="hero__image" />
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

        <section id="ways-to-begin" className="ways section-paper">
          <div className="section-heading"><h2 className="sr-only">Three ways to begin</h2><p className="eyebrow" aria-hidden="true">Three ways to begin</p></div>
          <div className="way-grid">
            {ways.map(({ icon: Icon, number, title, body, link, href }) => <article className="way-card" key={title}>
              <div className="way-card__top"><span>{number}</span><Icon size={29} strokeWidth={1.2} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
              <a href={href}>{link}<MoveRight size={17} /></a>
            </article>)}
          </div>
        </section>

        <section className="questions-carousel" role="region" aria-roledescription="carousel" aria-labelledby="daily-questions-heading">
          <div className="questions-carousel__intro">
            <div className="questions-carousel__mark" aria-hidden="true"><Anchor size={28} strokeWidth={1.2} /><span /></div>
            <h2 id="daily-questions-heading">Questions I hear<br /><i>every day…</i></h2>
          </div>
          <div className="questions-carousel__stage">
            <div id="daily-question-slides" className="questions-carousel__viewport">
              <div className="questions-carousel__track" style={{ transform: `translate3d(-${activeQuestion * 100}%, 0, 0)` }}>
                {dailyQuestions.map((question, index) => (
                  <article
                    className="questions-carousel__slide"
                    key={question}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Question ${index + 1} of ${dailyQuestions.length}`}
                    aria-hidden={index !== activeQuestion}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{question}</p>
                  </article>
                ))}
              </div>
            </div>
            <p className="sr-only" aria-live="polite" aria-atomic="true">Question {activeQuestion + 1} of {dailyQuestions.length}: {dailyQuestions[activeQuestion]}</p>
            <div
              className="questions-carousel__controls"
              role="group"
              aria-label="Question controls"
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  showQuestion(activeQuestion - 1);
                }
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  showQuestion(activeQuestion + 1);
                }
              }}
            >
              <span className="questions-carousel__count" aria-hidden="true">{String(activeQuestion + 1).padStart(2, "0")} / {String(dailyQuestions.length).padStart(2, "0")}</span>
              <div className="questions-carousel__dots" role="group" aria-label="Choose a question">
                {dailyQuestions.map((question, index) => (
                  <button
                    type="button"
                    key={question}
                    className={index === activeQuestion ? "is-active" : ""}
                    aria-label={`Show question ${index + 1}: ${question}`}
                    aria-current={index === activeQuestion ? "true" : undefined}
                    aria-controls="daily-question-slides"
                    onClick={() => showQuestion(index)}
                  />
                ))}
              </div>
              <div className="questions-carousel__arrows">
                <button type="button" aria-label="Previous question" aria-controls="daily-question-slides" onClick={() => showQuestion(activeQuestion - 1)}><ChevronLeft size={21} /></button>
                <button type="button" aria-label="Next question" aria-controls="daily-question-slides" onClick={() => showQuestion(activeQuestion + 1)}><ChevronRight size={21} /></button>
              </div>
            </div>
          </div>
        </section>

        <section id="meet-mary" className="mary-section">
          <DeferredBackground as="div" className="mary__image-panel" backgroundImage={`url(${washTexture})`}>
            <div className="mary__portrait-frame"><ResponsiveImage src={maryPortrait} sizes="(max-width: 800px) 72vw, 410px" alt="Mary Lynch seated on a cream sofa" className="mary__portrait" /><div className="mary__portrait-caption"><span>Mary Lynch</span><small>Founder, Downsize Baltimore</small></div></div>
          </DeferredBackground>
          <div className="mary__copy">
            <p className="eyebrow">A clear-eyed, human approach</p>
            <h2>Why Families<br /><i>Choose Mary</i></h2>
            <div className="gold-rule" />
            <p>For 30 years, I’ve helped Baltimore families buy and sell homes.</p>
            <p>Over time, that work became about much more than real estate.</p>
            <p>Downsize Baltimore grew from seeing how overwhelming housing decisions can become when family, aging, finances, belongings, and the future all collide at once.</p>
            <p>My role isn’t to convince you to move. It’s to help you understand your options, connect you with the right resources, and create a clear plan for whatever comes next.</p>
            <div className="credentials"><p className="credentials__eyebrow" id="mary-credentials-heading">Credentials &amp; specialties</p><ul className="credentials__grid credentials__grid--balanced" aria-labelledby="mary-credentials-heading"><li>Certified Senior Advisor</li><li>Chair &amp; Founder, National Aging in Place Council for Greater Baltimore</li><li>Seniors Real Estate Specialist</li><li>Senior Home Coach</li><li>Certified Probate Real Estate Specialist</li></ul></div>
            <a className="text-link" href="/meet-mary">Meet Mary <ArrowUpRight size={16} /></a>
          </div>
        </section>
        {approvedTestimonials.length > 0 && (
          <section className="testimonial-reserve" aria-labelledby="approved-testimonials-heading">
            <div>
              <p className="eyebrow">A quiet place for client perspective</p>
              <h2 id="approved-testimonials-heading">Kind Words From People I’ve Helped</h2>
            </div>
            <div className="testimonial-reserve__slots">
              {approvedTestimonials.map(({ quote, name, context }) => (
                <figure key={`${name}-${quote}`}>
                  <blockquote>{quote}</blockquote>
                  <figcaption>{name}{context ? `, ${context}` : ""}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
        <DeferredBackground id="resources" className="resources" backgroundImage={`linear-gradient(rgba(16,42,67,.97), rgba(16,42,67,.97)), url(${contourTexture})`}>
          <div className="resources__head"><div><p className="eyebrow eyebrow--gold">Resources for the road ahead</p><h2>Chart<br /><i>the Course.</i></h2></div><div className="resources__intro">There isn’t one right answer when it comes to housing, aging, and what comes next.<br /><br />That’s why I’ve built a collection of practical resources to help you understand your options before you need them.</div></div>
          <div className="resource-grid">            {resources.map(([title, body, Icon, href, action]) => <a className="resource-card" href={href as string} key={title as string}><Icon size={24} strokeWidth={1.2} /><h3>{title as string}</h3><p>{body as string}</p><span className="resource-card__action">{action as string}<ArrowUpRight size={16} /></span></a>)}
</div>
          <div className="resources__cta"><ButtonLink variant="light" href="/resource-center">Visit the Resource Center</ButtonLink></div>
        </DeferredBackground>

        <DeferredBackground id="contact" className="final-cta section-paper" backgroundImage={`url(${paperTexture})`}>
          <div className="final-cta__mark"><Anchor size={28} strokeWidth={1.2} /></div>
          <div className="final-cta__content"><p className="eyebrow">30 years of Baltimore real estate experience</p><h2>Your Next Step Deserves<br /><i>an Experienced Guide.</i></h2><p>Whether the right answer is moving, staying put, or taking more time, I’ll help you understand the options, anticipate the details, and build a plan around what matters most to you.</p></div>
        </DeferredBackground>
      </main>

      <SiteFooter currentPath="/" />
    </div>
  );
}
