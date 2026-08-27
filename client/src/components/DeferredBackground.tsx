import {
  createElement,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type DeferredBackgroundProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  as?: "div" | "section";
  backgroundImage: string;
  children?: ReactNode;
  rootMargin?: string;
};

export default function DeferredBackground({
  as = "section",
  backgroundImage,
  children,
  rootMargin = "500px 0px",
  style,
  ...props
}: DeferredBackgroundProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || ready) return;
    if (!("IntersectionObserver" in window)) {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ready, rootMargin]);

  return createElement(
    as,
    {
      ...props,
      ref: (node: HTMLElement | null) => {
        elementRef.current = node;
      },
      style: { ...style, backgroundImage: ready ? backgroundImage : undefined },
      "data-background-ready": ready ? "true" : "false",
    },
    children,
  );
}
