import { ArrowLeft, ArrowUpRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  formatInsightDate,
  insightsRequest,
  type InsightSummary,
} from "@/lib/insights";

export default function InsightsArchive() {
  const [posts, setPosts] = useState<InsightSummary[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");

  const load = useCallback(async (offset = 0) => {
    const isFirstPage = offset === 0;
    if (isFirstPage) setState("loading");
    else setLoadingMore(true);
    setLoadMoreError("");
    try {
      const result = await insightsRequest<{
        posts: InsightSummary[];
        pagination: { hasMore: boolean; nextOffset: number | null };
      }>(`/api/posts?limit=20&offset=${offset}`);
      setPosts((current) => {
        if (isFirstPage) return result.posts;
        const existing = new Set(current.map((post) => post.id));
        return [...current, ...result.posts.filter((post) => !existing.has(post.id))];
      });
      setNextOffset(result.pagination.hasMore ? result.pagination.nextOffset : null);
      setState("ready");
    } catch {
      if (isFirstPage) setState("error");
      else setLoadMoreError("More articles could not be loaded. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void load(0);
  }, [load]);

  return (
    <div className="insights-page">
      <SiteHeader currentPath="/resource-center" />
      <main id="main-content" tabIndex={-1}>
        <header className="insights-hero">
          <div>
            <p className="resource-eyebrow">Insights &amp; Advice</p>
            <h1>Practical Guidance<br /><i>for What Comes Next.</i></h1>
            <p>Thoughtful, straightforward articles from Mary Lynch about homes, moves, family conversations, and planning ahead.</p>
            <a href="/resource-center"><ArrowLeft size={16} aria-hidden="true" /> Back to the Resource Center</a>
          </div>
        </header>

        <section className="insights-archive" aria-labelledby="insights-archive-heading" aria-busy={state === "loading"}>
          <div className="insights-archive__heading">
            <p className="resource-eyebrow">Newest first</p>
            <h2 id="insights-archive-heading">All Insights &amp; Advice</h2>
          </div>

          {state === "loading" && <p className="insights-state" role="status">Loading articles…</p>}
          {state === "error" && (
            <div className="insights-state" role="alert">
              <p>The articles could not be loaded right now.</p>
              <button type="button" onClick={() => void load(0)}>Try again <RotateCcw size={15} aria-hidden="true" /></button>
            </div>
          )}
          {state === "ready" && !posts.length && (
            <div className="insights-state">
              <h2>New articles are on the way.</h2>
              <p>In the meantime, the Resource Center has practical starting points for the questions you may be facing.</p>
              <a href="/resource-center">Visit the Resource Center <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
          )}
          {state === "ready" && posts.length > 0 && (
            <>
              <ol className="insights-archive__list">
                {posts.map((post) => (
                  <li key={post.id}>
                    <article>
                      <time dateTime={post.publishedAt ?? undefined}>{formatInsightDate(post.publishedAt)}</time>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <a href={`/insights-advice/${post.slug}`}>Read article <ArrowUpRight size={16} aria-hidden="true" /></a>
                    </article>
                  </li>
                ))}
              </ol>
              {loadMoreError && <p className="insights-load-more__error" role="alert">{loadMoreError}</p>}
              {nextOffset !== null && (
                <div className="insights-load-more">
                  <button type="button" disabled={loadingMore} onClick={() => void load(nextOffset)}>
                    {loadingMore ? "Loading more…" : "Load more articles"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <SiteFooter currentPath="/resource-center" />
    </div>
  );
}
