<script setup lang="ts">
import { inject, computed, ref } from 'vue';
import { useI18n } from '../i18n';
import InteractiveMap from './InteractiveMap.vue';

const { t } = useI18n();
const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

const activeView = ref<'grid' | 'map'>('grid');

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
      
      <!-- Premium View Toggle -->
      <div class="view-toggle-pill flex items-center">
        <button 
          @click="activeView = 'grid'" 
          :class="{ active: activeView === 'grid' }"
          class="view-toggle-btn"
        >
          {{ t('destinations.gridView') }}
        </button>
        <button 
          @click="activeView = 'map'" 
          :class="{ active: activeView === 'map' }"
          class="view-toggle-btn"
        >
          {{ t('destinations.mapView') }}
        </button>
      </div>
    </div>

    <div class="view-container">
      <Transition name="fade-slide" mode="out-in">
        <div v-if="activeView === 'grid'" key="grid" class="top-destinations__list flex-1">
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
        
        <div v-else key="map" class="map-view-wrapper flex-1">
          <InteractiveMap />
        </div>
      </Transition>
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

.view-toggle-pill {
  background: #F1EBE3;
  border: 1px solid rgba(229, 224, 216, 0.6);
  border-radius: 20px;
  padding: 2px;
  gap: 2px;
}

.view-toggle-btn {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-light);
  padding: 4px 14px;
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
}

.view-toggle-btn:hover {
  color: var(--color-dark);
}

.view-toggle-btn.active {
  background: var(--color-dark);
  color: var(--color-white);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.view-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 0;
}

.map-view-wrapper {
  width: 100%;
  height: 100%;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Dark mode local overrides */
:global(.dark-mode) .view-toggle-pill {
  background: #2D2D2D;
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .view-toggle-btn {
  color: #AAAAAA;
}

:global(.dark-mode) .view-toggle-btn:hover {
  color: #FFFFFF;
}

:global(.dark-mode) .view-toggle-btn.active {
  background: var(--color-primary);
  color: #1A1A1A;
}
</style>
