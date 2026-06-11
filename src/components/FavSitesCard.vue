<template>
  <section class="favsites-card">
    <div class="favsites-header">
      <h2 class="favsites-title">{{ config.language === 'english' ? 'Favorite Sites' : 'المواقع المفضلة' }}</h2>
    </div>
    <div class="favsites-list">
      <a href="https://wuzzuf.net/search/jobs?q=php&a=navbl" target="_blank" rel="noopener noreferrer" class="favsite-item">
        <span class="favsite-icon">💼</span>
        <div class="favsite-info">
          <span class="favsite-name">Wuzzuf PHP Jobs</span>
          <span class="favsite-url">wuzzuf.net</span>
        </div>
      </a>
      <a href="https://www.linkedin.com/notifications/?=" target="_blank" rel="noopener noreferrer" class="favsite-item">
        <span class="favsite-icon">🔔</span>
        <div class="favsite-info">
          <span class="favsite-name">LinkedIn Notifications</span>
          <span class="favsite-url">linkedin.com</span>
        </div>
      </a>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSfScMMS-QhL49L7o7W-vHGqzKCq3FVOvSSCY1G1-DJGM-uHzg/viewform" target="_blank" rel="noopener noreferrer" class="favsite-item">
        <span class="favsite-icon">📝</span>
        <div class="favsite-info">
          <span class="favsite-name">Google Forms</span>
          <span class="favsite-url">docs.google.com</span>
        </div>
      </a>
      <a href="https://analytics.google.com/analytics/web/?pli=1#/a149833401p326251944/reports/intelligenthome?params=_u..nav%3Dmaui" target="_blank" rel="noopener noreferrer" class="favsite-item">
        <span class="favsite-icon">📊</span>
        <div class="favsite-info">
          <span class="favsite-name">Google Analytics</span>
          <span class="favsite-url">analytics.google.com</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { useConfigStore } from '../stores/useConfigStore'
const config = useConfigStore()
</script>
