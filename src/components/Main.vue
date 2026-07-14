<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import HeroSection from "./HeroSection.vue";
import TeamSection from "./TeamSection.vue";
import ProgramSection from "./ProgramSection.vue";
import DestinationList from "./DestinationList.vue";
import ServicesSection from "./ServicesSection.vue";
import ContactSection from "./ContactSection.vue";
import ExpandedCardModal from "./ExpandedCardModal.vue";

// Active Card state for expansion
const activeCard = ref<{
  type: 'team' | 'program' | 'destination' | 'service';
  data: any;
  rect: DOMRect | null;
} | null>(null);

// Provide openCard function to all child components
const openCard = (type: 'team' | 'program' | 'destination' | 'service', data: any, event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  activeCard.value = { type, data, rect };
};
provide('openCard', openCard);

const closeCard = () => {
  activeCard.value = null;
};

// Spotlight tracking coordinates
const mouseX = ref(0);
const mouseY = ref(0);
const targetX = ref(0);
const targetY = ref(0);
const spotlightStyle = ref({
  transform: 'translate3d(0px, 0px, 0px)',
  opacity: '0'
});

const onMouseMove = (e: MouseEvent) => {
  targetX.value = e.clientX;
  targetY.value = e.clientY;
  spotlightStyle.value.opacity = '1';
};

// Smooth mouse spotlight follow loop
let mouseFrameId: number | null = null;
const updateMousePosition = () => {
  // LERP logic for premium high-quality soft inertia
  mouseX.value += (targetX.value - mouseX.value) * 0.1;
  mouseY.value += (targetY.value - mouseY.value) * 0.1;
  
  spotlightStyle.value.transform = `translate3d(${mouseX.value - 120}px, ${mouseY.value - 120}px, 0px)`;
  mouseFrameId = requestAnimationFrame(updateMousePosition);
};

// Floating Navigation state
const lastScrollTop = ref(0);
const navbarVisible = ref(true);
const scrollProgress = ref(0);
const activeSection = ref('hero');

const handleScroll = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  
  // Keep navbar always fixed and visible when scrolling down or up
  navbarVisible.value = true;
  lastScrollTop.value = st <= 0 ? 0 : st;

  // Reading progress
  const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0;

  // Section tracker for active visual highlighter
  const sections = ['hero', 'team', 'programs', 'destinations', 'services', 'contact'];
  for (const sec of sections) {
    const el = document.getElementById(sec);
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 180) {
        activeSection.value = sec;
        break;
      }
    }
  }
};

const smoothScrollTo = (id: string, e: Event) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    activeSection.value = id;
  }
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('scroll', handleScroll, { passive: true });
  mouseFrameId = requestAnimationFrame(updateMousePosition);

  // Smooth page intro timeline
  gsap.from('.parent > div', {
    opacity: 0,
    scale: 0.94,
    y: 40,
    rotation: () => Math.random() * 3 - 1.5, // slight rotation
    filter: 'blur(8px)',
    stagger: 0.1,
    duration: 1.1,
    ease: 'power3.out',
    clearProps: 'all'
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('scroll', handleScroll);
  if (mouseFrameId) cancelAnimationFrame(mouseFrameId);
});
</script>

<template>
  <!-- Global Premium Spotlight Glow follow -->
  <div class="spotlight-follow" :style="spotlightStyle"></div>

  <!-- Floating Active Premium Navigation bar -->
  <header class="floating-navbar" :class="{ 'navbar-hidden': !navbarVisible }">
    <div class="navbar-wrapper">
      <div class="navbar-brand-group">
        <svg class="brand-logo" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#F5A623"/>
          <path d="M2 17l10 5 10-5" stroke="#F5A623" stroke-width="2" fill="none"/>
        </svg>
        <span class="brand-name">Tripora</span>
      </div>

      <nav class="nav-links">
        <a href="#hero" @click="smoothScrollTo('hero', $event)" :class="{ active: activeSection === 'hero' }">Home</a>
        <a href="#team" @click="smoothScrollTo('team', $event)" :class="{ active: activeSection === 'team' }">Team</a>
        <a href="#programs" @click="smoothScrollTo('programs', $event)" :class="{ active: activeSection === 'programs' }">Programs</a>
        <a href="#destinations" @click="smoothScrollTo('destinations', $event)" :class="{ active: activeSection === 'destinations' }">Destinations</a>
        <a href="#services" @click="smoothScrollTo('services', $event)" :class="{ active: activeSection === 'services' }">Services</a>
        <a href="#contact" @click="smoothScrollTo('contact', $event)" :class="{ active: activeSection === 'contact' }">Contact</a>
      </nav>

      <div class="nav-cta-wrap">
        <a href="#contact" @click="smoothScrollTo('contact', $event)" class="nav-premium-btn">
          Consult Now
        </a>
      </div>
    </div>
    <!-- Bottom line reading progress -->
    <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
  </header>

  <div class="parent">
    <!-- Section 1: Our Team -->
    <div class="div1">
       <TeamSection />
    </div>

    <!-- Section 2: Hero Banner -->
    <div class="div2">
        <HeroSection />
    </div>

    <!-- Section 3: Our Programs -->
    <div class="div3">
      <ProgramSection />
    </div>

    <!-- Section 4: Top Destinations -->
    <div class="div4">
      <DestinationList />
    </div>

    <!-- Section 5: Our Services -->
    <div class="div5">
      <ServicesSection />
    </div>

    <!-- Section 6: Contact Info & Footer -->
    <div class="div6">
      <ContactSection />
    </div>
  </div>

  <!-- Fullscreen GSAP Expansion Overlay detailed pages -->
  <ExpandedCardModal :activeCard="activeCard" @close="closeCard" />
</template>

<style scoped>
/* Floating Navbar Stylings */
.floating-navbar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(229, 224, 216, 0.6);
  border-radius: 30px;
  z-index: 900;
  padding: 10px 24px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  overflow: hidden; /* Clips the inner progress bar to match the rounded pill shape perfectly */
}

.floating-navbar.navbar-hidden {
  transform: translate(-50%, -100px);
}

.navbar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 24px;
  height: 24px;
}

.brand-name {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.5px;
  color: var(--color-dark);
}

.nav-links {
  display: flex;
  gap: 24px;
}

@media (max-width: 768px) {
  .nav-links {
    display: none; /* Hide on mobile/tablet */
  }
}

.nav-links a {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-light);
  transition: color 0.2s, transform 0.2s;
  position: relative;
  padding: 4px 0;
}

.nav-links a:hover, .nav-links a.active {
  color: var(--color-dark);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.nav-links a:hover::after, .nav-links a.active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-premium-btn {
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--color-dark);
  color: white;
  padding: 8px 18px;
  border-radius: 20px;
  transition: background 0.2s, transform 0.2s;
}

.nav-premium-btn:hover {
  background: var(--color-primary);
  color: var(--color-dark);
  transform: translateY(-1px);
}

.scroll-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--color-primary);
  transition: width 0.1s ease-out;
}

/* Mouse cursor Spotlight style */
.spotlight-follow {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(245, 166, 35, 0.08) 0%, rgba(245, 166, 35, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 850;
  mix-blend-mode: screen;
}

/* Base grid styling */
.parent {
  padding-top: 80px; /* Space for floating navbar */
  transition: filter 0.5s;
}

/* Styling matches parent grids in style.css */
</style>
