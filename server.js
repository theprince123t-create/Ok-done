const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));

app.get("/api/score", async (req, res) => {
  try {
    const url = "https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/18754689/individual/jaajssi-vs-jeejej/live.json";
    const response = await fetch(url);
    const data = await response.json();

    // Safe check
    const score = data?.pageProps?.data?.match?.miniScorecard;

    if (!score) {
      return res.json({ error: "No live score available right now" });
    }

    res.json({
      batting: score.batsmen,
      bowling: score.bowlers,
      runs: score.totalRuns,
      wickets: score.totalWickets,
      overs: score.totalOvers
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
