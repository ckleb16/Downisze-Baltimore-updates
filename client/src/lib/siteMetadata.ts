import { NOT_FOUND_METADATA, articleSlugFromPath, findPageRoute } from "./siteRoutes";

export const SOCIAL_IMAGE_PATH = "/downsize-baltimore-social-share.jpg";
export const SOCIAL_IMAGE_ALT = "Downsize Baltimore — clear housing guidance from Mary Lynch";
export const ARTICLE_FALLBACK_METADATA = {
  title: "Insights & Advice | Downsize Baltimore",
  description: "Practical guidance from Mary Lynch and Downsize Baltimore.",
};

export type ArticleMetadata = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
};

// Public rendering information only. Never serialize authentication or environment objects.
export type MetadataContext = {
  siteOrigin: string;
  requestOrigin: string;
  indexable: boolean;
  initialPath: string;
  initialResolvedPath: string | null;
  initialArticle: ArticleMetadata | null;
};

export type ArticleMetadataState = "loading" | "ready" | "missing" | "error";
export type MetadataInput = {
  path: string;
  articleState?: ArticleMetadataState;
  article?: ArticleMetadata | null;
};
export type PageMetadata = {
  title: string;
  description: string;
  canonical: string | null;
  robots: "index,follow" | "noindex,nofollow";
  ogType: "website" | "article";
  publishedAt: string | null;
  socialImage: string;
};

export function resolvePageMetadata(context: MetadataContext, input: MetadataInput): PageMetadata {
  const route = findPageRoute(input.path);
  const articlePath = articleSlugFromPath(input.path);
  const article = articlePath && input.articleState === "ready" ? input.article : null;
  const metadata = route ?? (article
    ? { title: `${article.title} | Downsize Baltimore`, description: article.excerpt }
    : articlePath && input.articleState !== "missing"
      ? ARTICLE_FALLBACK_METADATA
      : NOT_FOUND_METADATA);
  const resolvedPath = route?.path ?? (article ? `/insights-advice/${article.slug}` : null);
  const indexable = context.indexable && Boolean(route ? route.indexable !== false : article);
  const origin = indexable ? context.siteOrigin : context.requestOrigin;
  return {
    title: metadata.title,
    description: metadata.description,
    canonical: resolvedPath ? new URL(resolvedPath, `${origin}/`).href : null,
    robots: indexable ? "index,follow" : "noindex,nofollow",
    ogType: article ? "article" : "website",
    publishedAt: article?.publishedAt ?? null,
    socialImage: new URL(SOCIAL_IMAGE_PATH, `${origin}/`).href,
  };
}

export function initialMetadataInput(context: MetadataContext): MetadataInput {
  return {
    path: context.initialResolvedPath ?? context.initialPath,
    articleState: context.initialArticle ? "ready" : "missing",
    article: context.initialArticle,
  };
}

export function resolveNavigationMetadata(context: MetadataContext, input: MetadataInput, preserveInitial: boolean) {
  return resolvePageMetadata(context,
    preserveInitial && input.path === context.initialPath && input.articleState === "loading"
      ? initialMetadataInput(context) : input);
}

export function metadataFields(metadata: PageMetadata) {
  return [
    { attribute: "name", key: "description", value: metadata.description },
    { attribute: "name", key: "robots", value: metadata.robots },
    { attribute: "property", key: "og:type", value: metadata.ogType },
    { attribute: "property", key: "og:site_name", value: "Downsize Baltimore" },
    { attribute: "property", key: "og:title", value: metadata.title },
    { attribute: "property", key: "og:description", value: metadata.description },
    { attribute: "property", key: "og:url", value: metadata.canonical },
    { attribute: "property", key: "article:published_time", value: metadata.publishedAt },
    { attribute: "property", key: "og:image", value: metadata.socialImage },
    { attribute: "property", key: "og:image:width", value: "1200" },
    { attribute: "property", key: "og:image:height", value: "630" },
    { attribute: "property", key: "og:image:alt", value: SOCIAL_IMAGE_ALT },
    { attribute: "name", key: "twitter:card", value: "summary_large_image" },
    { attribute: "name", key: "twitter:title", value: metadata.title },
    { attribute: "name", key: "twitter:description", value: metadata.description },
    { attribute: "name", key: "twitter:image", value: metadata.socialImage },
    { attribute: "name", key: "twitter:image:alt", value: SOCIAL_IMAGE_ALT },
  ] as const;
}

export function publicRobots(indexable: boolean, siteOrigin: string) {
  return indexable
    ? `User-agent: *\nAllow: /\nDisallow: /publisher\nDisallow: /api/\nAllow: /api/posts$\nAllow: /api/posts?\nAllow: /api/posts/\nSitemap: ${siteOrigin}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n";
}
