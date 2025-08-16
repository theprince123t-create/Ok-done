async function loadScore() {
  try {
    let response = await fetch("/api/score");
    if (!response.ok) throw new Error("Network response was not ok");

    let data = await response.json();

    // 👇 ye part data ka structure dekh kar adjust karna padega
    // Example ke liye main team name aur score dikha raha hoon
    let team1 = data?.matchHeader?.team1?.teamSName || "Team A";
    let team2 = data?.matchHeader?.team2?.teamSName || "Team B";
    let score = data?.status || "No score available";

    document.getElementById("score").innerHTML = `
      <h2>${team1} vs ${team2}</h2>
      <p>${score}</p>
    `;
  } catch (err) {
    console.error(err);
    document.getElementById("score").innerHTML = "<p class='error'>Error loading score</p>";
  }
}

// refresh har 15s me
loadScore();
setInterval(loadScore, 15000);
