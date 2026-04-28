// Settings Management for Cat Trap Pro - COMPLETE WITH CAT COLOR & MUSIC

// Default Settings
const DEFAULT_SETTINGS = {
    // Sound Settings
    masterSound: true,
    clickSound: true,
    bgMusic: true,
    volume: 70,
    selectedSong: 'song1',

    // Cat Customization
    catColor: '#FFA500',
    catSize: 4.5,
    catPersonality: 'normal',

    // Timer Settings
    timerDuration: 30,
    timerWarning: true,
    warningTime: 10,
    warningColor: '#ff4444',

    // Difficulty Settings
    difficulty: 'normal',
    startLevel: 1,

    // Display Settings
    showTimer: true,
    showScore: true,
    animationSpeed: 'normal'
};

// Current settings
let currentSettings = {};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded');

    // Load settings
    loadSettings();

    // Initialize UI
    initializeSettingsUI();

    // Add event listeners
    addSettingsEventListeners();

    // Update cat preview
    updateCatPreview();
});

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('catTrapSettings');

    if (savedSettings) {
        try {
            const parsed = JSON.parse(savedSettings);
            // Merge with defaults to ensure all properties exist
            currentSettings = {...DEFAULT_SETTINGS, ...parsed };
            console.log('Settings loaded:', currentSettings);
        } catch (e) {
            console.error('Error loading settings:', e);
            currentSettings = {...DEFAULT_SETTINGS };
        }
    } else {
        currentSettings = {...DEFAULT_SETTINGS };
        console.log('No saved settings, using defaults');
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('catTrapSettings', JSON.stringify(currentSettings));
    console.log('Settings saved:', currentSettings);
    showStatus('Settings saved successfully! ✅', 'success');
}

// Reset to default settings
function resetToDefault() {
    if (confirm('Reset all settings to default values?')) {
        currentSettings = {...DEFAULT_SETTINGS };
        initializeSettingsUI();
        updateCatPreview();
        saveSettings();
        showStatus('Settings reset to default! ↩️', 'info');
    }
}

// Initialize UI with current settings
function initializeSettingsUI() {
    console.log('Initializing UI with settings:', currentSettings);

    // Sound Settings
    setCheckbox('masterSound', currentSettings.masterSound);
    setCheckbox('clickSound', currentSettings.clickSound);
    setCheckbox('bgMusic', currentSettings.bgMusic);

    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.value = currentSettings.volume;
        const volumeValue = document.getElementById('volumeValue');
        if (volumeValue) volumeValue.textContent = currentSettings.volume + '%';
    }

    const songSelect = document.getElementById('songSelect');
    if (songSelect) songSelect.value = currentSettings.selectedSong;

    // Cat Customization
    const catColorPicker = document.getElementById('catColorPicker');
    if (catColorPicker) {
        catColorPicker.value = currentSettings.catColor;
        const colorHex = document.getElementById('colorHex');
        if (colorHex) colorHex.textContent = currentSettings.catColor;
    }

    const catSize = document.getElementById('catSize');
    if (catSize) {
        catSize.value = currentSettings.catSize;
        const sizeValue = document.getElementById('sizeValue');
        if (sizeValue) sizeValue.textContent = currentSettings.catSize + 'rem';
    }

    // Set personality buttons
    const personalityOptions = document.querySelectorAll('.personality-option');
    personalityOptions.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.personality === currentSettings.catPersonality) {
            btn.classList.add('active');
        }
    });

    // Set color preset active
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(btn => {
        btn.classList.remove('active');
        const color = btn.dataset.color;
        let colorCode = '';
        switch (color) {
            case 'orange':
                colorCode = '#FFA500';
                break;
            case 'gray':
                colorCode = '#808080';
                break;
            case 'brown':
                colorCode = '#8B4513';
                break;
            case 'white':
                colorCode = '#FFFFFF';
                break;
            case 'black':
                colorCode = '#000000';
                break;
        }
        if (colorCode.toUpperCase() === currentSettings.catColor.toUpperCase()) {
            btn.classList.add('active');
        }
    });

    // Timer Settings
    setSelectValue('timerDuration', currentSettings.timerDuration);
    setCheckbox('timerWarning', currentSettings.timerWarning);
    setSelectValue('warningTime', currentSettings.warningTime);

    const warningColor = document.getElementById('warningColor');
    if (warningColor) warningColor.value = currentSettings.warningColor;

    // Difficulty Settings
    setDifficultyButtons(currentSettings.difficulty);

    const startLevel = document.getElementById('startLevel');
    if (startLevel) startLevel.value = currentSettings.startLevel;

    // Display Settings
    setCheckbox('showTimer', currentSettings.showTimer);
    setCheckbox('showScore', currentSettings.showScore);
}

// Helper: Set checkbox value
function setCheckbox(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.checked = value;
    }
}

// Helper: Set select value
function setSelectValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.value = value;
    }
}

// Helper: Set difficulty buttons
function setDifficultyButtons(difficulty) {
    const buttons = document.querySelectorAll('.difficulty-option');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        }
    });
}

// Update cat preview
function updateCatPreview() {
    const previewCat = document.getElementById('previewCat');
    if (previewCat) {
        // Update color
        previewCat.style.color = currentSettings.catColor;
        previewCat.style.filter = `drop-shadow(0 0 10px ${currentSettings.catColor}80)`;

        // Update size
        previewCat.style.fontSize = currentSettings.catSize + 'rem';

        // Update based on personality
        switch (currentSettings.catPersonality) {
            case 'lazy':
                previewCat.style.animation = 'none';
                break;
            case 'hyper':
                previewCat.style.animation = 'preview-bounce 0.5s infinite';
                break;
            case 'shy':
                previewCat.style.transform = 'scale(0.9)';
                break;
            default:
                previewCat.style.animation = 'preview-bounce 2s infinite';
        }
    }
}

// Add all event listeners
function addSettingsEventListeners() {
    // Sound Settings
    const masterSound = document.getElementById('masterSound');
    if (masterSound) {
        masterSound.addEventListener('change', function(e) {
            currentSettings.masterSound = e.target.checked;
        });
    }

    const clickSound = document.getElementById('clickSound');
    if (clickSound) {
        clickSound.addEventListener('change', function(e) {
            currentSettings.clickSound = e.target.checked;
        });
    }

    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.addEventListener('change', function(e) {
            currentSettings.bgMusic = e.target.checked;
        });
    }

    const songSelect = document.getElementById('songSelect');
    if (songSelect) {
        songSelect.addEventListener('change', function(e) {
            currentSettings.selectedSong = e.target.value;
        });
    }

    // Volume + and - buttons
    const volumeDown = document.getElementById('volumeDown');
    if (volumeDown) {
        volumeDown.addEventListener('click', function() {
            let newVolume = Math.max(0, currentSettings.volume - 10);
            currentSettings.volume = newVolume;
            const volumeValue = document.getElementById('volumeValue');
            if (volumeValue) volumeValue.textContent = newVolume + '%';
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) volumeSlider.value = newVolume;
        });
    }

    const volumeUp = document.getElementById('volumeUp');
    if (volumeUp) {
        volumeUp.addEventListener('click', function() {
            let newVolume = Math.min(100, currentSettings.volume + 10);
            currentSettings.volume = newVolume;
            const volumeValue = document.getElementById('volumeValue');
            if (volumeValue) volumeValue.textContent = newVolume + '%';
            const volumeSlider = document.getElementById('volumeSlider');
            if (volumeSlider) volumeSlider.value = newVolume;
        });
    }

    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            currentSettings.volume = parseInt(e.target.value);
            const volumeValue = document.getElementById('volumeValue');
            if (volumeValue) volumeValue.textContent = e.target.value + '%';
        });
    }

    const testSoundBtn = document.getElementById('testSoundBtn');
    if (testSoundBtn) {
        testSoundBtn.addEventListener('click', testSound);
    }

    // Cat Color Presets
    const colorPresets = document.querySelectorAll('.color-preset');
    colorPresets.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.dataset.color;
            let colorCode = '';
            switch (color) {
                case 'orange':
                    colorCode = '#FFA500';
                    break;
                case 'gray':
                    colorCode = '#808080';
                    break;
                case 'brown':
                    colorCode = '#8B4513';
                    break;
                case 'white':
                    colorCode = '#FFFFFF';
                    break;
                case 'black':
                    colorCode = '#000000';
                    break;
            }

            currentSettings.catColor = colorCode;

            // Update active state
            colorPresets.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update color picker
            const catColorPicker = document.getElementById('catColorPicker');
            if (catColorPicker) catColorPicker.value = colorCode;

            const colorHex = document.getElementById('colorHex');
            if (colorHex) colorHex.textContent = colorCode;

            // Update preview
            updateCatPreview();
        });
    });

    // Custom Color Picker
    const catColorPicker = document.getElementById('catColorPicker');
    if (catColorPicker) {
        catColorPicker.addEventListener('input', function(e) {
            currentSettings.catColor = e.target.value;

            const colorHex = document.getElementById('colorHex');
            if (colorHex) colorHex.textContent = e.target.value;

            // Remove active from presets
            document.querySelectorAll('.color-preset').forEach(b => b.classList.remove('active'));

            // Update preview
            updateCatPreview();
        });
    }

    // Cat Size Slider
    const catSize = document.getElementById('catSize');
    if (catSize) {
        catSize.addEventListener('input', function(e) {
            currentSettings.catSize = parseFloat(e.target.value);
            const sizeValue = document.getElementById('sizeValue');
            if (sizeValue) sizeValue.textContent = e.target.value + 'rem';
            updateCatPreview();
        });
    }

    // Personality Buttons
    const personalityOptions = document.querySelectorAll('.personality-option');
    personalityOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            personalityOptions.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSettings.catPersonality = this.dataset.personality;
            updateCatPreview();
        });
    });

    // Timer Settings
    const timerDuration = document.getElementById('timerDuration');
    if (timerDuration) {
        timerDuration.addEventListener('change', function(e) {
            currentSettings.timerDuration = parseInt(e.target.value);
        });
    }

    const timerWarning = document.getElementById('timerWarning');
    if (timerWarning) {
        timerWarning.addEventListener('change', function(e) {
            currentSettings.timerWarning = e.target.checked;
        });
    }

    const warningTime = document.getElementById('warningTime');
    if (warningTime) {
        warningTime.addEventListener('change', function(e) {
            currentSettings.warningTime = parseInt(e.target.value);
        });
    }

    const warningColor = document.getElementById('warningColor');
    if (warningColor) {
        warningColor.addEventListener('change', function(e) {
            currentSettings.warningColor = e.target.value;
        });
    }

    // Difficulty Settings
    const difficultyOptions = document.querySelectorAll('.difficulty-option');
    difficultyOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyOptions.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentSettings.difficulty = this.dataset.difficulty;
        });
    });

    const startLevel = document.getElementById('startLevel');
    if (startLevel) {
        startLevel.addEventListener('change', function(e) {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 1) value = 1;
            if (value > 10) value = 10;
            e.target.value = value;
            currentSettings.startLevel = value;
        });
    }

    // Display Settings
    const showTimer = document.getElementById('showTimer');
    if (showTimer) {
        showTimer.addEventListener('change', function(e) {
            currentSettings.showTimer = e.target.checked;
        });
    }

    const showScore = document.getElementById('showScore');
    if (showScore) {
        showScore.addEventListener('change', function(e) {
            currentSettings.showScore = e.target.checked;
        });
    }

    // Action Buttons
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }

    const resetBtn = document.getElementById('resetSettingsBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefault);
    }
}

// Test sound function
function testSound() {
    if (!currentSettings.masterSound) {
        showStatus('Master sound is disabled! Enable it to test.', 'warning');
        return;
    }

    try {
        const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.value = currentSettings.volume / 100;

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);

        showStatus('Sound test completed! 🔊', 'success');
    } catch (e) {
        console.error('Sound test failed:', e);
        showStatus('Sound test failed!', 'warning');
    }
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('settingsStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = 'settings-status ' + type;
        statusEl.style.display = 'block';

        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 3000);
    }
}

// Export settings for game page
window.getCatTrapSettings = function() {
    return currentSettings;
};