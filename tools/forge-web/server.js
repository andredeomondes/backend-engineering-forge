import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  addStudySession,
  exportData,
  exportSessionsCsv,
  finishReview,
  getDashboard,
  getReviews,
  getUnitDetail,
  reflectOnUnit,
  revealUnitHint,
  setCurrentUnit,
  testUnit,
} from "../forge-core/services.js";
import { getDatabase } from "../forge-core/database.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.join(currentDirectory, "src");
const distRoot = path.join(currentDirectory, "dist");
const port = Number(process.env.FORGE_PORT || 4310);
const isProduction = process.argv.includes("--production");
const app = express();

getDatabase();
app.disable("x-powered-by");
app.use(express.json({ limit: "256kb" }));

function api(handler) {
  return async (request, response, next) => {
    try {
      const result = await handler(request, response);
      if (!response.headersSent) response.json(result);
    } catch (error) {
      next(error);
    }
  };
}

app.get("/api/dashboard", api(() => getDashboard()));
app.get("/api/units/:unitId", api((request) => getUnitDetail(request.params.unitId)));
app.post("/api/focus", api((request) => setCurrentUnit(request.body.unitId)));
app.post("/api/study-sessions", api((request) => addStudySession(request.body)));
app.post(
  "/api/units/:unitId/hints/:level",
  api((request) => revealUnitHint(request.params.unitId, request.params.level)),
);
app.post("/api/units/:unitId/tests", api((request) => testUnit(request.params.unitId)));
app.post(
  "/api/units/:unitId/reflection",
  api((request) =>
    reflectOnUnit(request.params.unitId, request.body.reflection, request.body.confidence),
  ),
);
app.get("/api/reviews", api(() => getReviews()));
app.post(
  "/api/reviews/:reviewId/complete",
  api((request) => finishReview(request.params.reviewId, request.body.confidence)),
);
app.get("/api/export/json", (_request, response) => {
  response.attachment(`forge-backup-${new Date().toISOString().slice(0, 10)}.json`);
  response.json(exportData());
});
app.get("/api/export/csv", (_request, response) => {
  response.attachment(`forge-sessoes-${new Date().toISOString().slice(0, 10)}.csv`);
  response.type("text/csv").send(exportSessionsCsv());
});

app.use("/api", (error, _request, response, _next) => {
  console.error(error);
  response.status(400).json({ error: error.message || "Não foi possível concluir a operação." });
});

if (isProduction) {
  if (!existsSync(distRoot)) throw new Error("Execute npm run build:web antes do modo de produção.");
  app.use(express.static(distRoot));
  app.use((_request, response) => response.sendFile(path.join(distRoot, "index.html")));
} else {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root: clientRoot,
    appType: "spa",
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
}

app.listen(port, "127.0.0.1", () => {
  console.log(`Forge Web disponível em http://127.0.0.1:${port}`);
});
