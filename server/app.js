import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../client");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(clientPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.get("/map", (req, res) => {
  res.sendFile(path.join(clientPath, "map.html"));
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
