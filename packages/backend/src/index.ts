import express from "express";
import apiRouter from "./api/api-router";
import cors from "cors";

const app = express();
const port = Number(process.env.PORT) || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5000"

app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
// Respond to preflight requests quickly
app.options("*", cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.set("trust proxy", true);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", apiRouter);

app.get("/", (_req, res) => {
  res.send("Hello from Club Expense Tracker backend!");
});

// ================================= KEEP LAST =================================
// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`);
});
