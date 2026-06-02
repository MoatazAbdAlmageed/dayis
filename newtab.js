// newtab.js - Localized date and time display with options menu

// Global configuration object with sensible defaults
let config = {
  language: 'both',
  clockStyle: 'both',
  secondClock: 'Europe/London|London / لندن',
  thirdClock: 'Asia/Riyadh|KSA / السعودية'
};

// Load preferences from localStorage and apply UI visibility styles
function loadConfig() {
  config.language = localStorage.getItem('language') || 'both';
  config.clockStyle = localStorage.getItem('clockStyle') || 'both';
  config.secondClock = localStorage.getItem('secondClock') || 'Europe/London|London / لندن';
  config.thirdClock = localStorage.getItem('thirdClock') || 'Asia/Riyadh|KSA / السعودية';
  
  // Update select inputs to match config
  const langSel = document.getElementById('language-select');
  const clockStyleSel = document.getElementById('clock-type-select');
  const secondClockSel = document.getElementById('second-clock-select');
  const thirdClockSel = document.getElementById('third-clock-select');

  if (langSel) langSel.value = config.language;
  if (clockStyleSel) clockStyleSel.value = config.clockStyle;
  if (secondClockSel) secondClockSel.value = config.secondClock;
  if (thirdClockSel) thirdClockSel.value = config.thirdClock;

  applyUIConfig();
}

// Apply layout preferences dynamically based on the current configuration
function applyUIConfig() {
  // Cairo location label language override
  const localLabel = document.querySelector('.local-label');
  if (localLabel) {
    localLabel.textContent = config.language === 'english' ? 'Cairo' : 'Cairo / القاهرة';
  }

  // Arabic date visibility
  const dateAr = document.getElementById('date-display-ar');
  if (dateAr) {
    dateAr.style.display = config.language === 'english' ? 'none' : 'block';
  }

  // Clock type visibility options (Analog / Digital / Both)
  const analogClock = document.querySelector('.analog-clock');
  const digitalClock = document.getElementById('time-display');
  
  if (analogClock) {
    analogClock.style.display = (config.clockStyle === 'analog' || config.clockStyle === 'both') ? 'flex' : 'none';
  }
  if (digitalClock) {
    digitalClock.style.display = (config.clockStyle === 'digital' || config.clockStyle === 'both') ? 'block' : 'none';
  }

  // Second Clock labels and translations
  const secondLabel = config.secondClock.split('|')[1];
  const secondLabelEl = document.querySelectorAll('.clock-label')[0];
  if (secondLabelEl) {
    secondLabelEl.textContent = config.language === 'english' ? secondLabel.split(' / ')[0] : secondLabel;
  }

  // Third Clock labels and translations
  const thirdLabel = config.thirdClock.split('|')[1];
  const thirdLabelEl = document.querySelectorAll('.clock-label')[1];
  if (thirdLabelEl) {
    thirdLabelEl.textContent = config.language === 'english' ? thirdLabel.split(' / ')[0] : thirdLabel;
  }
}

// Save options and reload UI config
function saveConfig() {
  localStorage.setItem('language', document.getElementById('language-select').value);
  localStorage.setItem('clockStyle', document.getElementById('clock-type-select').value);
  localStorage.setItem('secondClock', document.getElementById('second-clock-select').value);
  localStorage.setItem('thirdClock', document.getElementById('third-clock-select').value);
  
  loadConfig();
  document.getElementById('settings-panel').classList.remove('active');
}

// Periodic update clock ticks
function updateDateTime() {
  const now = new Date();
  
  // Cairo options
  const dateOptions = {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };
  
  const timeOptions = {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const dateArOptions = {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };

  // Get active timezones for secondary world clocks
  const secondTimezone = config.secondClock.split('|')[0];
  const thirdTimezone = config.thirdClock.split('|')[0];

  const secondClockOptions = {
    timeZone: secondTimezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const thirdClockOptions = {
    timeZone: thirdTimezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };
  
  try {
    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
    const dateArFormatter = new Intl.DateTimeFormat('ar-EG', dateArOptions);
    const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);
    const secondClockFormatter = new Intl.DateTimeFormat('en-US', secondClockOptions);
    const thirdClockFormatter = new Intl.DateTimeFormat('en-US', thirdClockOptions);
    
    document.getElementById('date-display').textContent = dateFormatter.format(now);
    if (config.language !== 'english') {
      document.getElementById('date-display-ar').textContent = dateArFormatter.format(now);
    }
    document.getElementById('time-display').textContent = timeFormatter.format(now);
    document.getElementById('london-time').textContent = secondClockFormatter.format(now);
    document.getElementById('ksa-time').textContent = thirdClockFormatter.format(now);

    // Analog Clock Rotation Logic (Cairo Timezone)
    const analogFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = analogFormatter.formatToParts(now);
    const hr = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const min = parseInt(parts.find(p => p.type === 'minute').value, 10);
    const sec = parseInt(parts.find(p => p.type === 'second').value, 10);

    const hrDeg = ((hr % 12) * 30) + (min * 0.5);
    const minDeg = (min * 6) + (sec * 0.1);
    const secDeg = sec * 6;

    const hrHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('minute-hand');
    const secHand = document.getElementById('second-hand');

    if (hrHand) hrHand.style.transform = `rotate(${hrDeg}deg)`;
    if (minHand) minHand.style.transform = `rotate(${minDeg}deg)`;
    if (secHand) secHand.style.transform = `rotate(${secDeg}deg)`;
  } catch (error) {
    console.error('Error formatting world clocks:', error);
    document.getElementById('date-display').textContent = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    document.getElementById('time-display').textContent = now.toLocaleTimeString();
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  
  // Toggle Settings Panel Modal View
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsClose = document.getElementById('settings-close');
  const settingsSave = document.getElementById('settings-save-btn');
  const settingsPanel = document.getElementById('settings-panel');

  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
      settingsPanel.classList.toggle('active');
    });
  }

  if (settingsClose && settingsPanel) {
    settingsClose.addEventListener('click', () => {
      settingsPanel.classList.remove('active');
    });
  }

  if (settingsSave) {
    settingsSave.addEventListener('click', saveConfig);
  }
  
  // Periodic loops
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
