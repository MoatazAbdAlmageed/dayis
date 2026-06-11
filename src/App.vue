<template>
  <div>
    <div class="background-overlay"></div>
    <main class="container" :class="{ compact: config.density === 'compact' }">
      <ClockCard />
      <FocusCard />
      <ForecastCard />
      <RadioCard />
      <TodoCard v-if="config.todoToggle === 'show'" />
      <FavSitesCard />
      <PrayerCard />
    </main>

    <!-- Settings Trigger -->
    <button @click="isSettingsOpen = true" class="settings-toggle" aria-label="Toggle settings">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </button>

    <SettingsModal v-if="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConfigStore } from './stores/useConfigStore'
import ClockCard from './components/ClockCard.vue'
import FocusCard from './components/FocusCard.vue'
import ForecastCard from './components/ForecastCard.vue'
import RadioCard from './components/RadioCard.vue'
import TodoCard from './components/TodoCard.vue'
import FavSitesCard from './components/FavSitesCard.vue'
import PrayerCard from './components/PrayerCard.vue'
import SettingsModal from './components/SettingsModal.vue'

const config = useConfigStore()
const isSettingsOpen = ref(false)
</script>
