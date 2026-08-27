export type SiteRoute = {
  path: string;
  label: string;
  title: string;
  description: string;
};

export const SITE_ROUTES = [
  {
    path: "/",
    label: "Home",
    title: "Downsize Baltimore | Clear Housing Guidance",
    description:
      "Thoughtful Baltimore-area guidance for downsizing, aging in place, and planning what comes next with Mary Lynch.",
  },
  {
    path: "/downsizing-services",
    label: "Downsizing Services",
    title: "Downsizing Services | Downsize Baltimore",
    description:
      "A coordinated, personal plan for downsizing in Greater Baltimore—from the first conversation through the move and sale.",
  },
  {
    path: "/aging-in-place",
    label: "Aging in Place",
    title: "Aging in Place Planning | Downsize Baltimore",
    description:
      "Explore whether your home can continue to work for you and build an informed aging-in-place plan with Mary Lynch.",
  },
  {
    path: "/buying-selling",
    label: "Buying & Selling",
    title: "Buying & Selling | Downsize Baltimore",
    description:
      "Experienced Baltimore-area real estate guidance for selling a longtime home, finding the next one, or coordinating both.",
  },
  {
    path: "/resource-center",
    label: "Resource Center",
    title: "Resource Center | Downsize Baltimore",
    description:
      "Practical, trustworthy resources to help Baltimore-area families understand housing choices and prepare for what comes next.",
  },
  {
    path: "/meet-mary",
    label: "Meet Mary",
    title: "Meet Mary Lynch | Downsize Baltimore",
    description:
      "Meet Mary Lynch, a Baltimore-area real estate advisor helping older adults and families approach housing decisions with clarity.",
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact Mary Lynch | Downsize Baltimore",
    description:
      "Start a no-pressure conversation with Mary Lynch about downsizing, aging in place, or buying and selling in Greater Baltimore.",
  },
] as const satisfies readonly SiteRoute[];

export const CANONICAL_ROUTE_PATHS = SITE_ROUTES.map((route) => route.path);

export const NOT_FOUND_METADATA = {
  title: "Page Not Found | Downsize Baltimore",
  description:
    "The page you requested could not be found. Return to Downsize Baltimore for clear housing guidance.",
} as const;

function comparablePath(pathname: string) {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  const withLeadingSlash = withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  return collapsed === "/" ? "/" : collapsed.replace(/\/+$/, "");
}

export function canonicalizeRecognizedPath(pathname: string): string | null {
  const candidate = comparablePath(pathname).toLocaleLowerCase("en-US");
  return (
    SITE_ROUTES.find(
      (route) => route.path.toLocaleLowerCase("en-US") === candidate,
    )?.path ?? null
  );
}

export function findSiteRoute(pathname: string): SiteRoute | undefined {
  const canonical = canonicalizeRecognizedPath(pathname);
  return SITE_ROUTES.find((route) => route.path === canonical);
}
