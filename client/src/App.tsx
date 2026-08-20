import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BuyingSelling from "./pages/BuyingSelling";
import Contact from "./pages/Contact";
import ResourceCenter from "./pages/ResourceCenter";
import MeetMary from "./pages/MeetMary";
import Downsizing from "./pages/Downsizing";
import AgingInPlace from "./pages/AgingInPlace";

const routeMetadata: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Downsize Baltimore | Clear Housing Guidance",
    description: "Thoughtful Baltimore-area guidance for downsizing, aging in place, and planning what comes next with Mary Lynch.",
  },
  "/downsizing-services": {
    title: "Downsizing Services | Downsize Baltimore",
    description: "A coordinated, personal plan for downsizing in Greater Baltimore—from the first conversation through the move and sale.",
  },
  "/aging-in-place": {
    title: "Aging in Place Planning | Downsize Baltimore",
    description: "Explore whether your home can continue to work for you and build an informed aging-in-place plan with Mary Lynch.",
  },
  "/buying-selling": {
    title: "Buying & Selling | Downsize Baltimore",
    description: "Experienced Baltimore-area real estate guidance for selling a longtime home, finding the next one, or coordinating both.",
  },
  "/resource-center": {
    title: "Resource Center | Downsize Baltimore",
    description: "Practical, trustworthy resources to help Baltimore-area families understand housing choices and prepare for what comes next.",
  },
  "/meet-mary": {
    title: "Meet Mary Lynch | Downsize Baltimore",
    description: "Meet Mary Lynch, a Baltimore-area real estate advisor helping older adults and families approach housing decisions with clarity.",
  },
  "/contact": {
    title: "Contact Mary Lynch | Downsize Baltimore",
    description: "Start a no-pressure conversation with Mary Lynch about downsizing, aging in place, or buying and selling in Greater Baltimore.",
  },
};

function RouteMetadata() {
  const [location] = useLocation();

  useEffect(() => {
    const pathname = location.split(/[?#]/)[0] || "/";
    const metadata = routeMetadata[pathname] ?? {
      title: "Page Not Found | Downsize Baltimore",
      description: "The page you requested could not be found. Return to Downsize Baltimore for clear housing guidance.",
    };
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


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buying-selling" component={BuyingSelling} />
      <Route path="/contact" component={Contact} />
      <Route path="/resource-center" component={ResourceCenter} />
      <Route path="/meet-mary" component={MeetMary} />
      <Route path={"/downsizing-services"} component={Downsizing} />
      <Route path={"/aging-in-place"} component={AgingInPlace} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
          <a className="skip-link" href="#main-content">Skip to main content</a>
          <RouteMetadata />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
