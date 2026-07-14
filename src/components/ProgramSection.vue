<script setup lang="ts">
import { inject } from 'vue';

const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

// Program images using high quality Unsplash placeholders matching the mockup theme
const programs = [
  {
    id: 1,
    title: 'Adventure Trips',
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80',
    icon: '🏔️'
  },
  {
    id: 2,
    title: 'Cultural Experiences',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    icon: '🏛️'
  },
  {
    id: 3,
    title: 'Relax & Beach Getaways',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    icon: '🌴'
  },
  {
    id: 4,
    title: 'Custom Programs',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    icon: '⭐'
  }
];

const handleCardClick = (program: any, event: MouseEvent) => {
  if (openCard) {
    openCard('program', program, event);
  }
};
</script>

<template>
  <section class="programs" id="programs">
    <div class="programs__header">
      <div class="programs__title-wrapper">
        <h2 class="programs__title">Our<br><span class="highlight-circle">Programs</span></h2>
        <!-- Decorative path lines -->
        <svg class="programs__path-deco" viewBox="0 0 100 30" fill="none">
          <path d="M5 25 C 30 5, 70 5, 95 15" stroke="rgba(0,0,0,0.15)" stroke-width="1.5" stroke-dasharray="3 3"/>
        </svg>
      </div>
    </div>

    <div class="programs__cards">
      <div v-for="program in programs" :key="program.id" class="program-card cursor-pointer group" @click="handleCardClick(program, $event)">
        <img :src="program.image" :alt="program.title" class="program-card__img transition-transform duration-700 group-hover:scale-110" />
        <div class="program-card__overlay transition-opacity duration-300 group-hover:opacity-40"></div>
        <div class="program-card__content transition-transform duration-300 group-hover:-translate-y-1">
          <div class="program-card__icon-badge transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <span class="program-card__icon">{{ program.icon }}</span>
          </div>
          <h3 class="program-card__title flex items-center justify-between gap-2 mt-2">
            <span>{{ program.title }}</span>
            <span class="text-[10px] bg-amber-400 text-dark px-2.5 py-0.5 rounded-full font-bold uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">Open</span>
          </h3>
        </div>
      </div>
    </div>

    <div class="programs__footer">
      <div class="programs__stamp">
        <span class="programs__stamp-text">TIME TO TRAVEL</span>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
