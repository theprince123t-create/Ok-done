async function loadScore() {
  try {
    const res = await fetch("/api/score");
    if (!res.ok) throw new Error("Network Error");
    const data = await res.json();

    const sb = data.batsmen.sb;
    const nsb = data.batsmen.nsb;
    const bow = data.bowlers.sb;

    document.getElementById("batsmen").innerText =
      `${sb.name} ${sb.runs}(${sb.balls}) & ${nsb.name} ${nsb.runs}(${nsb.balls})`;

    document.getElementById("score").innerText = data.team_a.summary;

    document.getElementById("crr").innerText = `CRR ${data.last5_over.runrate}`;

    document.getElementById("bowler").innerText =
      `${bow.name} ${bow.overs}ov • ${bow.runs}/${bow.wickets}`;
  } catch (err) {
    console.error(err);
    document.getElementById("score").innerText = "Error loading score";
  }
}

loadScore();
setInterval(loadScore, 10000);
