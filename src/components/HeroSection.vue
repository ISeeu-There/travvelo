<script setup lang="ts">
import { ref, onMounted } from 'vue';
import heroImg from '../assets/hero.jpg'
import { useI18n } from '../i18n';

const { t } = useI18n();

const travelersCount = ref(100);

onMounted(() => {
  let current = 100;
  const target = 1450;
  const step = 45;
  const timer = setInterval(() => {
    if (current >= target) {
      travelersCount.value = target;
      clearInterval(timer);
    } else {
      current += step;
      travelersCount.value = current;
    }
  }, 35);
});

const scrollToDestinations = (e: Event) => {
  e.preventDefault();
  const el = document.getElementById('destinations');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <section class="hero" id="hero">
    <!-- Background Image with Ken Burns animation class -->
    <div class="hero__bg overflow-hidden">
      <img :src="heroImg" alt="Traveler overlooking mountains" class="animate-ken-burns scale-105" />
      <div class="hero__overlay"></div>
    </div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar__brand">
        <svg class="navbar__logo-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="logo-path" d="M15 15 L25 35 L35 15" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span class="navbar__name">{{ t('nav.logo') }}</span>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="hero__content">
      <div class="hero__text">
        <!-- Decorative elements -->
        <div class="hero__deco-plane">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
          </svg>
        </div>
        <div class="hero__deco-x">✕</div>

        <h1 class="hero__title">
          <span class="hero__title-line">{{ t('hero.title1') }}</span>
          <span class="hero__title-line"><em>{{ t('hero.title2') }}</em></span>
          <span class="hero__title-line"><em>{{ t('hero.title3') }}</em></span>
        </h1>
        <p class="hero__desc">
          {{ t('hero.subtitle') }}
        </p>
        <div class="hero__actions">
          <a href="#destinations" @click="scrollToDestinations" class="hero__btn hero__btn--primary transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
            {{ t('hero.exploreBtn') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          
        </div>
      </div>

      <div class="hero__stats">
        <div class="hero__avatars">
          <div class="hero__avatar" style="background: #F5A623;"></div>
          <div class="hero__avatar" style="background: #E8951A;"></div>
          <div class="hero__avatar" style="background: #D4801F;"></div>
          <div class="hero__avatar" style="background: #C07025;"></div>
        </div>
        <div class="hero__rating">
          <div class="hero__stars">
            <span class="hero__rating-value">4.9/5</span>
            <span class="hero__stars-icons">★★★★★</span>
          </div>
          <span class="hero__travelers">{{ travelersCount }}+ {{ t('hero.travelers') }}</span>
        </div>
      </div>
    </div>

    <!-- Dashed path decoration -->
    <svg class="hero__deco-path" viewBox="0 0 200 100" fill="none">
      <path d="M10 80 Q 60 10, 120 50 T 190 20" stroke="white" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4" fill="none"/>
      <polygon points="188,18 192,24 185,22" fill="white" opacity="0.4"/>
    </svg>
  </section>
</template>

<style scoped>

</style>
