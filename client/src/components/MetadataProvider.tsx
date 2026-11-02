import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import { canonicalizeRecognizedPath, findPageRoute } from "@/lib/siteRoutes";
import {
  resolveNavigationMetadata,
  type ArticleMetadata,
  type ArticleMetadataState,
  type MetadataContext,
} from "@/lib/siteMetadata";
import { updateDocumentMetadata } from "@/lib/documentMetadata";

type ArticleUpdate = { path: string; state: ArticleMetadataState; article?: ArticleMetadata | null };
type ArticleRecord = { navigation: { path: string }; update: ArticleUpdate };
const ArticleMetadataDispatch = createContext<((update: ArticleUpdate) => void) | null>(null);

function readContext(): MetadataContext | null {
  const contextElement = document.getElementById("site-metadata-context");
  // Legacy/static hosts keep their own server head until they adopt this contract.
  if (!contextElement) return null;
  const initialPath = window.location.pathname;
  const fallback: MetadataContext = {
    siteOrigin: window.location.origin,
    requestOrigin: window.location.origin,
    indexable: false,
    initialPath,
    initialResolvedPath: findPageRoute(initialPath)?.path ?? null,
    initialArticle: null,
  };
  try {
    const value = JSON.parse(contextElement.textContent ?? "null") as MetadataContext | null;
    if (!value || typeof value.indexable !== "boolean" || typeof value.initialPath !== "string" ||
        !(value.initialResolvedPath === null || typeof value.initialResolvedPath === "string")) return fallback;
    for (const origin of [value.siteOrigin, value.requestOrigin]) {
      const parsed = new URL(origin);
      if (!/^https?:$/.test(parsed.protocol) || parsed.origin !== origin) return fallback;
    }
    if (value.initialPath !== initialPath) return fallback;
    if (value.initialArticle && (typeof value.initialArticle.title !== "string" ||
        typeof value.initialArticle.excerpt !== "string" || typeof value.initialArticle.slug !== "string" ||
        !(value.initialArticle.publishedAt === null || typeof value.initialArticle.publishedAt === "string"))) return fallback;
    return value;
  } catch { return fallback; }
}

export default function MetadataProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const path = location.split(/[?#]/)[0] || "/";
  const navigation = useMemo(() => ({ path }), [path]);
  const [context] = useState(readContext);
  const [articleRecord, setArticleRecord] = useState<ArticleRecord | null>(null);
  const initialActive = useRef(true);
  const initialNavigation = useRef(navigation);
  // Each navigation owns its result. A late response from an older route cannot
  // overwrite the current head, and an immediate response is never cleared.
  const publishArticle = useCallback((update: ArticleUpdate) => {
    setArticleRecord({ navigation, update });
  }, [navigation]);

  useEffect(() => {
    if (!context) return;
    if (navigation !== initialNavigation.current) initialActive.current = false;
    const update = articleRecord?.navigation === navigation && articleRecord.update.path === path
      ? articleRecord.update : null;
    if (update && update.state !== "loading") initialActive.current = false;
    const input = { path, articleState: update?.state ?? "loading", article: update?.article } as const;
    updateDocumentMetadata(document, resolveNavigationMetadata(context, input, initialActive.current));
    const canonicalPath = canonicalizeRecognizedPath(path);
    if (canonicalPath && canonicalPath !== path) {
      const suffix = `${window.location.search}${window.location.hash}`;
      window.history.replaceState(window.history.state, "", `${canonicalPath}${suffix}`);
    }
  }, [path, navigation, articleRecord, context]);

  return <ArticleMetadataDispatch.Provider value={publishArticle}>{children}</ArticleMetadataDispatch.Provider>;
}

export function useArticleMetadata(path: string, state: ArticleMetadataState, article: ArticleMetadata | null) {
  const publish = useContext(ArticleMetadataDispatch);
  useEffect(() => {
    publish?.({ path, state, article: state === "ready" ? article : null });
  }, [publish, path, state, article]);
}
