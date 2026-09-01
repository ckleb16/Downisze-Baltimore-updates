import { ArrowLeft, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "wouter";
import MarkdownContent from "@/components/MarkdownContent";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  formatInsightDate,
  InsightsApiError,
  insightsRequest,
  type InsightPost,
} from "@/lib/insights";

export default function InsightArticle() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [post, setPost] = useState<InsightPost | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const result = await insightsRequest<{ post: InsightPost }>(`/api/posts/${encodeURIComponent(slug)}`);
      setPost(result.post);
      setState("ready");
    } catch (error) {
      setState(error instanceof InsightsApiError && error.status === 404 ? "missing" : "error");
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    void load();
  }, [load]);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} | Downsize Baltimore`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = post.excerpt;
  }, [post]);

  return (
    <div className="insights-page">
      <SiteHeader currentPath="/resource-center" />
      <main id="main-content" className="insight-article-shell" tabIndex={-1} aria-busy={state === "loading"}>
        {state === "loading" && <p className="insights-state" role="status">Loading article…</p>}
        {state === "error" && (
          <div className="insights-state" role="alert">
            <h1>This article could not be loaded.</h1>
            <p>Please try again or return to all Insights &amp; Advice.</p>
            <button type="button" onClick={() => void load()}>Try again <RotateCcw size={15} aria-hidden="true" /></button>
          </div>
        )}
        {state === "missing" && (
          <div className="insights-state">
            <p className="resource-eyebrow">Article not found</p>
            <h1>This insight is not available.</h1>
            <p>It may have moved or may no longer be published.</p>
            <a href="/insights-advice"><ArrowLeft size={15} aria-hidden="true" /> All Insights &amp; Advice</a>
          </div>
        )}
        {state === "ready" && post && (
          <article className="insight-article" aria-labelledby="article-title">
            <header>
              <p className="resource-eyebrow">Insights &amp; Advice</p>
              <h1 id="article-title">{post.title}</h1>
              <p className="insight-article__excerpt">{post.excerpt}</p>
              <div className="insight-article__meta">
                <span>By Mary Lynch</span>
                <time dateTime={post.publishedAt ?? undefined}>{formatInsightDate(post.publishedAt)}</time>
              </div>
            </header>
            <MarkdownContent className="insight-article__body">{post.body}</MarkdownContent>
            <footer>
              <a href="/insights-advice"><ArrowLeft size={15} aria-hidden="true" /> Back to Insights &amp; Advice</a>
            </footer>
          </article>
        )}
      </main>
      <SiteFooter currentPath="/resource-center" />
    </div>
  );
}
