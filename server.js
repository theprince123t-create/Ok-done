const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/score", async (req, res) => {
  try {
    const raw = await fetch("https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json");
    const data = await raw.json();
    res.json(data.pageProps.miniScorecard.data);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
