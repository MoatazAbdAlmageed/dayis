<template>
  <section class="todo-card">
    <div class="todo-header">
      <h2 class="todo-title">{{ config.language === 'english' ? 'Tasks' : 'المهام' }}</h2>
      <span class="todo-count">{{ activeCountText }}</span>
    </div>
    
    <form @submit.prevent="addTask" class="todo-form">
      <input type="text" v-model="newTask" class="todo-input" :placeholder="config.language === 'english' ? 'Add a new task...' : 'أضف مهمة جديدة...'" required autocomplete="off">
      <button type="submit" class="todo-add-btn">+</button>
    </form>
    
    <ul class="todo-list">
      <li v-for="(todo, index) in todos" :key="index" class="todo-item" :class="{ completed: todo.completed }">
        <div class="todo-checkbox" @click="toggleTask(index)"></div>
        <span class="todo-text" @click="toggleTask(index)">{{ todo.text }}</span>
        <button class="todo-delete-btn" @click="removeTask(index)">&times;</button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()
const todos = ref([])
const newTask = ref('')

onMounted(() => {
  const stored = localStorage.getItem('todos')
  if (stored) todos.value = JSON.parse(stored)
})

watch(todos, (newVal) => {
  localStorage.setItem('todos', JSON.stringify(newVal))
}, { deep: true })

const activeCount = computed(() => todos.value.filter(t => !t.completed).length)
const activeCountText = computed(() => {
  return config.language === 'english' 
    ? `${activeCount.value} task${activeCount.value !== 1 ? 's' : ''} left`
    : `${activeCount.value} مهام متبقية`
})

const addTask = () => {
  if (newTask.value.trim()) {
    todos.value.push({ text: newTask.value.trim(), completed: false })
    newTask.value = ''
  }
}

const toggleTask = (index) => {
  todos.value[index].completed = !todos.value[index].completed
}

const removeTask = (index) => {
  todos.value.splice(index, 1)
}
</script>
