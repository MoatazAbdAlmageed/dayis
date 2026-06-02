// newtab.js - Localized date and time display with options menu

// Global configuration object with sensible defaults
let config = {
  language: 'both',
  clockStyle: 'both',
  density: 'standard',
  todoToggle: 'show',
  secondClock: 'Europe/London|London / لندن',
  thirdClock: 'Asia/Riyadh|KSA / السعودية'
};

// Load preferences from localStorage and apply UI visibility styles
function loadConfig() {
  config.language = localStorage.getItem('language') || 'both';
  config.clockStyle = localStorage.getItem('clockStyle') || 'both';
  config.density = localStorage.getItem('density') || 'standard';
  config.todoToggle = localStorage.getItem('todoToggle') || 'show';
  config.secondClock = localStorage.getItem('secondClock') || 'Europe/London|London / لندن';
  config.thirdClock = localStorage.getItem('thirdClock') || 'Asia/Riyadh|KSA / السعودية';
  
  // Update select inputs to match config
  const langSel = document.getElementById('language-select');
  const clockStyleSel = document.getElementById('clock-type-select');
  const densitySel = document.getElementById('density-select');
  const todoToggleSel = document.getElementById('todo-toggle-select');
  const secondClockSel = document.getElementById('second-clock-select');
  const thirdClockSel = document.getElementById('third-clock-select');

  if (langSel) langSel.value = config.language;
  if (clockStyleSel) clockStyleSel.value = config.clockStyle;
  if (densitySel) densitySel.value = config.density;
  if (todoToggleSel) todoToggleSel.value = config.todoToggle;
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

  // Toggle Right Column visibility
  const rightColumn = document.querySelector('.right-column');
  if (rightColumn) {
    rightColumn.style.display = config.todoToggle === 'hide' ? 'none' : 'flex';
  }

  // Apply layout density class to container
  const container = document.querySelector('.container');
  if (container) {
    if (config.density === 'compact') {
      container.classList.add('compact');
    } else {
      container.classList.remove('compact');
    }

    // Collapse container grid dynamically if Todo list is hidden
    if (config.todoToggle === 'hide') {
      container.style.gridTemplateColumns = '1fr';
      container.style.maxWidth = '600px';
    } else {
      container.style.gridTemplateColumns = '';
      container.style.maxWidth = '';
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
