async function loadScore() {
  try {
    const res = await fetch("/api/score");
    const data = await res.json();

    // Example structure (replace according to real API response)
    const batsman1 = data.batsmen?.[0] || { name: "Batsman1", runs: 0, balls: 0 };
    const batsman2 = data.batsmen?.[1] || { name: "Batsman2", runs: 0, balls: 0 };
    const bowler = data.bowler || { name: "Bowler", overs: "0.0", runs: 0, wickets: 0 };
    const score = data.score || "0-0 (0)";

    document.getElementById("batsmen").innerText =
      `${batsman1.name} ${batsman1.runs}(${batsman1.balls}), ` +
      `${batsman2.name} ${batsman2.runs}(${batsman2.balls})`;

    document.getElementById("score").innerText = score;

    document.getElementById("bowler").innerText =
      `${bowler.name} ${bowler.overs} overs, ${bowler.runs} runs, ${bowler.wickets} wkts`;

  } catch (err) {
    console.error(err);
    document.getElementById("score").innerText = "Error loading score";
  }
}

loadScore();
setInterval(loadScore, 10000);
