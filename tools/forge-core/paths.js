import path from "node:path";
import { fileURLToPath } from "node:url";

export const WORKSPACE_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

export const FORGE_DATA_DIR = path.join(WORKSPACE_ROOT, ".forge");
export const DATABASE_PATH = path.join(FORGE_DATA_DIR, "forge.db");
export const LEGACY_STATE_PATH = path.join(WORKSPACE_ROOT, "tools", "forge-cli", "state.json");
export const STUDY_LOG_PATH = path.join(WORKSPACE_ROOT, "STUDY_LOG.md");
export const ROADMAP_PATH = path.join(WORKSPACE_ROOT, "ROADMAP.md");
export const JAVASCRIPT_UNITS_PATH = path.join(
  WORKSPACE_ROOT,
  "exercises",
  "01-javascript-core",
);
export const TYPESCRIPT_UNITS_PATH = path.join(WORKSPACE_ROOT, "exercises", "02-typescript-core");
export const NODE_UNITS_PATH = path.join(WORKSPACE_ROOT, "exercises", "03-node-core");
export const DSA_UNITS_PATH = path.join(WORKSPACE_ROOT, "exercises", "12-dsa-algorithms");
export const SQL_UNITS_PATH = path.join(WORKSPACE_ROOT, "exercises", "04-sql-postgresql");
export const PROJECTS_PATH = path.join(WORKSPACE_ROOT, "projects");
