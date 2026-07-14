<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../i18n';

const { t, locale } = useI18n();

// List of official contracted corporate partners & airlines
const partners = [
  {
    id: 1,
    initials: 'AA',
    gradient: 'from-red-600 to-amber-700', // Air Algérie style
    keyName: 'partners.airAlgeria.name',
    keyType: 'partners.airAlgeria.type',
    keyDesc: 'partners.airAlgeria.desc'
  },
  {
    id: 2,
    initials: 'AF',
    gradient: 'from-blue-800 to-indigo-900', // Air France style
    keyName: 'partners.airFrance.name',
    keyType: 'partners.airFrance.type',
    keyDesc: 'partners.airFrance.desc'
  },
  {
    id: 3,
    initials: 'IR',
    gradient: 'from-cyan-500 to-blue-600', // Iris Smart Technology
    keyName: 'partners.iris.name',
    keyType: 'partners.iris.type',
    keyDesc: 'partners.iris.desc'
  },
  {
    id: 4,
    initials: 'CO',
    gradient: 'from-orange-500 to-red-600', // Condor Logistics
    keyName: 'partners.condor.name',
    keyType: 'partners.condor.type',
    keyDesc: 'partners.condor.desc'
  },
  {
    id: 5,
    initials: 'TA',
    gradient: 'from-emerald-500 to-teal-600', // Tassili Airlines
    keyName: 'partners.tassili.name',
    keyType: 'partners.tassili.type',
    keyDesc: 'partners.tassili.desc'
  },
  {
    id: 6,
    initials: 'SH',
    gradient: 'from-purple-600 to-rose-700', // Sheraton Premium Lodging
    keyName: 'partners.sheraton.name',
    keyType: 'partners.sheraton.type',
    keyDesc: 'partners.sheraton.desc'
  }
];

// Double items to create a perfect seamless infinite marquee
const scrollListLeft = [...partners, ...partners];
const scrollListRight = [...partners].reverse().concat([...partners].reverse());

// Localized agreement status text
const agreementStatus = computed(() => {
  if (locale.value === 'ar') return '✓ اتفاقية نشطة';
  if (locale.value === 'fr') return '✓ ACCORD VALIDE';
  return '✓ ACTIVE CONTRACT';
});
</script>

<template>
  <section class="sponsors-section py-16 px-4 md:px-8 mt-12 overflow-hidden border-t border-neutral-200/50 dark:border-neutral-800/50 transition-colors duration-300">
    <div class="max-w-6xl mx-auto text-center mb-12">
      <span class="sponsors-badge text-xs uppercase font-extrabold tracking-widest text-amber-500 dark:text-amber-400 px-3 py-1 bg-amber-500/10 rounded-full">
        ★ {{ t('partners.badge') }}
      </span>
      <h2 class="sponsors-title mt-4 text-3xl md:text-4xl font-black text-dark dark:text-white transition-colors duration-300">
        {{ t('partners.title') }}
      </h2>
      <p class="sponsors-subtitle mt-2 text-sm md:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto transition-colors duration-300">
        {{ t('partners.subtitle') }}
      </p>
    </div>

    <!-- Infinite Marquee with fades on edges -->
    <div class="marquee-container relative w-full flex flex-col gap-6 select-none">
      <!-- Gradient masks on left/right edges for premium blend -->
      <div class="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#F1EBE3] dark:from-[#121212] to-transparent z-10 pointer-events-none transition-colors duration-300"></div>
      <div class="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#F1EBE3] dark:from-[#121212] to-transparent z-10 pointer-events-none transition-colors duration-300"></div>

      <!-- Row 1: Moving Left -->
      <div class="marquee-row overflow-hidden flex py-2">
        <div class="marquee-track marquee-track-left">
          <div 
            v-for="(item, index) in scrollListLeft" 
            :key="'left-' + item.id + '-' + index"
            class="sponsor-card flex flex-col justify-between p-6 bg-white dark:bg-[#1A1A1A] border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl w-[320px] md:w-[380px] shadow-sm hover:shadow-md hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300"
          >
            <!-- Header: Logo, Name, Type -->
            <div class="flex items-start gap-4">
              <div :class="`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white font-black text-sm shadow-inner`">
                {{ item.initials }}
              </div>
              <div class="text-left flex-1 min-w-0">
                <h4 class="sponsor-name text-base font-extrabold text-dark dark:text-white truncate transition-colors duration-300 m-0">
                  {{ t(item.keyName) }}
                </h4>
                <p class="sponsor-type text-[11px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider m-0 mt-0.5">
                  {{ t(item.keyType) }}
                </p>
              </div>
            </div>

            <!-- Description of contract benefits -->
            <p class="sponsor-desc mt-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-left transition-colors duration-300">
              {{ t(item.keyDesc) }}
            </p>

            <!-- Active Badge -->
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
              <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {{ agreementStatus }}
              </span>
              <span class="text-[10px] text-neutral-400 font-mono">
                ID: TRV-{{ 1024 + item.id }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 2: Moving Right -->
      <div class="marquee-row overflow-hidden flex py-2">
        <div class="marquee-track marquee-track-right">
          <div 
            v-for="(item, index) in scrollListRight" 
            :key="'right-' + item.id + '-' + index"
            class="sponsor-card flex flex-col justify-between p-6 bg-white dark:bg-[#1A1A1A] border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl w-[320px] md:w-[380px] shadow-sm hover:shadow-md hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300"
          >
            <!-- Header: Logo, Name, Type -->
            <div class="flex items-start gap-4">
              <div :class="`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white font-black text-sm shadow-inner`">
                {{ item.initials }}
              </div>
              <div class="text-left flex-1 min-w-0">
                <h4 class="sponsor-name text-base font-extrabold text-dark dark:text-white truncate transition-colors duration-300 m-0">
                  {{ t(item.keyName) }}
                </h4>
                <p class="sponsor-type text-[11px] text-amber-500 dark:text-amber-400 font-bold uppercase tracking-wider m-0 mt-0.5">
                  {{ t(item.keyType) }}
                </p>
              </div>
            </div>

            <!-- Description of contract benefits -->
            <p class="sponsor-desc mt-4 text-xs md:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-left transition-colors duration-300">
              {{ t(item.keyDesc) }}
            </p>

            <!-- Active Badge -->
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
              <span class="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {{ agreementStatus }}
              </span>
              <span class="text-[10px] text-neutral-400 font-mono">
                ID: TRV-{{ 2048 + item.id }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sponsors-section {
  background: var(--color-off-white);
}

.sponsors-title {
  font-family: var(--font-serif);
}

.marquee-container {
  overflow-x: hidden;
}

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
}

.marquee-track-left {
  animation: scrollLeft 40s linear infinite;
}

.marquee-track-right {
  animation: scrollRight 40s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes scrollLeft {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes scrollRight {
  0% {
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

/* Maintain proper alignment under RTL direction */
html[dir="rtl"] .marquee-track-left {
  animation: scrollRight 40s linear infinite;
}

html[dir="rtl"] .marquee-track-right {
  animation: scrollLeft 40s linear infinite;
}

html[dir="rtl"] .sponsor-desc {
  text-align: right;
}

html[dir="rtl"] .text-left {
  text-align: right;
}
</style>
