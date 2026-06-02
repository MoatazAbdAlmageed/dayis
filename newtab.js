// newtab.js - Localized date and time display with options menu

// Global configuration object with sensible defaults
let config = {
  language: 'both',
  clockStyle: 'both',
  density: 'standard',
  todoToggle: 'show',
  secondClock: 'Europe/London|London / لندن',
  thirdClock: 'Asia/Riyadh|KSA / السعودية',
  theme: 'emerald'
};

// Load preferences from localStorage and apply UI visibility styles
function loadConfig() {
  config.language = localStorage.getItem('language') || 'both';
  config.clockStyle = localStorage.getItem('clockStyle') || 'both';
  config.density = localStorage.getItem('density') || 'standard';
  config.todoToggle = localStorage.getItem('todoToggle') || 'show';
  config.secondClock = localStorage.getItem('secondClock') || 'Europe/London|London / لندن';
  config.thirdClock = localStorage.getItem('thirdClock') || 'Asia/Riyadh|KSA / السعودية';
  config.theme = localStorage.getItem('theme') || 'emerald';
  
  // Update select inputs to match config
  const langSel = document.getElementById('language-select');
  const clockStyleSel = document.getElementById('clock-type-select');
  const densitySel = document.getElementById('density-select');
  const todoToggleSel = document.getElementById('todo-toggle-select');
  const secondClockSel = document.getElementById('second-clock-select');
  const thirdClockSel = document.getElementById('third-clock-select');
  const themeSel = document.getElementById('theme-select');

  if (langSel) langSel.value = config.language;
  if (clockStyleSel) clockStyleSel.value = config.clockStyle;
  if (densitySel) densitySel.value = config.density;
  if (todoToggleSel) todoToggleSel.value = config.todoToggle;
  if (secondClockSel) secondClockSel.value = config.secondClock;
  if (thirdClockSel) thirdClockSel.value = config.thirdClock;
  if (themeSel) themeSel.value = config.theme;

  applyUIConfig();
}

// Apply layout preferences dynamically based on the current configuration
function applyUIConfig() {
  // Apply Background Theme classes
  document.body.classList.remove('theme-emerald', 'theme-indigo', 'theme-crimson', 'theme-obsidian');
  document.body.classList.add(`theme-${config.theme}`);

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

  // Toggle Tasks card visibility selectively rather than shutting down right-column
  const todoCard = document.querySelector('.todo-card');
  if (todoCard) {
    todoCard.style.display = config.todoToggle === 'hide' ? 'none' : 'block';
  }

  // Apply layout density class to container
  const container = document.querySelector('.container');
  if (container) {
    if (config.density === 'compact') {
      container.classList.add('compact');
    } else {
      container.classList.remove('compact');
    }
  }

  // Quran Radio translations
  const radioTitle = document.querySelector('.radio-title');
  const radioSubtitle = document.querySelector('.radio-subtitle');
  const liveText = document.querySelector('.live-text');
  
  if (radioTitle) {
    radioTitle.textContent = config.language === 'english' ? 'Holy Quran Radio' : 'Holy Quran Radio / إذاعة القرآن الكريم';
  }
  if (radioSubtitle) {
    radioSubtitle.textContent = config.language === 'english' ? 'From Cairo' : 'From Cairo / من القاهرة';
  }
  if (liveText) {
    liveText.textContent = config.language === 'english' ? 'LIVE' : 'LIVE / مباشر';
  }

  // 3-Day Forecast translation
  const forecastTitle = document.querySelector('.forecast-title');
  if (forecastTitle) {
    forecastTitle.textContent = config.language === 'english' ? '3-Day Forecast' : '3-Day Forecast / توقعات ٣ أيام';
  }

  // Refresh todo text/placeholders for selected language
  if (typeof renderTodos === 'function') {
    renderTodos();
  }

  // Refresh Focus Widget
  if (typeof renderFocus === 'function') {
    renderFocus();
  }
}

// Save options and reload UI config
function saveConfig() {
  localStorage.setItem('language', document.getElementById('language-select').value);
  localStorage.setItem('clockStyle', document.getElementById('clock-type-select').value);
  localStorage.setItem('density', document.getElementById('density-select').value);
  localStorage.setItem('todoToggle', document.getElementById('todo-toggle-select').value);
  localStorage.setItem('secondClock', document.getElementById('second-clock-select').value);
  localStorage.setItem('thirdClock', document.getElementById('third-clock-select').value);
  localStorage.setItem('theme', document.getElementById('theme-select').value);
  
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

  // Load todo list
  loadTodos();

  // Hook up form submission
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  if (todoForm && todoInput) {
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskText = todoInput.value.trim();
      if (taskText) {
        todos.push({ text: taskText, completed: false });
        todoInput.value = '';
        saveTodos();
      }
    });
  }

  // Initialize Quran Radio Player
  if (typeof initRadio === 'function') {
    initRadio();
  }

  // Fetch Weather
  if (typeof fetchWeather === 'function') {
    fetchWeather();
    setInterval(fetchWeather, 30 * 60 * 1000);
  }
  
  // Periodic loops
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// Todo List State Management
let todos = [];

function loadTodos() {
  const stored = localStorage.getItem('todos');
  todos = stored ? JSON.parse(stored) : [];
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

function renderTodos() {
  const todoList = document.getElementById('todo-list');
  const todoCount = document.getElementById('todo-count');
  const todoTitle = document.querySelector('.todo-title');
  const todoInput = document.getElementById('todo-input');
  
  if (!todoList) return;
  
  // Update translation for headers and input fields dynamically
  if (todoTitle) {
    todoTitle.textContent = config.language === 'english' ? 'Tasks' : 'Tasks / المهام';
  }
  if (todoInput) {
    todoInput.placeholder = config.language === 'english' ? 'Add a new task...' : 'Add a new task... / أضف مهمة جديدة...';
  }
  
  // Count incomplete items
  const activeCount = todos.filter(t => !t.completed).length;
  if (todoCount) {
    if (config.language === 'english') {
      todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} left`;
    } else {
      todoCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''} / ${activeCount} مهام متبقية`;
    }
  }
  
  // Render list elements
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    const checkbox = document.createElement('div');
    checkbox.className = 'todo-checkbox';
    checkbox.addEventListener('click', () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
    });
    
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    textSpan.addEventListener('click', () => {
      todos[index].completed = !todos[index].completed;
      saveTodos();
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.addEventListener('click', () => {
      todos.splice(index, 1);
      saveTodos();
    });
    
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

// Daily Focus Topic State Management (Resets local time Cairo midnight)
function renderFocus() {
  const container = document.getElementById('focus-container');
  if (!container) return;

  const todayStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const savedDate = localStorage.getItem('focusDate');
  let focusText = localStorage.getItem('focusText');

  // Midnight comparison check: reset focus if calendar day has incremented
  if (savedDate !== todayStr) {
    localStorage.removeItem('focusText');
    localStorage.setItem('focusDate', todayStr);
    localStorage.setItem('focusCompleted', 'false');
    focusText = null;
  }

  const isEn = config.language === 'english';
  const promptText = isEn ? 'What is your main focus for today?' : 'What is your main focus for today? / ما هو تركيزك اليوم؟';
  const inputPlaceholder = isEn ? 'Write your focus here...' : 'Write your focus here... / اكتب تركيزك هنا...';

  if (!focusText) {
    // Show Daily Focus Form
    container.innerHTML = `
      <form id="focus-form" class="focus-form">
        <label class="focus-prompt">${promptText}</label>
        <div class="focus-input-wrapper">
          <input type="text" id="focus-input" class="focus-input" placeholder="${inputPlaceholder}" required autocomplete="off">
          <button type="submit" class="focus-submit-btn">&rarr;</button>
        </div>
      </form>
    `;

    const form = document.getElementById('focus-form');
    const input = document.getElementById('focus-input');
    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = input.value.trim();
        if (val) {
          localStorage.setItem('focusText', val);
          localStorage.setItem('focusDate', todayStr);
          localStorage.setItem('focusCompleted', 'false');
          renderFocus();
        }
      });
    }
  } else {
    // Show Active Focus View with dynamic completion state and edit options
    const isCompleted = localStorage.getItem('focusCompleted') === 'true';
    
    container.innerHTML = `
      <div class="focus-display-wrapper">
        <span class="focus-today-label">${isEn ? 'TODAY' : 'TODAY / اليوم'}</span>
        <div class="focus-content-row">
          <div class="focus-check ${isCompleted ? 'completed' : ''}" id="focus-checkbox"></div>
          <span class="focus-text-display ${isCompleted ? 'completed' : ''}">${focusText}</span>
          <button id="focus-edit-btn" class="focus-edit-btn" title="Edit focus">&#9998;</button>
        </div>
      </div>
    `;

    const checkbox = document.getElementById('focus-checkbox');
    const editBtn = document.getElementById('focus-edit-btn');

    if (checkbox) {
      checkbox.addEventListener('click', () => {
        const state = localStorage.getItem('focusCompleted') === 'true';
        localStorage.setItem('focusCompleted', (!state).toString());
        renderFocus();
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        localStorage.removeItem('focusText');
        localStorage.setItem('focusCompleted', 'false');
        renderFocus();
      });
    }
  }
}

// Quran Radio Controller (Handles buffering and stream pausing networks)
function initRadio() {
  const audio = document.getElementById('quran-audio');
  const playBtn = document.getElementById('radio-play-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const volumeSlider = document.getElementById('radio-volume');
  const liveDot = document.querySelector('.live-dot');

  if (!audio || !playBtn) return;

  const streamUrl = 'https://stream.radiojar.com/8s5u5tpdtwzuv';
  let isPlaying = false;

  playBtn.addEventListener('click', () => {
    if (!isPlaying) {
      // Connect live audio stream and buffer
      audio.src = streamUrl;
      audio.load();
      audio.play().then(() => {
        isPlaying = true;
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        if (liveDot) liveDot.classList.add('playing');
      }).catch(err => {
        console.error('Radio play failed:', err);
      });
    } else {
      // Clear src to stop downloading live stream bytes on pause!
      audio.pause();
      audio.src = '';
      isPlaying = false;
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (liveDot) liveDot.classList.remove('playing');
    }
  });

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
    });
  }
}

// Fetch Weather from Open-Meteo for Cairo (Local Target Location)
function fetchWeather() {
  const latitude = 30.0444;
  const longitude = 31.2357;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Weather API network response failed');
      return res.json();
    })
    .then(data => {
      // 1. Render Current Weather
      if (data && data.current) {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        
        let icon = '☀️';
        let descEn = 'Clear';
        let descAr = 'مشمس';
        
        if (code === 0) {
          icon = '☀️'; descEn = 'Clear'; descAr = 'مشمس';
        } else if (code >= 1 && code <= 3) {
          icon = '⛅'; descEn = 'Cloudy'; descAr = 'غائم جزئياً';
        } else if (code === 45 || code === 48) {
          icon = '🌫️'; descEn = 'Foggy'; descAr = 'ضبابي';
        } else if (code >= 51 && code <= 55) {
          icon = '🌦️'; descEn = 'Drizzle'; descAr = 'رذاذ';
        } else if (code >= 61 && code <= 65) {
          icon = '🌧️'; descEn = 'Rainy'; descAr = 'ممطر';
        } else if (code >= 71 && code <= 75) {
          icon = '❄️'; descEn = 'Snowy'; descAr = 'ثلجي';
        } else if (code >= 80 && code <= 82) {
          icon = '🌧️'; descEn = 'Showers'; descAr = 'زخات مطر';
        } else if (code >= 95) {
          icon = '⛈️'; descEn = 'Stormy'; descAr = 'رعدي';
        }
        
        const tempEl = document.getElementById('weather-temp');
        const iconEl = document.getElementById('weather-icon');
        const widgetEl = document.getElementById('weather-widget');
        
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (iconEl) iconEl.textContent = icon;
        if (widgetEl) {
          const desc = config.language === 'english' ? descEn : `${descEn} / ${descAr}`;
          widgetEl.title = `${desc} - Cairo`;
        }
      }

      // 2. Render 3-Day Forecast Box
      if (data && data.daily) {
        const forecastDaysContainer = document.getElementById('forecast-days');
        if (forecastDaysContainer) {
          forecastDaysContainer.innerHTML = '';
          
          // Index 1, 2, 3 correspond to Tomorrow, Day 2, Day 3
          for (let i = 1; i <= 3; i++) {
            const dateStr = data.daily.time[i];
            const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
            const minTemp = Math.round(data.daily.temperature_2m_min[i]);
            const code = data.daily.weather_code[i];
            
            let icon = '☀️';
            let descEn = 'Clear';
            let descAr = 'مشمس';
            
            if (code === 0) {
              icon = '☀️'; descEn = 'Clear'; descAr = 'مشمس';
            } else if (code >= 1 && code <= 3) {
              icon = '⛅'; descEn = 'Cloudy'; descAr = 'غائم';
            } else if (code === 45 || code === 48) {
              icon = '🌫️'; descEn = 'Foggy'; descAr = 'ضباب';
            } else if (code >= 51 && code <= 55) {
              icon = '🌦️'; descEn = 'Drizzle'; descAr = 'رذاذ';
            } else if (code >= 61 && code <= 65) {
              icon = '🌧️'; descEn = 'Rainy'; descAr = 'ممطر';
            } else if (code >= 71 && code <= 75) {
              icon = '❄️'; descEn = 'Snowy'; descAr = 'ثلجي';
            } else if (code >= 80 && code <= 82) {
              icon = '🌧️'; descEn = 'Showers'; descAr = 'زخات';
            } else if (code >= 95) {
              icon = '⛈️'; descEn = 'Stormy'; descAr = 'عواصف';
            }
            
            // Format days of the week in English and Arabic
            const tempDate = new Date(dateStr);
            const dayEn = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(tempDate);
            const dayAr = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(tempDate);
            
            const dayLabel = config.language === 'english' ? dayEn : `${dayEn} / ${dayAr}`;
            const descLabel = config.language === 'english' ? descEn : descAr;
            
            const item = document.createElement('div');
            item.className = 'forecast-item';
            item.innerHTML = `
              <span class="forecast-day">${dayLabel}</span>
              <span class="forecast-icon" title="${descEn}">${icon}</span>
              <span class="forecast-desc">${descLabel}</span>
              <span class="forecast-temp">${maxTemp}° / ${minTemp}°</span>
            `;
            forecastDaysContainer.appendChild(item);
          }
        }
      }
    })
    .catch(err => {
      console.error('Error fetching weather:', err);
      const tempEl = document.getElementById('weather-temp');
      if (tempEl) tempEl.textContent = '--°C';
    });
}
