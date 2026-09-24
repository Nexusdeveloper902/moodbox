-- MoodBox schema (SQLite). `npm run db:setup` drops and recreates everything.
PRAGMA foreign_keys = OFF;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS moodbox_items;
DROP TABLE IF EXISTS moodboxes;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone         TEXT,
  address       TEXT,
  city          TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL -- ISO 8601 UTC
);

CREATE TABLE products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('dulce', 'bebida', 'detalle', 'relajacion', 'mensaje')),
  price       INTEGER NOT NULL CHECK (price > 0),
  image       TEXT NOT NULL,
  available   INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
  -- 0 = only used inside predefined boxes (e.g. Dulce), not sold alone
  in_catalog  INTEGER NOT NULL DEFAULT 1 CHECK (in_catalog IN (0, 1)),
  sort        INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE moodboxes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  number      INTEGER NOT NULL,
  name        TEXT NOT NULL,
  mood        TEXT NOT NULL,
  tagline     TEXT NOT NULL,
  quote       TEXT NOT NULL,
  summary     TEXT NOT NULL,
  description TEXT NOT NULL,
  price       INTEGER NOT NULL CHECK (price > 0),
  image       TEXT NOT NULL
);

CREATE TABLE moodbox_items (
  moodbox_id INTEGER NOT NULL REFERENCES moodboxes(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  label      TEXT NOT NULL,
  detail     TEXT NOT NULL,
  quantity   INTEGER NOT NULL DEFAULT 1,
  sort       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (moodbox_id, product_id)
);

CREATE TABLE orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  total      INTEGER NOT NULL,
  status     TEXT NOT NULL DEFAULT 'confirmado' CHECK (status IN ('confirmado', 'en_camino', 'entregado')),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  address    TEXT NOT NULL,
  city       TEXT NOT NULL,
  notes      TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE order_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kind           TEXT NOT NULL CHECK (kind IN ('moodbox', 'product', 'custom')),
  moodbox_id     INTEGER REFERENCES moodboxes(id),
  product_id     INTEGER REFERENCES products(id),
  name           TEXT NOT NULL,
  -- JSON: [{ "slug": "gomitas", "name": "Gomitas", "quantity": 1 }] for boxes
  contents       TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(contents)),
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  unit_price     INTEGER NOT NULL,
  custom_message TEXT,
  letter_to      TEXT,
  letter_from    TEXT
);

CREATE INDEX orders_user ON orders (user_id, created_at DESC);
CREATE INDEX order_items_order ON order_items (order_id);
