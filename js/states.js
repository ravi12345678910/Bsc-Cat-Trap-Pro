// Load stats from localStorage
function loadStats() {
    // Best score
    const bestScore = localStorage.getItem('catTrapHighScore') || 0;
    const bestScoreEl = document.getElementById('bestScore');
    if (bestScoreEl) bestScoreEl.textContent = bestScore;

    // Games played
    const gamesPlayed = localStorage.getItem('catTrapGamesPlayed') || 0;
    const gamesPlayedEl = document.getElementById('gamesPlayed');
    if (gamesPlayedEl) gamesPlayedEl.textContent = gamesPlayed;

    // Total stars
    const totalStars = localStorage.getItem('catTrapTotalStars') || 0;
    const totalStarsEl = document.getElementById('totalStars');
    if (totalStarsEl) totalStarsEl.textContent = totalStars;

    // Load leaderboard
    loadLeaderboard();
}

// Load leaderboard
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('catTrapLeaderboard')) || [];

    for (let i = 0; i < 5; i++) {
        const scoreEl = document.getElementById(`score${i + 1}`);
        const dateEl = document.getElementById(`date${i + 1}`);

        if (leaderboard[i]) {
            if (scoreEl) scoreEl.textContent = leaderboard[i].score;
            if (dateEl) dateEl.textContent = leaderboard[i].date;
        } else {
            if (scoreEl) scoreEl.textContent = '-';
            if (dateEl) dateEl.textContent = '-';
        }
    }
}

// Initialize
window.addEventListener('load', loadStats);