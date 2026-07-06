// ============ DATA ============
// Same teams you already set up in the Wix version
const teams = [
  { name: "Brazil", code: "br", group: "Group A" },
  { name: "Spain", code: "es", group: "Group A" },
  { name: "South Korea", code: "kr", group: "Group B" },
  { name: "Argentina", code: "ar", group: "Group B" },
];

// Current FIFA world ranking order (men's, as of the June 2026 update)
const rankings = [
  "Argentina",
  "Spain",
  "France",
  "England",
  "Portugal",
  "Brazil",
];

// ============ RENDER TEAM CARDS ============
const teamGrid = document.getElementById("teamGrid");

function renderTeams(list) {
  teamGrid.innerHTML = ""; // clear existing cards before re-rendering

  if (list.length === 0) {
    teamGrid.innerHTML = `<p style="color: var(--gray);">No teams match your search.</p>`;
    return;
  }

  list.forEach((team) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <img class="team-card__flag" src="https://flagcdn.com/w320/${team.code}.png" alt="${team.name} flag">
      <div class="team-card__body">
        <div class="team-card__name">${team.name}</div>
        <span class="team-card__group">${team.group}</span>
      </div>
    `;
    teamGrid.appendChild(card);
  });
}

renderTeams(teams); // initial render on page load

// ============ SEARCH / FILTER FEATURE ============
const searchInput = document.getElementById("teamSearch");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = teams.filter((team) =>
    team.name.toLowerCase().includes(query)
  );
  renderTeams(filtered);
});

// ============ RENDER RANKINGS ============
const rankingsList = document.getElementById("rankingsList");

rankings.forEach((teamName, index) => {
  const row = document.createElement("li");
  row.className = "rank-row";
  row.innerHTML = `
    <span class="rank-row__number">${index + 1}</span>
    <span class="rank-row__name">${teamName}</span>
  `;
  rankingsList.appendChild(row);
});