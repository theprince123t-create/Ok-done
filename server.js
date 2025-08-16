const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors()); // ✅ CORS allow

// Serve static frontend files (index.html, script.js etc.)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
app.get("/api/score", async (req, res) => {
  try {
    // 👇 yaha tum apna match id change kar sakte ho
    let response = await fetch("https://cricheroes.in/api/v1/match/18754689");
    let data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch score" });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
