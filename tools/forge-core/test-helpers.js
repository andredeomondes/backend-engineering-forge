import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";

// Points forge-core at a throwaway database. Call before any dynamic import()
// of database.js or services.js, since the module caches its connection.
export function useTempDatabase() {
  const dir = mkdtempSync(path.join(os.tmpdir(), "forge-test-"));
  const dbPath = path.join(dir, "forge.db");
  process.env.FORGE_DB_PATH = dbPath;
  return dbPath;
}
