<template>
  <section class="date-card">
    <div class="card-header-row">
      <div class="local-badge">
        <span class="pulse-dot"></span>
        <span class="local-label">{{ config.language === 'english' ? 'Cairo' : 'القاهرة' }}</span>
      </div>
      <div class="weather-widget" title="Weather Forecast">
        <span class="weather-icon">{{ weatherIcon }}</span>
        <span class="weather-temp">{{ weatherTemp }}°C</span>
      </div>
    </div>

    <div class="analog-clock" v-if="config.clockStyle === 'analog' || config.clockStyle === 'both'">
      <div class="clock-face">
        <div class="clock-number" v-for="i in 12" :key="i" :style="{ '--i': i }"><span>{{ i }}</span></div>
        <div class="hand hour-hand" :style="{ transform: `rotate(${hourDeg}deg)` }"></div>
        <div class="hand minute-hand" :style="{ transform: `rotate(${minDeg}deg)` }"></div>
        <div class="hand second-hand" :style="{ transform: `rotate(${secDeg}deg)` }"></div>
        <div class="center-dot"></div>
      </div>
    </div>

    <h1 class="date-display" v-if="config.language !== 'arabic'">{{ dateEn }}</h1>
    <h2 class="date-display-ar" dir="rtl" v-if="config.language !== 'english'">{{ dateAr }}</h2>
    <p class="time-display" v-if="config.clockStyle === 'digital' || config.clockStyle === 'both'">{{ timeEn }}</p>

    <div class="world-clocks">
      <div class="clock-item">
        <span class="clock-label">{{ getLabel(config.secondClock) }}</span>
        <span class="clock-time">{{ secondTime }}</span>
      </div>
      <div class="clock-item">
        <span class="clock-label">{{ getLabel(config.thirdClock) }}</span>
        <span class="clock-time">{{ thirdTime }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()

const dateEn = ref('...')
const dateAr = ref('...')
const timeEn = ref('00:00:00')
const secondTime = ref('00:00:00')
const thirdTime = ref('00:00:00')

const hourDeg = ref(0)
const minDeg = ref(0)
const secDeg = ref(0)

const weatherTemp = ref('--')
const weatherIcon = ref('☀️')

let timer

const getLabel = (clockStr) => {
  const parts = clockStr.split('|')
  if (parts.length < 2) return ''
  const label = parts[1]
  return config.language === 'english' ? label.split(' / ')[0] : label.split(' / ')[1]
}

const updateDateTime = () => {
  const now = new Date()
  
  dateEn.value = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now)
  dateAr.value = new Intl.DateTimeFormat('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now)
  timeEn.value = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
  
  const secTz = config.secondClock.split('|')[0]
  const thirdTz = config.thirdClock.split('|')[0]
  
  secondTime.value = new Intl.DateTimeFormat('en-US', { timeZone: secTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)
  thirdTime.value = new Intl.DateTimeFormat('en-US', { timeZone: thirdTz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).format(now)

  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(now)
  const hr = parseInt(parts.find(p => p.type === 'hour').value, 10)
  const min = parseInt(parts.find(p => p.type === 'minute').value, 10)
  const sec = parseInt(parts.find(p => p.type === 'second').value, 10)

  hourDeg.value = ((hr % 12) * 30) + (min * 0.5)
  minDeg.value = (min * 6) + (sec * 0.1)
  secDeg.value = sec * 6
}

const fetchWeather = async () => {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current=temperature_2m,weather_code&timezone=Africa%2FCairo')
    const data = await res.json()
    if (data?.current) {
      weatherTemp.value = Math.round(data.current.temperature_2m)
      const code = data.current.weather_code
      if (code === 0) weatherIcon.value = '☀️'
      else if (code <= 3) weatherIcon.value = '⛅'
      else if (code === 45 || code === 48) weatherIcon.value = '🌫️'
      else if (code <= 55) weatherIcon.value = '🌦️'
      else if (code <= 65) weatherIcon.value = '🌧️'
      else if (code <= 75) weatherIcon.value = '❄️'
      else if (code <= 82) weatherIcon.value = '🌧️'
      else if (code >= 95) weatherIcon.value = '⛈️'
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
  fetchWeather()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
