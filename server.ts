/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import driveFolderHandler from "./api/drive-folder.ts";
import driveUploadHandler from "./api/drive-upload.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Endpoints de Google Drive
app.all("/api/drive-folder", (req, res) => {
  return driveFolderHandler(req, res);
});

app.all("/api/drive-upload", (req, res) => {
  return driveUploadHandler(req, res);
});

// En desarrollo se monta el middleware de Vite; en producción se sirve el bundle de dist
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`V.A.C. Creative Server running on http://localhost:${PORT}`);
  });
}

startServer();
