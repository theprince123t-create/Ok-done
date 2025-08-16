const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

// CricHeroes JSON URL
const API_URL = "https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json";

// Root route
app.get("/", (req, res) => {
  res.send("✅ Live Cricket Score API is running! Go to /api/score");
});

// Score API
app.get("/api/score", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ notFound: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
