const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Static files
app.use(express.static("public"));

// Simple no-cache (live feel)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Score API: /api/score?id=...&slug=...
app.get("/api/score", async (req, res) => {
  try {
    const { id, slug } = req.query;

    // Defaults (optional): agar query na ho to aapka sample match chale
    const matchId = id || "18754689";
    const matchSlug = slug || "jaajssi-vs-jeejej";

    const url = `https://cricheroes.com/_next/data/GWn-9wsDkpg5k-2hvyhaR/scorecard/${matchId}/individual/${matchSlug}/live.json`;

    const response = await fetch(url, {
      headers: {
        // kuch hosts referer/user-agent par strict hote hain
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// Fallback: SPA style
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
