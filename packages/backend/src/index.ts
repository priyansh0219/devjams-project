import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

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
