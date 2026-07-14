<script setup lang="ts">
import { inject, computed } from 'vue';
import teamYassine from '../assets/team-yassine.png'
import teamLina from '../assets/team-lina.png'
import teamAmine from '../assets/team-amine.png'
import teamSara from '../assets/team-sara.png'
import teamRiad from '../assets/team-riad.png'
import { useI18n } from '../i18n';

const { t } = useI18n();
const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

const members = [
  {
    id: 'yassine',
    name: 'Yassine B.',
    role: 'Founder & CEO',
    image: teamYassine,
    bio: 'Yassine is an explorer and entrepreneur with over 15 years in luxury tourism. Having traversed 6 continents, his mission is to build highly curated journeys that respect local ecosystems.',
    languages: 'Arabic, French, English, Spanish',
    experienceYears: '15 Years',
    countriesVisited: 84,
    favDest: 'Kyoto, Japan'
  },
  {
    id: 'lina',
    name: 'Lina D.',
    role: 'Travel Planner',
    image: teamLina,
    bio: 'Lina specializes in custom European retreats and cultural getaways. Her attention to detail and relationships with boutique hotels ensures a flawless trip.',
    languages: 'French, English, Italian',
    experienceYears: '6 Years',
    countriesVisited: 32,
    favDest: 'Amalfi Coast, Greece'
  },
  {
    id: 'amine',
    name: 'Amine K.',
    role: 'Experience Manager',
    image: teamAmine,
    bio: 'Amine leads our physical exploration routes and verifies each local guide. If you are doing an alpine assault, Amine personally coordinates the safety packets.',
    languages: 'Arabic, English, Berber',
    experienceYears: '8 Years',
    countriesVisited: 22,
    favDest: 'Atlas Mountains, Algeria'
  },
  {
    id: 'sara',
    name: 'Sara M.',
    role: 'Customer Care',
    image: teamSara,
    bio: 'Sara ensures your journey is comfortable from takeoff to return. Available 24/7, she acts as your primary liaison during any flight or weather changes.',
    languages: 'English, French, Turkish',
    experienceYears: '5 Years',
    countriesVisited: 18,
    favDest: 'Cappadocia, Turkey'
  },
  {
    id: 'riad',
    name: 'Riad T.',
    role: 'Operations',
    image: teamRiad,
    bio: 'Riad handles international logistics, insurance approvals, and private jet chartering operations. The backbone of Trevvelo.',
    languages: 'Arabic, English, French',
    experienceYears: '10 Years',
    countriesVisited: 41,
    favDest: 'Dubai, UAE'
  }
];

const translatedMembers = computed(() => {
  return members.map(m => ({
    ...m,
    role: t('team.member.' + m.id + '.role'),
    bio: t('team.member.' + m.id + '.bio'),
    favDest: t('team.member.' + m.id + '.favDest')
  }));
});

const handleCardClick = (member: any, event: MouseEvent) => {
  if (openCard) {
    openCard('team', member, event);
  }
};
</script>

<template>
  <section class="team" id="team">
    <div class="team__header">
      <div class="team__title-wrapper">
        <h2 class="team__title">{{ t('team.title1') }}<br><span class="highlight-circle">{{ t('team.title2') }}</span></h2>
        <!-- Simple line decoration representing a paper plane path -->
        <svg class="team__plane-path" viewBox="0 0 100 50" fill="none">
          <path d="M5 45 C 20 10, 60 10, 85 20" stroke="#1A1A1A" stroke-width="1.5" stroke-dasharray="4 3"/>
          <path d="M85 20 L 78 15 M 85 20 L 80 27" stroke="#1A1A1A" stroke-width="1.5"/>
        </svg>
      </div>
      <p class="team__subtitle">
        {{ t('team.subtitle') }}
      </p>
    </div>

    <div class="team__grid">
      <!-- Founder & CEO -->
      <div class="team-card team-card--ceo cursor-pointer group float-ambient-1" @click="handleCardClick(translatedMembers[0], $event)">
        <div class="team-card__image-container overflow-hidden">
          <img :src="translatedMembers[0].image" :alt="translatedMembers[0].name" class="team-card__img transition-transform duration-500 group-hover:scale-110" />
        </div>
        <div class="team-card__info transition-transform duration-300 group-hover:-translate-y-1">
          <h3 class="team-card__name flex items-center justify-between">
            <span>{{ translatedMembers[0].name }}</span>
            <span class="text-[10px] bg-amber-500 text-dark px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{{ t('nav.meet') }}</span>
          </h3>
          <p class="team-card__role">{{ translatedMembers[0].role }}</p>
          <span class="team-card__dot"></span>
        </div>
      </div>

      <!-- Grid for other team members -->
      <div class="team__subgrid">
        <div 
          v-for="(m, idx) in translatedMembers.slice(1)" 
          :key="m.id" 
          :class="idx % 2 === 0 ? 'float-ambient-2' : 'float-ambient-1'"
          class="team-card cursor-pointer group" 
          @click="handleCardClick(m, $event)"
        >
          <div class="team-card__image-container overflow-hidden">
            <img :src="m.image" :alt="m.name" class="team-card__img transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div class="team-card__info transition-transform duration-300 group-hover:-translate-y-1">
            <h3 class="team-card__name flex items-center justify-between">
              <span>{{ m.name }}</span>
              <span class="text-[9px] bg-amber-500 text-dark px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition-opacity">{{ t('nav.meet') }}</span>
            </h3>
            <p class="team-card__role">{{ m.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
