// Harbor House Editorial: warm editorial layout, Baltimore navy, cream paper, antique gold, restrained motion.
import { useState } from "react";
import DeferredBackground from "@/components/DeferredBackground";
import ResponsiveImage from "@/components/ResponsiveImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { SITE_CONTACT } from "@/lib/siteConfig";
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
const calendlyUrl = SITE_CONTACT.calendlyUrl;

const dailyQuestions = [
  "Should Mom stay in her home?",
  "Would downsizing make life easier?",
  "Where do we even begin?",
];

type GoogleReview = {
  quote: string;
  name: string;
  sourceUrl: string;
  sourceLabel?: string;
};

// Three retained reviews were verified against Google Maps on September 2, 2026.
// Rose and Sandi's text was supplied by Mary; the user confirmed five stars on October 7.
// This is a curated set, not an automatically synchronized or re-sorted feed.
const googleReviews: GoogleReview[] = [
  {
    quote: "Mary is an outstanding agent and advisor who has helped us in all aspects of downsizing in the BelAir/ Harford County market. She is extremely knowledgeable, wonderfully warm and personal, incredibly accommodating, empathetic and enthusiastic. It’s very apparent she loves what she does from the moment you meet her and a real pleasure to work with.\nGloria&Tom Tanton",
    name: "Gloria Tanton",
    sourceUrl: "https://maps.app.goo.gl/mVBYYC3t38mhxJeUA",
  },
  {
    quote: "I’ve known Mary for almost 50 years. I owned my Parkville rancher for 26 years, and when I decided it was time for a change, Mary helped me through the whole process, from getting the house ready for the market through the sale.\n\nI was really impressed with the level of marketing she did for my home. She used professional photography and created a marketing video that included virtual staging to help buyers see the potential of the house. It paid off. We had multiple offers and a very strong contract, and everything went smoothly right through closing on time.\n\nMary knows the Baltimore real estate market and knows how to get a house sold. I would highly recommend her for any of your real estate needs.",
    name: "eddie wiseman",
    sourceUrl: "https://maps.app.goo.gl/ewtd9eKATLa1wiuT9",
  },
  {
    quote: "We've known Mary for more than 30 years, so when it was time to make a big change, we knew we could trust her to guide us.\n\nAbout 20 years ago, we moved three hours away to what we believed would be our forever home—and we truly loved it there. But as time went by, we found ourselves wanting to be closer to family again. We began casually searching about two years ago, but because we had a very specific type of property in mind, we were willing to wait for the right one.\n\nWhen the perfect condo in Perry Hall finally became available, Mary helped us secure it sight unseen! Her knowledge, responsiveness, and steady guidance made our downsizing journey so much easier. We're thrilled to be closer to family again and couldn't have done it without her. We highly recommend Mary to anyone considering a move or downsizing in the Perry Hall area! You won't be disappointed!",
    name: "Rose Filbey",
    sourceUrl: "https://www.google.com/maps/contrib/104944791681420851109/reviews?hl=en",
    sourceLabel: "Google profile",
  },
  {
    quote: "Mary is an outstanding real estate agent, and I can’t recommend her enough. She is always professional, patient, and incredibly accommodating. In 2019, Mary helped me sell my elderly father’s home, and her steady guidance made what could have been a very stressful process so much easier.\n\nThere were many important decisions to make along the way—listing price, prioritizing necessary repairs, and even choosing paint colors. Mary walked us through every step with care and expertise. Most importantly, she always made sure my 87-year-old father fully understood not just what decisions were being made, but why they were the best choices to help him get the highest possible price for his home.\n\nThanks to Mary’s knowledge and strategy, the house sold for $40,000 over the target price. My father was absolutely ecstatic with the outcome and with Mary’s performance.\n\nI have personally used Mary for all of my real estate needs (selling two homes), and she never disappoints. I would—and do—recommend her to anyone buying or selling a home in Maryland. She’s a rock star!",
    name: "Jeff Rouch",
    sourceUrl: "https://maps.app.goo.gl/H3LyiLFN4YC9zTx69",
  },
  {
    quote: "Mary helped us with our cross country move by contacting and interviewing painting contractors. She helped us with many of the details involved in purchasing a home that would have otherwise been difficult to arrange from out of state. Mary went above and beyond what most realtors would have done!",
    name: "Sandi Stevanak",
    sourceUrl: "https://www.google.com/maps/contrib/111567031490243201480/reviews?hl=en",
    sourceLabel: "Google profile",
  },
];

const testimonialPreviewCharacters = 150;

function takeCharacters(value: string, count: number) {
  return Array.from(value).slice(0, count).join("");
}

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
  return <a className={`button button--${variant}`} href={href}>{children}<ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" /></a>;
}

export default function Home() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonialExpanded, setTestimonialExpanded] = useState(false);
  const showQuestion = (index: number) => {
    setActiveQuestion((index + dailyQuestions.length) % dailyQuestions.length);
  };
  const showTestimonial = (index: number) => {
    const nextIndex = (index + googleReviews.length) % googleReviews.length;
    if (nextIndex === activeTestimonial) return;
    setActiveTestimonial(nextIndex);
    setTestimonialExpanded(false);
  };
  const currentTestimonial = googleReviews[activeTestimonial];
  const testimonialNeedsDisclosure = Array.from(currentTestimonial.quote).length > testimonialPreviewCharacters;
  const visibleTestimonial = testimonialExpanded || !testimonialNeedsDisclosure
    ? currentTestimonial.quote
    : takeCharacters(currentTestimonial.quote, testimonialPreviewCharacters);

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
              <div className="way-card__top"><span>{number}</span><Icon size={29} strokeWidth={1.2} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{body}</p>
      <a href={href}>{link}<MoveRight size={17} aria-hidden="true" /></a>
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
                <button type="button" aria-label="Previous question" aria-controls="daily-question-slides" onClick={() => showQuestion(activeQuestion - 1)}><ChevronLeft size={21} aria-hidden="true" /></button>
                <button type="button" aria-label="Next question" aria-controls="daily-question-slides" onClick={() => showQuestion(activeQuestion + 1)}><ChevronRight size={21} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </section>

        <section id="meet-mary" className="mary-section">
          <DeferredBackground as="div" className="mary__image-panel" backgroundImage={`url(${washTexture})`}>
            <div className="mary__portrait-frame"><ResponsiveImage src={maryPortrait} sizes="(max-width: 800px) 72vw, 410px" alt="Mary Lynch seated on a cream sofa" className="mary__portrait" /><div className="mary__portrait-caption"><span>Mary Lynch</span><small>Founder, Downsize Baltimore</small></div></div>
          </DeferredBackground>
          <div className="mary__copy">
            <p className="eyebrow">A PLAN, NOT A PUSH</p>
            <h2>Why Families<br /><i>Choose Mary</i></h2>
            <div className="gold-rule" />
            <p>For 30 years, I’ve helped Baltimore families buy and sell homes.</p>
            <p>Over time, that work became about much more than real estate.</p>
            <p>Downsize Baltimore grew from seeing how overwhelming housing decisions can become when family, aging, finances, belongings, and the future all collide at once.</p>
            <p>My role isn’t to convince you to move. It’s to help you understand your options, connect you with the right resources, and create a clear plan for whatever comes next.</p>
            <div className="credentials"><p className="credentials__eyebrow" id="mary-credentials-heading">Credentials &amp; specialties</p><ul className="credentials__grid credentials__grid--balanced" role="list" aria-labelledby="mary-credentials-heading"><li>Certified Senior Advisor (CSA®)</li><li>Founder and Chair, National Aging in Place Council, Greater Baltimore Chapter</li><li>Seniors Real Estate Specialist (SRES®)</li><li>Senior Home Coach™</li><li>Certified Probate Real Estate Specialist</li></ul></div>
            <section className="mary-media" aria-labelledby="home-media-heading">
              <h3 id="home-media-heading">AS SEEN AND HEARD ON</h3>
              <ul role="list">
                <li>ABC's Midday Maryland</li>
                <li>PBS</li>
                <li>WCBM Radio</li>
                <li>Baltimore Style</li>
              </ul>
            </section>
            <a className="text-link" href="/meet-mary">Meet Mary <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </section>
        {googleReviews.length > 0 && (
          <section className="testimonial-reserve" aria-labelledby="google-reviews-heading">
            <div className="testimonial-reserve__heading">
              <p className="eyebrow">Selected five-star Google reviews</p>
              <h2 id="google-reviews-heading">Kind Words From People I’ve Helped</h2>
            </div>
            <div className="testimonial-reserve__stage" role="region" aria-roledescription="carousel" aria-label="Selected five-star Google reviews">
              <figure className="testimonial-reserve__card" aria-label={`Review ${activeTestimonial + 1} of ${googleReviews.length}`}>
                <div className="testimonial-reserve__stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true">★</span>)}
                </div>
                <blockquote>
                  <p id="active-testimonial-quote">{visibleTestimonial}{!testimonialExpanded && testimonialNeedsDisclosure && <span aria-hidden="true">…</span>}</p>
                </blockquote>
                {testimonialNeedsDisclosure && (
                  <button
                    type="button"
                    className="testimonial-reserve__disclosure"
                    aria-controls="active-testimonial-quote"
                    aria-expanded={testimonialExpanded}
                    aria-label={`${testimonialExpanded ? "Show less" : "See more"} of the review by ${currentTestimonial.name}`}
                    onClick={() => setTestimonialExpanded((expanded) => !expanded)}
                  >
                    {testimonialExpanded ? "Show less" : "See more"}
                  </button>
                )}
                <figcaption>
                  <strong>{currentTestimonial.name}</strong>
                  <a href={currentTestimonial.sourceUrl} target="_blank" rel="noopener noreferrer">{currentTestimonial.sourceLabel ?? "Google review"} <ArrowUpRight size={14} aria-hidden="true" /></a>
                </figcaption>
              </figure>
              <p className="sr-only" aria-live="polite" aria-atomic="true">Review {activeTestimonial + 1} of {googleReviews.length}, by {currentTestimonial.name}</p>
              <div
                className="testimonial-reserve__controls"
                role="group"
                aria-label="Testimonial controls"
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    showTestimonial(activeTestimonial - 1);
                  } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    showTestimonial(activeTestimonial + 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    showTestimonial(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    showTestimonial(googleReviews.length - 1);
                  }
                }}
              >
                <span className="testimonial-reserve__count" aria-hidden="true">{String(activeTestimonial + 1).padStart(2, "0")} / {String(googleReviews.length).padStart(2, "0")}</span>
                <div className="testimonial-reserve__dots" role="group" aria-label="Choose a testimonial">
                  {googleReviews.map(({ name }, index) => (
                    <button
                      type="button"
                      key={`${name}-${index}`}
                      className={index === activeTestimonial ? "is-active" : ""}
                      aria-label={`Show review ${index + 1} of ${googleReviews.length} by ${name}`}
                      aria-current={index === activeTestimonial ? "true" : undefined}
                      onClick={() => showTestimonial(index)}
                    />
                  ))}
                </div>
                <div className="testimonial-reserve__arrows">
                  <button type="button" aria-label="Previous testimonial" onClick={() => showTestimonial(activeTestimonial - 1)}><ChevronLeft size={21} aria-hidden="true" /></button>
                  <button type="button" aria-label="Next testimonial" onClick={() => showTestimonial(activeTestimonial + 1)}><ChevronRight size={21} aria-hidden="true" /></button>
                </div>
              </div>
            </div>
          </section>
        )}
        <DeferredBackground id="resources" className="resources" backgroundImage={`linear-gradient(rgba(16,42,67,.97), rgba(16,42,67,.97)), url(${contourTexture})`}>
          <div className="resources__head"><div><p className="eyebrow eyebrow--gold">Resources for the road ahead</p><h2>Chart<br /><i>the Course.</i></h2></div><div className="resources__intro">There isn’t one right answer when it comes to housing, aging, and what comes next.<br /><br />That’s why I’ve built a collection of practical resources to help you understand your options before you need them.</div></div>
          <div className="resource-grid">            {resources.map(([title, body, Icon, href, action]) => <a className="resource-card" href={href as string} key={title as string}><Icon size={24} strokeWidth={1.2} aria-hidden="true" /><h3>{title as string}</h3><p>{body as string}</p><span className="resource-card__action">{action as string}<ArrowUpRight size={16} aria-hidden="true" /></span></a>)}
</div>
          <div className="resources__cta"><ButtonLink variant="light" href="/resource-center">Visit the Resource Center</ButtonLink></div>
        </DeferredBackground>

        <DeferredBackground id="contact" className="final-cta site-closing-strip section-paper" backgroundImage={`url(${paperTexture})`}>
          <div className="site-closing-strip__content">
            <div className="site-closing-strip__heading">
              <p className="eyebrow">30 years of Baltimore real estate experience</p>
              <h2>Your Next Step Deserves<br /><i>an Experienced Guide.</i></h2>
            </div>
            <div className="site-closing-strip__copy">
              <p>Whether the right answer is moving, staying put, or taking more time, I’ll help you understand the options, anticipate the details, and build a plan around what matters most to you.</p>
            </div>
          </div>
        </DeferredBackground>
      </main>

      <SiteFooter currentPath="/" />
    </div>
  );
}
