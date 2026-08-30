import { useEffect, useRef, useState } from "react";
import DeferredBackground from "@/components/DeferredBackground";
import AnchorLineLabel from "@/components/AnchorLineLabel";
import ResponsiveImage from "@/components/ResponsiveImage";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ArrowUpRight, Check, Anchor, Home, ShieldCheck, Sparkles } from "lucide-react";

// Harbor House Editorial: warm, advisory, spacious, and human — navy, cream, taupe, antique gold,
// Cormorant-led headlines, quiet rules, symbolic compass details, and no sales-first framing.
const heroPhoto = "/manus-storage/aging-in-place-hero_627154ed.jpg";
const consultationPhoto = "/manus-storage/aging-in-place-consultation_1b627f71.jpg";
const personalPhoto = "/manus-storage/mary-and-pop-boat.png";
const paperTexture = "/manus-storage/downsize-baltimore-paper-texture_268a29f4-1920w.webp";
const contourTexture = "/manus-storage/downsize-baltimore-contour-lines_aaa317b7-1920w.webp";
const calendlyUrl = "https://calendly.com/mary-movewithmarylynch/30min";

const assessmentTopics = [
  ["Entry & Mobility", "Steps, thresholds, handrails, no-step entry, and wider doorways.", Home],
  ["Bathroom Safety", "Curbless showers, properly installed grab bars, non-slip surfaces, and lighting.", ShieldCheck],
  ["Main-Level Living", "Bedroom, full bath, laundry, and daily living without requiring the stairs.", Home],
  ["Kitchen & Daily Function", "Storage, lighting, appliances, controls, and ease of use.", Sparkles],
  ["Maintenance", "Yard work, exterior upkeep, repairs, and the ongoing demands of the property.", Check],
  ["Technology", "Smart lighting, medical alerts, voice technology, and other AgeTech solutions.", ArrowUpRight],
];

const stayItems = ["Home safety improvements", "Bathroom modifications", "Main-level living changes", "Stairlifts or elevators", "Home care", "Smart home technology", "Occupational therapy home assessments", "ADUs or multigenerational additions"];
const moveItems = ["One-level homes", "Ranchers", "Villas", "Condominiums", "55+ communities", "Retirement Community", "Multigenerational housing", "Closer to family, healthcare, transportation, and community"];

type EvaluationChoice = "working" | "planning" | "closer";
type EvaluationQuestion = { title: string; detail: string; final?: boolean };
const evaluationQuestions: EvaluationQuestion[] = [
  { title: "Can your home physically support you now and later?", detail: "I can comfortably enter and move throughout my home, use the bathroom safely, manage the stairs, and access the spaces I need. If my mobility changed, my home could reasonably be modified to support me." },
  { title: "Is taking care of your home still manageable?", detail: "Repairs, cleaning, yardwork, seasonal maintenance and everyday responsibilities feel manageable. I'm not ignoring significant repairs or depending heavily on others just to keep up with the house." },
  { title: "Can you get where you need and want to go?", detail: "I can comfortably get to groceries, medical appointments, friends, activities and the places that matter to me. I also have realistic transportation options if driving becomes difficult, especially at night." },
  { title: "Does where you live support your health?", detail: "I can easily access healthcare, nutritious food and the services I need. My daily environment makes it reasonably easy for me to eat well and take care of myself." },
  { title: "Does your everyday life help you stay active?", detail: "I have realistic opportunities to walk, exercise, maintain strength and keep moving in ways I enjoy." },
  { title: "Are you as connected as you'd like to be?", detail: "I regularly see or talk with people I care about and have access to friends, family, neighbors, activities or a community that keeps me engaged. My home doesn't leave me feeling isolated." },
  { title: "Do you have support if something changes?", detail: "If I became sick, stopped driving, needed help around the house or required some assistance with daily life, I know who I could call and what resources are available. My plan doesn't depend entirely on one person." },
  { title: "Does staying here still make financial sense for the life you want?", detail: "I understand what my home truly costs me, including taxes, insurance, utilities, maintenance and upcoming repairs. I'm comfortable with those costs and with the money I may need to spend to make the home work for me in the future." },
  { title: "Would your home still work after an unexpected change?", detail: "If my health, mobility, finances or support system changed, I believe I would have enough options and time to make thoughtful decisions rather than being forced into a crisis move." },
  { title: "If you were choosing today, would you choose this home again?", detail: "Knowing what you know today, if you were choosing a home for the next 5 to 10 years of your life, would you choose this one?", final: true },
];
const evaluationChoices: { value: EvaluationChoice; label: string }[] = [
  { value: "working", label: "Yes, this works well for me" },
  { value: "planning", label: "Mostly, but I should plan ahead" },
  { value: "closer", label: "No, this is becoming difficult" },
];

function ButtonLink({ children, href = calendlyUrl, variant = "gold" }: { children: React.ReactNode; href?: string; variant?: "gold" | "outline" | "light" }) {
  return <a className={`aip-button aip-button--${variant}`} href={href}>{children}<ArrowUpRight size={15} /></a>;
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="aip-bullet-list">{items.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul>;
}

function SelfEvaluation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, EvaluationChoice>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shouldMoveFocus = useRef(false);
  const question = evaluationQuestions[step];
  const complete = step >= evaluationQuestions.length;
  const counts = Object.values(answers).reduce((result, value) => ({ ...result, [value]: result[value] + 1 }), { working: 0, planning: 0, closer: 0 } as Record<EvaluationChoice, number>);
  const overall = counts.closer >= 3 ? "closer" : counts.planning >= 3 || counts.closer > 0 ? "planning" : "working";
  const resultCopy = {
    working: { label: "Working Well", headline: "Your home and your life seem to be working well together.", body: "That doesn't mean you shouldn't plan. In fact, planning while things are going well gives you the most choices. Your answers can help you identify a few things worth preparing for now so you can continue living the way you want." },
    planning: { label: "Worth Planning For", headline: "Your home may still be a good fit, but a few things deserve some attention.", body: "You may not need a different home. You may need a plan. Home modifications, transportation, maintenance help, community resources or other support could make a meaningful difference." },
    closer: { label: "Time to Explore", headline: "It may be worth exploring what else is possible.", body: "That doesn't mean you need to move. It means several parts of your current situation may be requiring more from you than you'd like. Understanding your options now can help you make decisions on your terms rather than waiting until circumstances make them for you." },
  }[overall];
  useEffect(() => {
    if (shouldMoveFocus.current) {
      headingRef.current?.focus();
      shouldMoveFocus.current = false;
    }
  }, [step]);
  const selectAnswer = (value: EvaluationChoice) => { shouldMoveFocus.current = true; setAnswers((current) => ({ ...current, [step]: value })); setStep((current) => current + 1); };
  const goBack = () => { shouldMoveFocus.current = true; setStep((current) => Math.max(0, current - 1)); };
  const reset = () => { shouldMoveFocus.current = true; setAnswers({}); setStep(0); };
  return <div className="aip-evaluation">
    <div className="aip-evaluation__intro"><p className="aip-eyebrow aip-eyebrow--gold">A personal check-in</p><h3>Should I Stay or Should I Go?</h3><p className="aip-evaluation__subtitle">A quick check-in on how well your home and your life still fit.</p><p>Your home is only one part of the picture.</p><p>These questions are designed to help you look at your home, your health, your finances, your connections and your everyday life. There are no right or wrong answers, and this isn't a test that tells you whether you should move.</p><p>It's simply a way to see what's working well, what may need some planning, and what deserves a closer look.</p></div>
    {!complete ? <div className={`aip-evaluation__question ${question.final ? "is-final" : ""}`}>{step > 0 && <button type="button" className="aip-evaluation__reset" onClick={goBack} aria-label={`Back to question ${step}`}>Back to change my previous answer</button>}<div className="aip-evaluation__progress" role="status">Question {step + 1} of {evaluationQuestions.length}</div><h4 ref={headingRef} tabIndex={-1} id={`evaluation-question-${step}`}>{question.title}</h4><p id={`evaluation-detail-${step}`}>{question.detail}</p><div className="aip-evaluation__choices" role="group" aria-labelledby={`evaluation-question-${step}`} aria-describedby={`evaluation-detail-${step}`}>{(question.final ? [{ value: "working", label: "Absolutely" }, { value: "planning", label: "I'm not sure" }, { value: "closer", label: "Probably not" }] : evaluationChoices).map((choice) => <button key={choice.label} type="button" className={answers[step] === choice.value ? "is-selected" : undefined} aria-label={`${choice.label}${answers[step] === choice.value ? ", previously selected" : ""}`} onClick={() => selectAnswer(choice.value as EvaluationChoice)}>{choice.label}<ArrowUpRight size={15} /></button>)}</div></div> : <div className="aip-evaluation__results"><p className="aip-evaluation__progress">Your reflection</p><h4 ref={headingRef} tabIndex={-1}>{resultCopy.label}</h4><p className="aip-evaluation__result-headline">{resultCopy.headline}</p><p>{resultCopy.body}</p><div className="aip-evaluation__areas"><span><b>{counts.working}</b> Working Well</span><span><b>{counts.planning}</b> Worth Planning For</span><span><b>{counts.closer}</b> Needs a Closer Look</span></div><p className="aip-evaluation__closing">Sometimes staying means changing the house. Sometimes it means changing houses. Either way, it starts with a plan.</p><div className="aip-evaluation__result-actions"><ButtonLink href={calendlyUrl}>Talk Through My Results</ButtonLink><button type="button" className="aip-evaluation__reset" onClick={goBack}>Change my previous answer</button><button type="button" className="aip-evaluation__reset" onClick={reset}>Take the check-in again</button></div></div>}
  </div>;
}

export default function AgingInPlace() {
  return <div className="aip-page"><SiteHeader currentPath="/aging-in-place" /><main id="main-content" tabIndex={-1}>
    <section className="aip-hero aip-hero--split">
      <div className="aip-hero__panel"><div className="aip-hero__content"><p className="aip-eyebrow"><span /> Aging in Place</p><h1>Age in Place by Design,<br /><i>Not by Default.</i></h1><p>Wanting to stay in your home and being set up to stay in your home are two very different things.</p><p>Aging in place successfully means looking beyond where you live today and thinking about how your home, health, mobility, finances, support system, and community may need to work for you in the years ahead.</p><ButtonLink>Schedule a Conversation</ButtonLink></div></div>
      <div className="aip-hero__photo"><ResponsiveImage src={heroPhoto} sizes="(max-width: 900px) 100vw, 46vw" priority alt="Mary Lynch seated at a table in a bright home" /><span className="aip-hero__photo-caption">Plan early. Understand the whole picture.</span></div>
    </section>

    <DeferredBackground className="aip-stats" backgroundImage={`url(${paperTexture})`}><h2 className="sr-only">The gap between wanting to stay and being ready to stay</h2><AnchorLineLabel className="aip-section-label" decorative>The gap between wanting to stay and being ready to stay</AnchorLineLabel><div className="aip-stats__grid"><article><strong>75%</strong><p>of adults age 50+ say they want to remain in their current homes as they age.</p></article><article><strong>Less than 4%</strong><p>of U.S. homes have a no-step entrance, single-floor living, and doors and hallways wide enough for a wheelchair.</p></article></div><p className="aip-source">National sources: <a href="https://www.aarp.org/pri/topics/livable-communities/housing/2024-home-community-preferences/">AARP’s 2024 Home and Community Preferences Survey</a>; <a href="https://www.jchs.harvard.edu/blog/housing-americas-older-adults-four-problems-we-must-address">Harvard Joint Center for Housing Studies analysis of national housing data</a>. Baltimore’s older, multi-level homes and rowhomes may present additional challenges for aging in place.</p></DeferredBackground>

    <section className="aip-personal" id="meet-mary"><div className="aip-personal__copy"><p className="aip-eyebrow">Why this work matters to Mary</p><h2>For Me,<br /><i>This Is Personal.</i></h2><div className="aip-gold-rule" /><p>Mary’s interest in aging in place began while helping care for her grandfather. He had lived in his home for decades, but the house itself eventually became part of the challenge: laundry was in the basement, bedrooms and bathrooms were upstairs, and steps were required at the entrances.</p><p>That experience made Mary realize how often families begin thinking about housing only after circumstances have changed.</p><p>Today Mary is the <strong>Founder and Chair of the National Aging in Place Council, Greater Baltimore Chapter</strong>, bringing together professionals across housing, healthcare, finance, home care, wellness, and other aging-related services.</p><p>She also leads educational programs throughout Greater Baltimore, including <strong>Should I Stay or Should I Go?</strong>, designed to help older adults and families understand their options before a crisis makes the decision for them.</p><a className="aip-text-link" href="/meet-mary">Read Mary’s Story <ArrowUpRight size={16} /></a></div><div className="aip-personal__visual"><div className="aip-personal__photo-frame"><div className="aip-personal__photo-crop"><ResponsiveImage className="aip-personal__photo-source" src={personalPhoto} sizes="(max-width: 900px) 90vw, 432px" alt="Mary Lynch and Pop together on a boat" /></div></div></div></section>

    <DeferredBackground className="aip-assess" backgroundImage={`linear-gradient(rgba(242,237,226,.96),rgba(242,237,226,.96)),url(${paperTexture})`}><div className="aip-section-head"><div><p className="aip-eyebrow">Start with the home</p><h2>Can Your Home Continue<br /><i>to Work for You?</i></h2></div><p>A thoughtful review looks at the daily details that make a home safer, easier, and more sustainable.</p></div><div className="aip-assess-grid">{assessmentTopics.map(([title, copy, Icon]) => <article key={title as string}><Icon size={23} strokeWidth={1.25} /><h3>{title as string}</h3><p>{copy as string}</p></article>)}</div><a className="aip-text-link" href="#self-evaluation">Take the home and lifestyle self-evaluation <ArrowUpRight size={16} /></a></DeferredBackground>

    <section className="aip-story"><div className="aip-story__image"><ResponsiveImage src={consultationPhoto} sizes="(max-width: 900px) 100vw, 50vw" alt="Mary Lynch talking with an older adult in a bright office" /><span>02 / A CONVERSATION IN CONTEXT</span></div><div className="aip-story__copy"><p className="aip-eyebrow">The whole picture matters</p><h2>Your Home Is Only One Part <i>of the Plan.</i></h2><p>Successful aging in place also means thinking about the life around the house.</p><div className="aip-life-list">{["Healthcare and future care needs", "Transportation", "Friends, family, and social connection", "Financial sustainability", "Access to groceries, services, and activities", "Technology and support", "What happens if driving or mobility changes"].map(item => <span key={item}><Check size={14} />{item}</span>)}</div><blockquote>Aging in place is not simply a renovation project. It is a plan for the life around the house.</blockquote></div></section>

    <section className="aip-pathways"><div className="aip-section-head aip-section-head--center"><p className="aip-eyebrow aip-eyebrow--gold">Two ways to age in place</p><h2>Sometimes Staying Means Changing the House.<br /><i>Sometimes It Means Changing Houses.</i></h2><p>The goal is to find the environment that best supports how someone wants to live.</p></div><div className="aip-pathway-grid"><article><span className="aip-pathway__num">01</span><h3>Stay in Your Current Home</h3><BulletList items={stayItems} /></article><article><span className="aip-pathway__num">02</span><h3>Move to a Home That Better Supports You</h3><BulletList items={moveItems} /></article></div><p className="aip-pathways__note">Aging in place does not always mean remaining in the same house forever.</p></section>

    <DeferredBackground className="aip-adu" backgroundImage={`linear-gradient(90deg,rgba(16,42,67,.95),rgba(16,42,67,.82)),url(${paperTexture})`}><div><p className="aip-eyebrow aip-eyebrow--gold">A connected possibility</p><h2>Sometimes the Best Solution Is <i>Right in the Backyard.</i></h2></div><div><p>Accessory Dwelling Units and multigenerational living can create private but connected arrangements for a parent, adult child, caregiver, or family member.</p><p>Mary teaches continuing education on Maryland ADUs and helps families understand how these options may fit into a longer-term housing plan.</p><a className="aip-light-link" href="/contact">Ask Mary about ADU options <ArrowUpRight size={16} /></a></div></DeferredBackground>

    <DeferredBackground id="self-evaluation" className="aip-resource" backgroundImage={`linear-gradient(rgba(16,42,67,.97),rgba(16,42,67,.97)),url(${contourTexture})`}><div className="aip-resource__head"><div><p className="aip-eyebrow aip-eyebrow--gold">A practical next step</p><h2>Should I Stay or Should I Go?<br /><i>A Personal Housing &amp; Aging Self-Evaluation.</i></h2></div><p>A thoughtful guide across home fit, maintenance, mobility, transportation, health, connection, support, finances, and resilience.</p></div><SelfEvaluation /></DeferredBackground>

    <section className="aip-naipc"><div className="aip-naipc__mark"><Anchor size={31} /><span>NAIPC<br /><small>GREATER BALTIMORE</small></span></div><div><p className="aip-eyebrow">Connected to the right people</p><h2>Connected to the Right People <i>Matters.</i></h2><p>Mary is the <strong>Founder and Chair of the National Aging in Place Council, Greater Baltimore Chapter</strong>. Through NAIPC, she works alongside professionals across the many areas that affect successful aging.</p><p>She helps families understand the bigger picture and connect with the appropriate professionals — without trying to be the lawyer, contractor, healthcare professional, financial advisor, or occupational therapist herself.</p><a className="aip-text-link" href="/contact">Ask Mary for a trusted local connection <ArrowUpRight size={16} /></a></div></section>

    <DeferredBackground className="aip-final site-closing-strip" backgroundImage={`url(${paperTexture})`}><div className="site-closing-strip__content"><div className="site-closing-strip__heading"><p className="aip-eyebrow">A clearer decision starts early</p><h2>The Goal Is Not to Stay at All Costs.<br /><i>And It Is Not to Move Before You’re Ready.</i></h2></div><div className="site-closing-strip__copy"><p>The goal is to understand your options early enough that the decision is still yours.</p><p>Whether that means making your current home safer, creating a multigenerational solution, finding a home that better fits the years ahead, or simply beginning the conversation, having a plan can make all the difference.</p></div></div></DeferredBackground>
  </main><SiteFooter currentPath="/aging-in-place" /></div>;
}
