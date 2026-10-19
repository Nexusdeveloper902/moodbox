/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle db/schema.sql with the serverless functions so src/lib/db.ts can seed
  // its SQLite database in /tmp on Vercel (the data/ directory is not deployed).
  outputFileTracingIncludes: {
    "/*": ["./db/schema.sql"],
  },
};

export default nextConfig;
