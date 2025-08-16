const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/score/:matchId/:slug", async (req, res) => {
  const { matchId, slug } = req.params;
  const url = `https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/${matchId}/individual/${slug}/live.json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // miniScoreCard nikalo
    const mini = data?.pageProps?.data?.scorecard?.miniScoreCard;
    if (!mini) {
      return res.json({ error: "Score not found" });
    }

    res.json({
      teamA: mini.teamAName,
      teamB: mini.teamBName,
      score: mini.score,
      overs: mini.over,
      crr: mini.crr,
      rr: mini.rr,
      result: mini.result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(10000, () => console.log("Server running on port 10000"));
