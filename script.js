// ============ DATA ============
// Same teams you already set up in the Wix version
const teams = [
  { name: "Brazil", code: "br", group: "Group A", status: "Eliminated" },
  { name: "Spain", code: "es", group: "Group A", status: "Quarterfinals" },
  { name: "South Korea", code: "kr", group: "Group B", status: "Eliminated" },
  { name: "Argentina", code: "ar", group: "Group B", status: "Quarterfinals" },
  { name: "France", code: "fr", group: "Group C", status: "Quarterfinals" },
  { name: "England", code: "gb-eng", group: "Group C", status: "Quarterfinals" },
  { name: "Portugal", code: "pt", group: "Group D", status: "Eliminated" },
  { name: "Germany", code: "de", group: "Group D", status: "Eliminated" },
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
        <span class="team-card__status status--${team.status.toLowerCase().replace(/\s/g, '-')}">${team.status}</span>
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
// ============ SCROLL FADE-IN ============
const revealTargets = document.querySelectorAll(".teams, .rankings, .headlines, .golden-boot, .about");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((section) => {
  section.classList.add("reveal");
  revealObserver.observe(section);
});
// ============ FAN POLL ============
const pollBox = document.getElementById("pollBox");
const POLL_KEY = "fifaHubPollVotes";

function getVotes() {
  const saved = localStorage.getItem(POLL_KEY);
  if (saved) return JSON.parse(saved);
  // Start every team at 0 votes
  const initial = {};
  teams.forEach((team) => (initial[team.name] = 0));
  return initial;
}

function saveVotes(votes) {
  localStorage.setItem(POLL_KEY, JSON.stringify(votes));
}

function renderPoll() {
  const votes = getVotes();
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const buttonsHTML = teams
    .map((team) => `<button class="poll-btn" data-team="${team.name}">${team.name}</button>`)
    .join("");

  const resultsHTML = teams
    .map((team) => {
      const count = votes[team.name] || 0;
      const percent = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
      return `
        <div class="poll-result">
          <div class="poll-result__label">
            <span>${team.name}</span>
            <span>${count} vote${count === 1 ? "" : "s"} (${percent}%)</span>
          </div>
          <div class="poll-result__bar">
            <div class="poll-result__fill" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    })
    .join("");

  pollBox.innerHTML = `
    <div class="poll-buttons">${buttonsHTML}</div>
    ${resultsHTML}
  `;

  // Attach click handlers to the freshly rendered buttons
  document.querySelectorAll(".poll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const votes = getVotes();
      votes[btn.dataset.team] += 1;
      saveVotes(votes);
      renderPoll(); // re-render with updated counts
    });
  });
}

renderPoll();