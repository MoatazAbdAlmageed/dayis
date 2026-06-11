<template>
  <section class="focus-card">
    <div class="focus-container">
      <template v-if="!focusText">
        <form @submit.prevent="saveFocus" class="focus-form">
          <label class="focus-prompt">{{ config.language === 'english' ? 'What is your main focus for today?' : 'ما هو تركيزك اليوم؟' }}</label>
          <div class="focus-input-wrapper">
            <input type="text" v-model="inputText" class="focus-input" :placeholder="config.language === 'english' ? 'Write your focus here...' : 'اكتب تركيزك هنا...'" required autocomplete="off">
            <button type="submit" class="focus-submit-btn">&rarr;</button>
          </div>
        </form>
      </template>
      <template v-else>
        <div class="focus-display-wrapper">
          <span class="focus-today-label">{{ config.language === 'english' ? 'TODAY' : 'اليوم' }}</span>
          <div class="focus-content-row">
            <div class="focus-check" :class="{ completed: isCompleted }" @click="toggleFocus"></div>
            <span class="focus-text-display" :class="{ completed: isCompleted }">{{ focusText }}</span>
            <button class="focus-edit-btn" @click="editFocus" title="Edit focus">&#9998;</button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()
const focusText = ref('')
const inputText = ref('')
const isCompleted = ref(false)

const getTodayStr = () => new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

onMounted(() => {
  const todayStr = getTodayStr()
  if (localStorage.getItem('focusDate') !== todayStr) {
    localStorage.removeItem('focusText')
    localStorage.setItem('focusDate', todayStr)
    localStorage.setItem('focusCompleted', 'false')
  } else {
    focusText.value = localStorage.getItem('focusText') || ''
    isCompleted.value = localStorage.getItem('focusCompleted') === 'true'
  }
})

const saveFocus = () => {
  if (inputText.value.trim()) {
    focusText.value = inputText.value.trim()
    localStorage.setItem('focusText', focusText.value)
    localStorage.setItem('focusDate', getTodayStr())
    localStorage.setItem('focusCompleted', 'false')
    isCompleted.value = false
  }
}

const toggleFocus = () => {
  isCompleted.value = !isCompleted.value
  localStorage.setItem('focusCompleted', isCompleted.value.toString())
}

const editFocus = () => {
  inputText.value = focusText.value
  focusText.value = ''
  localStorage.removeItem('focusText')
  localStorage.setItem('focusCompleted', 'false')
  isCompleted.value = false
}
</script>
