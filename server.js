import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Proxy API route
app.get("/api/overlay", async (req, res) => {
  try {
    // Yaha tumhara API URL (jo JSON diya hai uska actual live endpoint)
    const apiUrl = "https://your-json-source.com/match.json";

    const response = await fetch(apiUrl);
    const data = await response.json();

    // Sirf overlay ke liye compact data bhejna
    const overlayData = {
      match_id: data.match_id,
      status: data.status,
      overs_limit: data.overs,
      teams: {
        batting: {
          name: data.teams.team_a.name,
          score: data.teams.team_a.score,
          runs: data.teams.team_a.innings.runs,
          wickets: data.teams.team_a.innings.wickets,
          overs: data.teams.team_a.innings.overs,
          rr: data.teams.team_a.innings.rr
        },
        bowling: {
          name: data.teams.team_b.name,
          score: data.teams.team_b.score
        }
      },
      batsmen: data.batsmen,
      bowler: data.bowlers[0] || {}
    };

    res.json(overlayData);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to fetch overlay data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
