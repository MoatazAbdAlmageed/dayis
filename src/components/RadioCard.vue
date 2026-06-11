<template>
  <section class="radio-card">
    <div class="radio-header">
      <div class="radio-station-info">
        <span class="radio-live-badge">
          <span class="live-dot" :class="{ playing: isPlaying }"></span>
          <span class="live-text">{{ config.language === 'english' ? 'LIVE' : 'مباشر' }}</span>
        </span>
        <h2 class="radio-title">{{ config.language === 'english' ? 'Holy Quran Radio' : 'إذاعة القرآن الكريم' }}</h2>
        <p class="radio-subtitle">{{ config.language === 'english' ? 'From Cairo' : 'من القاهرة' }}</p>
      </div>
    </div>
    
    <div class="radio-controls">
      <button class="radio-play-btn" aria-label="Play Radio" @click="togglePlay">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      
      <div class="volume-container">
        <span class="volume-icon">🔊</span>
        <input type="range" class="volume-slider" min="0" max="1" step="0.05" v-model="volume" @input="updateVolume">
      </div>
    </div>
    <audio ref="audioRef" preload="none"></audio>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()
const audioRef = ref(null)
const isPlaying = ref(false)
const volume = ref(0.8)
const streamUrl = 'https://stream.radiojar.com/8s5u5tpdtwzuv'

const togglePlay = () => {
  if (!audioRef.value) return
  if (!isPlaying.value) {
    audioRef.value.src = streamUrl
    audioRef.value.load()
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => console.error(err))
  } else {
    audioRef.value.pause()
    audioRef.value.src = ''
    isPlaying.value = false
  }
}

const updateVolume = () => {
  if (audioRef.value) {
    audioRef.value.volume = volume.value
  }
}
</script>
