import { ArrowUpRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  formatInsightDate,
  insightsRequest,
  type InsightSummary,
} from "@/lib/insights";

export default function LatestInsights() {
  const [posts, setPosts] = useState<InsightSummary[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const result = await insightsRequest<{ posts: InsightSummary[] }>(
        "/api/posts?limit=3",
      );
      setPosts(result.posts);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (state === "loading") {
    return <p className="resource-insights__state" role="status">Loading the latest insights…</p>;
  }

  if (state === "error") {
    return (
      <div className="resource-insights__state" role="alert">
        <p>The latest articles could not be loaded.</p>
        <button type="button" onClick={() => void load()}>
          Try again <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="resource-insights__state">
        <p>Mary’s first Insights &amp; Advice articles are on the way.</p>
        <a href="/contact">Ask Mary a question <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    );
  }

  return (
    <ul className={`resource-insights__list resource-insights__list--${Math.min(posts.length, 3)}`} role="list">
      {posts.map((post) => (
        <li key={post.id}>
          <article>
            <time dateTime={post.publishedAt ?? undefined}>
              {formatInsightDate(post.publishedAt)}
            </time>
            <h3><a href={`/insights-advice/${post.slug}`}>{post.title}</a></h3>
            <a href={`/insights-advice/${post.slug}`}>
              Read article <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
}
