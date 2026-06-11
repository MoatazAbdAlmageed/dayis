import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // State
  const language = ref(localStorage.getItem('language') || 'english')
  const clockStyle = ref(localStorage.getItem('clockStyle') || 'both')
  const density = ref(localStorage.getItem('density') || 'standard')
  const todoToggle = ref(localStorage.getItem('todoToggle') || 'show')
  const secondClock = ref(localStorage.getItem('secondClock') || 'Europe/London|London / لندن')
  const thirdClock = ref(localStorage.getItem('thirdClock') || 'Asia/Riyadh|KSA / السعودية')
  const theme = ref(localStorage.getItem('theme') || 'emerald')

  // Save to localStorage when state changes
  watch([language, clockStyle, density, todoToggle, secondClock, thirdClock, theme], () => {
    localStorage.setItem('language', language.value)
    localStorage.setItem('clockStyle', clockStyle.value)
    localStorage.setItem('density', density.value)
    localStorage.setItem('todoToggle', todoToggle.value)
    localStorage.setItem('secondClock', secondClock.value)
    localStorage.setItem('thirdClock', thirdClock.value)
    localStorage.setItem('theme', theme.value)
    
    applyTheme()
  }, { deep: true })

  // Theme application logic
  const applyTheme = () => {
    document.body.classList.remove('theme-emerald', 'theme-indigo', 'theme-crimson', 'theme-obsidian', 'theme-purple')
    document.body.classList.add(`theme-${theme.value}`)
  }

  // Initialize theme on store creation
  applyTheme()

  return {
    language,
    clockStyle,
    density,
    todoToggle,
    secondClock,
    thirdClock,
    theme
  }
})
