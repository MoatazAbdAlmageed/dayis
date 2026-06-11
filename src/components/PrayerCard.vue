<template>
  <section class="prayer-card">
    <div class="prayer-header">
      <h2 class="prayer-title">{{ config.language === 'english' ? 'Next Prayer' : 'الصلاة القادمة' }}</h2>
    </div>
    <div class="prayer-content">
      <div class="prayer-name">{{ prayerName }}</div>
      <div class="prayer-time">{{ prayerTimeDisplay }}</div>
      <div class="prayer-countdown">{{ countdownText }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()

const prayerName = ref('--')
const prayerTimeDisplay = ref('--:--')
const countdownText = ref('--:-- left')

let timings = null
let nextPrayerObj = null
let timer = null

const fetchPrayerTimes = async () => {
  try {
    const dateStr = new Date().toISOString().split('T')[0]
    const cachedData = localStorage.getItem('prayerTimesData')
    
    if (cachedData) {
      const parsed = JSON.parse(cachedData)
      if (parsed.date === dateStr) {
        timings = parsed.timings
      }
    }

    if (!timings) {
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5')
      const data = await response.json()
      timings = data.data.timings
      localStorage.setItem('prayerTimesData', JSON.stringify({
        date: dateStr,
        timings: timings
      }))
    }
    calculateNextPrayer()
  } catch (error) {
    console.error(error)
  }
}

const calculateNextPrayer = () => {
  if (!timings) return
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
  const prayerNamesAr = { 'Fajr': 'الفجر', 'Dhuhr': 'الظهر', 'Asr': 'العصر', 'Maghrib': 'المغرب', 'Isha': 'العشاء' }

  let foundNext = false
  for (let prayer of prayers) {
    const timeStr = timings[prayer].split(' ')[0]
    const [hours, minutes] = timeStr.split(':').map(Number)
    const prayerTime = hours * 60 + minutes

    if (prayerTime > currentTime) {
      nextPrayerObj = { name: prayer, nameAr: prayerNamesAr[prayer], time: timeStr, timeMinutes: prayerTime }
      foundNext = true
      break
    }
  }

  if (!foundNext) {
    const timeStrFajr = timings['Fajr'].split(' ')[0]
    nextPrayerObj = {
      name: 'Fajr', nameAr: 'الفجر', time: timeStrFajr,
      timeMinutes: parseInt(timeStrFajr.split(':')[0]) * 60 + parseInt(timeStrFajr.split(':')[1]) + 24 * 60
    }
  }
  updateUI()
}

const updateUI = () => {
  if (!nextPrayerObj) return

  prayerName.value = config.language === 'english' ? nextPrayerObj.name : nextPrayerObj.nameAr
  
  const [h, m] = nextPrayerObj.time.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  prayerTimeDisplay.value = `${hour12}:${m} ${ampm}`

  updateCountdown()
}

const updateCountdown = () => {
  if (!nextPrayerObj) return
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  
  let diff = nextPrayerObj.timeMinutes - currentMinutes
  if (diff < 0) {
    fetchPrayerTimes()
    return
  }

  const hoursLeft = Math.floor(diff / 60)
  const minutesLeft = diff % 60

  let text = ''
  if (hoursLeft > 0) text += `${hoursLeft}h `
  text += `${minutesLeft}m left`
  
  if (config.language !== 'english') {
    text = text.replace('h ', 'س ').replace('m left', 'د متبقية').replace(' left', ' متبقية')
  }
  
  countdownText.value = text
}

onMounted(() => {
  fetchPrayerTimes()
  timer = setInterval(calculateNextPrayer, 60000) // check every minute
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
