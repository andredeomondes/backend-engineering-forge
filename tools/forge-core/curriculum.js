import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import {
  DSA_UNITS_PATH,
  JAVASCRIPT_UNITS_PATH,
  NODE_UNITS_PATH,
  PROJECTS_PATH,
  ROADMAP_PATH,
  SQL_UNITS_PATH,
  TYPESCRIPT_UNITS_PATH,
} from "./paths.js";

const TRACK_CONFIG = {
  javascript: { prefix: "js", phase: 1, extension: "js" },
  typescript: { prefix: "ts", phase: 2, extension: "ts" },
  node: { prefix: "node", phase: 3, extension: "ts" },
  sql: { prefix: "sql", phase: 4, extension: "sql" },
  dsa: { prefix: "dsa", phase: 12, extension: "js" },
};

function titleFromMarkdown(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

const SIGNATURE_KEYWORDS =
  /^(?:(?:export|default|abstract|class|interface|type|const|enum|function)\s+)+/;

// "class ValidationError extends Error" -> "ValidationError", "identity<T>(x)" -> "identity"
function missionId(name) {
  const stripped = name.trim().replace(SIGNATURE_KEYWORDS, "");
  return stripped.match(/^[A-Za-z_$][\w$]*/)?.[0] ?? name.trim();
}

function extractExercises(markdown) {
  const headings = [...markdown.matchAll(/^## (.+)$/gm)].map((match) => ({
    position: match.index,
    group: match[1].replace(/\s*\(\d+\)\s*$/, "").trim(),
  }));
  return [
    ...markdown.matchAll(
      /^\d+\.\s+\*\*`([^`]+)`\*\*([^\n]*(?:\n(?!\s*\n|\d+\.\s)[^\n]*)*)/gm,
    ),
  ].map((match, index) => {
    const heading = headings.filter((item) => item.position < match.index).at(-1);
    const summary = match[2]
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[—–-]\s*/, "");
    return {
      index: index + 1,
      id: missionId(match[1]),
      name: match[1],
      group: heading?.group || "",
      summary: summary || match[1],
    };
  });
}

export function mergeMissions(exercises, missions, filePath) {
  if (!missions) return exercises.map((exercise) => ({ ...exercise, detail: null }));
  const ids = new Set(exercises.map((exercise) => exercise.id));
  for (const key of Object.keys(missions)) {
    if (!ids.has(key)) {
      throw new Error(`${filePath}: a chave "${key}" não corresponde a nenhum exercício`);
    }
  }
  return exercises.map((exercise) => ({
    ...exercise,
    detail: missions[exercise.id] ?? null,
  }));
}

function readMissions(directory) {
  const missionsPath = path.join(directory, "missions.json");
  if (!existsSync(missionsPath)) return { missions: null, missionsPath };
  try {
    const missions = JSON.parse(readFileSync(missionsPath, "utf8"));
    if (!missions || typeof missions !== "object" || Array.isArray(missions)) {
      throw new Error("o conteúdo deve ser um objeto { idDoExercício: detalhe }");
    }
    return { missions, missionsPath };
  } catch (error) {
    throw new Error(`${missionsPath}: missions.json inválido (${error.message})`, {
      cause: error,
    });
  }
}

function parseHints(markdown) {
  return markdown
    .split(/^## Nível /m)
    .slice(1)
    .map((section) => {
      const newline = section.indexOf("\n");
      const heading = section.slice(0, newline).trim();
      return {
        level: Number(heading.match(/^([1-3])/)?.[1]),
        title: heading.replace(/^\d+\s*[—-]?\s*/, ""),
        content: section.slice(newline + 1).trim(),
      };
    })
    .filter((hint) => hint.level);
}

function extractSqlExercises(sql) {
  return [
    ...sql.matchAll(
      /^-- TODO(?:\s+\d+|\s+Migration\s+\d+|\s+Seed|\s+Paginação|:)?\s*:?\s*(.*)$/gim,
    ),
  ].map((match, index) => ({
    index: index + 1,
    id: `sql-ex-${index + 1}`,
    name: match[1].trim() || `Exercício ${index + 1}`,
    group: "Exercícios",
    summary: match[1].trim() || `Exercício ${index + 1}`,
  }));
}

function readUnit(root, directoryName, track) {
  const directory = path.join(root, directoryName);
  const readmePath = path.join(directory, "README.md");
  if (!existsSync(readmePath)) return null;

  const raw = readFileSync(readmePath, "utf8");
  const parsed = matter(raw);
  const numberMatch = directoryName.match(/(?:unit|session)-(\d+)/);
  const number = Number(numberMatch?.[1] || 0);
  const { prefix, phase, extension } = TRACK_CONFIG[track];
  const hintsPath = path.join(directory, "hints.md");
  const hintsRaw = existsSync(hintsPath) ? readFileSync(hintsPath, "utf8") : "";
  const exercisePath = path.join(
    directory,
    track === "sql" ? "exercises.sql" : `exercises.${extension}`,
  );
  const exerciseRaw = existsSync(exercisePath) ? readFileSync(exercisePath, "utf8") : "";
  const { missions, missionsPath } = readMissions(directory);
  const baseExercises =
    track === "sql" ? extractSqlExercises(exerciseRaw) : extractExercises(parsed.content);

  return {
    id: parsed.data.id || `${prefix}-${String(number).padStart(2, "0")}`,
    track,
    phase,
    number,
    slug: directoryName,
    title: parsed.data.title || titleFromMarkdown(parsed.content, directoryName),
    estimatedHours: Number(parsed.data.estimatedHours || 4),
    prerequisites: parsed.data.prerequisites || [],
    directory,
    readmePath,
    testPath: path.join(
      directory,
      track === "sql" ? "checks.sql" : `exercises.test.${extension}`,
    ),
    exercisePath,
    markdown: parsed.content,
    exercises: mergeMissions(baseExercises, missions, missionsPath),
    missionTestable: track !== "sql",
    hints: parseHints(hintsRaw),
  };
}

function scanRoot(root, track) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readUnit(root, entry.name, track))
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
}

export function listUnits() {
  return [
    ...scanRoot(JAVASCRIPT_UNITS_PATH, "javascript"),
    ...scanRoot(TYPESCRIPT_UNITS_PATH, "typescript"),
    ...scanRoot(NODE_UNITS_PATH, "node"),
    ...scanRoot(SQL_UNITS_PATH, "sql"),
    ...scanRoot(DSA_UNITS_PATH, "dsa"),
  ];
}

export function getUnit(unitId) {
  return listUnits().find((unit) => unit.id === unitId) || null;
}

export function listProjects() {
  if (!existsSync(PROJECTS_PATH)) return [];
  return readdirSync(PROJECTS_PATH, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(path.join(PROJECTS_PATH, entry.name, "README.md")),
    )
    .map((entry) => {
      const raw = readFileSync(path.join(PROJECTS_PATH, entry.name, "README.md"), "utf8");
      const parsed = matter(raw);
      return {
        id: parsed.data.id || entry.name,
        title: parsed.data.title || titleFromMarkdown(parsed.content, entry.name),
        unlockAfter: parsed.data.unlockAfter || null,
        status: parsed.data.status || "planned",
        markdown: parsed.content,
      };
    });
}

export function listPhases() {
  const markdown = readFileSync(ROADMAP_PATH, "utf8");
  return [
    ...markdown.matchAll(/^\|\s*(\d{1,2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm),
  ].map((match) => {
    const label = match[3].trim();
    return {
      number: Number(match[1]),
      title: match[2].trim(),
      label,
      status: "available",
    };
  });
}

export function listPolyglotTracks() {
  return [
    {
      id: "java",
      title: "Java + Spring",
      modules: "JAVA-01–JAVA-09",
      status: "available",
    },
    {
      id: "dotnet",
      title: "C# + .NET",
      modules: "DOTNET-01–DOTNET-09",
      status: "available",
    },
    { id: "go", title: "Go para backend", modules: "GO-01–GO-09", status: "available" },
  ];
}
