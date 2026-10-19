// Recreates the schema and seeds products, MoodBoxes and a demo user.
// Usage: npm run db:setup   (DATABASE_FILE in .env → data/<file>, default moodbox.db)
import { mkdirSync } from "node:fs";
import path from "node:path";
import { createDatabase, localDataFile } from "../db/seed.mjs";

const file = localDataFile();
mkdirSync(path.dirname(file), { recursive: true });
createDatabase(file);
console.log(`Base de datos lista en ${path.relative(process.cwd(), file)}: 14 productos, 3 MoodBox, usuario demo laura@correo.com / moodbox123`);
