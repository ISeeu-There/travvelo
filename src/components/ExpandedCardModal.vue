<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { useI18n } from '../i18n';

const { t } = useI18n();

const props = defineProps<{
  activeCard: {
    type: 'team' | 'program' | 'destination' | 'service';
    data: any;
    rect: DOMRect | null;
  } | null;
}>();

const emit = defineEmits(['close']);

const modalOpen = ref(false);
const modalEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const backdropEl = ref<HTMLElement | null>(null);
const particleCanvas = ref<HTMLCanvasElement | null>(null);

// Form / Interactive states
const bookSuccess = ref(false);
const bookDate = ref('');
const bookTime = ref('');
const bookName = ref('');
const bookPhone = ref('');

// Custom Program states
const budgetTier = ref('standard');
const customDest = ref('Japan');
const durationDays = ref(7);
const customPeople = ref(2);
const customActivities = ref<string[]>(['Hiking', 'Food Tasting']);
const activityOptions = ['Hiking', 'Cultural Tours', 'Water Sports', 'Shopping', 'Food Tasting', 'Relaxing'];

// Live Chat State
interface ChatMessage {
  sender: 'user' | 'bot';
  text?: string;
  textKey?: string;
}

const chatMessages = ref<ChatMessage[]>([
  { sender: 'bot', textKey: 'modal.chatInitial' }
]);
const userMessage = ref('');
const isTyping = ref(false);
const suggestedChats = [
  { key: 'delay', textKey: 'modal.chatSuggest.delay' },
  { key: 'claim', textKey: 'modal.chatSuggest.claim' },
  { key: 'rules', textKey: 'modal.chatSuggest.rules' },
  { key: 'emergency', textKey: 'modal.chatSuggest.emergency' }
];

// Visa selector states
const visaCountry = ref('Japan');
const visaRequiredDocs = ref<string[]>([]);
const visaFee = ref('modal.visaFeeJapan');
const visaProcessing = ref('modal.visaTimeJapan');
const visaEligibility = ref(95);

// Hotel states
const checkIn = ref('');
const checkOut = ref('');
const roomsCount = ref(1);
const selectedRoomType = ref('deluxe');

// Flight state
const flightFrom = ref('CDG, Paris');
const flightTo = ref('NRT, Tokyo');
const flightClass = ref('economy');

// Insurance states
const insAge = ref(30);
const insDuration = ref(10);
const insTier = ref('premium');

// Particles loop handles
let animFrameId: number | null = null;

// Trigger GSAP Morph Transition
watch(() => props.activeCard, async (newVal) => {
  if (newVal) {
    modalOpen.value = true;
    bookSuccess.value = false;
    await nextTick();
    
    // Set up custom particles if it's a destination
    if (newVal.type === 'destination') {
      initParticles(newVal.data.name);
    }
    
    // GSAP Flip-like morphing entrance
    if (newVal.rect && modalEl.value && backdropEl.value) {
      const fromRect = newVal.rect;
      
      // Force initial position matching the clicked card
      gsap.set(modalEl.value, {
        x: fromRect.left,
        y: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        borderRadius: '18px',
        opacity: 0,
        scale: 0.95,
        transformOrigin: 'top left'
      });
      
      gsap.set(backdropEl.value, { opacity: 0 });
      if (contentEl.value) {
        gsap.set(contentEl.value.children, { opacity: 0, y: 20 });
      }

      // Timeline for beautiful organic reveal
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      
      tl.to(backdropEl.value, {
        opacity: 1,
        duration: 0.5
      });
      
      tl.to(modalEl.value, {
        x: 0,
        y: 0,
        width: '100%',
        height: '100%',
        borderRadius: '0px',
        scale: 1,
        opacity: 1,
        duration: 0.85,
        clearProps: 'transformOrigin'
      }, '<');

      if (contentEl.value) {
        tl.to(contentEl.value.children, {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6
        }, '-=0.45');
      }
    }
  } else {
    stopParticles();
  }
});

// Close modal animation (Reverse morph)
const closeModal = () => {
  if (props.activeCard && props.activeCard.rect && modalEl.value && backdropEl.value) {
    const toRect = props.activeCard.rect;
    
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        modalOpen.value = false;
        emit('close');
      }
    });

    if (contentEl.value) {
      tl.to(contentEl.value.children, {
        opacity: 0,
        y: 15,
        duration: 0.25,
        stagger: 0.03
      });
    }

    tl.to(modalEl.value, {
      x: toRect.left,
      y: toRect.top,
      width: toRect.width,
      height: toRect.height,
      borderRadius: '18px',
      scale: 0.95,
      opacity: 0,
      duration: 0.65
    }, '-=0.1');

    tl.to(backdropEl.value, {
      opacity: 0,
      duration: 0.4
    }, '<');
  } else {
    modalOpen.value = false;
    emit('close');
  }
};

// Handle booking consultation forms
const handleBookSubmit = () => {
  if (!bookName.value || !bookPhone.value) return;
  bookSuccess.value = true;
  setTimeout(() => {
    // Reset after some time or close
  }, 4000);
};

// Calculate Custom Program Live Price
const calculateLivePrice = () => {
  let basePrice = 250; // per day base
  if (budgetTier.value === 'budget') basePrice = 120;
  if (budgetTier.value === 'luxury') basePrice = 650;
  
  let actPrice = customActivities.value.length * 45;
  let total = (basePrice * durationDays.value + actPrice) * customPeople.value;
  
  if (customDest.value === 'Dubai') total *= 1.25;
  if (customDest.value === 'Greece') total *= 1.15;
  return Math.round(total);
};

// Chatbot messages responder
const handleSendMessage = (q?: { key: string, textKey: string }) => {
  const msgText = q ? t(q.textKey) : userMessage.value;
  if (!msgText.trim()) return;
  
  chatMessages.value.push({ sender: 'user', text: msgText });
  if (!q) userMessage.value = '';
  
  isTyping.value = true;
  
  let responseKey = 'modal.chatResponseDefault';
  const query = msgText.toLowerCase();
  
  if (q) {
    if (q.key === 'delay') responseKey = 'modal.chatResponseDelay';
    else if (q.key === 'claim') responseKey = 'modal.chatResponseInsurance';
    else if (q.key === 'rules') responseKey = 'modal.chatResponseVisa';
    else if (q.key === 'emergency') responseKey = 'modal.chatResponseEmergency';
  } else {
    if (query.includes('delay') || query.includes('flight') || query.includes('retard') || query.includes('تاخ') || query.includes('تأخ')) {
      responseKey = 'modal.chatResponseDelay';
    } else if (query.includes('insurance') || query.includes('claim') || query.includes('assurance') || query.includes('تأمين') || query.includes('تامين')) {
      responseKey = 'modal.chatResponseInsurance';
    } else if (query.includes('visa') || query.includes('japan') || query.includes('تأشير') || query.includes('تاشير')) {
      responseKey = 'modal.chatResponseVisa';
    } else if (query.includes('emergency') || query.includes('contact') || query.includes('urgence') || query.includes('طوارئ') || query.includes('طوارئ')) {
      responseKey = 'modal.chatResponseEmergency';
    }
  }

  setTimeout(() => {
    isTyping.value = false;
    chatMessages.value.push({ sender: 'bot', textKey: responseKey });
  }, 1200);
};

// Handle Visa Selector Data
watch(visaCountry, (newVal) => {
  if (newVal === 'Japan') {
    visaRequiredDocs.value = ['modal.visaDocJapan1', 'modal.visaDocJapan2', 'modal.visaDocJapan3', 'modal.visaDocJapan4'];
    visaFee.value = 'modal.visaFeeJapan';
    visaProcessing.value = 'modal.visaTimeJapan';
    visaEligibility.value = 98;
  } else if (newVal === 'Greece') {
    visaRequiredDocs.value = ['modal.visaDocGreece1', 'modal.visaDocGreece2', 'modal.visaDocGreece3', 'modal.visaDocGreece4'];
    visaFee.value = 'modal.visaFeeGreece';
    visaProcessing.value = 'modal.visaTimeGreece';
    visaEligibility.value = 92;
  } else if (newVal === 'Dubai') {
    visaRequiredDocs.value = ['modal.visaDocDubai1', 'modal.visaDocDubai2', 'modal.visaDocDubai3', 'modal.visaDocDubai4'];
    visaFee.value = 'modal.visaFeeDubai';
    visaProcessing.value = 'modal.visaTimeDubai';
    visaEligibility.value = 99;
  } else if (newVal === 'Bali') {
    visaRequiredDocs.value = ['modal.visaDocBali1', 'modal.visaDocBali2', 'modal.visaDocBali3'];
    visaFee.value = 'modal.visaFeeBali';
    visaProcessing.value = 'modal.visaTimeBali';
    visaEligibility.value = 100;
  }
}, { immediate: true });

// Particle system setup
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation?: number;
  rotSpeed?: number;
}

const initParticles = (destName: string) => {
  const canvas = particleCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const particles: Particle[] = [];
  const maxParticles = destName === 'Japan' ? 80 : 40;
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(createParticle(canvas.width, canvas.height, destName));
  }
  
  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, idx) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      
      if (destName === 'Japan') {
        // Cherry blossom petals
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        // Drawing heart/oval petal shape
        ctx.ellipse(0, 0, p.size, p.size * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        p.rotation = (p.rotation || 0) + (p.rotSpeed || 0.01);
      } else if (destName === 'Dubai') {
        // Golden luxury particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFD233';
        ctx.fill();
      } else if (destName === 'Greece') {
        // Ocean blue rings
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
        p.size += 0.2; // Expanding rings
        p.alpha -= 0.005; // Fade out
      } else {
        // Bali tropical green leaves
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation || 0);
        ctx.beginPath();
        // Leaf shape
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size, 0, 0, p.size);
        ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
        ctx.fill();
        p.rotation = (p.rotation || 0) + (p.rotSpeed || 0.01);
      }
      
      ctx.restore();
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      
      // Recycle particles
      if (p.y > canvas.height || p.x > canvas.width || p.x < -20 || p.alpha <= 0) {
        particles[idx] = createParticle(canvas.width, canvas.height, destName, true);
      }
    });
    
    animFrameId = requestAnimationFrame(draw);
  };
  
  animFrameId = requestAnimationFrame(draw);
};

const createParticle = (width: number, height: number, destName: string, topOnly = false): Particle => {
  const isJapan = destName === 'Japan';
  const isDubai = destName === 'Dubai';
  const isGreece = destName === 'Greece';
  
  const yVal = topOnly ? -20 : Math.random() * height;
  
  if (isJapan) {
    return {
      x: Math.random() * width,
      y: yVal,
      vx: Math.random() * 1.5 - 0.5,
      vy: Math.random() * 1.5 + 0.8,
      size: Math.random() * 4 + 3,
      color: `rgba(255, ${Math.floor(Math.random() * 40) + 160}, ${Math.floor(Math.random() * 40) + 180}, 0.85)`,
      alpha: Math.random() * 0.4 + 0.5,
      rotation: Math.random() * Math.PI,
      rotSpeed: Math.random() * 0.02 - 0.01
    };
  } else if (isDubai) {
    return {
      x: Math.random() * width,
      y: topOnly ? height + 20 : Math.random() * height, // Floats upward
      vx: Math.random() * 0.6 - 0.3,
      vy: -(Math.random() * 1.2 + 0.5),
      size: Math.random() * 3 + 1.5,
      color: `rgba(255, ${Math.floor(Math.random() * 55) + 190}, 51, ${Math.random() * 0.3 + 0.5})`,
      alpha: Math.random() * 0.5 + 0.4
    };
  } else if (isGreece) {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      size: Math.random() * 15 + 5,
      color: `rgba(135, 206, 250, ${Math.random() * 0.2 + 0.1})`,
      alpha: Math.random() * 0.4 + 0.2
    };
  } else {
    // Bali leaves
    return {
      x: Math.random() * width,
      y: yVal,
      vx: Math.random() * 1.2 - 0.6,
      vy: Math.random() * 1.0 + 0.6,
      size: Math.random() * 5 + 4,
      color: `rgba(${Math.floor(Math.random() * 30) + 40}, ${Math.floor(Math.random() * 50) + 150}, ${Math.floor(Math.random() * 40) + 80}, 0.7)`,
      alpha: Math.random() * 0.4 + 0.4,
      rotation: Math.random() * Math.PI,
      rotSpeed: Math.random() * 0.03 - 0.015
    };
  }
};

const stopParticles = () => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
};

const handleResize = () => {
  if (particleCanvas.value) {
    particleCanvas.value.width = window.innerWidth;
    particleCanvas.value.height = window.innerHeight;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  stopParticles();
});
</script>

<template>
  <div v-if="modalOpen" class="expanded-modal-overlay">
    <!-- Backdrop Blur & Fade -->
    <div ref="backdropEl" class="expanded-modal-backdrop" @click="closeModal"></div>
    
    <!-- Floating canvas for particles (Japan blossoms, Dubai gold dust, etc) -->
    <canvas v-if="props.activeCard?.type === 'destination'" ref="particleCanvas" class="destination-canvas-particles"></canvas>

    <!-- Main Modal Shell -->
    <div ref="modalEl" class="expanded-modal-container" :class="[`theme-${props.activeCard?.type}`, props.activeCard?.type === 'destination' ? `dest-${props.activeCard.data.name.toLowerCase()}` : '']">
      
      <!-- Sticky close button -->
      <button class="modal-close-btn" @click="closeModal" aria-label="Close modal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div ref="contentEl" class="expanded-modal-scroll">
        
        <!-- TEAM CARD EXPANDED -->
        <div v-if="props.activeCard?.type === 'team'" class="team-expanded-grid">
          <!-- Left Col: Large Picture & Stats -->
          <div class="team-col-left">
            <div class="large-team-img-wrap">
              <img :src="props.activeCard.data.image" :alt="props.activeCard.data.name" />
              <div class="img-overlay-glow"></div>
            </div>
            
            <div class="team-quick-stats">
              <h4 class="stat-header">{{ t('modal.achievements') }}</h4>
              <div class="team-stat-bar">
                <div class="stat-label">
                  <span>{{ t('modal.countriesVisited') }}</span>
                  <span class="stat-num">{{ props.activeCard.data.countriesVisited || 24 }}</span>
                </div>
                <div class="stat-track"><div class="stat-fill" style="width: 85%"></div></div>
              </div>
              <div class="team-stat-bar">
                <div class="stat-label">
                  <span>{{ t('modal.experience') }}</span>
                  <span class="stat-num">{{ props.activeCard.data.experienceYears || '6 Years' }}</span>
                </div>
                <div class="stat-track"><div class="stat-fill" style="width: 70%"></div></div>
              </div>
              <div class="team-stat-bar">
                <div class="stat-label">
                  <span>{{ t('modal.clientSatisfaction') }}</span>
                  <span class="stat-num">99.8%</span>
                </div>
                <div class="stat-track"><div class="stat-fill" style="width: 99%"></div></div>
              </div>
            </div>
          </div>

          <!-- Right Col: Bio & Booking Scheduler -->
          <div class="team-col-right">
            <div class="team-header-info">
              <span class="badge">{{ t('modal.teamExpert') }}</span>
              <h2 class="team-main-name">{{ props.activeCard.data.name }}</h2>
              <p class="team-main-role">{{ t('team.member.' + props.activeCard.data.id + '.role') }}</p>
            </div>

            <div class="team-main-bio">
              <h3>{{ t('modal.biography') }}</h3>
              <p>
                {{ t('team.member.' + props.activeCard.data.id + '.bio') }}
              </p>
              
              <div class="team-meta-facts">
                <div class="meta-fact">
                  <strong>{{ t('modal.languages') }}</strong>
                  <span>{{ props.activeCard.data.languages || 'English, French, Arabic' }}</span>
                </div>
                <div class="meta-fact">
                  <strong>{{ t('modal.favDest') }}</strong>
                  <span>{{ t('team.member.' + props.activeCard.data.id + '.favDest') }}</span>
                </div>
                <div class="meta-fact">
                  <strong>{{ t('modal.philosophy') }}</strong>
                  <span>"{{ t('modal.philosophyVal') }}"</span>
                </div>
              </div>
            </div>

            <!-- Consultation Booking Scheduler -->
            <div class="booking-scheduler">
              <h3>{{ t('modal.scheduleConsult') }}</h3>
              <p class="scheduler-desc">{{ t('modal.scheduleDesc') }}</p>
              
              <form v-if="!bookSuccess" @submit.prevent="handleBookSubmit" class="scheduler-form">
                <div class="form-grid">
                  <div class="form-group">
                    <label>{{ t('modal.selectDate') }}</label>
                    <input type="date" v-model="bookDate" required class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>{{ t('modal.prefTime') }}</label>
                    <select v-model="bookTime" required class="form-input">
                      <option value="">{{ t('modal.chooseSlot') }}</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ t('modal.yourName') }}</label>
                  <input type="text" v-model="bookName" placeholder="John Doe" required class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('modal.phone') }}</label>
                  <input type="tel" v-model="bookPhone" placeholder="+213 555 123 456" required class="form-input" />
                </div>
                <button type="submit" class="submit-booking-btn">
                  {{ t('modal.confirmMeeting') }}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="inline ml-1"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
              </form>

              <!-- Booking success alert -->
              <div v-else class="booking-success-card animate-scale-up">
                <div class="success-icon">✓</div>
                <h4>{{ t('modal.consultConfirmed') }}</h4>
                <p>{{ t('modal.consultSuccessDesc') }}</p>
                <button @click="bookSuccess = false" class="reset-booking-btn">{{ t('modal.bookAnother') }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- PROGRAM CARD EXPANDED -->
        <div v-if="props.activeCard?.type === 'program'" class="program-expanded-layout">
          <!-- Hero Header -->
          <div class="program-hero" :style="{ backgroundImage: `url(${props.activeCard.data.image})` }">
            <div class="program-hero-overlay"></div>
            <div class="program-hero-text">
              <span class="program-emoji-badge">{{ props.activeCard.data.icon }}</span>
              <h2 class="program-main-title">{{ props.activeCard.data.id === 1 ? t('programs.adventure') : props.activeCard.data.id === 2 ? t('programs.cultural') : props.activeCard.data.id === 3 ? t('programs.relax') : t('programs.custom') }}</h2>
              <p class="program-tagline">{{ t('modal.awardBespoke') }}</p>
            </div>
          </div>

          <!-- Main Sub-views depending on program ID/type -->
          <div class="program-content-body">
            
            <!-- Adventure Trips Detail -->
            <div v-if="props.activeCard.data.id === 1" class="adventure-program-detail">
              <div class="info-split-grid">
                <div>
                  <h3>{{ t('modal.alpineTitle') }}</h3>
                  <p class="program-long-desc">{{ t('modal.alpineDesc') }}</p>
                  
                  <div class="difficulty-meters mt-4">
                    <div class="diff-chip"><strong>{{ t('modal.difficulty') }}</strong> <span class="text-orange-500 font-semibold">{{ t('modal.challenging') }}</span></div>
                    <div class="diff-chip"><strong>{{ t('modal.duration') }}</strong> <span>{{ t('modal.alpineDuration') }}</span></div>
                    <div class="diff-chip"><strong>{{ t('modal.groupSize') }}</strong> <span>{{ t('modal.alpineGroupSize') }}</span></div>
                  </div>

                  <!-- Animated Itinerary Timeline -->
                  <div class="itinerary-timeline mt-8">
                    <h4 class="sub-section-title">{{ t('modal.masterItinerary') }}</h4>
                    <div class="itinerary-steps">
                      <div class="itinerary-step">
                        <div class="step-num">01</div>
                        <div class="step-desc">
                          <h5>{{ t('modal.day1Title') }}</h5>
                          <p>{{ t('modal.day1Desc') }}</p>
                        </div>
                      </div>
                      <div class="itinerary-step">
                        <div class="step-num">02</div>
                        <div class="step-desc">
                          <h5>{{ t('modal.day2Title') }}</h5>
                          <p>{{ t('modal.day2Desc') }}</p>
                        </div>
                      </div>
                      <div class="itinerary-step">
                        <div class="step-num">03</div>
                        <div class="step-desc">
                          <h5>{{ t('modal.day3Title') }}</h5>
                          <p>{{ t('modal.day3Desc') }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="side-booking-pane">
                  <div class="booking-pane-card">
                    <div class="price-header">
                      <span class="price-from">{{ t('modal.from') }}</span>
                      <span class="price-val">$1,299</span>
                      <span class="price-unit">{{ t('modal.perPerson') }}</span>
                    </div>
                    <ul class="included-list">
                      <li>✓ {{ t('modal.incGuides') }}</li>
                      <li>✓ {{ t('modal.incEquip') }}</li>
                      <li>✓ {{ t('modal.incMeals') }}</li>
                      <li>✓ {{ t('modal.incPickups') }}</li>
                    </ul>
                    <button class="cta-book-now" @click="bookSuccess = true">{{ t('modal.reserveSpot') }}</button>
                    <p class="free-cancel-tag">{{ t('modal.freeCancel') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cultural Experience Detail -->
            <div v-if="props.activeCard.data.id === 2" class="cultural-program-detail">
              <div class="info-split-grid">
                <div>
                  <h3>{{ t('modal.culturalTitle') }}</h3>
                  <p class="program-long-desc">{{ t('modal.culturalDesc') }}</p>
                  
                  <!-- Virtual Video Placeholder -->
                  <div class="virtual-video-container mt-6">
                    <img src="https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&w=800&q=80" alt="Cultural guide" />
                    <div class="video-play-btn">
                      <span class="play-icon">▶</span>
                      <span class="play-text">{{ t('modal.watchTeaser') }}</span>
                    </div>
                  </div>

                  <div class="culture-highlights mt-8">
                    <h4 class="sub-section-title">{{ t('modal.whatMakesItUnmatched') }}</h4>
                    <div class="bento-sub-grid">
                      <div class="highlight-bento-card">
                        <span class="card-icon">🍲</span>
                        <h5>{{ t('modal.authenticGastronomy') }}</h5>
                        <p>{{ t('modal.authenticGastronomyDesc') }}</p>
                      </div>
                      <div class="highlight-bento-card">
                        <span class="card-icon">🏮</span>
                        <h5>{{ t('modal.ceremonies') }}</h5>
                        <p>{{ t('modal.ceremoniesDesc') }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="side-booking-pane">
                  <div class="booking-pane-card">
                    <div class="price-header">
                      <span class="price-from">{{ t('modal.from') }}</span>
                      <span class="price-val">$840</span>
                      <span class="price-unit">{{ t('modal.perPerson') }}</span>
                    </div>
                    <ul class="included-list">
                      <li>✓ {{ t('modal.incPrivateGuides') }}</li>
                      <li>✓ {{ t('modal.incTickets') }}</li>
                      <li>✓ {{ t('modal.incGastronomic') }}</li>
                      <li>✓ {{ t('modal.incLodging') }}</li>
                    </ul>
                    <button class="cta-book-now text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.joinTour') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Beach Getaway Detail -->
            <div v-if="props.activeCard.data.id === 3" class="beach-program-detail">
              <div class="info-split-grid">
                <div>
                  <h3>{{ t('modal.beachTitle') }}</h3>
                  <p class="program-long-desc">{{ t('modal.beachDesc') }}</p>
                  
                  <div class="beach-amenities-grid mt-6">
                    <div class="amenity-pill">{{ t('modal.poolAmenity') }}</div>
                    <div class="amenity-pill">{{ t('modal.yachtAmenity') }}</div>
                    <div class="amenity-pill">{{ t('modal.yogaAmenity') }}</div>
                    <div class="amenity-pill">{{ t('modal.diningAmenity') }}</div>
                  </div>

                  <div class="photo-masonry mt-8">
                    <h4 class="sub-section-title">{{ t('modal.resortsCatalog') }}</h4>
                    <div class="masonry-grid-custom">
                      <img src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=400&q=80" alt="Resort 1" class="masonry-img" />
                      <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80" alt="Resort 2" class="masonry-img" />
                    </div>
                  </div>
                </div>

                <div class="side-booking-pane">
                  <div class="booking-pane-card">
                    <div class="price-header">
                      <span class="price-from">{{ t('modal.from') }}</span>
                      <span class="price-val">$1,899</span>
                      <span class="price-unit">{{ t('modal.perPerson') }}</span>
                    </div>
                    <ul class="included-list">
                      <li>✓ {{ t('modal.incSuite') }}</li>
                      <li>✓ {{ t('modal.incAllInc') }}</li>
                      <li>✓ {{ t('modal.incScuba') }}</li>
                      <li>✓ {{ t('modal.incButler') }}</li>
                    </ul>
                    <button class="cta-book-now" @click="bookSuccess = true">{{ t('modal.bookRetreat') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interactive Custom Program Configurator -->
            <div v-if="props.activeCard.data.id === 4" class="custom-program-detail">
              <h3 class="text-center mb-6 font-serif text-3xl">{{ t('modal.configuratorTitle') }}</h3>
              <p class="text-center text-gray-600 max-w-xl mx-auto mb-8">{{ t('modal.configuratorDesc') }}</p>
              
              <div class="configurator-wrapper">
                <div class="configurator-controls">
                  <!-- Destination Select -->
                  <div class="control-group">
                    <label>{{ t('modal.chooseDestination') }}</label>
                    <div class="dest-selector-chips">
                      <button v-for="d in ['Japan', 'Greece', 'Dubai', 'Bali']" :key="d" :class="{ active: customDest === d }" @click="customDest = d" class="chip-btn">
                        {{ d }}
                      </button>
                    </div>
                  </div>

                  <!-- Budget Tier Select -->
                  <div class="control-group">
                    <label>{{ t('modal.luxuryTier') }}</label>
                    <div class="tier-selector-chips">
                      <button :class="{ active: budgetTier === 'budget' }" @click="budgetTier = 'budget'" class="chip-btn">{{ t('modal.backpacker') }}</button>
                      <button :class="{ active: budgetTier === 'standard' }" @click="budgetTier = 'standard'" class="chip-btn">{{ t('modal.explorer') }}</button>
                      <button :class="{ active: budgetTier === 'luxury' }" @click="budgetTier = 'luxury'" class="chip-btn">{{ t('modal.eliteVip') }}</button>
                    </div>
                  </div>

                  <!-- Range Slider for Days -->
                  <div class="control-group">
                    <label class="flex justify-between">
                      <span>{{ t('modal.durationDays') }}</span>
                      <strong class="text-orange-500">{{ durationDays }} {{ t('modal.durationDays').includes('أيام') ? 'أيام' : t('modal.durationDays').includes('jours') ? 'jours' : 'Days' }}</strong>
                    </label>
                    <input type="range" min="1" max="21" v-model.number="durationDays" class="custom-range-slider" />
                  </div>

                  <!-- Range Slider for Travelers -->
                  <div class="control-group">
                    <label class="flex justify-between">
                      <span>{{ t('modal.numPeople') }}</span>
                      <strong class="text-orange-500">{{ customPeople }} {{ t('modal.travelers') }}</strong>
                    </label>
                    <input type="range" min="1" max="10" v-model.number="customPeople" class="custom-range-slider" />
                  </div>

                  <!-- Activities Checklist -->
                  <div class="control-group">
                    <label>{{ t('modal.activitiesIncluded') }}</label>
                    <div class="activities-checkbox-grid">
                      <button v-for="act in activityOptions" :key="act" :class="{ active: customActivities.includes(act) }" @click="customActivities.includes(act) ? customActivities = customActivities.filter(a => a !== act) : customActivities.push(act)" class="activity-checkbox-btn">
                        {{ act === 'Hiking' ? t('modal.actHiking') : act === 'Cultural Tours' ? t('modal.actCultural') : act === 'Water Sports' ? t('modal.actWater') : act === 'Shopping' ? t('modal.actShopping') : act === 'Food Tasting' ? t('modal.actFood') : t('modal.actRelax') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Price Estimator Panel -->
                <div class="configurator-preview-card">
                  <div class="preview-header">
                    <h4>{{ t('modal.customItinerary') }}</h4>
                    <span class="custom-stamp">{{ t('modal.bespokeBadge') }}</span>
                  </div>
                  
                  <div class="preview-specs-list">
                    <div class="spec-item">
                      <span>{{ t('modal.destLabel') }}</span>
                      <strong>{{ customDest }}</strong>
                    </div>
                    <div class="spec-item">
                      <span>{{ t('modal.tripTierLabel') }}</span>
                      <strong class="capitalize">{{ budgetTier === 'budget' ? t('modal.backpacker').replace('🎒 ', '') : budgetTier === 'standard' ? t('modal.explorer').replace('🏨 ', '') : t('modal.eliteVip').replace('💎 ', '') }}</strong>
                    </div>
                    <div class="spec-item">
                      <span>{{ t('modal.durationLabel') }}</span>
                      <strong>{{ durationDays }} {{ t('modal.durationDays').includes('أيام') ? 'أيام' : t('modal.durationDays').includes('jours') ? 'jours' : 'Days' }} / {{ durationDays - 1 }} {{ t('modal.durationDays').includes('أيام') ? 'ليالٍ' : t('modal.durationDays').includes('jours') ? 'nuits' : 'Nights' }}</strong>
                    </div>
                    <div class="spec-item">
                      <span>{{ t('modal.partySizeLabel') }}</span>
                      <strong>{{ customPeople }} {{ t('modal.travelers') }}</strong>
                    </div>
                    <div class="spec-item">
                      <span>{{ t('modal.activitiesCountLabel') }}</span>
                      <strong>{{ customActivities.length }}</strong>
                    </div>
                  </div>

                  <hr class="my-4 border-gray-200" />

                  <div class="live-price-box">
                    <span class="live-label">{{ t('modal.estPackagePrice') }}</span>
                    <span class="live-val">${{ calculateLivePrice() }}</span>
                    <span class="live-terms">{{ t('modal.allIncEstimates') }}</span>
                  </div>

                  <button class="custom-booking-cta" @click="bookSuccess = true">{{ t('modal.lockInRate') }}</button>
                  <span class="assist-badge">{{ t('modal.instantConfirmation') }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- DESTINATION CARD EXPANDED -->
        <div v-if="props.activeCard?.type === 'destination'" class="destination-expanded-wrapper">
          <div class="dest-showcase-split">
            <!-- Left Side: Immersive Imagery & Visuals -->
            <div class="dest-imagery-panel">
              <div class="dest-big-hero" :style="{ backgroundImage: `url(${props.activeCard.data.image})` }">
                <div class="hero-tint"></div>
                <div class="dest-hero-labels">
                  <span class="dest-continent-badge">📍 {{ props.activeCard.data.location }}</span>
                  <h2 class="dest-large-title text-shadow-sm">{{ props.activeCard.data.name }}</h2>
                </div>
              </div>
              
              <!-- Food & Culture Spotlight -->
              <div class="dest-cultural-spotlight">
                <h4>{{ t('modal.localDelicacyTitle') }}</h4>
                <div class="spotlight-cards">
                  <div class="spotlight-food-card">
                    <img v-if="props.activeCard.data.name === 'Japan'" src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=150&q=80" alt="Sushi" />
                    <img v-else-if="props.activeCard.data.name === 'Greece'" src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=150&q=80" alt="Salad" />
                    <img v-else-if="props.activeCard.data.name === 'Dubai'" src="https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=150&q=80" alt="Dates" />
                    <img v-else src="https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&w=150&q=80" alt="Curry" />
                    <div>
                      <h5>{{ props.activeCard.data.name === 'Japan' ? t('modal.delicacyJapan') : props.activeCard.data.name === 'Greece' ? t('modal.delicacyGreece') : props.activeCard.data.name === 'Dubai' ? t('modal.delicacyDubai') : t('modal.delicacyBali') }}</h5>
                      <p>{{ t('modal.delicacyDesc') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Side: Immersive Guides & Widgets -->
            <div class="dest-details-panel">
              <!-- Grid Widgets -->
              <div class="dest-widgets-grid">
                <!-- Weather widget -->
                <div class="dest-widget-box weather-widget">
                  <div class="widget-header">{{ t('modal.weatherSim') }}</div>
                  <div class="weather-temp-wrap">
                    <span class="temp">{{ props.activeCard.data.name === 'Japan' ? '21°C' : props.activeCard.data.name === 'Greece' ? '28°C' : props.activeCard.data.name === 'Dubai' ? '36°C' : '29°C' }}</span>
                    <span class="icon">{{ props.activeCard.data.name === 'Japan' ? '🌸' : props.activeCard.data.name === 'Greece' ? '🏖️' : props.activeCard.data.name === 'Dubai' ? '🐪' : '🌴' }}</span>
                  </div>
                  <p class="weather-comment">{{ props.activeCard.data.name === 'Japan' ? t('modal.weatherJapan') : props.activeCard.data.name === 'Greece' ? t('modal.weatherGreece') : props.activeCard.data.name === 'Dubai' ? t('modal.weatherDubai') : t('modal.weatherBali') }}</p>
                </div>

                <!-- Best season widget -->
                <div class="dest-widget-box season-widget">
                  <div class="widget-header">{{ t('modal.bestSeason') }}</div>
                  <div class="season-badge">{{ props.activeCard.data.name === 'Japan' ? t('modal.seasonJapan') : props.activeCard.data.name === 'Greece' ? t('modal.seasonGreece') : props.activeCard.data.name === 'Dubai' ? t('modal.seasonDubai') : t('modal.seasonBali') }}</div>
                  <p class="season-details">{{ t('modal.seasonDetails') }}</p>
                </div>
              </div>

              <!-- General Tour Estimates -->
              <div class="dest-about-section">
                <h3>{{ t('modal.about') }} {{ props.activeCard.data.name }}</h3>
                <p>
                  {{ props.activeCard.data.name === 'Japan' ? t('modal.aboutJapan') : props.activeCard.data.name === 'Greece' ? t('modal.aboutGreece') : props.activeCard.data.name === 'Dubai' ? t('modal.aboutDubai') : t('modal.aboutBali') }}
                </p>
                
                <h4 class="mt-8 mb-3">{{ t('modal.popTours') }}</h4>
                <div class="popular-tours-list">
                  <div class="tour-item">
                    <div class="tour-name">
                      <h5>{{ t('modal.tour1') }}</h5>
                      <span>7 {{ t('modal.durationDays').includes('أيام') ? 'أيام' : t('modal.durationDays').includes('jours') ? 'jours' : 'Days' }} / 6 {{ t('modal.durationDays').includes('أيام') ? 'ليالٍ' : t('modal.durationDays').includes('jours') ? 'nuits' : 'Nights' }}</span>
                    </div>
                    <span class="tour-price">$1,450</span>
                  </div>
                  <div class="tour-item">
                    <div class="tour-name">
                      <h5>{{ t('modal.tour2') }}</h5>
                      <span>12 {{ t('modal.durationDays').includes('أيام') ? 'أيام' : t('modal.durationDays').includes('jours') ? 'jours' : 'Days' }} / 11 {{ t('modal.durationDays').includes('أيام') ? 'ليالٍ' : t('modal.durationDays').includes('jours') ? 'nuits' : 'Nights' }}</span>
                    </div>
                    <span class="tour-price">$2,200</span>
                  </div>
                </div>

                <div class="booking-instant-box mt-8">
                  <div class="booking-info-label">
                    <span>{{ t('modal.priceStart') }}</span>
                    <strong>${{ props.activeCard.data.name === 'Japan' ? '1,100' : props.activeCard.data.name === 'Greece' ? '980' : props.activeCard.data.name === 'Dubai' ? '1,550' : '780' }}</strong>
                  </div>
                  <button class="book-destination-cta text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.selectDates') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SERVICES CARD EXPANDED -->
        <div v-if="props.activeCard?.type === 'service'" class="service-expanded-layout">
          <!-- Title & Emoji badge -->
          <div class="service-detail-header text-center py-6">
            <div class="service-emoji-badge">{{ props.activeCard.data.icon }}</div>
            <h2 class="service-detail-title">{{ t('services.' + props.activeCard.data.key + '.title') }}</h2>
            <p class="text-gray-500 max-w-md mx-auto">{{ t('modal.serviceTagline') }}</p>
          </div>

          <!-- FLIGHT BOOKING SERVICE -->
          <div v-if="props.activeCard.data.id === 1" class="flight-service-interactive px-4 py-6">
            <h3 class="font-serif text-2xl text-center mb-6">{{ t('modal.flightTitle') }}</h3>
            <div class="flight-widget-form">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label>{{ t('modal.originAirport') }}</label>
                  <input type="text" v-model="flightFrom" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('modal.destinationAirport') }}</label>
                  <input type="text" v-model="flightTo" class="form-input" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div class="form-group">
                  <label>{{ t('modal.seatClass') }}</label>
                  <select v-model="flightClass" class="form-input">
                    <option value="economy">{{ t('modal.economyClass') }}</option>
                    <option value="business">{{ t('modal.businessClass') }}</option>
                    <option value="first">{{ t('modal.firstPremium') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t('modal.departureDate') }}</label>
                  <input type="date" value="2026-08-15" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('modal.airlinePref') }}</label>
                  <select class="form-input">
                    <option>{{ t('modal.anyAlliance') }}</option>
                    <option>Emirates</option>
                    <option>Qatar Airways</option>
                    <option>Air France</option>
                  </select>
                </div>
              </div>
              
              <!-- Simulated price trend chart -->
              <div class="price-trend-graph-wrap mt-8">
                <h4 class="text-sm font-semibold mb-2">📊 {{ t('modal.fareTrend') }}</h4>
                <div class="price-trend-graph">
                  <div class="graph-bar" style="height: 45%;">
                    <span class="bar-price">$810</span>
                    <span class="bar-day">{{ t('modal.mon') }}</span>
                  </div>
                  <div class="graph-bar" style="height: 60%;">
                    <span class="bar-price">$840</span>
                    <span class="bar-day">{{ t('modal.tue') }}</span>
                  </div>
                  <div class="graph-bar active" style="height: 35%;">
                    <span class="bar-price" style="background-color: var(--color-primary); color: #000;">$780</span>
                    <span class="bar-day">{{ t('modal.wed') }}</span>
                  </div>
                  <div class="graph-bar" style="height: 75%;">
                    <span class="bar-price">$890</span>
                    <span class="bar-day">{{ t('modal.thu') }}</span>
                  </div>
                  <div class="graph-bar" style="height: 80%;">
                    <span class="bar-price">$910</span>
                    <span class="bar-day">{{ t('modal.fri') }}</span>
                  </div>
                </div>
              </div>

              <div class="flight-actions mt-8 flex justify-between items-center">
                <div class="flight-quote-sum">
                  <span>{{ t('modal.bestPriceFound') }}</span>
                  <strong>${{ flightClass === 'economy' ? 780 : flightClass === 'business' ? 1850 : 3800 }}</strong>
                </div>
                <button class="search-flights-cta text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.reserveFlights') }}</button>
              </div>
            </div>
          </div>

          <!-- HOTEL RESERVATION SERVICE -->
          <div v-if="props.activeCard.data.id === 2" class="hotel-service-interactive px-4 py-6">
            <h3 class="font-serif text-2xl text-center mb-6">{{ t('modal.hotelTitle') }}</h3>
            <div class="hotel-booking-shell">
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ t('modal.checkInDate') }}</label>
                  <input type="date" v-model="checkIn" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('modal.checkOutDate') }}</label>
                  <input type="date" v-model="checkOut" class="form-input" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div class="form-group">
                  <label>{{ t('modal.roomCategory') }}</label>
                  <select v-model="selectedRoomType" class="form-input">
                    <option value="standard">{{ t('modal.hotelStandardOpt') }}</option>
                    <option value="deluxe">{{ t('modal.hotelDeluxeOpt') }}</option>
                    <option value="villa">{{ t('modal.hotelVillaOpt') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ t('modal.guests') }}</label>
                  <input type="number" min="1" max="5" v-model.number="roomsCount" class="form-input" />
                </div>
              </div>

              <div class="amenities-checklist mt-6">
                <h4>{{ t('modal.desiredAmenities') }}</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                  <label><input type="checkbox" checked /> {{ t('modal.wifi') }}</label>
                  <label><input type="checkbox" checked /> {{ t('modal.poolAccess') }}</label>
                  <label><input type="checkbox" /> {{ t('modal.spaRoom') }}</label>
                  <label><input type="checkbox" /> {{ t('modal.airportShuttle') }}</label>
                  <label><input type="checkbox" checked /> {{ t('modal.breakfast') }}</label>
                </div>
              </div>

              <button class="hotel-submit-cta mt-6 text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.checkHotelAvailability') }}</button>
            </div>
          </div>

          <!-- VISA ASSISTANCE SERVICE -->
          <div v-if="props.activeCard.data.id === 3" class="visa-service-interactive px-4 py-6">
            <h3 class="font-serif text-2xl text-center mb-6">{{ t('modal.visaTitle') }}</h3>
            <div class="visa-container-box">
              <div class="form-group max-w-sm mx-auto mb-6">
                <label class="text-center block">{{ t('modal.selectDestCountry') }}</label>
                <select v-model="visaCountry" class="form-input">
                  <option value="Japan">Japan 🌸</option>
                  <option value="Greece">Greece 🇬🇷</option>
                  <option value="Dubai">Dubai 🇦🇪</option>
                  <option value="Bali">Bali 🇮🇩</option>
                </select>
              </div>

              <div class="visa-results-panel grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="visa-doc-box">
                  <h5>{{ t('modal.reqDocs') }}</h5>
                  <ul class="visa-doc-list">
                    <li v-for="doc in visaRequiredDocs" :key="doc">✓ {{ t(doc) }}</li>
                  </ul>
                </div>
                
                <div class="visa-metrics-box">
                  <h5>{{ t('modal.visaStats') }}</h5>
                  <div class="metric-item">
                    <span>{{ t('modal.govFee') }}</span>
                    <strong>{{ t(visaFee) }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>{{ t('modal.processingTime') }}</span>
                    <strong>{{ t(visaProcessing) }}</strong>
                  </div>
                  <div class="metric-item">
                    <span>{{ t('modal.approvalLikelihood') }}</span>
                    <strong class="text-green-600">{{ visaEligibility }}% {{ t('modal.approvalRate') }}</strong>
                  </div>
                  
                  <button class="visa-apply-btn mt-6 text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.submitDocs') }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- TRAVEL INSURANCE SERVICE -->
          <div v-if="props.activeCard.data.id === 4" class="insurance-service-interactive px-4 py-6">
            <h3 class="font-serif text-2xl text-center mb-6">{{ t('modal.insTitle') }}</h3>
            <div class="ins-calc-shell grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="ins-inputs">
                <div class="form-group mb-4">
                  <label>{{ t('modal.ageTraveler') }}</label>
                  <input type="number" v-model.number="insAge" min="1" max="95" class="form-input" />
                </div>
                <div class="form-group mb-4">
                  <label>{{ t('modal.tripDuration') }}</label>
                  <input type="number" v-model.number="insDuration" min="1" max="90" class="form-input" />
                </div>
                <div class="form-group">
                  <label>{{ t('modal.coverageTier') }}</label>
                  <select v-model="insTier" class="form-input">
                    <option value="basic">{{ t('modal.insBasicOpt') }}</option>
                    <option value="premium">{{ t('modal.insPremiumOpt') }}</option>
                    <option value="vip">{{ t('modal.insVipOpt') }}</option>
                  </select>
                </div>
              </div>

              <div class="ins-quote-card text-center">
                <h4>{{ t('modal.premiumCoverQuote') }}</h4>
                <div class="ins-price-value">${{ insAge > 65 ? (insDuration * 6) + 50 : insTier === 'basic' ? (insDuration * 2) : insTier === 'vip' ? (insDuration * 9) : (insDuration * 4) }}</div>
                <span class="terms-label">{{ t('modal.oneOffPayment') }}</span>
                
                <ul class="quote-benefits-list text-left mt-6">
                  <li>{{ t('modal.billingBenefit') }}</li>
                  <li>{{ t('modal.luggageBenefit') }}</li>
                  <li>{{ t('modal.delayBenefit') }}</li>
                </ul>

                <button class="buy-insurance-cta mt-6 text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.purchasePolicy') }}</button>
              </div>
            </div>
          </div>

          <!-- TOUR GUIDES SERVICE -->
          <div v-if="props.activeCard.data.id === 5" class="tour-guides-service px-4 py-6">
            <h3 class="font-serif text-2xl text-center mb-6 font-semibold">{{ t('modal.guidesTitle') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Guide 1 -->
              <div class="guide-profile-card">
                <div class="guide-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Sarah J" />
                </div>
                <div class="guide-profile-info">
                  <h5>Sarah Jenkins</h5>
                  <p class="guide-spec">Tokyo Historian & Local Food Curator</p>
                  <div class="guide-meta-stats">
                    <span>⭐ 4.98 Rating</span>
                    <span>🗣️ English, Japanese</span>
                  </div>
                  <button class="book-guide-mini-btn text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.bookGuide') }} ($45/hr)</button>
                </div>
              </div>

              <!-- Guide 2 -->
              <div class="guide-profile-card">
                <div class="guide-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80" alt="Marco L" />
                </div>
                <div class="guide-profile-info">
                  <h5>Marco Lorenz</h5>
                  <p class="guide-spec">Schengen Trekking Guide & Ski Master</p>
                  <div class="guide-meta-stats">
                    <span>⭐ 4.95 Rating</span>
                    <span>🗣️ German, English, French</span>
                  </div>
                  <button class="book-guide-mini-btn text-dark" style="background: var(--color-primary);" @click="bookSuccess = true">{{ t('modal.bookGuide') }} ($50/hr)</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 24/7 LIVE SUPPORT CHAT -->
          <div v-if="props.activeCard.data.id === 6" class="support-service-chat px-2 py-4">
            <h3 class="font-serif text-2xl text-center mb-4">{{ t('modal.chatTitle') }}</h3>
            <div class="chat-terminal-shell">
              <!-- Messages stream -->
              <div class="chat-messages-box">
                <div v-for="(m, idx) in chatMessages" :key="idx" :class="['chat-bubble', m.sender === 'bot' ? 'chat-bot' : 'chat-user']">
                  <span class="bubble-sender">{{ m.sender === 'bot' ? 'Trevvelo SOS' : (bookName.split(' ')[0] || t('contact.fullName').split(' ')[0]) }}</span>
                  <p class="bubble-text">{{ m.textKey ? t(m.textKey) : m.text }}</p>
                </div>
                
                <!-- Typing Indicator -->
                <div v-if="isTyping" class="chat-bubble chat-bot typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>

              <!-- Suggested Query Chips -->
              <div class="suggested-queries-pane">
                <span class="pane-label">{{ t('modal.tapBelow') }}</span>
                <div class="chips-flex">
                  <button v-for="q in suggestedChats" :key="q.key" @click="handleSendMessage(q)" class="suggested-chip">
                    {{ t(q.textKey) }}
                  </button>
                </div>
              </div>

              <!-- Chat footer input -->
              <div class="chat-input-bar">
                <input type="text" v-model="userMessage" :placeholder="t('modal.chatPlaceholder')" @keyup.enter="handleSendMessage()" class="chat-text-input" />
                <button @click="handleSendMessage()" class="chat-send-btn">{{ t('modal.send') }}</button>
              </div>
            </div>
          </div>

          <!-- General Alert Overlay -->
          <div v-if="bookSuccess && props.activeCard.data.id !== 6" class="service-booking-success animate-scale-up text-center">
            <div class="success-icon-badge">✓</div>
            <h4>{{ t('modal.reqSuccess') }}</h4>
            <p>{{ t('modal.reqSuccessDesc') }}</p>
            <button class="close-success-btn text-dark font-semibold" style="background: var(--color-primary);" @click="bookSuccess = false">{{ t('modal.done') }}</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal Layout Styles */
.expanded-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expanded-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 10, 0.45);
  backdrop-filter: blur(15px);
}

.destination-canvas-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1005;
}

.expanded-modal-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--color-off-white);
  overflow: hidden;
  z-index: 1010;
  display: flex;
  flex-direction: column;
}

/* Scroll Container inside Expanded Page */
.expanded-modal-scroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 80px 40px 60px;
}

@media (max-width: 768px) {
  .expanded-modal-scroll {
    padding: 60px 20px 40px;
  }
}

.modal-close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: var(--color-dark);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;
  z-index: 1020;
}

.modal-close-btn:hover {
  transform: rotate(90deg) scale(1.1);
  background: var(--color-primary);
  color: var(--color-dark);
}

/* --- THEME CUSTOMIZATIONS --- */
.theme-destination.dest-japan {
  background-color: #FFF2F4; /* Soft Cherry Blossom Pink tint */
  color: #3d2328;
}
.theme-destination.dest-dubai {
  background-color: #1A1813; /* Black & Gold theme */
  color: #ECE0CA;
}
.theme-destination.dest-dubai .dest-about-section h3 {
  color: var(--color-accent-yellow);
}
.theme-destination.dest-greece {
  background-color: #F0F6FC; /* Santorini white/blue theme */
  color: #1c2b3e;
}
.theme-destination.dest-bali {
  background-color: #F3F7F2; /* Ubud Rainforest green tint */
  color: #1b2e21;
}

/* --- TEAM EXPANDED STYLING --- */
.team-expanded-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .team-expanded-grid {
    grid-template-columns: 1fr;
  }
}

.large-team-img-wrap {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.large-team-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-overlay-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
}

.team-quick-stats {
  margin-top: 24px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--color-border);
}

.stat-header {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 15px;
}

.team-stat-bar {
  margin-bottom: 12px;
}

.stat-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: var(--color-text-light);
}

.stat-num {
  font-weight: 700;
  color: var(--color-dark);
}

.stat-track {
  width: 100%;
  height: 6px;
  background: #EBE6DF;
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
}

.team-header-info .badge {
  background: var(--color-primary);
  color: var(--color-dark);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.team-main-name {
  font-family: var(--font-serif);
  font-size: 2.8rem;
  font-weight: 900;
  margin-top: 8px;
}

.team-main-role {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.team-main-bio h3 {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.team-meta-facts {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0,0,0,0.02);
  padding: 16px;
  border-radius: 12px;
}

.booking-scheduler {
  margin-top: 40px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.booking-scheduler h3 {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.scheduler-desc {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 14px;
  text-align: left;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-off-white);
  font-family: var(--font-sans);
  font-size: 0.9rem;
}

.form-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.submit-booking-btn {
  width: 100%;
  background: var(--color-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 10px;
  transition: transform 0.2s, background 0.2s;
}

.submit-booking-btn:hover {
  transform: translateY(-2px);
  background: var(--color-primary);
  color: var(--color-dark);
}

.booking-success-card {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 48px;
  height: 48px;
  background: #27ae60;
  color: white;
  font-size: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.reset-booking-btn {
  margin-top: 16px;
  font-size: 0.85rem;
  text-decoration: underline;
  color: var(--color-text-light);
}

/* --- PROGRAM DETAILS STYLES --- */
.program-expanded-layout {
  max-width: 1100px;
  margin: 0 auto;
}

.program-hero {
  height: 280px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.program-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%);
}

.program-hero-text {
  position: relative;
  z-index: 5;
  color: white;
}

.program-emoji-badge {
  font-size: 2.2rem;
}

.program-main-title {
  font-family: var(--font-serif);
  font-size: 2.6rem;
  font-weight: 900;
  margin: 4px 0;
}

.program-tagline {
  font-size: 0.9rem;
  opacity: 0.85;
}

.program-content-body {
  padding-top: 30px;
}

.info-split-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
}

@media (max-width: 900px) {
  .info-split-grid {
    grid-template-columns: 1fr;
  }
}

.difficulty-meters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.diff-chip {
  background: white;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.itinerary-steps {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.itinerary-step {
  display: flex;
  gap: 16px;
}

.step-num {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  border-right: 2px solid var(--color-border);
  padding-right: 12px;
}

.step-desc h5 {
  font-weight: 700;
  font-size: 0.95rem;
}

.step-desc p {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.side-booking-pane {
  position: sticky;
  top: 20px;
}

.booking-pane-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
}

.price-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
}

.price-from {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-right: 6px;
}

.price-val {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--color-dark);
}

.price-unit {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-left: 4px;
}

.included-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  font-size: 0.85rem;
}

.cta-book-now {
  width: 100%;
  background: var(--color-dark);
  color: white;
  padding: 14px;
  border-radius: 8px;
  font-weight: 700;
  text-align: center;
  transition: transform 0.2s, background 0.2s;
}

.cta-book-now:hover {
  transform: scale(1.02);
  background: var(--color-primary);
  color: var(--color-dark);
}

.free-cancel-tag {
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 8px;
}

/* Culture Teaser Video style */
.virtual-video-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  height: 200px;
}

.virtual-video-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.video-play-btn:hover {
  background: rgba(0,0,0,0.55);
}

.play-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  color: var(--color-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Configurator custom styling */
.configurator-wrapper {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .configurator-wrapper {
    grid-template-columns: 1fr;
  }
}

.configurator-controls {
  background: white;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--color-border);
}

.control-group {
  margin-bottom: 24px;
}

.dest-selector-chips, .tier-selector-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.chip-btn {
  background: var(--color-off-white);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.chip-btn.active {
  background: var(--color-dark);
  color: white;
  border-color: var(--color-dark);
}

.custom-range-slider {
  width: 100%;
  accent-color: var(--color-primary);
  margin-top: 8px;
}

.activities-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.activity-checkbox-btn {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-off-white);
  font-size: 0.8rem;
  transition: all 0.2s;
}

.activity-checkbox-btn.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  font-weight: 600;
}

.configurator-preview-card {
  background: #1A1A1A;
  color: white;
  border-radius: 20px;
  padding: 24px;
  height: fit-content;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.custom-stamp {
  font-size: 0.65rem;
  background: var(--color-primary);
  color: #000;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 800;
}

.preview-specs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.live-price-box {
  background: rgba(255,255,255,0.05);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
}

.live-label {
  font-size: 0.75rem;
  opacity: 0.7;
}

.live-val {
  display: block;
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-primary);
  margin: 4px 0;
}

.live-terms {
  font-size: 0.65rem;
  opacity: 0.5;
}

.custom-booking-cta {
  width: 100%;
  background: var(--color-primary);
  color: var(--color-dark);
  font-weight: 700;
  padding: 14px;
  border-radius: 10px;
}

/* --- DESTINATION DETAILS STYLES --- */
.destination-expanded-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.dest-showcase-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 900px) {
  .dest-showcase-split {
    grid-template-columns: 1fr;
  }
}

.dest-big-hero {
  height: 380px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.hero-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.dest-hero-labels {
  position: relative;
  z-index: 5;
  color: white;
}

.dest-continent-badge {
  font-size: 0.85rem;
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(5px);
  padding: 4px 10px;
  border-radius: 20px;
}

.dest-large-title {
  font-family: var(--font-serif);
  font-size: 3rem;
  font-weight: 900;
  margin-top: 6px;
}

.dest-cultural-spotlight {
  margin-top: 24px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.spotlight-food-card {
  display: flex;
  gap: 16px;
  margin-top: 10px;
}

.spotlight-food-card img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}

.dest-widgets-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 500px) {
  .dest-widgets-grid {
    grid-template-columns: 1fr;
  }
}

.dest-widget-box {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.widget-header {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 0.7;
}

.weather-temp-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.weather-temp-wrap .temp {
  font-size: 2rem;
  font-weight: 800;
}

.weather-temp-wrap .icon {
  font-size: 2rem;
}

.weather-comment {
  font-size: 0.75rem;
  opacity: 0.8;
}

.season-badge {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 700;
  padding: 6px;
  border-radius: 6px;
  text-align: center;
  margin: 10px 0;
  font-size: 0.9rem;
}

.season-details {
  font-size: 0.75rem;
}

.popular-tours-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tour-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 12px;
  border-radius: 8px;
}

.tour-name h5 {
  font-weight: 700;
}

.tour-name span {
  font-size: 0.75rem;
}

.tour-price {
  font-weight: 800;
  color: var(--color-primary-dark);
}

.booking-instant-box {
  background: white;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
}

.booking-info-label {
  display: flex;
  justify-content: space-between;
}

.book-destination-cta {
  background: var(--color-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
}

/* --- SERVICES DETAIL STYLES --- */
.service-expanded-layout {
  max-width: 850px;
  margin: 0 auto;
}

.service-emoji-badge {
  font-size: 3rem;
}

.service-detail-title {
  font-family: var(--font-serif);
  font-size: 2.4rem;
  font-weight: 900;
}

.flight-widget-form, .hotel-booking-shell, .visa-container-box, .ins-calc-shell, .chat-terminal-shell {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 25px rgba(0,0,0,0.02);
}

/* Flight trend chart */
.price-trend-graph {
  display: flex;
  height: 120px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 6px;
}

.graph-bar {
  flex: 1;
  background-color: #EBE6DF;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.graph-bar.active {
  background-color: var(--color-primary-light);
  border: 1.5px solid var(--color-primary);
}

.bar-price {
  font-size: 0.65rem;
  font-weight: 700;
  position: absolute;
  top: -24px;
  background: #f1ede8;
  padding: 2px 4px;
  border-radius: 3px;
}

.bar-day {
  font-size: 0.7rem;
  margin-bottom: -22px;
}

.search-flights-cta {
  background: var(--color-dark);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
}

/* Visa document list */
.visa-doc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visa-doc-list li {
  font-size: 0.85rem;
  background: var(--color-off-white);
  padding: 10px;
  border-radius: 8px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.visa-apply-btn {
  width: 100%;
  background: var(--color-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
}

/* Insurance quotes styles */
.ins-price-value {
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-primary-dark);
}

.quote-benefits-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quote-benefits-list li {
  font-size: 0.8rem;
}

.buy-insurance-cta {
  width: 100%;
  background: var(--color-dark);
  color: white;
  padding: 12px;
  border-radius: 8px;
}

/* Support Live Chat terminal window */
.chat-terminal-shell {
  display: flex;
  flex-direction: column;
  height: 480px;
}

.chat-messages-box {
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  background: var(--color-off-white);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-bubble {
  max-width: 80%;
  padding: 12px;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.4;
}

.chat-bot {
  align-self: flex-start;
  background: white;
  border-bottom-left-radius: 2px;
  border: 1px solid var(--color-border);
}

.chat-user {
  align-self: flex-end;
  background: var(--color-dark);
  color: white;
  border-bottom-right-radius: 2px;
}

.bubble-sender {
  display: block;
  font-weight: 700;
  font-size: 0.65rem;
  margin-bottom: 4px;
}

.suggested-queries-pane {
  margin-top: 12px;
  margin-bottom: 12px;
}

.pane-label {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.chips-flex {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.suggested-chip {
  background: #f1ede8;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 20px;
}

.chat-input-bar {
  display: flex;
  gap: 10px;
}

.chat-text-input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.chat-send-btn {
  background: var(--color-dark);
  color: white;
  padding: 0 20px;
  border-radius: 8px;
}

/* Service Alert Succcess Overlay */
.service-booking-success {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px;
  z-index: 100;
}

.success-icon-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #27ae60;
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.close-success-btn {
  background: var(--color-dark);
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  margin-top: 24px;
}

/* Guide Profile Cards */
.guide-profile-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--color-border);
  background: var(--color-off-white);
  border-radius: 12px;
}

.guide-avatar-wrap img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.guide-profile-info h5 {
  font-weight: 700;
}

.guide-spec {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.guide-meta-stats {
  display: flex;
  gap: 12px;
  font-size: 0.7rem;
  margin: 6px 0;
}

.book-guide-mini-btn {
  background: var(--color-dark);
  color: white;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
}

/* Typing indicator dots */
.typing-indicator span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-text-muted);
  margin-right: 4px;
  animation: typing-dots 1s infinite alternate;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-dots {
  from { transform: translateY(0); }
  to { transform: translateY(-4px); }
}

/* Dark Mode overrides for Expanded Modal content */
:global(.dark-mode) .modal-overlay {
  background: rgba(0, 0, 0, 0.85);
}

:global(.dark-mode) .modal-container {
  background: #1A1A1A;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

:global(.dark-mode) .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

:global(.dark-mode) .chat-bot {
  background: #252525;
  color: #E5E0D8;
}

:global(.dark-mode) .suggested-chip {
  background: #2A2A2A;
  color: #B5B0A8;
}

:global(.dark-mode) .suggested-chip:hover {
  background: #333333;
  color: #FFFFFF;
}

:global(.dark-mode) .chat-text-input {
  background: #252525;
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .service-booking-success {
  background: rgba(26, 26, 26, 0.98);
}

:global(.dark-mode) .guide-profile-card {
  background: #222222;
  border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark-mode) .booking-pane-card {
  background: #222222;
  border-color: rgba(255, 255, 255, 0.08);
}

:global(.dark-mode) .diff-chip {
  background: #252525;
  color: #B5B0A8;
}

:global(.dark-mode) .amenity-pill {
  background: #252525;
  color: #B5B0A8;
}
</style>
