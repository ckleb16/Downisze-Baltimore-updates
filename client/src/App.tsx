import { RESOURCE_GUIDES, guidePath } from "@/lib/resourceGuides";
import MetadataProvider from "@/components/MetadataProvider";
import { lazy, Suspense, useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/Home"));
const BuyingSelling = lazy(() => import("./pages/BuyingSelling"));
const Contact = lazy(() => import("./pages/Contact"));
const ResourceCenter = lazy(() => import("./pages/ResourceCenter"));
const ResourceGuide = lazy(() => import("./pages/ResourceGuide"));
const MeetMary = lazy(() => import("./pages/MeetMary"));
const Downsizing = lazy(() => import("./pages/Downsizing"));
const AgingInPlace = lazy(() => import("./pages/AgingInPlace"));
const InsightsArchive = lazy(() => import("./pages/InsightsArchive"));
const InsightArticle = lazy(() => import("./pages/InsightArticle"));
const InsightsPublisher = lazy(() => import("./pages/InsightsPublisher"));
const NotFound = lazy(() => import("./pages/NotFound"));

function GlobalSkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
}

function FragmentNavigation() {
  const [location] = useLocation();
  useEffect(() => {
    let observer: MutationObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const navigate = () => {
      observer?.disconnect();
      clearTimeout(timer);
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!id) return;
      const reveal = () => {
        const target = document.getElementById(id);
        if (!target || target.closest('[aria-busy="true"]')) return false;
        observer?.disconnect();
        clearTimeout(timer);
        target.scrollIntoView({ block: "start", behavior: "instant" });
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
        }
        target.focus({ preventScroll: true });
        return true;
      };
      if (reveal()) return;
      observer = new MutationObserver(reveal);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-busy"] });
      timer = setTimeout(() => observer?.disconnect(), 20000);
    };
    navigate();
    window.addEventListener("hashchange", navigate);
    window.addEventListener("popstate", navigate);
    return () => { observer?.disconnect(); clearTimeout(timer); window.removeEventListener("hashchange", navigate); window.removeEventListener("popstate", navigate); };
  }, [location]);
  return null;
}


function Router() {
  return (
    <Suspense
      fallback={
        <main id="main-content" className="route-loading" tabIndex={-1}>
          <p role="status">Loading Downsize Baltimore…</p>
        </main>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/buying-selling" component={BuyingSelling} />
        <Route path="/contact" component={Contact} />
        <Route path="/resource-center" component={ResourceCenter} />
        {RESOURCE_GUIDES.map((guide) => (
          <Route key={guide.slug} path={guidePath(guide)}>
            <ResourceGuide guide={guide} />
          </Route>
        ))}
        <Route path="/meet-mary" component={MeetMary} />
        <Route path="/downsizing-services" component={Downsizing} />
        <Route path="/aging-in-place" component={AgingInPlace} />
        <Route path="/insights-advice" component={InsightsArchive} />
        <Route path="/insights-advice/:slug" component={InsightArticle} />
        <Route path="/publisher" component={InsightsPublisher} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <GlobalSkipLink />
        <FragmentNavigation />
        <MetadataProvider>
          <Router />
        </MetadataProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
