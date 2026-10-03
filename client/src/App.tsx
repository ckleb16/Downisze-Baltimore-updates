import { Toaster } from "@/components/ui/sonner";
import { RESOURCE_GUIDES, guidePath } from "@/lib/resourceGuides";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  NOT_FOUND_METADATA,
  canonicalizeRecognizedPath,
  findPageRoute,
} from "@/lib/siteRoutes";
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

function RouteMetadata() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = location.split(/[?#]/)[0] || "/";
    const canonicalPath = canonicalizeRecognizedPath(pathname);
    const metadata = findPageRoute(pathname) ??
      (pathname.startsWith("/insights-advice/")
        ? {
            title: "Insights & Advice | Downsize Baltimore",
            description: "Practical guidance from Mary Lynch and Downsize Baltimore.",
          }
        : NOT_FOUND_METADATA);

    if (canonicalPath && canonicalPath !== pathname && typeof window !== "undefined") {
      const suffix = `${window.location.search}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", `${canonicalPath}${suffix}`);
    }

    document.title = metadata.title;

    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = metadata.description;
  }, [location]);

  return null;
}

function GlobalSkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
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
        <TooltipProvider>
          <Toaster />
          <GlobalSkipLink />
          <RouteMetadata />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
