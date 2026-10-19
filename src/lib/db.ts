import "server-only";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { createDatabase } from "../../db/seed.mjs";

// One connection per server process, reused across hot reloads in development.
// ponytail: SQLite file with a single writer; move to a server DB if you run several app instances.
const g = globalThis as unknown as { sqlite?: DatabaseSync };

function dbFile() {
  const name = path.basename(process.env.DATABASE_FILE ?? "moodbox.db");
  // Vercel's filesystem is read-only except /tmp: keep the database there and let
  // createDatabase seed it on the first run of every instance.
  const dir = process.env.VERCEL ? os.tmpdir() : path.join(process.cwd(), "data");
  return path.join(dir, name);
}

function open() {
  const file = dbFile();
  // Seed on first use: the data/ directory is not deployed, so on Vercel every
  // serverless instance builds its own database (schema + catalog + demo account).
  if (!existsSync(file)) {
    try {
      createDatabase(file);
    } catch (err) {
      console.error("[db] no se pudo sembrar la base de datos:", err);
      throw err;
    }
  }
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
