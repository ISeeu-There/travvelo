<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '../i18n';

const { t, locale } = useI18n();

const partnersRow1 = [
  {
    id: 'airalgeria',
    initials: 'AA',
    keyName: 'partners.airAlgeria.name',
    keyType: 'partners.airAlgeria.type',
    keyDesc: 'partners.airAlgeria.desc',
    contractId: 'TRV-1025'
  },
  {
    id: 'airfrance',
    initials: 'AF',
    keyName: 'partners.airFrance.name',
    keyType: 'partners.airFrance.type',
    keyDesc: 'partners.airFrance.desc',
    contractId: 'TRV-1026'
  },
  {
    id: 'iris',
    initials: 'IR',
    keyName: 'partners.iris.name',
    keyType: 'partners.iris.type',
    keyDesc: 'partners.iris.desc',
    contractId: 'TRV-1027'
  },
  {
    id: 'condor',
    initials: 'CO',
    keyName: 'partners.condor.name',
    keyType: 'partners.condor.type',
    keyDesc: 'partners.condor.desc',
    contractId: 'TRV-1028'
  }
];

const partnersRow2 = [
  {
    id: 'sheraton',
    initials: 'SH',
    keyName: 'partners.sheraton.name',
    keyType: 'partners.sheraton.type',
    keyDesc: 'partners.sheraton.desc',
    contractId: 'TRV-2054'
  },
  {
    id: 'tassili',
    initials: 'TA',
    keyName: 'partners.tassili.name',
    keyType: 'partners.tassili.type',
    keyDesc: 'partners.tassili.desc',
    contractId: 'TRV-2053'
  },
  {
    id: 'condor2',
    initials: 'CO',
    keyName: 'partners.condor.name',
    keyType: 'partners.condor.type',
    keyDesc: 'partners.condor.desc',
    contractId: 'TRV-2052'
  },
  {
    id: 'iris2',
    initials: 'IR',
    keyName: 'partners.iris.name',
    keyType: 'partners.iris.type',
    keyDesc: 'partners.iris.desc',
    contractId: 'TRV-2051'
  }
];

const checkmarkText = computed(() => {
  return '✓';
});

const activeContractPrefixText = computed(() => {
  if (locale.value === 'ar') return 'معرف العقد النشط:';
  if (locale.value === 'fr') return 'ID CONTRAT ACTIF :';
  return 'ACTIVE CONTRACT ID:';
});
</script>

<template>
  <section class="sponsors-section" id="partners">
    <div class="sponsors-container">
      
      <!-- Section Header -->
      <div class="sponsors-header">
        <span class="sponsors-badge">
          ★ {{ t('partners.badge') }}
        </span>
        <h2 class="sponsors-title">
          {{ t('partners.title') }}
        </h2>
        <p class="sponsors-subtitle">
          {{ t('partners.subtitle') }}
        </p>
      </div>

      <!-- Infinite Scrolling Marquee -->
      <div class="marquee-wrapper">
        <!-- Soft Edge Fades for visual blend -->
        <div class="edge-mask mask-left"></div>
        <div class="edge-mask mask-right"></div>

        <!-- Row 1: Scrolling Left -->
        <div class="marquee-row scroll-left-row">
          <div class="marquee-track">
            <!-- Tripled the content for absolute seamless loop across extra-wide viewports -->
            <div 
              v-for="(item, idx) in [...partnersRow1, ...partnersRow1, ...partnersRow1, ...partnersRow1]" 
              :key="`row1-${item.id}-${idx}`"
              class="partner-card"
            >
              <div class="card-top">
                <span class="partner-initials">{{ item.initials }}</span>
                <div class="partner-info">
                  <h4 class="partner-name">{{ t(item.keyName) }}</h4>
                  <span class="partner-type">{{ t(item.keyType) }}</span>
                </div>
              </div>
              <p class="partner-desc">{{ t(item.keyDesc) }}</p>
              <div class="card-footer">
                <span class="contract-status">
                  <span class="check-dot">{{ checkmarkText }}</span>
                  {{ activeContractPrefixText }} {{ item.contractId }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Scrolling Right -->
        <div class="marquee-row scroll-right-row">
          <div class="marquee-track">
            <!-- Tripled the content for absolute seamless loop across extra-wide viewports -->
            <div 
              v-for="(item, idx) in [...partnersRow2, ...partnersRow2, ...partnersRow2, ...partnersRow2]" 
              :key="`row2-${item.id}-${idx}`"
              class="partner-card"
            >
              <div class="card-top">
                <span class="partner-initials">{{ item.initials }}</span>
                <div class="partner-info">
                  <h4 class="partner-name">{{ t(item.keyName) }}</h4>
                  <span class="partner-type">{{ t(item.keyType) }}</span>
                </div>
              </div>
              <p class="partner-desc">{{ t(item.keyDesc) }}</p>
              <div class="card-footer">
                <span class="contract-status">
                  <span class="check-dot">{{ checkmarkText }}</span>
                  {{ activeContractPrefixText }} {{ item.contractId }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.sponsors-section {
  background-color: var(--color-off-white);
  padding: 80px 0;
  border-top: 1px solid var(--color-border);
  overflow: hidden;
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
}

.sponsors-container {
  width: 100%;
  max-width: 100%;
}

.sponsors-header {
  text-align: center;
  margin-bottom: 48px;
  padding: 0 24px;
}

.sponsors-badge {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: var(--color-primary);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.sponsors-title {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-dark);
  margin-bottom: 16px;
  line-height: 1.2;
}

.sponsors-subtitle {
  font-family: var(--font-sans);
  font-size: 15px;
  color: var(--color-text-light);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Marquee wrapper and gradients */
.marquee-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  user-select: none;
}

.edge-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 150px;
  z-index: 5;
  pointer-events: none;
}

.mask-left {
  left: 0;
  background: linear-gradient(to right, var(--color-off-white), transparent);
}

.mask-right {
  right: 0;
  background: linear-gradient(to left, var(--color-off-white), transparent);
}

/* Rows and Tracks */
.marquee-row {
  width: 100%;
  overflow: hidden;
  display: flex;
}

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
  will-change: transform;
}

/* Animations */
.scroll-left-row .marquee-track {
  animation: scroll-left-anim 40s linear infinite;
}

.scroll-right-row .marquee-track {
  animation: scroll-right-anim 40s linear infinite;
}

/* Hover pauses the marquee for readable premium UX */
.marquee-row:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes scroll-left-anim {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes scroll-right-anim {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Cards Design */
.partner-card {
  flex-shrink: 0;
  width: 320px;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.015);
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
}

.partner-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.04);
}

.card-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.partner-initials {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background-color: var(--color-bg-card);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 900;
  color: var(--color-primary);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.partner-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
}

.partner-name {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-dark);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner-type {
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-primary);
}

.partner-desc {
  font-family: var(--font-sans);
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--color-text-light);
  margin: 0 0 16px 0;
  flex-grow: 1;
  text-align: left;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px dashed var(--color-border);
}

.contract-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

.check-dot {
  color: #10B981; /* Emerald green */
  font-weight: bold;
}

/* Dark mode tweaks */
html.dark-mode .partner-card {
  background-color: var(--color-white);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .partner-card:hover {
  border-color: var(--color-primary);
}

html.dark-mode .partner-initials {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.05);
}

/* RTL handling */
html[dir="rtl"] .sponsors-header {
  direction: rtl;
}
html[dir="rtl"] .partner-info {
  text-align: right;
}
html[dir="rtl"] .partner-desc {
  text-align: right;
}
html[dir="rtl"] .contract-status {
  flex-direction: row-reverse;
}

/* Responsive styles */
@media (max-width: 768px) {
  .sponsors-section {
    padding: 60px 0;
  }
  .sponsors-title {
    font-size: 1.85rem;
  }
  .sponsors-subtitle {
    font-size: 13.5px;
  }
  .edge-mask {
    width: 60px;
  }
  .partner-card {
    width: 280px;
    padding: 18px;
  }
}
</style>
