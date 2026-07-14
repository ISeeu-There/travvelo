<script setup lang="ts">
import { inject, computed } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();
const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

// Service item data matching Section 5 icons
const services = [
  { id: 1, title: 'Flight Booking', icon: '✈️', key: 'flight' },
  { id: 2, title: 'Hotel Reservation', icon: '🏨', key: 'hotel' },
  { id: 3, title: 'Visa Assistance', icon: '🎫', key: 'visa' },
  { id: 4, title: 'Travel Insurance', icon: '🛡️', key: 'insurance' },
  { id: 5, title: 'Tour Guides', icon: '🗺️', key: 'guides' },
  { id: 6, title: '24/7 Support', icon: '📞', key: 'support' }
];

const translatedServices = computed(() => {
  return services.map(s => ({
    ...s,
    title: t('services.' + s.key)
  }));
});

const handleCardClick = (service: any, event: MouseEvent) => {
  if (openCard) {
    openCard('service', service, event);
  }
};
</script>

<template>
  <section class="services">
    <!-- Overlay/Background mimicking the tropical paraglider bay background -->
    <div class="services__bg">
      <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" alt="Beautiful tropical bay" />
      <div class="services__overlay"></div>
    </div>

    <div class="services__content">
      <div class="services__header">
        <h2 class="services__title">{{ t('services.title1') }}<br><em>{{ t('services.title2') }}</em></h2>
        <!-- Decorative paraglider path -->
        <div class="services__paraglider">
          🪂
        </div>
      </div>

      <div class="services__grid">
        <div 
          v-for="(service, idx) in translatedServices" 
          :key="service.id" 
          :class="idx % 2 === 0 ? 'float-ambient-1' : 'float-ambient-2'"
          class="service-item cursor-pointer group" 
          @click="handleCardClick(service, $event)"
        >
          <div class="service-item__icon-wrapper transition-all duration-300 group-hover:bg-amber-400 group-hover:scale-110 group-hover:rotate-12">
            <span class="service-item__icon">{{ service.icon }}</span>
          </div>
          <span class="service-item__title transition-colors duration-300 group-hover:text-amber-400 font-medium">{{ service.title }}</span>
          <!-- Dynamic indicator chevron -->
          <svg class="service-chevron ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
