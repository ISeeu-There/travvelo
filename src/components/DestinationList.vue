<script setup lang="ts">
import { inject, computed } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();
const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

const destinations = [
  {
    id: 1,
    name: 'Greece',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    location: 'Europe',
    key: 'greece',
    regionKey: 'europe'
  },
  {
    id: 2,
    name: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    location: 'Asia',
    key: 'japan',
    regionKey: 'asia'
  },
  {
    id: 3,
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    location: 'Middle East',
    key: 'dubai',
    regionKey: 'middleEast'
  },
  {
    id: 4,
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    location: 'Indonesia',
    key: 'bali',
    regionKey: 'indonesia'
  }
];

const translatedDestinations = computed(() => {
  return destinations.map(dest => ({
    ...dest,
    name: t('destinations.countries.' + dest.key),
    location: t('destinations.regions.' + dest.regionKey)
  }));
});

const handleCardClick = (dest: any, event: MouseEvent) => {
  if (openCard) {
    openCard('destination', dest, event);
  }
};
</script>

<template>
  <section class="top-destinations" id="destinations">
    <div class="top-destinations__header flex items-center justify-between">
      <h2 class="top-destinations__title">{{ t('destinations.title') }}</h2>
    </div>

    <div class="view-container">
      <div class="top-destinations__list flex-1">
        <div 
          v-for="(dest, idx) in translatedDestinations" 
          :key="dest.id" 
          :class="idx % 2 === 0 ? 'float-ambient-1' : 'float-ambient-2'"
          class="dest-card cursor-pointer group" 
          @click="handleCardClick(dest, $event)"
        >
          <img :src="dest.image" :alt="dest.name" class="dest-card__img transition-transform duration-700 group-hover:scale-110" />
          <div class="dest-card__tag transition-all duration-300 group-hover:bg-amber-400 group-hover:text-dark">
            <span class="dest-card__pin">📍</span>
            <span class="dest-card__name font-semibold">{{ dest.name }} ({{ dest.location }})</span>
          </div>
          <!-- Absolute overlay badge -->
          <span class="absolute top-4 right-4 text-[10px] bg-amber-400 text-dark font-bold px-2 py-0.5 rounded-full uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{ t('nav.explore') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.top-destinations {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-destinations__header {
  margin-bottom: 16px;
}

.view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
}
</style>
