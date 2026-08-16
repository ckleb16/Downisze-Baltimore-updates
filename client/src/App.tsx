import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import BuyingSelling from "./pages/BuyingSelling";
import Contact from "./pages/Contact";
import ResourceCenter from "./pages/ResourceCenter";
import MeetMary from "./pages/MeetMary";
import Downsizing from "./pages/Downsizing";
import AgingInPlace from "./pages/AgingInPlace";


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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
