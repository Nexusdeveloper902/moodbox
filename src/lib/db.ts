import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

// One connection per server process, reused across hot reloads in development.
// ponytail: SQLite file with a single writer; move to a server DB if you run several app instances.
const g = globalThis as unknown as { sqlite?: DatabaseSync };

function open() {
  const file = path.join(process.cwd(), "data", path.basename(process.env.DATABASE_FILE ?? "moodbox.db"));
  mkdirSync(path.dirname(file), { recursive: true });
  const conn = new DatabaseSync(file);
  conn.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  return conn;
}

export const db = g.sqlite ?? open();
if (process.env.NODE_ENV !== "production") g.sqlite = db;

/** Runs `fn` inside BEGIN/COMMIT, rolling back if it throws. */
export function transaction<T>(fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
