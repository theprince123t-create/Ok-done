import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// CricHeroes ka live JSON API URL
const API_URL = "https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json";

// Static files (index.html, script.js etc)
app.use(express.static("public"));

// API route jo frontend ke liye proxy karega
app.get("/api/score", async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
