import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MarkdownContent from "@/components/MarkdownContent";
import {
  dateInputValue,
  formatInsightDate,
  InsightsApiError,
  insightsRequest,
  slugifyInsight,
  type InsightPost,
  type PublisherSession,
} from "@/lib/insights";
import { ArrowLeft, ArrowUpRight, FilePlus2, LogOut, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

type EditorForm = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publicationDate: string;
  status: "draft" | "published";
  version: number | null;
};

const freshForm = (): EditorForm => ({
  id: null,
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  publicationDate: dateInputValue(null),
  status: "draft",
  version: null,
});

function formFromPost(post: InsightPost): EditorForm {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    publicationDate: dateInputValue(post.publishedAt),
    status: post.status,
    version: post.version,
  };
}

export default function InsightsPublisher() {
  const [session, setSession] = useState<PublisherSession | null>(null);
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [form, setForm] = useState<EditorForm>(() => freshForm());
  const [savedForm, setSavedForm] = useState<EditorForm>(() => freshForm());
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm), [form, savedForm]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const sessionResult = await insightsRequest<PublisherSession>("/api/admin/session");
      setSession(sessionResult);
      if (sessionResult.authorized) {
        const postResult = await insightsRequest<{ posts: InsightPost[] }>("/api/admin/posts");
        setPosts(postResult.posts);
      }
    } catch (error) {
      if (error instanceof InsightsApiError && (error.status === 401 || error.status === 403)) {
        setSession({
          authenticated: false,
          authorized: false,
          displayName: null,
          email: null,
        });
      } else {
        setLoadError("The publishing dashboard could not be loaded.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (signingIn) return;
    setSigningIn(true);
    setLoginError("");
    try {
      await insightsRequest<PublisherSession>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "X-Downsize-Publisher": "1" },
      });
      setPassword("");
      await loadDashboard();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    if (saving || (isDirty && !window.confirm("Discard your unsaved changes and sign out?"))) return;
    setSaving(true);
    try {
      await insightsRequest("/api/admin/logout", { method: "POST", headers: { "X-Downsize-Publisher": "1" } });
      const next = freshForm();
      setForm(next);
      setSavedForm(next);
      setPosts([]);
      setErrors({});
      setNotice("");
      setSlugEdited(false);
      setPassword("");
      setLoginError("");
      setSession(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Sign-out failed. Please try again.");
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof EditorForm, value: string) => {
    setNotice("");
    setNoticeIsError(false);
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateTitle = (title: string) => {
    setNotice("");
    setNoticeIsError(false);
    setErrors((current) => {
      const next = { ...current };
      delete next.title;
      if (!slugEdited) delete next.slug;
      return next;
    });
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugifyInsight(title),
    }));
  };

  const beginNewPost = () => {
    if (isDirty && !window.confirm("Discard your unsaved changes and start a new post?")) return;
    const next = freshForm();
    setForm(next);
    setSavedForm(next);
    setSlugEdited(false);
    setErrors({});
    setNotice("");
    setNoticeIsError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const editPost = (post: InsightPost) => {
    if (isDirty && !window.confirm("Discard your unsaved changes and open this post?")) return;
    const next = formFromPost(post);
    setForm(next);
    setSavedForm(next);
    setSlugEdited(true);
    setErrors({});
    setNotice("");
    setNoticeIsError(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validate = (status: "draft" | "published") => {
    const nextErrors: Record<string, string> = {};
    if (!form.title.trim()) nextErrors.title = "Add a headline.";
    if (!form.slug.trim()) nextErrors.slug = "Add a URL slug.";
    if (!form.excerpt.trim()) nextErrors.excerpt = "Add a short summary.";
    if (!form.body.trim()) nextErrors.body = "Add the article text.";
    if (status === "published" && !form.publicationDate) nextErrors.publishedAt = "Choose a publication date.";
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0];
    if (firstField) {
      window.setTimeout(() => {
        formRef.current
          ?.querySelector<HTMLElement>(`[data-field="${firstField}"]`)
          ?.focus();
      }, 0);
    }
    return !firstField;
  };

  const save = async (status: "draft" | "published") => {
    if (!validate(status)) return;
    setSaving(true);
    setNotice("");
    setNoticeIsError(false);
    setErrors({});
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body: form.body,
      status,
      publishedAt:
        status === "published"
          ? `${form.publicationDate}T12:00:00.000Z`
          : null,
      version: form.version,
    };

    try {
      const result = await insightsRequest<{ post: InsightPost }>(
        form.id ? `/api/admin/posts/${encodeURIComponent(form.id)}` : "/api/admin/posts",
        {
          method: form.id ? "PUT" : "POST",
          body: JSON.stringify(payload),
          headers: { "X-Downsize-Publisher": "1" },
        },
      );
      const next = formFromPost(result.post);
      setForm(next);
      setSavedForm(next);
      setSlugEdited(true);
      setPosts((current) => {
        const withoutSaved = current.filter((post) => post.id !== result.post.id);
        return [result.post, ...withoutSaved].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      });
      setNotice(status === "published" ? "Article published successfully." : "Draft saved successfully.");
      setNoticeIsError(false);
    } catch (error) {
      if (error instanceof InsightsApiError) {
        setErrors(error.fields);
        setNotice(error.message);
        if (error.status === 401) {
          setSession(null);
          setLoginError("Your session expired. Sign in again to continue; your unsaved article is still here.");
        }
      } else {
        setNotice("The post could not be saved. Please try again.");
      }
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!form.id) return;
    setSaving(true);
    setNotice("");
    setNoticeIsError(false);
    try {
      await insightsRequest<{ success: true }>(`/api/admin/posts/${encodeURIComponent(form.id)}`, {
        method: "DELETE",
        headers: { "X-Downsize-Publisher": "1" },
      });
      setPosts((current) => current.filter((post) => post.id !== form.id));
      const next = freshForm();
      setForm(next);
      setSavedForm(next);
      setSlugEdited(false);
      setNotice("Post deleted.");
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The post could not be deleted.");
      setNoticeIsError(true);
      if (error instanceof InsightsApiError && error.status === 401) {
        setSession(null);
        setLoginError("Your session expired. Sign in again to continue; your unsaved article is still here.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main id="main-content" className="publisher-gate" tabIndex={-1}><p role="status">Opening the publishing dashboard…</p></main>;
  }

  if (loadError) {
    return (
      <main id="main-content" className="publisher-gate" tabIndex={-1}>
        <h1>Publishing dashboard unavailable</h1>
        <p role="alert">{loadError}</p>
        <Button type="button" onClick={() => void loadDashboard()}>Try again</Button>
      </main>
    );
  }

  if (!session?.authorized) {
    return (
      <main id="main-content" className="publisher-gate" tabIndex={-1}>
        <p className="publisher-eyebrow">Downsize Baltimore</p>
        <h1>Admin sign-in</h1>
        <p>Sign in to write and publish Insights &amp; Advice. No ChatGPT account is needed.</p>
        <form className="publisher-login" onSubmit={signIn} aria-busy={signingIn}>
          <div className="publisher-field">
            <Label htmlFor="publisher-username">Username (email)</Label>
            <Input id="publisher-username" name="username" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={254} value={username} onChange={(event) => setUsername(event.target.value)} disabled={signingIn} />
          </div>
          <div className="publisher-field">
            <Label htmlFor="publisher-password">Password</Label>
            <Input id="publisher-password" name="password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} disabled={signingIn} aria-describedby={loginError ? "publisher-login-error" : undefined} />
          </div>
          {loginError && <p id="publisher-login-error" className="publisher-login__error" role="alert">{loginError}</p>}
          <Button className="publisher-login__submit" type="submit" disabled={signingIn}>{signingIn ? "Signing in…" : "Sign in"}</Button>
        </form>
        <a className="publisher-back-link" href="/"><ArrowLeft size={15} aria-hidden="true" /> Return to the website</a>
      </main>
    );
  }

  return (
    <div className="publisher-page">
      <header className="publisher-header">
        <div>
          <p className="publisher-eyebrow">Downsize Baltimore</p>
          <span>Insights &amp; Advice Publisher</span>
        </div>
        <nav aria-label="Publisher account">
          <span>{session.displayName}</span>
          <button type="button" onClick={() => void signOut()} disabled={saving}>Sign out <LogOut size={15} aria-hidden="true" /></button>
        </nav>
      </header>

      <main id="main-content" className="publisher-main" tabIndex={-1}>
        <section className="publisher-editor" aria-labelledby="publisher-heading">
          <div className="publisher-editor__heading">
            <div>
              <p className="publisher-eyebrow">Private editor</p>
              <h1 id="publisher-heading">{form.id ? "Edit article" : "Write a new article"}</h1>
            </div>
            <Button type="button" variant="outline" onClick={beginNewPost}><FilePlus2 aria-hidden="true" /> New article</Button>
          </div>

          {notice && <div className={`publisher-notice ${noticeIsError ? "is-error" : ""}`} role={noticeIsError ? "alert" : "status"}>{notice}{form.status === "published" && form.slug && !noticeIsError ? <a href={`/insights-advice/${form.slug}`}>View article <ArrowUpRight size={14} aria-hidden="true" /></a> : null}</div>}

          <form ref={formRef} onSubmit={(event: FormEvent) => event.preventDefault()} noValidate>
            <div className="publisher-field">
              <Label htmlFor="publisher-title">Headline</Label>
              <Input id="publisher-title" data-field="title" value={form.title} onChange={(event) => updateTitle(event.target.value)} maxLength={140} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "publisher-title-error" : undefined} />
              {errors.title && <p id="publisher-title-error" className="publisher-field__error">{errors.title}</p>}
            </div>

            <div className="publisher-field">
              <Label htmlFor="publisher-slug">Page address</Label>
              <div className="publisher-slug-field"><span>/insights-advice/</span><Input id="publisher-slug" data-field="slug" value={form.slug} onChange={(event) => { setSlugEdited(true); update("slug", slugifyInsight(event.target.value)); }} maxLength={90} aria-invalid={Boolean(errors.slug)} aria-describedby="publisher-slug-help" /></div>
              <p id="publisher-slug-help" className={errors.slug ? "publisher-field__error" : "publisher-field__help"}>{errors.slug || "Created from the headline. You can shorten it before publishing."}</p>
            </div>

            <div className="publisher-field">
              <Label htmlFor="publisher-excerpt">Short summary</Label>
              <Textarea id="publisher-excerpt" data-field="excerpt" value={form.excerpt} onChange={(event) => update("excerpt", event.target.value)} maxLength={320} rows={4} aria-invalid={Boolean(errors.excerpt)} aria-describedby="publisher-excerpt-help" />
              <p id="publisher-excerpt-help" className={errors.excerpt ? "publisher-field__error" : "publisher-field__help"}>{errors.excerpt || `${form.excerpt.length}/320 characters. This appears in article listings and search previews.`}</p>
            </div>

            <div className="publisher-field">
              <Label htmlFor="publisher-body">Article</Label>
              <Textarea id="publisher-body" data-field="body" className="publisher-body-input" value={form.body} onChange={(event) => update("body", event.target.value)} rows={18} maxLength={50000} aria-invalid={Boolean(errors.body)} aria-describedby="publisher-body-help" />
              <p id="publisher-body-help" className={errors.body ? "publisher-field__error" : "publisher-field__help"}>{errors.body || "Use a blank line between paragraphs. For optional formatting: ## Heading, **bold**, - list item, or [link text](https://example.com)."}</p>
            </div>

            <div className="publisher-field publisher-field--date">
              <Label htmlFor="publisher-date">Publication date</Label>
              <Input id="publisher-date" data-field="publishedAt" type="date" value={form.publicationDate} onChange={(event) => update("publicationDate", event.target.value)} aria-invalid={Boolean(errors.publishedAt)} aria-describedby={errors.publishedAt ? "publisher-date-error" : undefined} />
              {errors.publishedAt && <p id="publisher-date-error" className="publisher-field__error">{errors.publishedAt}</p>}
            </div>

            <div className="publisher-actions">
              <Button type="button" variant="outline" disabled={saving} onClick={() => void save("draft")}>{form.status === "published" ? "Move to draft" : "Save draft"}</Button>
              <Button type="button" disabled={saving} onClick={() => void save("published")}>{saving ? "Saving…" : form.status === "published" ? "Update article" : "Publish article"}</Button>
              {form.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button type="button" variant="destructive" disabled={saving}><Trash2 aria-hidden="true" /> Delete</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                      <AlertDialogDescription>This removes it from the dashboard and the public website. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-white" onClick={() => void remove()}>Delete post</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>

          <section className="publisher-preview" aria-labelledby="publisher-preview-heading">
            <p className="publisher-eyebrow">Article preview</p>
            <h2 id="publisher-preview-heading">{form.title || "Your headline will appear here"}</h2>
            {form.excerpt && <p className="publisher-preview__excerpt">{form.excerpt}</p>}
            {form.body ? <MarkdownContent className="insight-article__body">{form.body}</MarkdownContent> : <p className="publisher-preview__empty">Start writing to preview the article.</p>}
          </section>
        </section>

        <aside className="publisher-library" aria-labelledby="publisher-library-heading">
          <div className="publisher-library__heading">
            <div><p className="publisher-eyebrow">Library</p><h2 id="publisher-library-heading">All posts</h2></div>
            <span>{posts.length}</span>
          </div>
          {!posts.length ? (
            <div className="publisher-library__empty"><p>No articles yet.</p><button type="button" onClick={beginNewPost}>Create the first article</button></div>
          ) : (
            <ul role="list">
              {posts.map((post) => (
                <li key={post.id} className={form.id === post.id ? "is-active" : ""}>
                  <button type="button" onClick={() => editPost(post)}>
                    <span className={`publisher-status publisher-status--${post.status}`}>{post.status}</span>
                    <strong>{post.title}</strong>
                    <small>{post.status === "published" ? formatInsightDate(post.publishedAt) : `Updated ${formatInsightDate(post.updatedAt)}`}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </div>
  );
}
