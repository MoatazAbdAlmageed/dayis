<template>
  <div class="settings-panel active" v-show="true">
    <div class="settings-header">
      <h2>{{ config.language === 'english' ? 'Preferences' : 'الإعدادات' }}</h2>
      <button class="settings-close-btn" @click="$emit('close')">&times;</button>
    </div>
    
    <div class="settings-body">
      <div class="settings-group">
        <label>Language / اللغة</label>
        <select v-model="config.language">
          <option value="english">English Only / الإنجليزية فقط</option>
          <option value="arabic">Arabic Only / العربية فقط</option>
        </select>
      </div>

      <div class="settings-group">
        <label>Background Theme / المظهر</label>
        <select v-model="config.theme">
          <option value="emerald">Majestic Emerald / الزمرد المهيب</option>
          <option value="indigo">Midnight Indigo / النيلي الداكن</option>
          <option value="crimson">Sunset Crimson / القرمزي الغروبي</option>
          <option value="obsidian">Royal Obsidian / الأوبسيديان الملكي</option>
          <option value="purple">Royal Purple / الأرجواني الملكي</option>
        </select>
      </div>

      <div class="settings-group">
        <label>Clock Style / نمط الساعة</label>
        <select v-model="config.clockStyle">
          <option value="both">Analog & Digital / التناظرية والرقمية</option>
          <option value="digital">Digital Only / الرقمية فقط</option>
          <option value="analog">Analog Only / التناظرية فقط</option>
        </select>
      </div>

      <div class="settings-group">
        <label>Layout / التنسيق</label>
        <select v-model="config.density">
          <option value="standard">Standard / الافتراضي</option>
          <option value="compact">Compact / مدمج</option>
        </select>
      </div>

      <div class="settings-group full-width">
        <label>Todo List / قائمة المهام</label>
        <select v-model="config.todoToggle">
          <option value="show">Show / عرض</option>
          <option value="hide">Hide / إخفاء</option>
        </select>
      </div>

      <div class="settings-group">
        <label>Second Clock / الساعة الثانية</label>
        <select v-model="config.secondClock">
          <option value="Europe/London|London / لندن">London / لندن</option>
          <option value="Asia/Riyadh|KSA / السعودية">KSA / السعودية</option>
          <option value="America/New_York|New York / نيويورك">New York / نيويورك</option>
          <option value="Asia/Tokyo|Tokyo / طوكيو">Tokyo / طوكيو</option>
          <option value="Asia/Dubai|Dubai / دبي">Dubai / دبي</option>
          <option value="Europe/Paris|Paris / باريس">Paris / باريس</option>
          <option value="Australia/Sydney|Sydney / سيدني">Sydney / سيدني</option>
        </select>
      </div>

      <div class="settings-group">
        <label>Third Clock / الساعة الثالثة</label>
        <select v-model="config.thirdClock">
          <option value="Asia/Riyadh|KSA / السعودية">KSA / السعودية</option>
          <option value="Europe/London|London / لندن">London / لندن</option>
          <option value="America/New_York|New York / نيويورك">New York / نيويورك</option>
          <option value="Asia/Tokyo|Tokyo / طوكيو">Tokyo / طوكيو</option>
          <option value="Asia/Dubai|Dubai / دبي">Dubai / دبي</option>
          <option value="Europe/Paris|Paris / باريس">Paris / باريس</option>
          <option value="Australia/Sydney|Sydney / سيدني">Sydney / سيدني</option>
        </select>
      </div>
    </div>
    
    <button class="settings-save-btn" @click="$emit('close')">{{ config.language === 'english' ? 'Save Changes' : 'حفظ' }}</button>
  </div>
</template>

<script setup>
import { useConfigStore } from '../stores/useConfigStore'

const config = useConfigStore()
defineEmits(['close'])
</script>
