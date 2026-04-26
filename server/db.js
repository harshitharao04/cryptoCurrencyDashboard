import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("server", "db.json");
const isVercel = Boolean(process.env.VERCEL);

const defaultDb = {
  users: [],
  watchlists: {},
  portfolios: {},
};

if (!globalThis.__cryptoDashboardDb) {
  globalThis.__cryptoDashboardDb = JSON.parse(JSON.stringify(defaultDb));
}

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
}

export function readDb() {
  if (isVercel) {
    return globalThis.__cryptoDashboardDb;
  }
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeDb(nextDb) {
  if (isVercel) {
    globalThis.__cryptoDashboardDb = JSON.parse(JSON.stringify(nextDb));
    return;
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(nextDb, null, 2));
}
