import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

type NativeRunResult = {
  changes: number | bigint;
  lastInsertRowid: number | bigint;
};

type NativeStatement = {
  all(...values: unknown[]): unknown[];
  get(...values: unknown[]): unknown;
  run(...values: unknown[]): NativeRunResult;
};

type NativeDatabase = {
  prepare(query: string): NativeStatement;
  exec(query: string): void;
};

class SqliteD1Statement {
  private readonly database: NativeDatabase;
  readonly query: string;
  readonly values: unknown[];

  constructor(
    database: NativeDatabase,
    query: string,
    values: unknown[] = [],
  ) {
    this.database = database;
    this.query = query;
    this.values = values;
  }

  bind(...values: unknown[]) {
    return new SqliteD1Statement(this.database, this.query, values);
  }

  async all<T>() {
    const results = this.database.prepare(this.query).all(...this.values) as T[];
    return {
      success: true,
      results,
      meta: { changes: 0, duration: 0, rows_read: results.length, rows_written: 0 },
    } as D1Result<T>;
  }

  async first<T>(columnName?: string) {
    const row = this.database.prepare(this.query).get(...this.values) as
      | Record<string, unknown>
      | undefined;
    if (!row) return null;
    return (columnName ? row[columnName] : row) as T;
  }

  async run() {
    return this.runSync();
  }

  runSync() {
    const statement = this.database.prepare(this.query);
    if (/\bRETURNING\b/i.test(this.query)) {
      const results = statement.all(...this.values);
      const changes = this.database
        .prepare("SELECT changes() AS changes")
        .get() as { changes: number | bigint };
      return {
        success: true,
        results,
        meta: {
          changes: Number(changes.changes),
          duration: 0,
          last_row_id: 0,
          rows_read: results.length,
          rows_written: Number(changes.changes),
        },
      } as D1Result;
    }

    const result = statement.run(...this.values);
    return {
      success: true,
      results: [],
      meta: {
        changes: Number(result.changes),
        duration: 0,
        last_row_id: Number(result.lastInsertRowid),
        rows_read: 0,
        rows_written: Number(result.changes),
      },
    } as D1Result;
  }
}

class SqliteD1Database {
  private readonly database: NativeDatabase;

  constructor(database: NativeDatabase) {
    this.database = database;
  }

  prepare(query: string) {
    return new SqliteD1Statement(this.database, query);
  }

  async batch(statements: D1PreparedStatement[]) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const results = statements.map((statement) => {
        if (!(statement instanceof SqliteD1Statement)) {
          throw new Error("Unsupported database statement.");
        }
        return statement.runSync();
      });
      this.database.exec("COMMIT");
      return results as D1Result[];
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }

  async exec(query: string) {
    this.database.exec(query);
    return { count: 0, duration: 0 };
  }

  async dump() {
    throw new Error("Database dumps are not available through the runtime adapter.");
  }
}

const MIGRATIONS = [
  "0000_premium_post.sql",
  "0001_seed_sample_insight.sql",
  "0002_superb_boom_boom.sql",
  "0003_sweet_the_initiative.sql",
] as const;

function migrationSql(filename: string) {
  const source = readFileSync(
    path.resolve(process.cwd(), "drizzle", filename),
    "utf8",
  );
  return source.replaceAll("--> statement-breakpoint", "");
}

function applyMigrations(database: NativeDatabase) {
  database.exec(
    "CREATE TABLE IF NOT EXISTS app_migrations (name TEXT PRIMARY KEY NOT NULL, applied_at INTEGER NOT NULL)",
  );
  const alreadyApplied = database.prepare(
    "SELECT name FROM app_migrations WHERE name = ?",
  );
  const record = database.prepare(
    "INSERT INTO app_migrations (name, applied_at) VALUES (?, ?)",
  );

  for (const filename of MIGRATIONS) {
    if (alreadyApplied.get(filename)) continue;
    database.exec("BEGIN IMMEDIATE");
    try {
      database.exec(migrationSql(filename));
      record.run(filename, Date.now());
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }
}

function canUseDirectory(directory: string) {
  try {
    mkdirSync(directory, { recursive: true });
    const probe = path.join(directory, ".write-test");
    writeFileSync(probe, "ok", { flag: "w" });
    unlinkSync(probe);
    return true;
  } catch {
    return false;
  }
}

export function resolveAppDataDirectory() {
  const configured = process.env.APP_DATA_DIR?.trim();
  const directory = configured
    ? path.resolve(configured)
    : path.resolve(process.cwd(), "public", "assets", ".downsize-baltimore");
  if (!canUseDirectory(directory)) {
    throw new Error(`Application data directory is not writable: ${directory}`);
  }
  return directory;
}

export function openApplicationDatabase(dataDirectory: string) {
  if (!existsSync(dataDirectory)) mkdirSync(dataDirectory, { recursive: true });
  const database = new DatabaseSync(
    path.join(dataDirectory, "content.sqlite"),
  ) as unknown as NativeDatabase;
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA foreign_keys = ON");
  database.exec("PRAGMA busy_timeout = 5000");
  applyMigrations(database);
  return new SqliteD1Database(database) as unknown as D1Database;
}
