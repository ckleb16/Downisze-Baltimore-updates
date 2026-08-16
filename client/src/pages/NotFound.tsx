import { ArrowUpRight, Anchor } from "lucide-react";
import { useLocation } from "wouter";

// Harbor House Editorial: a quiet, warm wayfinding page using the established navy, cream, and antique-gold system.
export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="not-found-page">
      <div className="not-found-page__frame">
        <Anchor size={34} strokeWidth={1.1} aria-hidden="true" />
        <p className="not-found-page__eyebrow">A little off course</p>
        <h1>Well, this wasn’t<br /><i>part of the plan.</i></h1>
        <p>Looks like you got a little off course. Let’s get you back to familiar territory.</p>
        <button type="button" onClick={() => setLocation("/")}>
          Take Me Home <ArrowUpRight size={16} />
        </button>
      </div>
    </main>
  );
}
