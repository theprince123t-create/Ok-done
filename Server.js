import express from "express";
import axios from "axios";
import cheerio from "cheerio";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const MATCH_ID = process.env.MATCH_ID || "18717888";

app.use(cors());
app.use(express.static("public"));

/**
 * Fetch html from multiple candidate URLs (site mirrors).
 */
async function fetchScorecardHtml(id) {
  const urls = [
    `https://cricheroes.in/scorecard/${id}/live`,
    `https://cricheroes.com/scorecard/${id}/live`,
    `https://cricheroes.in/live-video-scorecard-customize/${id}`
  ];
  for (const url of urls) {
    try {
      const res = await axios.get(url, {
        headers: {
          // Pretend to be a browser
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        },
        timeout: 12000
      });
      if (res.status === 200 && res.data) return res.data;
    } catch (_) {
      // try next
    }
  }
  throw new Error("Unable to fetch CricHeroes HTML");
}

/**
 * Heuristic parser: extracts score, batsmen, bowler, recent balls.
 * Works across small HTML changes by relying on regex/text.
 */
function parseFromHtml(html) {
  const $ = cheerio.load(html);
  const text = $("body").text().replace(/\s+/g, " ").trim();

  // Score like: 45/2 (6.3) OR 45-2 (6.3)
  let score = "";
  const m1 = text.match(/(\d+)\s*[-/]\s*(\d+)\s*\((\d+\.\d)\)/);
  if (m1) score = `${m1[1]}-${m1[2]} (${m1[3]})`;

  // Current run rate (CRR or RR)
  let crr = "";
  const rr = text.match(/(?:CRR|RPO|RR)\s*[: ]\s*(\d+\.\d{1,2})/i);
  if (rr) crr = rr[1];

  // Batsmen "Name 12(9)" patterns; take first two unique
  const batsRaw = [...text.matchAll(/([A-Z][A-Za-z'.\-\s]{1,28})\s+(\d+)\s*\((\d+)\)/g)]
    .map(m => `${m[1].trim()} ${m[2]}(${m[3]})`);
  const batsmen = [...new Set(batsRaw)].slice(0, 2);

  // Bowler "Name 1-12 (2)"
  let bowler = "";
  const bw = text.match(/([A-Z][A-Za-z'.\-\s]{1,28})\s+(\d+)-(\d+)\s*\((\d+)\)/);
  if (bw) bowler = `${bw[1].trim()} ${bw[2]}-${bw[3]} (${bw[4]})`;

  // Recent balls: take stream of W . 0-6 and slice last 6
  const ballsStream = [...text.matchAll(/(?:W|\.|[0-6])/g)].map(x => x[0]);
  const balls = ballsStream.slice(-6);

  // Fallbacks
  return {
    score: score || "0-0 (0.0)",
    crr: crr || "0.00",
    batsman1: batsmen[0] || "Batter 1 0(0)",
    batsman2: batsmen[1] || "Batter 2 0(0)",
    bowler: bowler || "Bowler 0-0 (0)",
    balls: balls.length ? balls : [".", ".", ".", ".", ".", "."]
  };
}

let CACHE = { data: null, at: 0 };
const TTL = 2500; // 2.5s

app.get("/api/score", async (req, res) => {
  try {
    const now = Date.now();
    if (CACHE.data && now - CACHE.at < TTL) {
      return res.json(CACHE.data);
    }
    const html = await fetchScorecardHtml(MATCH_ID);
    const data = parseFromHtml(html);
    CACHE = { data, at: now };
    res.json(data);
  } catch (err) {
    console.error("Fetch/Parse error:", err.message);
    if (CACHE.data) return res.json(CACHE.data); // stale ok
    res.status(500).json({ error: "Unable to fetch score right now." });
  }
});

app.listen(PORT, () => {
  console.log(`Overlay server on :${PORT}  •  MATCH_ID=${MATCH_ID}`);
});
