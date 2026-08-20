import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Downsize Baltimore encountered an unexpected error", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main id="main-content" className="not-found-page" role="alert">
          <div className="not-found-page__frame">
            <AlertTriangle
              size={48}
              aria-hidden="true"
            />
            <p className="not-found-page__eyebrow">We hit a small snag</p>
            <h1>Something didn’t load<br /><i>the way it should.</i></h1>
            <p>Please reload the page. If the problem continues, you can return home and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Reload Page
            </button>
            <a className="error-boundary__home" href="/">Return Home</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
