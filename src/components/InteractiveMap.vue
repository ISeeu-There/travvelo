<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, inject } from 'vue';
import { useI18n } from '../i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { t, locale } = useI18n();
const openCard = inject<(type: string, data: any, event: MouseEvent) => void>('openCard');

const mapContainer = ref<HTMLElement | null>(null);
let mapInstance: L.Map | null = null;
let tileLayerInstance: L.TileLayer | null = null;
const activeMarkers = ref<L.Marker[]>([]);

// Determine theme dynamically from the document element
const isDarkMode = ref(document.documentElement.classList.contains('dark-mode'));

// Destination data matching DestinationList.vue with coordinates
const destinations = [
  {
    id: 1,
    name: 'Greece',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    location: 'Europe',
    key: 'greece',
    regionKey: 'europe',
    lat: 37.9838,
    lng: 23.7275,
    zoom: 6
  },
  {
    id: 2,
    name: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    location: 'Asia',
    key: 'japan',
    regionKey: 'asia',
    lat: 35.6762,
    lng: 139.6503,
    zoom: 6
  },
  {
    id: 3,
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    location: 'Middle East',
    key: 'dubai',
    regionKey: 'middleEast',
    lat: 25.2048,
    lng: 55.2708,
    zoom: 8
  },
  {
    id: 4,
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    location: 'Indonesia',
    key: 'bali',
    regionKey: 'indonesia',
    lat: -8.4095,
    lng: 115.1889,
    zoom: 8
  }
];

// URLs for Light/Dark Map tiles
const LIGHT_TILES = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Initialize map
const initMap = () => {
  if (!mapContainer.value) return;

  // Create Leaflet map instance
  mapInstance = L.map(mapContainer.value, {
    center: [20, 40], // Centered globally
    zoom: 2,
    minZoom: 2,
    maxZoom: 14,
    zoomControl: false // Custom placement later
  });

  // Add custom zoom control at bottom right
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // Set tile layer based on current mode
  const tileUrl = isDarkMode.value ? DARK_TILES : LIGHT_TILES;
  tileLayerInstance = L.tileLayer(tileUrl, {
    attribution: ATTRIBUTION,
    subdomains: 'abcd'
  }).addTo(mapInstance);

  // Add customized pulsing markers
  renderMarkers();

  // Listen for popup action button clicks using event delegation
  mapContainer.value.addEventListener('click', handlePopupClick);
};

// Handle clicks inside Leaflet popups dynamically
const handlePopupClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('map-explore-btn')) {
    const destId = parseInt(target.getAttribute('data-id') || '0', 10);
    const dest = destinations.find(d => d.id === destId);
    if (dest && openCard) {
      // Create translated destination object
      const translatedDest = {
        ...dest,
        name: t('destinations.countries.' + dest.key),
        location: t('destinations.regions.' + dest.regionKey)
      };
      openCard('destination', translatedDest, event);
    }
  }
};

// Render markers with premium pulsing design
const renderMarkers = () => {
  if (!mapInstance) return;

  // Clear previous markers
  activeMarkers.value.forEach(m => m.remove());
  activeMarkers.value = [];

  destinations.forEach(dest => {
    // Translate destination strings
    const name = t('destinations.countries.' + dest.key);
    const locName = t('destinations.regions.' + dest.regionKey);
    const exploreText = t('nav.explore');

    // Custom pulsing HTML icon
    const customIcon = L.divIcon({
      html: `
        <div class="custom-map-marker">
          <div class="marker-pulse"></div>
          <div class="marker-pin-inner"></div>
        </div>
      `,
      className: '', // Remove default styling
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Detailed popup content styled with modern layout
    const popupContent = `
      <div class="map-popup-card">
        <div class="map-popup-img-wrap">
          <img src="${dest.image}" alt="${name}" class="map-popup-img" />
          <span class="map-popup-tag">${locName}</span>
        </div>
        <div class="map-popup-body">
          <h4 class="map-popup-title">${name}</h4>
          <p class="map-popup-text">${t('destinations.clickPin')}</p>
          <button class="map-explore-btn font-semibold" data-id="${dest.id}">
            ${exploreText} →
          </button>
        </div>
      </div>
    `;

    const marker = L.marker([dest.lat, dest.lng], { icon: customIcon })
      .bindPopup(popupContent, {
        closeButton: false,
        minWidth: 220,
        className: 'custom-leaflet-popup'
      })
      .addTo(mapInstance!);

    activeMarkers.value.push(marker);
  });
};

// Monitor theme changes to update map tile layers smoothly
const updateMapTheme = (dark: boolean) => {
  isDarkMode.value = dark;
  if (tileLayerInstance && mapInstance) {
    tileLayerInstance.setUrl(dark ? DARK_TILES : LIGHT_TILES);
  }
};

// Listen for custom theme switch event or update from watch
watch(isDarkMode, (newVal) => {
  if (tileLayerInstance) {
    tileLayerInstance.setUrl(newVal ? DARK_TILES : LIGHT_TILES);
  }
});

// Watch locale changes to re-render markers with new translations
watch(locale, () => {
  renderMarkers();
});

// Setup MutationObserver to watch dark-mode class on documentElement
let observer: MutationObserver | null = null;

onMounted(() => {
  initMap();

  // Watch for theme toggles on <html> element
  observer = new MutationObserver(() => {
    const dark = document.documentElement.classList.contains('dark-mode');
    updateMapTheme(dark);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  if (mapInstance) {
    mapInstance.remove();
  }
  if (mapContainer.value) {
    mapContainer.value.removeEventListener('click', handlePopupClick);
  }
});
</script>

<template>
  <div class="map-wrapper flex flex-col h-full w-full relative">
    <div ref="mapContainer" class="map-container flex-1 w-full rounded-2xl overflow-hidden min-h-[300px] md:min-h-[400px]"></div>
    <!-- Floating Quick Info -->
    <div class="absolute top-4 left-4 z-[500] pointer-events-none max-w-[240px]">
      <div class="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur shadow-md rounded-xl p-3 border border-neutral-200/50 dark:border-neutral-800/80 transition-all">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-amber-500 text-sm">🌐</span>
          <h5 class="text-xs font-bold uppercase tracking-wider text-dark dark:text-white m-0">{{ t('destinations.title') }}</h5>
        </div>
        <p class="text-[11px] text-neutral-500 dark:text-neutral-400 m-0 leading-tight">
          {{ t('destinations.clickPin') }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Leaflet customized container and markers */
.map-container {
  border: 1px solid var(--color-border);
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
}

/* Custom Marker Styling */
.custom-map-marker {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-pin-inner {
  width: 14px;
  height: 14px;
  background: var(--color-primary);
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.custom-map-marker:hover .marker-pin-inner {
  transform: scale(1.3);
  background: var(--color-primary-dark);
}

.marker-pulse {
  position: absolute;
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: markerPulse 1.8s infinite ease-out;
  pointer-events: none;
}

@keyframes markerPulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Leaflet Popup overrides for premium bento style */
.custom-leaflet-popup .leaflet-popup-content-wrapper {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border: 1px solid var(--color-border);
  transition: background 0.3s, border-color 0.3s;
}

.dark-mode .custom-leaflet-popup .leaflet-popup-content-wrapper {
  background: rgba(26, 26, 26, 0.98);
  border-color: rgba(255, 255, 255, 0.1);
}

.custom-leaflet-popup .leaflet-popup-content {
  margin: 0;
  font-family: var(--font-sans);
}

.custom-leaflet-popup .leaflet-popup-tip {
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--color-border);
}

.dark-mode .custom-leaflet-popup .leaflet-popup-tip {
  background: #1A1A1A;
  border-color: rgba(255, 255, 255, 0.1);
}

/* Inner card inside leaflet popup */
.map-popup-card {
  display: flex;
  flex-direction: column;
  width: 220px;
}

.map-popup-img-wrap {
  position: relative;
  width: 100%;
  height: 110px;
  overflow: hidden;
}

.map-popup-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-popup-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.map-popup-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.map-popup-title {
  font-size: 14px;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0;
}

.dark-mode .map-popup-title {
  color: #ffffff;
}

.map-popup-text {
  font-size: 11px;
  color: #666666;
  margin: 0;
  line-height: 1.3;
}

.dark-mode .map-popup-text {
  color: #aaaaaa;
}

.map-explore-btn {
  background: var(--color-primary);
  color: var(--color-dark);
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 11px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 4px;
}

.map-explore-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.dark-mode .map-explore-btn {
  background: var(--color-primary);
  color: #1A1A1A;
}

.dark-mode .map-explore-btn:hover {
  background: var(--color-accent-yellow);
}
</style>
