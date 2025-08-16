const qs = new URLSearchParams(location.search);
const matchId = qs.get("id") || "18754689";
const matchSlug = qs.get("slug") || "jaajssi-vs-jeejej";

// DOM refs
const teamALogo = document.getElementById("teamALogo");
const teamAName = document.getElementById("teamAName");
const scoreEl   = document.getElementById("score");
const oversEl   = document.getElementById("overs");
const rrEl      = document.getElementById("rr");
const ballsEl   = document.getElementById("balls");
const bat1El    = document.getElementById("bat1");
const bat2El    = document.getElementById("bat2");
const bowlerEl  = document.getElementById("bowler");
const groundEl  = document.getElementById("ground");

async function fetchScore() {
  const url = `/api/score?id=${encodeURIComponent(matchId)}&slug=${encodeURIComponent(matchSlug)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data;
}

function parseMini(data) {
  // path: pageProps.miniScorecard.data
  const mini = data?.pageProps?.miniScorecard?.data || {};
  return mini;
}

function setTeamScore(mini) {
  const teamA = mini.team_a || {};
  const innings = Array.isArray(teamA.innings) ? teamA.innings[0] : null;

  teamALogo.src = teamA.logo || "";
  teamALogo.alt = teamA.name || "Team";
  teamAName.textContent = teamA.name || "Team";

  // Score
  const summary = teamA.summary || ""; // e.g. "17/0"
  scoreEl.textContent = summary || "0/0";

  // Overs text
  // Try innings.summary.over => "(1.3 Ov)" else fallback from recent_over
  let overTxt = (innings?.summary?.over) || "";
  if (!overTxt) {
    // fallback
    overTxt = `(${innings?.overs_played || "0"} Ov)`;
  }
  oversEl.textContent = overTxt;

  // CRR
  const crr = mini?.last5_over?.runrate || "0.00";
  rrEl.textContent = `CRR ${crr}`;

  // Ground
  groundEl.textContent = `${mini.ground_name || ""}, ${mini.city_name || ""}`.trim();
}

function setPlayers(mini) {
  const sb = mini?.batsmen?.sb;
  const nsb = mini?.batsmen?.nsb;
  const bow = mini?.bowlers?.sb;

  if (sb) bat1El.innerHTML = `<b>${sb.name}</b> ${sb.runs} (${sb.balls})`;
  if (nsb) bat2El.innerHTML = `<b>${nsb.name}</b> ${nsb.runs} (${nsb.balls})`;

  if (bow) {
    // overs, runs, wickets -> like 0.3-0-4-0 is not directly provided. We’ll format minimal.
    const ov = (bow.overs ?? 0);
    const r  = (bow.runs ?? 0);
    const w  = (bow.wickets ?? 0);
    bowlerEl.innerHTML = `Bowler: <b>${bow.name}</b> ${ov} ov • ${r}-${w}`;
  }
}

/**
 * Make last 6 balls list from commentary_with_over_summary
 * Rule:
 *  - 4 => yellow
 *  - 6 => green
 *  - wicket (is_out==1) => red (W)
 *  - otherwise white (show run or • for 0)
 */
function setBalls(mini) {
  ballsEl.innerHTML = "";

  // commentary_with_over_summary[0] has current over balls (no summary object), [1] has previous over summary and balls
  const cws = mini?.commentary_with_over_summary || [];

  let events = [];

  // Current over balls (first block): newest entries are earlier in array, we’ll read in natural order
  if (cws[0]?.match_over_balls) {
    for (const b of cws[0].match_over_balls) {
      events.push(ballToEvent(b));
    }
  }

  // Previous over (second block) has "over_balls" string like "2 3 0 0 6 2 "
  if (cws[1]?.match_over_summary?.over_balls) {
    const prevStr = cws[1].match_over_summary.over_balls.trim(); // "2 3 0 0 6 2"
    const toks = prevStr.split(/\s+/);
    for (const t of toks) {
      // Map simple tokens
      if (t.toUpperCase() === "W") events.push({ type:"W", label:"W" });
      else if (/^\d+$/.test(t))    events.push({ type:t, label:t === "0" ? "•" : t });
      // ignore pipes or junk
    }
  }

  // Keep last 6 (most recent last). cws[0] is current over last 3 balls in your sample.
  // We want latest on the RIGHT, so we’ll take from start->end and slice(-6)
  const lastSix = events.slice(-6);

  for (const ev of lastSix) {
    const div = document.createElement("div");
    div.className = "ball " + colorClass(ev);
    div.textContent = ev.label;
    ballsEl.appendChild(div);
  }
}

function ballToEvent(b) {
  // b.run (number), b.is_out (0/1)
  if (b?.is_out === 1) return { type:"W", label:"W" };
  const run = Number(b?.run ?? 0);
  if (run === 0) return { type:"0", label:"•" };
  return { type:String(run), label:String(run) };
}

function colorClass(ev) {
  if (ev.type === "W") return "red";
  if (ev.type === "6") return "green";
  if (ev.type === "4") return "yellow";
  return ""; // white default
}

async function render() {
  try {
    const data = await fetchScore();
    const mini = parseMini(data);
    setTeamScore(mini);
    setPlayers(mini);
    setBalls(mini);
  } catch (e) {
    console.error(e);
  }
}

// First load + poll
render();
setInterval(render, 4000);
