async function loadOverlay() {
  try {
    const res = await fetch("/api/overlay");
    const data = await res.json();

    // Batsmen
    if (data.batsmen[0]) {
      document.getElementById("batsman1").textContent =
        `${data.batsmen[0].name} ${data.batsmen[0].runs} (${data.batsmen[0].balls})`;
    }
    if (data.batsmen[1]) {
      document.getElementById("batsman2").textContent =
        `${data.batsmen[1].name} ${data.batsmen[1].runs} (${data.batsmen[1].balls})`;
    }

    // Team Score
    document.getElementById("teamScore").textContent =
      `${data.teams.batting.name} ${data.teams.batting.runs}-${data.teams.batting.wickets} (${data.teams.batting.overs} ov) | CRR: ${data.teams.batting.rr}`;

    // Bowler
    if (data.bowler) {
      document.getElementById("bowler").textContent =
        `${data.bowler.name} ${data.bowler.runs}-${data.bowler.wickets} (${data.bowler.overs})`;
    }
  } catch (e) {
    console.error("Error fetching overlay:", e);
    document.getElementById("teamScore").textContent = "Error loading score";
  }
}

// Auto refresh every 5 sec
setInterval(loadOverlay, 5000);
loadOverlay();
