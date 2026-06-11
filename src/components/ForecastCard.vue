<template>
  <section class="weather-forecast-card">
    <div class="forecast-header">
      <h2 class="forecast-title">{{ config.language === 'english' ? '3-Day Forecast' : 'توقعات ٣ أيام' }}</h2>
    </div>
    <div class="forecast-days">
      <div v-for="(day, i) in forecast" :key="i" class="forecast-item">
        <span class="forecast-day">{{ config.language === 'english' ? day.dayEn : day.dayAr }}</span>
        <span class="forecast-icon" :title="day.descEn">{{ day.icon }}</span>
        <span class="forecast-desc">{{ config.language === 'english' ? day.descEn : day.descAr }}</span>
        <span class="forecast-temp">{{ day.max }}° / {{ day.min }}°</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()
const forecast = ref([])

onMounted(async () => {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCairo')
    const data = await res.json()
    if (data?.daily) {
      const parsed = []
      for (let i = 1; i <= 3; i++) {
        const dateStr = data.daily.time[i]
        const maxTemp = Math.round(data.daily.temperature_2m_max[i])
        const minTemp = Math.round(data.daily.temperature_2m_min[i])
        const code = data.daily.weather_code[i]
        
        let icon = '☀️', descEn = 'Clear', descAr = 'مشمس'
        if (code === 0) { icon = '☀️'; descEn = 'Clear'; descAr = 'مشمس'; }
        else if (code <= 3) { icon = '⛅'; descEn = 'Cloudy'; descAr = 'غائم'; }
        else if (code === 45 || code === 48) { icon = '🌫️'; descEn = 'Foggy'; descAr = 'ضباب'; }
        else if (code <= 55) { icon = '🌦️'; descEn = 'Drizzle'; descAr = 'رذاذ'; }
        else if (code <= 65) { icon = '🌧️'; descEn = 'Rainy'; descAr = 'ممطر'; }
        else if (code <= 75) { icon = '❄️'; descEn = 'Snowy'; descAr = 'ثلجي'; }
        else if (code <= 82) { icon = '🌧️'; descEn = 'Showers'; descAr = 'زخات'; }
        else if (code >= 95) { icon = '⛈️'; descEn = 'Stormy'; descAr = 'عواصف'; }
        
        const tempDate = new Date(dateStr)
        const dayEn = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(tempDate)
        const dayAr = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(tempDate)

        parsed.push({
          dayEn, dayAr, icon, descEn, descAr, max: maxTemp, min: minTemp
        })
      }
      forecast.value = parsed
    }
  } catch (e) {
    console.error(e)
  }
})
</script>
