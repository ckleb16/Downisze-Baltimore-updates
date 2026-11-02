type NewsletterSignup = {
  kind: "newsletter";
  source: "guide" | "footer" | "meet-mary";
  name: string;
  email: string;
};

type ClubSignup = {
  kind: "club";
  source: "resource-center";
  name: string;
  email: string;
  mailingAddress: string;
  phone: string;
  timing: string[];
  planningFor: string[];
  partOfTown: string;
  timeOfDay: string[];
  newsletter: boolean;
};

type Signup = NewsletterSignup | ClubSignup;
type NewsletterRow = { email: string; name: string; source: string; created_at: number; updated_at: number };
type ClubRow = { email: string; name: string; mailing_address: string; phone: string; timing: string; planning_for: string; part_of_town: string; time_of_day: string; newsletter_opt_in: number; created_at: number; updated_at: number };

const attempts = new Map<string, { count: number; until: number }>();
const JSON_LIMIT = 8192;

function required(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

function optional(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length <= max;
}

function choices(value: unknown, allowed: string[]): value is string[] {
  return Array.isArray(value) && value.length <= allowed.length &&
    value.every((item) => typeof item === "string" && allowed.includes(item)) &&
    new Set(value).size === value.length;
}

export function validateSignup(value: unknown): Signup | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (!required(input.name, 100) || !required(input.email, 254) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return null;
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (input.kind === "newsletter" && ["guide", "footer", "meet-mary"].includes(String(input.source))) {
    return { kind: "newsletter", source: input.source as NewsletterSignup["source"], name, email };
  }
  if (input.kind !== "club" || input.source !== "resource-center" ||
      !optional(input.mailingAddress, 300) || !optional(input.phone, 40) ||
      !optional(input.partOfTown, 120) ||
      !choices(input.timing, ["Ready to start soon", "In the next 6 to 12 months", "In the next 1 to 2 years", "Just exploring for now"]) ||
      !choices(input.planningFor, ["Myself", "A parent or loved one", "Both"]) ||
      !choices(input.timeOfDay, ["Daytime", "Evening"]) ||
      typeof input.newsletter !== "boolean") return null;
  return {
    kind: "club", source: "resource-center", name, email,
    mailingAddress: input.mailingAddress.trim(), phone: input.phone.trim(),
    timing: input.timing, planningFor: input.planningFor,
    partOfTown: input.partOfTown.trim(), timeOfDay: input.timeOfDay,
    newsletter: input.newsletter,
  };
}

function response(payload: object, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  } });
}

function rateAllowed(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  if (attempts.size > 5000) attempts.forEach((entry, key) => {
    if (entry.until <= now) attempts.delete(key);
  });
  if (attempts.size > 5000) {
    const oldest = attempts.keys().next().value as string | undefined;
    if (oldest) attempts.delete(oldest);
  }
  const entry = attempts.get(ip);
  if (!entry || entry.until <= now) {
    attempts.set(ip, { count: 1, until: now + 15 * 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count += 1;
  return true;
}

async function readSignup(request: Request): Promise<Signup | null> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json") ||
      Number(request.headers.get("content-length") || 0) > JSON_LIMIT) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > JSON_LIMIT) {
        await reader.cancel();
        return null;
      }
      chunks.push(chunk.value);
    }
    return validateSignup(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return null;
  }
}

export async function saveSignup(request: Request, db: D1Database) {
  if (request.method !== "POST") return response({ error: "Use POST." }, 405);
  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin ||
      ![null, "same-origin"].includes(request.headers.get("sec-fetch-site"))) {
    return response({ error: "This request was blocked." }, 403);
  }
  if (!rateAllowed(request)) return response({ error: "Please wait before trying again." }, 429);
  const signup = await readSignup(request);
  if (!signup) return response({ error: "Invalid sign-up details." }, 422);
  const now = Date.now();
  const newsletter = db.prepare(
    "INSERT INTO newsletter_signups (email, name, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name, source = excluded.source, updated_at = excluded.updated_at",
  ).bind(signup.email, signup.name, signup.kind === "club" ? "downsizers-club" : signup.source, now, now);
  if (signup.kind === "newsletter") {
    await newsletter.run();
  } else {
    const club = db.prepare(
      "INSERT INTO club_signups (email, name, mailing_address, phone, timing, planning_for, part_of_town, time_of_day, newsletter_opt_in, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name, mailing_address = excluded.mailing_address, phone = excluded.phone, timing = excluded.timing, planning_for = excluded.planning_for, part_of_town = excluded.part_of_town, time_of_day = excluded.time_of_day, newsletter_opt_in = excluded.newsletter_opt_in, updated_at = excluded.updated_at",
    ).bind(signup.email, signup.name, signup.mailingAddress, signup.phone, JSON.stringify(signup.timing), JSON.stringify(signup.planningFor), signup.partOfTown, JSON.stringify(signup.timeOfDay), signup.newsletter ? 1 : 0, now, now);
    if (signup.newsletter) await db.batch([club, newsletter]);
    else await club.run();
  }
  return response({ ok: true });
}

export async function signupSummary(db: D1Database) {
  const [newsletterCount, clubCount, newsletterRecent, clubRecent] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS count FROM newsletter_signups").first<{ count: number }>(),
    db.prepare("SELECT COUNT(*) AS count FROM club_signups").first<{ count: number }>(),
    db.prepare("SELECT name, email, created_at AS createdAt FROM newsletter_signups ORDER BY created_at DESC LIMIT 5").all<{ name: string; email: string; createdAt: number }>(),
    db.prepare("SELECT name, email, created_at AS createdAt FROM club_signups ORDER BY created_at DESC LIMIT 5").all<{ name: string; email: string; createdAt: number }>(),
  ]);
  return response({ newsletter: { count: newsletterCount?.count ?? 0, recent: newsletterRecent.results }, club: { count: clubCount?.count ?? 0, recent: clubRecent.results } });
}

export function csvCell(value: string | number) {
  let text = String(value).replace(/[\r\n\t]+/g, " ");
  if (/^\s*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function csv(headers: string[], rows: Array<Array<string | number>>) {
  return `\uFEFF${[headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export async function exportSignups(db: D1Database, list: "newsletter" | "club") {
  let content: string;
  if (list === "newsletter") {
    const result = await db.prepare("SELECT name, email, source, created_at, updated_at FROM newsletter_signups ORDER BY created_at ASC").all<NewsletterRow>();
    content = csv(["Name", "Email", "Source", "Signed up at (UTC)", "Updated at (UTC)"],
      result.results.map((row) => [row.name, row.email, row.source, new Date(row.created_at).toISOString(), new Date(row.updated_at).toISOString()]));
  } else {
    const result = await db.prepare("SELECT name, email, mailing_address, phone, timing, planning_for, part_of_town, time_of_day, newsletter_opt_in, created_at, updated_at FROM club_signups ORDER BY created_at ASC").all<ClubRow>();
    content = csv(["Name", "Email", "Mailing address", "Phone", "Where are you in your thinking?", "Who are you planning for?", "Part of town", "Time of day", "Newsletter opt-in", "Signed up at (UTC)", "Updated at (UTC)"],
      result.results.map((row) => [row.name, row.email, row.mailing_address, row.phone, JSON.parse(row.timing).join("; "), JSON.parse(row.planning_for).join("; "), row.part_of_town, JSON.parse(row.time_of_day).join("; "), row.newsletter_opt_in ? "Yes" : "No", new Date(row.created_at).toISOString(), new Date(row.updated_at).toISOString()]));
  }
  return new Response(content, { headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="downsize-baltimore-${list}-signups.csv"`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  } });
}
