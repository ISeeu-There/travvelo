<script setup lang="ts">
import { useI18n } from '../i18n';

const { t } = useI18n();

// Interactive elements for socials or contacting
const handleSocialClick = (platform: string) => {
  console.log(`Navigating to ${platform}`)
}
</script>

<template>
  <section class="contact" id="contact">
    <div class="contact__content">
      <div class="contact__text">
        <h2 class="contact__title">
          {{ t('contact.title1') }}<br><span class="highlight-underline">{{ t('contact.title2') }}</span>
        </h2>
        
        <div class="contact__info">
          <a href="tel:+213555123456" class="contact__item">
            <span class="contact__icon">📞</span>
            <span class="contact__detail">+213 555 123 456</span>
          </a>
          <a href="mailto:hello@trevvelo.com" class="contact__item">
            <span class="contact__icon">✉️</span>
            <span class="contact__detail">hello@trevvelo.com</span>
          </a>
          <div class="contact__item">
            <span class="contact__icon">📍</span>
            <span class="contact__detail">Algiers, Algeria</span>
          </div>
        </div>
      </div>

      <!-- Right side: Mini map representation with icons -->
      <div class="contact__map-wrapper">
        <div class="contact__map">
          <!-- Dotted path representation for the travel map -->
          <svg class="contact__map-svg" viewBox="0 0 120 70" fill="none">
            <!-- Simple continent silhouettes -->
            <path d="M5 20 C 15 15, 25 25, 35 15 C 45 25, 55 10, 65 20 C 75 10, 85 30, 95 15 C 105 25, 115 15, 115 40 C 95 45, 85 35, 75 45 C 55 35, 45 45, 35 35 C 20 40, 10 30, 5 20 Z" fill="#EBE6DF" opacity="0.6"/>
            <!-- Travel route -->
            <path d="M20 45 C 40 25, 70 55, 95 30" stroke="var(--color-dark)" stroke-width="1.2" stroke-dasharray="3 2.5"/>
            <!-- Pin point -->
            <circle cx="95" cy="30" r="3" fill="var(--color-primary)"/>
            <path d="M95 30 L 91 22 M 95 30 L 98 25" stroke="var(--color-dark)" stroke-width="1"/>
          </svg>
          <div class="contact__pin-marker">📍</div>
        </div>
        
        <!-- Social handle buttons matching the black circles in mockup -->
        <div class="contact__socials">
          <button @click="handleSocialClick('instagram')" class="social-btn" aria-label="Instagram">
            <span>📸</span>
          </button>
          <button @click="handleSocialClick('facebook')" class="social-btn" aria-label="Facebook">
            <span>👤</span>
          </button>
          <button @click="handleSocialClick('tiktok')" class="social-btn" aria-label="TikTok">
            <span>🎵</span>
          </button>
          <button @click="handleSocialClick('youtube')" class="social-btn" aria-label="YouTube">
            <span>📺</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
