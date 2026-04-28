// ─────────────────────────────────────────────────────────────
// 1. GAME CONFIGURATION
// ─────────────────────────────────────────────────────────────
const GAME_CONFIG = {
    totalLevels: 10,
    levelRequirements: {
        1: { star1: 5, star2: 8, star3: 12, speed: 1000 },
        2: { star1: 7, star2: 11, star3: 16, speed: 900 },
        3: { star1: 9, star2: 14, star3: 20, speed: 800 },
        4: { star1: 11, star2: 17, star3: 24, speed: 700 },
        5: { star1: 13, star2: 20, star3: 28, speed: 600 },
        6: { star1: 15, star2: 23, star3: 32, speed: 500 },
        7: { star1: 17, star2: 26, star3: 36, speed: 400 },
        8: { star1: 19, star2: 29, star3: 40, speed: 300 },
        9: { star1: 21, star2: 32, star3: 44, speed: 200 },
        10: { star1: 23, star2: 35, star3: 48, speed: 150 }
    }
};

const SPEED_LABELS = {
    1000: '🐢 Very Slow',
    900: '🐕 Slow',
    800: '🚶 Moderate',
    700: '🏃 Normal',
    600: '💨 Fast',
    500: '⚡ Very Fast',
    400: '🔥 Rapid',
    300: '🌩️ Lightning',
    200: '💫 Blazing',
    150: '🚀 MAX Speed!'
};

const TIPS = [
    '💡 Click rapidly to build your combo — 5× combo gives 5 points per click!',
    '🎯 Watch the cat carefully — it moves faster each level.',
    '🎪 Chase the cat into corners for an easy catch!',
    '⚠️ Combo resets when the cat moves. Stay sharp!',
    '🏆 Level 10 moves at 150ms — blink and you miss it.',
    '📊 The streak bar shows how close you are to the next star.',
    '🎨 Customise your cat colour in Settings for extra style.',
    '🏅 Check the Hall of Fame to see how your score stacks up.',
    '🎵 You can change background music in Settings!',
    '😴 Lazy cat moves slower, ⚡ Hyper cat moves faster!'
];

// ─────────────────────────────────────────────────────────────
// 2. DEFAULT SETTINGS (MUST MATCH settings.js)
// ─────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
    masterSound: true,
    clickSound: true,
    bgMusic: true,
    volume: 70,
    selectedSong: 'song1',
    catColor: '#FFA500',
    catSize: 4.0,
    catPersonality: 'normal',
    timerDuration: 30,
    timerWarning: true,
    warningTime: 10,
    warningColor: '#ff4444',
    difficulty: 'normal',
    startLevel: 1,
    showTimer: true,
    showScore: true,
    particleEffects: true
};

// ─────────────────────────────────────────────────────────────
// 3. MP3 BACKGROUND MUSIC SYSTEM
// ─────────────────────────────────────────────────────────────
const SONG_URLS = {
    song1: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    song2: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    song3: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    song4: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    song5: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
};

const SONG_NAMES = {
    song1: '🎵 Calm Piano',
    song2: '🎸 Acoustic Guitar',
    song3: '🎹 Lo-fi Beats',
    song4: '🎻 Orchestral',
    song5: '🎧 Electronic'
};

let backgroundMusic = null;
let isMusicPlaying = false;
let musicStarted = false;

function initMusic() {
    if (!ST.settings.bgMusic || !ST.settings.masterSound) return;
    const songUrl = SONG_URLS[ST.settings.selectedSong];
    if (!songUrl) return;
    backgroundMusic = new Audio(songUrl);
    backgroundMusic.loop = true;
    backgroundMusic.volume = ST.settings.volume / 100;
    document.addEventListener('click', startMusicOnInteraction, { once: true });
    document.addEventListener('keydown', startMusicOnInteraction, { once: true });
}

function startMusicOnInteraction() {
    if (!ST.settings.bgMusic || !ST.settings.masterSound || musicStarted) return;
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        musicStarted = true;
        isMusicPlaying = true;
        console.log('🎵 Music started:', SONG_NAMES[ST.settings.selectedSong]);
    }
}

function updateMusic() {
    if (!backgroundMusic) return;
    backgroundMusic.volume = ST.settings.volume / 100;
    if (!ST.settings.bgMusic || !ST.settings.masterSound) {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
        }
    } else {
        if (!isMusicPlaying && musicStarted) {
            backgroundMusic.play().catch(e => console.log('Music play failed:', e));
            isMusicPlaying = true;
        }
    }
}

function changeSong(songId) {
    if (!backgroundMusic) return;
    const wasPlaying = isMusicPlaying;
    const newUrl = SONG_URLS[songId];
    if (!newUrl) return;
    backgroundMusic.pause();
    backgroundMusic = new Audio(newUrl);
    backgroundMusic.loop = true;
    backgroundMusic.volume = ST.settings.volume / 100;
    if (wasPlaying && ST.settings.bgMusic && ST.settings.masterSound) {
        backgroundMusic.play().catch(e => console.log('Music play failed:', e));
        isMusicPlaying = true;
    }
}

// ─────────────────────────────────────────────────────────────
// 4. CAT CLICK SOUND SYSTEM
// ─────────────────────────────────────────────────────────────
let audioContext = null;
let audioInitialized = false;

function initAudioContext() {
    if (!audioInitialized && ST.settings.masterSound && ST.settings.clickSound) {
        try {
            audioContext = new(window.AudioContext || window.webkitAudioContext)();
            audioContext.resume();
            audioInitialized = true;
            console.log('✅ Click sound ready!');
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }
}

function playBeepSound(freq, dur, vol = 0.25) {
    if (!ST.settings.masterSound || !ST.settings.clickSound) return;
    try {
        if (!audioInitialized) {
            audioContext = new(window.AudioContext || window.webkitAudioContext)();
            audioInitialized = true;
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(e => {});
            return;
        }
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        const volume = (ST.settings.volume / 100) * vol;
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        oscillator.start();
        oscillator.stop(now + dur);
    } catch (e) {}
}

document.addEventListener('click', function initAudioOnFirstClick() {
    initAudioContext();
    document.removeEventListener('click', initAudioOnFirstClick);
}, { once: true });

// ─────────────────────────────────────────────────────────────
// 5. GAME STATE
// ─────────────────────────────────────────────────────────────
let ST = {
    level: 1,
    score: 0,
    timeLeft: 30,
    active: false,
    combo: 1,
    comboCount: 0,
    bestCombo: 0,
    sessionClicks: 0,
    sessionMisses: 0,
    settings: {...DEFAULT_SETTINGS }
};

let catInterval = null;
let timerInterval = null;
let tipInterval = null;
let tipIdx = 0;

// ─────────────────────────────────────────────────────────────
// 6. DOM ELEMENTS
// ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const cat = $('cat');
const gameArea = $('gameArea');
// FIXED: Use levelNum instead of levelDisplay (matches game.html)
const levelNum = $('levelNum');
const scoreDisplay = $('scoreDisplay');
const timerDisplay = $('timerDisplay');
const starsDisplay = $('starsDisplay');
const timerRing = $('timerRing');
const comboPill = $('comboPill');
const comboVal = $('comboVal');
const comboCounter = $('comboCounter');
const comboBadgeNum = $('comboBadgeNum');
const req1El = $('req1');
const req2El = $('req2');
const req3El = $('req3');
const reqFill1 = $('reqFill1');
const reqFill2 = $('reqFill2');
const reqFill3 = $('reqFill3');
const currentLevelNum = $('currentLevelNum');
const levelBarFill = $('levelBarFill');
const startBtn = $('startBtn');
const restartBtn = $('restartBtn');
const speedBadge = $('speedBadge');
const hsBadge = $('hsBadge');
const arenaHint = $('arenaHint');
const overlayIdle = $('overlayIdle');
const overlayGameOver = $('overlayGameOver');
const overlayLevelUp = $('overlayLevelUp');
const overlayHS = $('overlayHS');
const goFinalScore = $('goFinalScore');
const goStars = $('goStars');
const goPlayAgain = $('goPlayAgain');
const hsPlayAgain = $('hsPlayAgain');
const hsFinalScore = $('hsFinalScore');
const luSub = $('luSub');
const luStars = $('luStars');
const luBarFill = $('luBarFill');
const streakFill = $('streakFill');
const streakPct = $('streakPct');
const tipText = $('tipText');
const sessionClicks = $('sessionClicks');
const sessionBestCombo = $('sessionBestCombo');
const sessionAccuracy = $('sessionAccuracy');
const burstContainer = $('burstContainer');

// ─────────────────────────────────────────────────────────────
// 7. INITIALIZATION
// ─────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    loadSettings();
    showOverlay('idle');
    refreshAllDisplays();
    rotateTip();
    tipInterval = setInterval(rotateTip, 7000);
    updateHS();
    initMusic();

    document.addEventListener('mousemove', e => {
        const g = $('cursorGlow');
        if (g) {
            g.style.left = e.clientX + 'px';
            g.style.top = e.clientY + 'px';
        }
    });

    setTimeout(() => {
        const s = $('loadingScreen');
        if (s) s.classList.add('hidden');
    }, 900);
});

// ─────────────────────────────────────────────────────────────
// 8. SETTINGS MANAGEMENT (STARTING LEVEL FIXED)
// ─────────────────────────────────────────────────────────────
function loadSettings() {
    const raw = localStorage.getItem('catTrapSettings');
    if (raw) {
        try {
            ST.settings = {...DEFAULT_SETTINGS, ...JSON.parse(raw) };
            console.log('✅ Settings loaded - Start Level:', ST.settings.startLevel);
            console.log('✅ Settings loaded - Personality:', ST.settings.catPersonality);
            console.log('✅ Settings loaded - Volume:', ST.settings.volume);
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    } else {
        const oldStartLevel = localStorage.getItem('catTrapStartLevel');
        if (oldStartLevel) {
            ST.settings.startLevel = parseInt(oldStartLevel);
            console.log('✅ Loaded start level from individual key:', ST.settings.startLevel);
        }
    }

    // ★★★ CRITICAL: Set the game level from settings ★★★
    ST.level = ST.settings.startLevel;
    ST.timeLeft = ST.settings.timerDuration;

    console.log('🎮 Game starting level set to:', ST.level);

    applyCatStyle();
    updateMusic();

    updateLevelUI();
    refreshAllDisplays();
}

// ─────────────────────────────────────────────────────────────
// 9. CAT PERSONALITY SYSTEM
// ─────────────────────────────────────────────────────────────
function applyCatStyle() {
    if (!cat) return;
    cat.style.color = ST.settings.catColor;
    cat.style.fontSize = ST.settings.catSize + 'rem';
    cat.style.filter = `drop-shadow(0 4px 14px ${ST.settings.catColor}55)`;

    const personality = ST.settings.catPersonality;
    switch (personality) {
        case 'lazy':
            cat.textContent = '😴🐱';
            cat.style.transform = 'rotate(3deg) scale(0.95)';
            cat.style.animation = 'none';
            break;
        case 'hyper':
            cat.textContent = '⚡🐱';
            cat.style.transform = 'scale(1)';
            cat.style.animation = 'catHyper 0.3s infinite';
            break;
        case 'shy':
            cat.textContent = '🙈🐱';
            cat.style.transform = 'scale(0.85)';
            cat.style.animation = 'none';
            break;
        default:
            cat.textContent = '🐱';
            cat.style.transform = 'scale(1)';
            cat.style.animation = '';
    }
}

function personalityMult() {
    const personality = ST.settings.catPersonality;
    if (personality === 'lazy') return 1.5;
    if (personality === 'hyper') return 0.6;
    if (personality === 'shy') return 1.2;
    return 1.0;
}

// ─────────────────────────────────────────────────────────────
// 10. UI OVERLAYS
// ─────────────────────────────────────────────────────────────
function showOverlay(type) {
    [overlayIdle, overlayGameOver, overlayLevelUp, overlayHS].forEach(el => {
        if (el) el.classList.add('hidden');
    });
    if (type === 'none' && gameArea) gameArea.classList.add('gp-arena--active');
    const map = { idle: overlayIdle, gameover: overlayGameOver, levelup: overlayLevelUp, hs: overlayHS };
    if (map[type] && type !== 'none') map[type].classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────
// 11. TIMER RING WITH WARNING COLOR
// ─────────────────────────────────────────────────────────────
function updateTimerRing() {
    if (!timerRing) return;
    const circ = 2 * Math.PI * 24;
    const pct = ST.timeLeft / ST.settings.timerDuration;
    timerRing.style.strokeDashoffset = circ * (1 - Math.max(0, Math.min(1, pct)));
    const warn = ST.settings.timerWarning && ST.timeLeft <= ST.settings.warningTime;
    const warningColor = ST.settings.warningColor || '#ff4444';
    const normalColor = 'var(--accent)';
    timerRing.style.stroke = warn ? warningColor : normalColor;
    timerRing.style.filter = warn ? `drop-shadow(0 0 3px ${warningColor})` : '';
    const numEl = document.querySelector('.gp-ring-num');
    if (numEl) numEl.style.color = warn ? warningColor : 'var(--text-1)';
    if (speedBadge) speedBadge.classList.toggle('danger', warn);
}

// ─────────────────────────────────────────────────────────────
// 12. STARS & SCORE SYSTEM
// ─────────────────────────────────────────────────────────────
function starsForScore(score, level) {
    const r = GAME_CONFIG.levelRequirements[level];
    if (score >= r.star3) return 3;
    if (score >= r.star2) return 2;
    if (score >= r.star1) return 1;
    return 0;
}

function starStr(n, f = '⭐', e = '☆') {
    return f.repeat(n) + e.repeat(3 - n);
}

function updateReqBars() {
    const r = GAME_CONFIG.levelRequirements[ST.level];
    const s = ST.score;
    const pct = (v) => Math.min(100, (s / v) * 100).toFixed(1) + '%';
    if (reqFill1) reqFill1.style.width = pct(r.star1);
    if (reqFill2) reqFill2.style.width = pct(r.star2);
    if (reqFill3) reqFill3.style.width = pct(r.star3);
}

function updateStreak() {
    const r = GAME_CONFIG.levelRequirements[ST.level];
    const cur = starsForScore(ST.score, ST.level);
    let pct = 0;
    if (cur === 0) pct = (ST.score / r.star1) * 100;
    else if (cur === 1) pct = ((ST.score - r.star1) / (r.star2 - r.star1)) * 100;
    else if (cur === 2) pct = ((ST.score - r.star2) / (r.star3 - r.star2)) * 100;
    else pct = 100;
    pct = Math.max(0, Math.min(100, pct));
    if (streakFill) streakFill.style.width = pct + '%';
    if (streakPct) streakPct.textContent = Math.round(pct) + '%';
}

function updateStarDisplay() {
    const earned = starsForScore(ST.score, ST.level);
    if (!starsDisplay) return;
    starsDisplay.querySelectorAll('.gp-star').forEach((el, i) => {
        if (i < earned) {
            el.textContent = '⭐';
            el.classList.add('earned');
        } else {
            el.textContent = '☆';
            el.classList.remove('earned');
        }
    });
}

function updateSessionStats() {
    if (sessionClicks) sessionClicks.textContent = ST.sessionClicks;
    if (sessionBestCombo) sessionBestCombo.textContent = ST.bestCombo;
    const total = ST.sessionClicks + ST.sessionMisses;
    const acc = total > 0 ? Math.round((ST.sessionClicks / total) * 100) + '%' : '—';
    if (sessionAccuracy) sessionAccuracy.textContent = acc;
}

// FIXED: updateLevelUI now works with both levelNum and currentLevelNum
function updateLevelUI() {
    if (levelBarFill) levelBarFill.style.width = ((ST.level - 1) / 9 * 100) + '%';

    // Update the main level display (levelNum from game.html)
    if (levelNum) levelNum.textContent = ST.level;

    // Update the requirements card level number
    if (currentLevelNum) currentLevelNum.textContent = ST.level;

    const r = GAME_CONFIG.levelRequirements[ST.level];
    if (req1El) req1El.textContent = r.star1;
    if (req2El) req2El.textContent = r.star2;
    if (req3El) req3El.textContent = r.star3;

    const spd = GAME_CONFIG.levelRequirements[ST.level].speed;
    if (speedBadge) speedBadge.textContent = 'Speed: ' + (SPEED_LABELS[spd] || spd + 'ms');
}

function updateHS() {
    const hs = localStorage.getItem('catTrapHighScore') || 0;
    if (hsBadge) hsBadge.textContent = hs;
}

function refreshAllDisplays() {
    if (scoreDisplay) scoreDisplay.textContent = ST.score;
    if (timerDisplay) timerDisplay.textContent = ST.timeLeft;
    if (comboVal) comboVal.textContent = 'x' + ST.combo;
    updateStarDisplay();
    updateTimerRing();
    updateReqBars();
    updateStreak();
    updateLevelUI();
    updateSessionStats();
}

// ─────────────────────────────────────────────────────────────
// 13. TIPS ROTATION
// ─────────────────────────────────────────────────────────────
function rotateTip() {
    tipIdx = (tipIdx + 1) % TIPS.length;
    if (tipText) {
        tipText.style.opacity = '0';
        setTimeout(() => {
            tipText.textContent = TIPS[tipIdx];
            tipText.style.opacity = '1';
        }, 200);
    }
}

// ─────────────────────────────────────────────────────────────
// 14. CAT MOVEMENT
// ─────────────────────────────────────────────────────────────
function moveCat() {
    if (!ST.active || !gameArea || !cat) return;
    const maxX = gameArea.clientWidth - cat.offsetWidth - 10;
    const maxY = gameArea.clientHeight - cat.offsetHeight - 10;
    if (maxX < 5 || maxY < 5) return;
    cat.style.left = (Math.random() * maxX + 5) + 'px';
    cat.style.top = (Math.random() * maxY + 5) + 'px';
    if (ST.active && ST.comboCount > 0) {
        ST.sessionMisses++;
        ST.comboCount = Math.max(0, ST.comboCount - 1);
        if (ST.comboCount === 0) {
            ST.combo = 1;
            refreshAllDisplays();
            if (comboCounter) comboCounter.classList.add('hidden');
        }
    }
}

// ─────────────────────────────────────────────────────────────
// 15. LEADERBOARD SYSTEM
// ─────────────────────────────────────────────────────────────
function saveScoreToLeaderboard(score, level) {
    let leaderboard = JSON.parse(localStorage.getItem('catTrapLeaderboard') || '[]');
    let playerName = localStorage.getItem('catTrapPlayerName');
    if (!playerName) {
        playerName = prompt('🎉 New Score! Enter your name for the leaderboard:', 'Cat Champion');
        if (playerName && playerName.trim() !== '') {
            localStorage.setItem('catTrapPlayerName', playerName);
        } else {
            playerName = 'Cat Champion';
        }
    }
    const newEntry = {
        name: playerName,
        score: score,
        level: level,
        date: new Date().toLocaleDateString()
    };
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 20) leaderboard = leaderboard.slice(0, 20);
    localStorage.setItem('catTrapLeaderboard', JSON.stringify(leaderboard));
    console.log('✅ Score saved to leaderboard:', newEntry);
}

// ─────────────────────────────────────────────────────────────
// 16. GAME FLOW (Start, Game Over, Level Up)
// ─────────────────────────────────────────────────────────────
function startGame() {
    ST.active = true;
    ST.score = 0;
    ST.timeLeft = ST.settings.timerDuration;
    ST.combo = 1;
    ST.comboCount = 0;
    ST.sessionClicks = 0;
    ST.sessionMisses = 0;
    ST.bestCombo = 0;
    showOverlay('none');
    if (arenaHint) arenaHint.textContent = 'Click the cat!';
    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Playing…';
    if (comboCounter) comboCounter.classList.add('hidden');
    const speed = GAME_CONFIG.levelRequirements[ST.level].speed * personalityMult();
    catInterval = setInterval(moveCat, speed);
    moveCat();
    timerInterval = setInterval(() => {
        if (!ST.active) return;
        ST.timeLeft--;
        refreshAllDisplays();
        if (ST.settings.timerWarning && ST.timeLeft === ST.settings.warningTime) {
            playBeepSound(380, 0.12);
        }
        if (ST.timeLeft <= 0) gameOver();
    }, 1000);
    refreshAllDisplays();
    notify('Game started! Click the cat! 🐱', 'success');
    playBeepSound(600, 0.08, 0.2);
}

function gameOver() {
    ST.active = false;
    clearInts();
    resetStartBtn();
    const earned = starsForScore(ST.score, ST.level);
    const hs = parseInt(localStorage.getItem('catTrapHighScore') || 0);
    const isHS = ST.score > hs;
    saveScoreToLeaderboard(ST.score, ST.level);
    if (isHS) {
        localStorage.setItem('catTrapHighScore', ST.score);
        if (hsFinalScore) hsFinalScore.textContent = ST.score;
        showOverlay('hs');
        triggerConfetti();
        notify(`🏆 New high score! ${ST.score} points!`, 'hs');
    } else {
        if (goFinalScore) goFinalScore.textContent = ST.score;
        if (goStars) goStars.textContent = starStr(earned);
        showOverlay('gameover');
        notify(`Game over! You scored ${ST.score} points.`, 'info');
    }
    const gamesPlayed = parseInt(localStorage.getItem('catTrapGamesPlayed') || 0) + 1;
    localStorage.setItem('catTrapGamesPlayed', gamesPlayed);
    const totalStars = parseInt(localStorage.getItem('catTrapTotalStars') || 0) + earned;
    localStorage.setItem('catTrapTotalStars', totalStars);
    updateHS();
}

function checkLevelUp() {
    const r = GAME_CONFIG.levelRequirements[ST.level];
    if (ST.score < r.star3 || ST.level >= GAME_CONFIG.totalLevels) return;
    clearInts();
    ST.active = false;
    const next = ST.level + 1;
    if (luSub) luSub.textContent = `Moving to Level ${next}`;
    if (luStars) luStars.textContent = starStr(3);
    showOverlay('levelup');
    if (luBarFill) {
        luBarFill.style.width = '0%';
        requestAnimationFrame(() => { luBarFill.style.width = '100%'; });
    }
    const highest = parseInt(localStorage.getItem('catTrapHighestLevel') || 1);
    if (next > highest) localStorage.setItem('catTrapHighestLevel', next);
    triggerConfetti();
    notify(`🎉 Level ${ST.level} complete! Level ${next} starting…`, 'success');
    playBeepSound(880, 0.18, 0.3);
    setTimeout(() => {
        ST.level = next;
        ST.score = 0;
        ST.timeLeft = ST.settings.timerDuration;
        ST.combo = 1;
        ST.comboCount = 0;
        if (comboCounter) comboCounter.classList.add('hidden');
        updateLevelUI();
        refreshAllDisplays();
        beginLevel();
    }, 2200);
}

function beginLevel() {
    ST.active = true;
    showOverlay('none');
    if (arenaHint) arenaHint.textContent = `Level ${ST.level} — Click the cat!`;
    const speed = GAME_CONFIG.levelRequirements[ST.level].speed * personalityMult();
    catInterval = setInterval(moveCat, speed);
    moveCat();
    timerInterval = setInterval(() => {
        if (!ST.active) return;
        ST.timeLeft--;
        refreshAllDisplays();
        if (ST.settings.timerWarning && ST.timeLeft === ST.settings.warningTime) {
            playBeepSound(380, 0.12);
        }
        if (ST.timeLeft <= 0) gameOver();
    }, 1000);
}

// ─────────────────────────────────────────────────────────────
// 17. CAT CLICK HANDLER (WITH CLICK SOUND)
// ─────────────────────────────────────────────────────────────
if (cat) {
    cat.addEventListener('click', (e) => {
        if (!ST.active) return;
        playBeepSound(660, 0.05, 0.22);
        ST.comboCount++;
        ST.combo = Math.min(10, Math.floor(ST.comboCount / 2) + 1);
        if (ST.combo > ST.bestCombo) ST.bestCombo = ST.combo;
        if (comboBadgeNum) comboBadgeNum.textContent = 'x' + ST.combo;
        if (comboCounter) comboCounter.classList.toggle('hidden', ST.combo < 2);
        if (comboPill) comboPill.classList.toggle('active', ST.combo > 1);
        if (comboVal) comboVal.textContent = 'x' + ST.combo;
        const pts = ST.combo;
        ST.score += pts;
        ST.sessionClicks++;
        const arenaRect = gameArea.getBoundingClientRect();
        const catRect = cat.getBoundingClientRect();
        spawnBurst(
            catRect.left - arenaRect.left + catRect.width / 2,
            catRect.top - arenaRect.top + catRect.height / 2
        );
        floatScore(e.clientX, e.clientY, pts);
        cat.classList.add('captured');
        setTimeout(() => cat.classList.remove('captured'), 220);
        if (scoreDisplay) {
            scoreDisplay.style.transform = 'scale(1.22)';
            setTimeout(() => { scoreDisplay.style.transform = 'scale(1)'; }, 130);
        }
        refreshAllDisplays();
        checkLevelUp();
    });
}

// ─────────────────────────────────────────────────────────────
// 18. CONTROL BUTTONS
// ─────────────────────────────────────────────────────────────
if (startBtn) {
    startBtn.addEventListener('click', () => {
        if (!ST.active) startGame();
    });
}

if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        clearInts();
        ST.active = false;
        ST.score = 0;
        // On restart, reset to starting level from settings
        ST.level = ST.settings.startLevel;
        ST.timeLeft = ST.settings.timerDuration;
        ST.combo = 1;
        ST.comboCount = 0;
        ST.sessionClicks = 0;
        ST.sessionMisses = 0;
        ST.bestCombo = 0;
        if (comboCounter) comboCounter.classList.add('hidden');
        showOverlay('idle');
        resetStartBtn();
        refreshAllDisplays();
        updateLevelUI();
        notify('Restarted — press Start when ready! 🔄', 'info');
    });
}

if (goPlayAgain) {
    goPlayAgain.addEventListener('click', () => {
        ST.score = 0;
        refreshAllDisplays();
        startGame();
    });
}

if (hsPlayAgain) {
    hsPlayAgain.addEventListener('click', () => {
        ST.score = 0;
        refreshAllDisplays();
        startGame();
    });
}

window.addEventListener('storage', (e) => {
    if (e.key === 'catTrapSettings') {
        loadSettings();
        if (ST.active) {
            clearInts();
            ST.active = false;
            showOverlay('idle');
            resetStartBtn();
        }
        refreshAllDisplays();
        updateMusic();
    }
});

// ─────────────────────────────────────────────────────────────
// 19. CSS ANIMATIONS
// ─────────────────────────────────────────────────────────────
const catStyle = document.createElement('style');
catStyle.textContent = `
    @keyframes catHyper {
        0% { transform: translateX(0px); }
        25% { transform: translateX(3px); }
        75% { transform: translateX(-3px); }
        100% { transform: translateX(0px); }
    }
`;
document.head.appendChild(catStyle);

// ─────────────────────────────────────────────────────────────
// 20. HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function resetStartBtn() {
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
    }
}

function clearInts() {
    if (catInterval) clearInterval(catInterval);
    if (timerInterval) clearInterval(timerInterval);
    catInterval = null;
    timerInterval = null;
}

function floatScore(x, y, pts) {
    const el = document.createElement('div');
    el.className = 'gp-float-score' + (pts >= 5 ? ' big' : '');
    el.textContent = '+' + pts;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
}

function spawnBurst(x, y) {
    if (!ST.settings.particleEffects || !burstContainer) return;
    const ring = document.createElement('div');
    ring.className = 'gp-burst-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    burstContainer.appendChild(ring);
    setTimeout(() => ring.remove(), 520);
    const colors = ST.combo > 3 ? ['var(--accent-2)'] : ['var(--accent)', 'var(--gold)'];
    for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * 2 * Math.PI;
        const distance = 28 + Math.random() * 20;
        const dot = document.createElement('div');
        dot.className = 'gp-burst-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.setProperty('--dx', (Math.cos(angle) * distance) + 'px');
        dot.style.setProperty('--dy', (Math.sin(angle) * distance) + 'px');
        dot.style.background = colors[i % colors.length];
        burstContainer.appendChild(dot);
        setTimeout(() => dot.remove(), 540);
    }
}

function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'gp-confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ['#6D42F5', '#E83D8F', '#F5A623', '#16A34A', '#38BDF8', '#fff'];
    const dots = Array.from({ length: 130 }, () => ({
        x: canvas.width / 2,
        y: canvas.height * 0.42,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 14 - 6,
        size: Math.random() * 7 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 8
    }));
    let live = true;
    (function draw() {
        if (!live) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let any = false;
        dots.forEach(p => {
            if (p.life <= 0) return;
            any = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.24;
            p.life -= 0.017;
            p.rot += p.rv;
            ctx.save();
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });
        if (any) requestAnimationFrame(draw);
        else canvas.remove();
    })();
    setTimeout(() => { live = false; if (canvas.parentNode) canvas.remove(); }, 3000);
}

function notify(msg, type = 'info') {
    const container = $('notificationContainer');
    if (!container) return;
    const icons = { success: '🎉', warning: '⚠️', info: 'ℹ️', hs: '🏆' };
    const el = document.createElement('div');
    el.className = `gp-notif gp-notif--${type}`;
    el.innerHTML = `<div class="gp-notif-icon">${icons[type] || 'ℹ️'}</div><div class="gp-notif-msg">${msg}</div>`;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 400);
    }, 3200);
}

console.log('🎮 Cat Trap Pro - Game script loaded with STARTING LEVEL FIX!');