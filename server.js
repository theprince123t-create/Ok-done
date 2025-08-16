const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Example API call (replace with real CricHeroes API link)
app.get("/api/score", async (req, res) => {
  try {
    const raw = await fetch("https://example.com/score.json"); 
    const data = await raw.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching score:", err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
