<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  store, 
  addUmrahPackage, 
  deleteUmrahPackage, 
  updateBookingStatus, 
  deleteBooking, 
  addDestination, 
  deleteDestination, 
  addTeamMember, 
  deleteTeamMember, 
  addService, 
  deleteService, 
  addPartner, 
  deletePartner, 
  addTransaction, 
  deleteTransaction 
} from '../store';

// Navigation tabs
const activeTab = ref<'overview' | 'financials' | 'bookings' | 'packages' | 'destinations' | 'team' | 'services' | 'partners'>('overview');

// System clock
const currentTime = ref('');
let clockInterval: any = null;

const updateClock = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});

// Form states
const showAddTxnForm = ref(false);
const showAddPkgForm = ref(false);
const showAddDestForm = ref(false);
const showAddTeamForm = ref(false);
const showAddServiceForm = ref(false);
const showAddPartnerForm = ref(false);

const newTxn = ref({
  description: '',
  descriptionAr: '',
  type: 'revenue' as 'revenue' | 'expense',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  category: 'Umrah Package',
  dealReference: ''
});

const newPkg = ref({
  name: '',
  nameAr: '',
  nameFr: '',
  tagline: '',
  taglineAr: '',
  taglineFr: '',
  priceVal: '',
  duration: '15 Days / 14 Nights',
  durationAr: '15 يومًا / 14 ليلة',
  durationFr: '15 Jours / 14 Nuits',
  image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
  makkahHotel: '',
  makkahHotelAr: '',
  makkahHotelFr: '',
  makkahDist: '',
  makkahDistAr: '',
  makkahDistFr: '',
  madinahHotel: '',
  madinahHotelAr: '',
  madinahHotelFr: '',
  madinahDist: '',
  madinahDistAr: '',
  madinahDistFr: '',
  flight: 'Air Algérie (Direct Flight Algiers - Jeddah)',
  flightAr: 'الخطوط الجوية الجزائرية (رحلة مباشرة: الجزائر - جدة)',
  flightFr: 'Air Algérie (Vol Direct Alger - Djeddah)'
});

const newDest = ref({
  name: '',
  nameAr: '',
  nameFr: '',
  image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
  location: 'Europe',
  locationAr: 'أوروبا',
  locationFr: 'Europe'
});

const newTeam = ref({
  name: '',
  role: '',
  roleAr: '',
  roleFr: '',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  bio: '',
  bioAr: '',
  bioFr: '',
  languages: 'Arabic, French, English',
  experienceYears: '5 Years',
  countriesVisited: 12,
  favDest: 'Makkah'
});

const newService = ref({
  title: '',
  titleAr: '',
  titleFr: '',
  icon: '✈️',
  description: ''
});

const newPartner = ref({
  name: '',
  nameAr: '',
  nameFr: '',
  type: 'Luxury Travel Partner',
  typeAr: 'شريك إقامة فاخرة',
  typeFr: 'Partenaire Voyage de Luxe',
  desc: '',
  descAr: '',
  descFr: '',
  contractId: 'TRV-' + Math.floor(1000 + Math.random() * 9000)
});

// Computations
const totalRevenue = computed(() => {
  return store.moneyTransactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, item) => sum + item.amount, 0);
});

const totalExpenses = computed(() => {
  return store.moneyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
});

const netProfit = computed(() => {
  return totalRevenue.value - totalExpenses.value;
});

const totalBookingsCount = computed(() => store.bookings.length);
const pendingBookingsCount = computed(() => store.bookings.filter(b => b.status === 'pending').length);
const approvedBookingsCount = computed(() => store.bookings.filter(b => b.status === 'approved').length);

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val) + ' DZD';
};

const sparklinePath = computed(() => {
  const txns = [...store.moneyTransactions].reverse();
  if (txns.length < 2) return "M 10,40 L 290,40";
  let bal = 0;
  const points = txns.map(t => {
    bal += t.type === 'revenue' ? t.amount : -t.amount;
    return bal;
  });
  const min = Math.min(...points, 0);
  const max = Math.max(...points, 100000);
  const range = max - min || 1;
  const w = 300, h = 60, pad = 5;
  return points.map((v, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
});

// Mutators wrappers
const submitTxn = () => {
  if (!newTxn.value.description || newTxn.value.amount <= 0) return;
  addTransaction({
    description: newTxn.value.description,
    descriptionAr: newTxn.value.descriptionAr || newTxn.value.description,
    type: newTxn.value.type,
    amount: newTxn.value.amount,
    date: newTxn.value.date,
    category: newTxn.value.category,
    dealReference: newTxn.value.dealReference || undefined
  });
  newTxn.value = {
    description: '',
    descriptionAr: '',
    type: 'revenue',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Umrah Package',
    dealReference: ''
  };
  showAddTxnForm.value = false;
};

const submitPkg = () => {
  if (!newPkg.value.name || !newPkg.value.priceVal) return;
  addUmrahPackage({
    name: newPkg.value.name,
    nameAr: newPkg.value.nameAr || newPkg.value.name,
    nameFr: newPkg.value.nameFr || newPkg.value.name,
    tagline: newPkg.value.tagline || 'Experience a premium peaceful pilgrimage',
    taglineAr: newPkg.value.taglineAr || 'عمرة ميسرة مع خدمات راقية ومميزة',
    taglineFr: newPkg.value.taglineFr || 'Voyage spirituel de haute qualité',
    price: `${newPkg.value.priceVal} DZD`,
    priceVal: `${newPkg.value.priceVal} DZD`,
    duration: newPkg.value.duration,
    durationAr: newPkg.value.durationAr,
    durationFr: newPkg.value.durationFr,
    rating: '5.0',
    reviews: '1',
    image: newPkg.value.image,
    makkahHotel: newPkg.value.makkahHotel,
    makkahHotelAr: newPkg.value.makkahHotelAr || newPkg.value.makkahHotel,
    makkahHotelFr: newPkg.value.makkahHotelFr || newPkg.value.makkahHotel,
    makkahDist: newPkg.value.makkahDist,
    makkahDistAr: newPkg.value.makkahDistAr || newPkg.value.makkahDist,
    makkahDistFr: newPkg.value.makkahDistFr || newPkg.value.makkahDist,
    madinahHotel: newPkg.value.madinahHotel,
    madinahHotelAr: newPkg.value.madinahHotelAr || newPkg.value.madinahHotel,
    madinahHotelFr: newPkg.value.madinahHotelFr || newPkg.value.madinahHotel,
    madinahDist: newPkg.value.madinahDist,
    madinahDistAr: newPkg.value.madinahDistAr || newPkg.value.madinahDist,
    madinahDistFr: newPkg.value.madinahDistFr || newPkg.value.madinahDist,
    flight: newPkg.value.flight,
    flightAr: newPkg.value.flightAr || newPkg.value.flight,
    flightFr: newPkg.value.flightFr || newPkg.value.flight,
    itinerary: [
      {
        day: 'Day 1',
        dayAr: 'اليوم 1',
        dayFr: 'Jour 1',
        title: 'Arrival & Welcome',
        titleAr: 'الوصول والاستقبال',
        titleFr: 'Arrivée & Installation',
        desc: 'Meet delegates and transfer to premium accommodation.',
        descAr: 'الوصول بمشيئة الله والاستقبال المريح بالباص السياحي المتميز.',
        descFr: 'Accueil à l\'aéroport et transfert vers votre hôtel.'
      }
    ]
  });
  newPkg.value = {
    name: '',
    nameAr: '',
    nameFr: '',
    tagline: '',
    taglineAr: '',
    taglineFr: '',
    priceVal: '',
    duration: '15 Days / 14 Nights',
    durationAr: '15 يومًا / 14 ليلة',
    durationFr: '15 Jours / 14 Nuits',
    image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
    makkahHotel: '',
    makkahHotelAr: '',
    makkahHotelFr: '',
    makkahDist: '',
    makkahDistAr: '',
    makkahDistFr: '',
    madinahHotel: '',
    madinahHotelAr: '',
    madinahHotelFr: '',
    madinahDist: '',
    madinahDistAr: '',
    madinahDistFr: '',
    flight: 'Air Algérie (Direct Flight Algiers - Jeddah)',
    flightAr: 'الخطوط الجوية الجزائرية (رحلة مباشرة: الجزائر - جدة)',
    flightFr: 'Air Algérie (Vol Direct Alger - Djeddah)'
  };
  showAddPkgForm.value = false;
};

const submitDest = () => {
  if (!newDest.value.name) return;
  addDestination({
    name: newDest.value.name,
    nameAr: newDest.value.nameAr || newDest.value.name,
    nameFr: newDest.value.nameFr || newDest.value.name,
    image: newDest.value.image,
    location: newDest.value.location,
    locationAr: newDest.value.locationAr || newDest.value.location,
    locationFr: newDest.value.locationFr || newDest.value.location
  });
  newDest.value = {
    name: '',
    nameAr: '',
    nameFr: '',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    location: 'Europe',
    locationAr: 'أوروبا',
    locationFr: 'Europe'
  };
  showAddDestForm.value = false;
};

const submitTeam = () => {
  if (!newTeam.value.name || !newTeam.value.role) return;
  addTeamMember({
    name: newTeam.value.name,
    role: newTeam.value.role,
    roleAr: newTeam.value.roleAr || newTeam.value.role,
    roleFr: newTeam.value.roleFr || newTeam.value.role,
    image: newTeam.value.image,
    bio: newTeam.value.bio,
    bioAr: newTeam.value.bioAr || newTeam.value.bio,
    bioFr: newTeam.value.bioFr || newTeam.value.bio,
    languages: newTeam.value.languages,
    experienceYears: newTeam.value.experienceYears,
    countriesVisited: Number(newTeam.value.countriesVisited),
    favDest: newTeam.value.favDest
  });
  newTeam.value = {
    name: '',
    role: '',
    roleAr: '',
    roleFr: '',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: '',
    bioAr: '',
    bioFr: '',
    languages: 'Arabic, French, English',
    experienceYears: '5 Years',
    countriesVisited: 12,
    favDest: 'Makkah'
  };
  showAddTeamForm.value = false;
};

const submitService = () => {
  if (!newService.value.title) return;
  addService({
    title: newService.value.title,
    titleAr: newService.value.titleAr || newService.value.title,
    titleFr: newService.value.titleFr || newService.value.title,
    icon: newService.value.icon,
    description: newService.value.description
  });
  newService.value = {
    title: '',
    titleAr: '',
    titleFr: '',
    icon: '✈️',
    description: ''
  };
  showAddServiceForm.value = false;
};

const submitPartner = () => {
  if (!newPartner.value.name) return;
  addPartner({
    name: newPartner.value.name,
    nameAr: newPartner.value.nameAr || newPartner.value.name,
    nameFr: newPartner.value.nameFr || newPartner.value.name,
    type: newPartner.value.type,
    typeAr: newPartner.value.typeAr || newPartner.value.type,
    typeFr: newPartner.value.typeFr || newPartner.value.type,
    desc: newPartner.value.desc,
    descAr: newPartner.value.descAr || newPartner.value.desc,
    descFr: newPartner.value.descFr || newPartner.value.desc,
    contractId: newPartner.value.contractId
  });
  newPartner.value = {
    name: '',
    nameAr: '',
    nameFr: '',
    type: 'Luxury Travel Partner',
    typeAr: 'شريك إقامة فاخرة',
    typeFr: 'Partenaire Voyage de Luxe',
    desc: '',
    descAr: '',
    descFr: '',
    contractId: 'TRV-' + Math.floor(1000 + Math.random() * 9000)
  };
  showAddPartnerForm.value = false;
};

const handleApprove = (booking: any) => {
  updateBookingStatus(booking.id, 'approved');
  let amt = 165000;
  const pkg = store.packages.find(p => p.id === booking.packageId);
  if (pkg) {
    const raw = pkg.priceVal.replace(/[^0-9]/g, '');
    if (raw) amt = Number(raw);
  }
  const total = amt * booking.pilgrimsCount;
  
  const alreadyLogged = store.moneyTransactions.some(t => t.dealReference === booking.clientPhone);
  if (!alreadyLogged) {
    addTransaction({
      description: `Approved Booking - ${booking.clientName}`,
      descriptionAr: `حجز معتمد - ${booking.clientName}`,
      type: 'revenue',
      amount: total,
      date: new Date().toISOString().split('T')[0],
      category: 'Umrah Package',
      dealReference: booking.clientPhone
    });
  }
};
</script>

<template>
  <div class="dashboard-custom-container min-h-screen pb-32">
    <!-- Outer decorative soft pattern wrapper -->
    <div class="absolute inset-0 bg-radial-gradient opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(var(--color-dark) 1px, transparent 0); background-size: 24px 24px;"></div>
    
    <div class="relative z-10 space-y-12">
      <!-- Premium Design Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E0D8] dark:border-slate-800/80 pb-10">
        <div class="space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF8ED] dark:bg-[#1C140A] border border-[#F5A623]/20 rounded-full">
            <span class="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#F5A623]">Tripora Operations Terminal</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-serif italic font-extrabold text-slate-900 dark:text-white tracking-tight">
            Agency <span class="text-[#F5A623] highlight-underline">Console</span>
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xl font-sans font-medium">
            Manage your high-end destinations, pilgrimage programs, client queue pipelines, and luxury operations ledger.
          </p>
        </div>

        <!-- Clock & Security -->
        <div class="flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 border border-[#E5E0D8]/80 dark:border-slate-800/80 p-4.5 rounded-[24px] shadow-sm shrink-0">
          <div class="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800">
            <span class="text-lg">⏱️</span>
            <div>
              <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Clock Out</span>
              <span class="font-mono text-sm font-bold text-slate-950 dark:text-white">{{ currentTime || '00:00:00' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-lg">🛡️</span>
            <div>
              <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Cache State</span>
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Authorized
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Core Operations Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Sidebar Navigation Card -->
        <aside class="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 p-3 pb-4 lg:pb-3 rounded-[32px] bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/60 dark:border-slate-800/80 shadow-md shadow-amber-900/[0.02] sticky top-28 z-20 scrollbar-none shrink-0">
          <button 
            v-for="tab in ['overview', 'financials', 'bookings', 'packages', 'destinations', 'team', 'services', 'partners'] as const" 
            :key="tab"
            @click="activeTab = tab"
            class="flex items-center justify-between gap-4 px-4.5 py-3.5 rounded-full font-sans font-bold text-[10px] tracking-widest uppercase transition-all duration-300 border cursor-pointer shrink-0 whitespace-nowrap w-full relative group"
            :class="activeTab === tab 
              ? 'bg-gradient-to-r from-[#F5A623] to-[#E8951A] border-transparent text-slate-950 shadow-md shadow-amber-500/15' 
              : 'bg-transparent border-transparent text-slate-600 dark:text-slate-400 hover:bg-[#FFF8ED]/60 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'"
          >
            <div class="flex items-center gap-3">
              <span class="text-base" v-if="tab === 'overview'">📊</span>
              <span class="text-base" v-else-if="tab === 'financials'">💸</span>
              <span class="text-base" v-else-if="tab === 'bookings'">📝</span>
              <span class="text-base" v-else-if="tab === 'packages'">🕋</span>
              <span class="text-base" v-else-if="tab === 'destinations'">📍</span>
              <span class="text-base" v-else-if="tab === 'team'">👥</span>
              <span class="text-base" v-else-if="tab === 'services'">⚙️</span>
              <span class="text-base" v-else-if="tab === 'partners'">🤝</span>

              <span>
                <span v-if="tab === 'overview'">Overview</span>
                <span v-else-if="tab === 'financials'">Cashflow Ledger</span>
                <span v-else-if="tab === 'bookings'">Pilgrim Queue</span>
                <span v-else-if="tab === 'packages'">Umrah Packages</span>
                <span v-else-if="tab === 'destinations'">Destinations</span>
                <span v-else-if="tab === 'team'">Experts Pool</span>
                <span v-else-if="tab === 'services'">Value Props</span>
                <span v-else-if="tab === 'partners'">Partners</span>
              </span>
            </div>

            <!-- Beautiful counts badges inside the floating sidebar -->
            <span 
              v-if="tab === 'bookings' && pendingBookingsCount > 0"
              class="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-normal"
              :class="activeTab === 'bookings' ? 'bg-slate-950 text-[#F5A623]' : 'bg-[#F5A623]/15 text-[#E8951A]'"
            >
              {{ pendingBookingsCount }}
            </span>
            <span 
              v-else-if="tab === 'packages' || tab === 'destinations'"
              class="px-2 py-0.5 rounded-full text-[8px] font-bold font-mono"
              :class="activeTab === tab ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'"
            >
              {{ tab === 'packages' ? store.packages.length : store.destinations.length }}
            </span>
          </button>
        </aside>

        <!-- Main Workspace Card Wrapper -->
        <main class="lg:col-span-9 bg-white/40 dark:bg-slate-900/30 rounded-[32px] border border-[#E5E0D8]/50 dark:border-slate-800/50 p-6 md:p-10 shadow-sm relative overflow-hidden backdrop-blur-md">
          
          <!-- TAB 1: OVERVIEW -->
          <div v-if="activeTab === 'overview'" class="space-y-10 animate-fade-in">
            
            <!-- Statistics Bento Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <!-- Card 1: Gross Revenue -->
              <div class="relative overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 rounded-[28px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 group-hover:w-2.5 transition-all"></div>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Gross Revenue</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">Inflow</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif italic font-extrabold mt-4 tracking-tight text-slate-900 dark:text-white">
                  {{ formatCurrency(totalRevenue) }}
                </h3>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1.5 font-sans font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Deposits secured & validated
                </p>
              </div>

              <!-- Card 2: Operating Expenses -->
              <div class="relative overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 rounded-[28px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 group-hover:w-2.5 transition-all"></div>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Operating Expenses</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[8px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 uppercase tracking-widest">Outflow</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif italic font-extrabold mt-4 tracking-tight text-slate-900 dark:text-white">
                  {{ formatCurrency(totalExpenses) }}
                </h3>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1.5 font-sans font-semibold">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  Hotel & Flight procurement cost
                </p>
              </div>

              <!-- Card 3: Net Profit Margin -->
              <div class="relative overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 rounded-[28px] p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#F5A623] group-hover:w-2.5 transition-all"></div>
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Net Profit Yield</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[8px] font-black bg-[#F5A623]/10 text-[#E8951A] border border-[#F5A623]/20 uppercase tracking-widest">Margin</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-serif italic font-extrabold mt-4 tracking-tight text-slate-900 dark:text-white">
                  {{ formatCurrency(netProfit) }}
                </h3>
                <!-- Dynamic Sparkline Visualization -->
                <div class="mt-4 h-9 w-full">
                  <svg viewBox="0 0 300 60" class="w-full h-full overflow-visible">
                    <path :d="sparklinePath" stroke="#F5A623" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </div>
              </div>

            </div>

            <!-- Capital Ratio Allocation Graph -->
            <div class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 rounded-[28px] p-7 shadow-sm">
              <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span>Capital Distribution Ratio</span>
                <span class="text-[#F5A623] font-black">{{ totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '100.0' }}% Net margin yield</span>
              </div>
              <div class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  :style="{ width: `${totalRevenue > 0 ? (totalExpenses / totalRevenue) * 100 : 0}%` }" 
                  class="h-full bg-rose-500 transition-all duration-500"
                  title="Expenses"
                ></div>
                <div 
                  :style="{ width: `${totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 100}%` }" 
                  class="h-full bg-emerald-500 transition-all duration-500"
                  title="Net Profit"
                ></div>
              </div>
              <div class="flex items-center gap-6 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-4">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>Expenses ({{ totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(0) : 0 }}%)</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Net Yield Profit ({{ totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(0) : 100 }}%)</span>
                </div>
              </div>
            </div>

            <!-- General Pipeline Counters -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/60 dark:border-slate-800 p-6 rounded-[24px] flex items-center justify-between">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Bookings</span>
                  <strong class="text-3xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1.5 block">{{ totalBookingsCount }}</strong>
                </div>
                <div class="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-[#F5A623] flex items-center justify-center rounded-full text-lg">📝</div>
              </div>

              <div class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/60 dark:border-slate-800 p-6 rounded-[24px] flex items-center justify-between">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Pending Queue</span>
                  <strong class="text-3xl font-serif italic font-extrabold text-[#F5A623] mt-1.5 block">{{ pendingBookingsCount }}</strong>
                </div>
                <div class="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-[#F5A623] flex items-center justify-center rounded-full text-lg">🕒</div>
              </div>

              <div class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/60 dark:border-slate-800 p-6 rounded-[24px] flex items-center justify-between">
                <div>
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Approved Pipeline</span>
                  <strong class="text-3xl font-serif italic font-extrabold text-emerald-500 mt-1.5 block">{{ approvedBookingsCount }}</strong>
                </div>
                <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center rounded-full text-lg">✓</div>
              </div>

            </div>

            <!-- Central Core Entities Summary -->
            <div class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 rounded-[28px] p-7 space-y-4">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Core Registry Counters</h4>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div class="bg-[#FFF8ED]/40 dark:bg-slate-800/10 p-4 rounded-[18px] border border-[#E5E0D8]/40 dark:border-slate-800/40">
                  <span class="text-[8px] text-slate-400 uppercase font-black block">Packages</span>
                  <strong class="text-xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1 block">{{ store.packages.length }}</strong>
                </div>
                <div class="bg-[#FFF8ED]/40 dark:bg-slate-800/10 p-4 rounded-[18px] border border-[#E5E0D8]/40 dark:border-slate-800/40">
                  <span class="text-[8px] text-slate-400 uppercase font-black block">Destinations</span>
                  <strong class="text-xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1 block">{{ store.destinations.length }}</strong>
                </div>
                <div class="bg-[#FFF8ED]/40 dark:bg-slate-800/10 p-4 rounded-[18px] border border-[#E5E0D8]/40 dark:border-slate-800/40">
                  <span class="text-[8px] text-slate-400 uppercase font-black block">Guides Pool</span>
                  <strong class="text-xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1 block">{{ store.teamMembers.length }}</strong>
                </div>
                <div class="bg-[#FFF8ED]/40 dark:bg-slate-800/10 p-4 rounded-[18px] border border-[#E5E0D8]/40 dark:border-slate-800/40">
                  <span class="text-[8px] text-slate-400 uppercase font-black block">Services</span>
                  <strong class="text-xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1 block">{{ store.services.length }}</strong>
                </div>
                <div class="bg-[#FFF8ED]/40 dark:bg-slate-800/10 p-4 rounded-[18px] border border-[#E5E0D8]/40 dark:border-slate-800/40 col-span-2 sm:col-span-1">
                  <span class="text-[8px] text-slate-400 uppercase font-black block">Partners</span>
                  <strong class="text-xl font-serif italic font-extrabold text-slate-900 dark:text-white mt-1 block">{{ store.partners.length }}</strong>
                </div>
              </div>
            </div>

          </div>

          <!-- TAB 2: FINANCIALS -->
          <div v-else-if="activeTab === 'financials'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Cashflow Ledger</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Bookkeeping journal of all travel deposits and logistics expenses.</p>
              </div>
              <button 
                @click="showAddTxnForm = !showAddTxnForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddTxnForm ? '✕ Close Form' : '➕ Create Voucher' }}</span>
              </button>
            </div>

            <!-- Form -->
            <div v-if="showAddTxnForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Record Log Voucher</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voucher Label (EN)</label>
                  <input v-model="newTxn.description" placeholder="e.g. Flight ticket procurement Air Algérie" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Voucher Label (AR)</label>
                  <input v-model="newTxn.descriptionAr" placeholder="مثال: دفع تكاليف تذاكر طيران الخطوط الجزائرية" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                  <select v-model="newTxn.category" class="premium-input text-xs w-full bg-transparent">
                    <option value="Umrah Package">🕋 Umrah Package Sales</option>
                    <option value="Flight booking">✈️ Flight Procurement</option>
                    <option value="Hotel Renting">🏨 Hotels Lodging Cost</option>
                    <option value="Visas">🛂 Visa Procurement</option>
                    <option value="Operations & Salaries">💼 Operations & Salaries</option>
                    <option value="Other">⚓ General Operating</option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Inflow / Outflow</label>
                    <select v-model="newTxn.type" class="premium-input text-xs w-full bg-transparent">
                      <option value="revenue">🟢 Revenue (Inflow)</option>
                      <option value="expense">🔴 Expense (Outflow)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Amount (DZD)</label>
                    <input type="number" v-model.number="newTxn.amount" class="premium-input text-xs w-full" />
                  </div>
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Posting Date</label>
                  <input type="date" v-model="newTxn.date" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Audit Phone Link (Optional)</label>
                  <input v-model="newTxn.dealReference" placeholder="e.g. 0552148769" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddTxnForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitTxn" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Save Posting</button>
              </div>
            </div>

            <!-- Ledger Table -->
            <div class="overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/60 dark:border-slate-800/80 rounded-[28px] shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50/50 dark:bg-slate-900/40 text-[9px] font-bold uppercase tracking-widest text-slate-400 border-b border-[#E5E0D8]/60 dark:border-slate-800">
                      <th class="px-6 py-4.5">Voucher No / Date</th>
                      <th class="px-6 py-4.5">Account Label / Audit trail</th>
                      <th class="px-6 py-4.5">Allocation Line</th>
                      <th class="px-6 py-4.5">Inflow/Outflow</th>
                      <th class="px-6 py-4.5">Posting Amount</th>
                      <th class="px-6 py-4.5 text-right">Operation</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans text-slate-700 dark:text-slate-300">
                    <tr v-for="txn in store.moneyTransactions" :key="txn.id" class="hover:bg-[#FFF8ED]/20 dark:hover:bg-slate-800/10 transition duration-150">
                      <td class="px-6 py-4.5 whitespace-nowrap">
                        <span class="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">#{{ txn.id }}</span>
                        <span class="block text-[10px] text-slate-400 mt-1 font-medium">{{ txn.date }}</span>
                      </td>
                      <td class="px-6 py-4.5">
                        <div class="font-bold text-slate-900 dark:text-slate-100 text-[13px]">{{ txn.description }}</div>
                        <div class="text-[11px] text-slate-400 mt-0.5" dir="rtl" v-if="txn.descriptionAr">{{ txn.descriptionAr }}</div>
                        <span v-if="txn.dealReference" class="inline-flex mt-1 text-[8px] text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Dossier Ref: {{ txn.dealReference }}
                        </span>
                      </td>
                      <td class="px-6 py-4.5 font-semibold text-slate-500 dark:text-slate-400">{{ txn.category }}</td>
                      <td class="px-6 py-4.5 whitespace-nowrap">
                        <span class="px-3 py-1 text-[8px] font-black rounded-full uppercase tracking-widest inline-block border" 
                          :class="txn.type === 'revenue' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'">
                          {{ txn.type }}
                        </span>
                      </td>
                      <td class="px-6 py-4.5 font-mono font-bold text-sm whitespace-nowrap" :class="txn.type === 'revenue' ? 'text-emerald-600' : 'text-rose-600'">
                        {{ txn.type === 'revenue' ? '+' : '-' }} {{ formatCurrency(txn.amount) }}
                      </td>
                      <td class="px-6 py-4.5 text-right whitespace-nowrap">
                        <button @click="deleteTransaction(txn.id)" class="text-rose-500 hover:text-rose-600 font-black text-[9px] uppercase tracking-wider cursor-pointer hover:underline transition">
                          ✕ Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p v-if="store.moneyTransactions.length === 0" class="text-center py-12 text-slate-400 font-sans text-xs">No transaction records present.</p>
          </div>

          <!-- TAB 3: BOOKINGS / CRM -->
          <div v-else-if="activeTab === 'bookings'" class="space-y-8 animate-fade-in">
            <div>
              <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Pilgrim Queue</h2>
              <p class="text-xs text-slate-500 mt-1 font-sans">Verify and approve reservations. Approved reservations automatically log package revenue.</p>
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div 
                v-for="booking in store.bookings" 
                :key="booking.id" 
                class="border border-[#E5E0D8]/80 dark:border-slate-800/80 rounded-[28px] p-6 bg-white dark:bg-[#1A1A1A] hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div class="space-y-4 flex-1">
                  <div class="flex items-center gap-3">
                    <span class="font-mono text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded">#{{ booking.id }}</span>
                    
                    <!-- Redesigned Badges matching premium travel palette -->
                    <span class="px-3 py-0.5 text-[8px] font-black rounded-full uppercase tracking-widest inline-block border"
                      :class="{
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20': booking.status === 'pending',
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20': booking.status === 'approved',
                        'bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400 border-slate-200 dark:border-slate-800': booking.status === 'completed',
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20': booking.status === 'cancelled'
                      }"
                    >
                      {{ booking.status }}
                    </span>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E8951A] text-slate-950 font-black text-sm flex items-center justify-center">
                      {{ booking.clientName.charAt(0) }}
                    </div>
                    <div>
                      <h3 class="text-base font-serif italic font-bold text-slate-900 dark:text-white">{{ booking.clientName }}</h3>
                      <p class="text-xs text-[#E8951A] font-sans font-semibold mt-0.5">📞 {{ booking.clientPhone }}</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <p class="flex items-center gap-2 font-sans"><strong>Package:</strong> <span class="text-slate-800 dark:text-slate-200 font-bold">{{ booking.packageName }}</span></p>
                    <p class="flex items-center gap-2 font-sans"><strong>Room Setup:</strong> <span class="text-slate-800 dark:text-slate-200 font-bold capitalize">{{ booking.roomPreference }} Setup</span></p>
                    <p class="flex items-center gap-2 font-sans"><strong>Pax Count:</strong> <span class="text-slate-800 dark:text-slate-200 font-bold">{{ booking.pilgrimsCount }} Pax</span></p>
                    <p class="flex items-center gap-2 font-sans"><strong>Departure:</strong> <span class="text-slate-800 dark:text-slate-200 font-bold font-mono">{{ booking.departureDate }}</span></p>
                  </div>

                  <p v-if="booking.notes" class="text-xs text-slate-500 dark:text-slate-400 bg-[#FFF8ED]/30 dark:bg-[#1C140A]/20 p-3.5 rounded-[18px] border border-dashed border-[#E5E0D8]">
                    📌 <strong>Agent Remarks:</strong> {{ booking.notes }}
                  </p>
                </div>

                <!-- Operations actions buttons -->
                <div class="flex flex-row lg:flex-col gap-2 justify-end shrink-0 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
                  <button 
                    v-if="booking.status !== 'approved'"
                    @click="handleApprove(booking)" 
                    class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] hover:from-[#E8951A] hover:to-[#D48212] text-slate-950 font-sans font-extrabold text-[9px] tracking-widest uppercase py-3 px-5 transition shadow-sm active:scale-95 cursor-pointer flex-1 lg:flex-initial"
                  >
                    ✓ Approve Deal
                  </button>
                  <button 
                    v-if="booking.status !== 'completed'"
                    @click="updateBookingStatus(booking.id, 'completed')" 
                    class="rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-sans font-bold text-[9px] tracking-widest uppercase py-3 px-5 transition cursor-pointer flex-1 lg:flex-initial"
                  >
                    Mark Complete
                  </button>
                  <div class="flex gap-2 w-full lg:w-auto">
                    <button 
                      v-if="booking.status !== 'cancelled'"
                      @click="updateBookingStatus(booking.id, 'cancelled')" 
                      class="rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-bold text-[9px] tracking-widest uppercase py-3 px-4 transition cursor-pointer flex-1"
                    >
                      Cancel
                    </button>
                    <button @click="deleteBooking(booking.id)" class="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-[9px] tracking-widest uppercase py-3 px-4 transition cursor-pointer flex-1">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="store.bookings.length === 0" class="text-center py-16 text-slate-400">No applicant booking requests in queue.</p>
          </div>

          <!-- TAB 4: PACKAGES -->
          <div v-else-if="activeTab === 'packages'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Active Umrah Programs</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Deploy or remove active luxury and comfort spiritual travel offers.</p>
              </div>
              <button 
                @click="showAddPkgForm = !showAddPkgForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddPkgForm ? '✕ Close Form' : '🕋 Deploy New Program' }}</span>
              </button>
            </div>

            <!-- Add Program form -->
            <div v-if="showAddPkgForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Formulate Spiritual Travel Program</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Program Name (EN)</label>
                  <input v-model="newPkg.name" placeholder="e.g. Deluxe Golden Umrah" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Program Name (AR)</label>
                  <input v-model="newPkg.nameAr" placeholder="مثال: باقة العمرة الذهبية الفاخرة" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Program Price (DZD value only)</label>
                  <input v-model="newPkg.priceVal" placeholder="e.g. 240,000" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Duration (English / Arabic / French)</label>
                  <div class="grid grid-cols-3 gap-2">
                    <input v-model="newPkg.duration" placeholder="15 Days / 14 Nights" class="premium-input text-[10px] w-full" />
                    <input v-model="newPkg.durationAr" placeholder="15 يومًا / 14 ليلة" class="premium-input text-[10px] w-full text-right" dir="rtl" />
                    <input v-model="newPkg.durationFr" placeholder="15 Jours / 14 Nuits" class="premium-input text-[10px] w-full" />
                  </div>
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Makkah Hotel & Stars (e.g. Anjum Makkah (★★★★))</label>
                  <input v-model="newPkg.makkahHotel" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Makkah Distance from Haram (e.g. 350m, shuttle details)</label>
                  <input v-model="newPkg.makkahDist" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Madinah Hotel & Stars (e.g. Saja Al Madinah (★★★★))</label>
                  <input v-model="newPkg.madinahHotel" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Madinah Distance from Masjid an-Nabawi</label>
                  <input v-model="newPkg.madinahDist" class="premium-input text-xs w-full" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Program Illustration Cover URL</label>
                  <input v-model="newPkg.image" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddPkgForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitPkg" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Deploy Program</button>
              </div>
            </div>

            <!-- Programs list - Styled beautifully matching high-end website cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                v-for="pkg in store.packages" 
                :key="pkg.id" 
                class="group rounded-[28px] overflow-hidden bg-white dark:bg-[#1C1A17] border border-[#E5E0D8]/80 dark:border-slate-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between"
              >
                <!-- Top Image + Gradient bottom overlay -->
                <div class="relative h-60 overflow-hidden shrink-0">
                  <img :src="pkg.image" :alt="pkg.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <span class="px-3 py-1 bg-[#F5A623] text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-full self-start mb-2">{{ pkg.duration }}</span>
                    <h3 class="text-xl md:text-2xl font-serif italic font-extrabold text-white leading-tight">
                      {{ pkg.name }}
                    </h3>
                    <p class="text-[11px] text-[#FFD580] font-sans font-semibold mt-1" dir="rtl">{{ pkg.nameAr }}</p>
                  </div>
                  
                  <!-- Trash button absolute -->
                  <button @click="deleteUmrahPackage(pkg.id)" class="absolute top-4 right-4 w-9 h-9 bg-black/60 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow">
                    ✕
                  </button>
                </div>

                <!-- Info panel with clean layout and typography -->
                <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div class="space-y-3.5">
                    <!-- Hotels Info Segment -->
                    <div class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <div class="flex items-start gap-2.5">
                        <span class="text-base select-none">🕋</span>
                        <div>
                          <strong class="font-sans font-bold text-slate-900 dark:text-slate-100 block">Makkah Accommodation</strong>
                          <span class="text-slate-500 text-[11px] block">{{ pkg.makkahHotel }}</span>
                          <span class="text-slate-400 text-[10px] block mt-0.5">📍 {{ pkg.makkahDist }}</span>
                        </div>
                      </div>

                      <div class="h-px bg-slate-100 dark:bg-slate-800/60 my-1"></div>

                      <div class="flex items-start gap-2.5">
                        <span class="text-base select-none">🕌</span>
                        <div>
                          <strong class="font-sans font-bold text-slate-900 dark:text-slate-100 block">Madinah Accommodation</strong>
                          <span class="text-slate-500 text-[11px] block">{{ pkg.madinahHotel }}</span>
                          <span class="text-slate-400 text-[10px] block mt-0.5">📍 {{ pkg.madinahDist }}</span>
                        </div>
                      </div>

                      <div class="h-px bg-slate-100 dark:bg-slate-800/60 my-1"></div>

                      <div class="flex items-start gap-2.5">
                        <span class="text-base select-none">✈️</span>
                        <div>
                          <strong class="font-sans font-bold text-slate-900 dark:text-slate-100 block">Flight Support</strong>
                          <span class="text-slate-500 text-[11px] block">{{ pkg.flight }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Price + badge -->
                  <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Premium Rate</span>
                      <strong class="text-lg md:text-xl font-mono font-black text-[#E8951A]">{{ pkg.priceVal }}</strong>
                    </div>
                    <span class="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-full">VIP Approved</span>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="store.packages.length === 0" class="text-center py-12 text-slate-400">No spiritual packages listed.</p>
          </div>

          <!-- TAB 5: DESTINATIONS -->
          <div v-else-if="activeTab === 'destinations'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Active Destinations</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Manage high-end, visual destination cards shown on our landing page.</p>
              </div>
              <button 
                @click="showAddDestForm = !showAddDestForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddDestForm ? '✕ Close Form' : '📍 Deploy Destination' }}</span>
              </button>
            </div>

            <!-- Form -->
            <div v-if="showAddDestForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Configure Visual Destination</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Destination Name (EN)</label>
                  <input v-model="newDest.name" placeholder="e.g. Bali" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Destination Name (AR)</label>
                  <input v-model="newDest.nameAr" placeholder="مثال: جزيرة بالي" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Region (e.g. Indonesia, Middle East, Europe)</label>
                  <input v-model="newDest.location" placeholder="e.g. Indonesia" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Region (AR)</label>
                  <input v-model="newDest.locationAr" placeholder="إندونيسيا" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">High-Quality Cover Image URL</label>
                  <input v-model="newDest.image" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddDestForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitDest" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Save Destination</button>
              </div>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div 
                v-for="dest in store.destinations" 
                :key="dest.id" 
                class="group relative h-60 rounded-[28px] overflow-hidden border border-[#E5E0D8]/60 dark:border-slate-800/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img :src="dest.image" :alt="dest.name" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <span class="px-2.5 py-0.5 bg-[#F5A623] text-slate-950 text-[8px] font-black uppercase tracking-widest rounded-full self-start mb-2">📍 {{ dest.location }}</span>
                  <h3 class="text-xl font-serif italic font-extrabold text-white">{{ dest.name }}</h3>
                  <span class="text-[10px] text-slate-300 font-medium block mt-1" dir="rtl" v-if="dest.nameAr">{{ dest.nameAr }}</span>
                </div>

                <button @click.stop="deleteDestination(dest.id)" class="absolute top-4 right-4 w-8 h-8 bg-black/60 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-all cursor-pointer">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 6: TEAM / GUIDES -->
          <div v-else-if="activeTab === 'team'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Spiritual Travel Guides</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Manage spiritual guides and cultural experts representing our crew.</p>
              </div>
              <button 
                @click="showAddTeamForm = !showAddTeamForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddTeamForm ? '✕ Close Form' : '👥 Recruit Guide' }}</span>
              </button>
            </div>

            <!-- Form -->
            <div v-if="showAddTeamForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Register spiritual/cultural guide</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input v-model="newTeam.name" placeholder="Amine K." class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Role (EN)</label>
                  <input v-model="newTeam.role" placeholder="Senior Spiritual Guide" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Role (AR)</label>
                  <input v-model="newTeam.roleAr" placeholder="مرشد روحي أول" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Spoken Languages</label>
                  <input v-model="newTeam.languages" placeholder="Arabic, French, English" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Experience (Years)</label>
                  <input v-model="newTeam.experienceYears" placeholder="8 Years" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Favorite Destination</label>
                  <input v-model="newTeam.favDest" placeholder="Makkah / Madinah" class="premium-input text-xs w-full" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Guide Bio (Short sentence)</label>
                  <textarea v-model="newTeam.bio" class="premium-input text-xs w-full h-20 resize-none"></textarea>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Avatar URL</label>
                  <input v-model="newTeam.image" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddTeamForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitTeam" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Recruit Guide</button>
              </div>
            </div>

            <!-- Team Guides cards matching high-quality travel team look -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                v-for="member in store.teamMembers" 
                :key="member.id" 
                class="group rounded-[28px] overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8]/80 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between text-center relative"
              >
                <!-- Avatar block -->
                <div class="space-y-4">
                  <div class="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-[#F5A623] shadow-sm">
                    <img :src="member.image" :alt="member.name" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                  </div>
                  <div>
                    <h3 class="text-lg font-serif italic font-extrabold text-slate-900 dark:text-white">{{ member.name }}</h3>
                    <span class="text-[10px] font-sans font-bold text-[#F5A623] uppercase tracking-widest mt-1 block">{{ member.role }}</span>
                  </div>
                  <p class="text-[11px] text-slate-500 line-clamp-3 font-sans h-12 leading-relaxed">
                    {{ member.bio }}
                  </p>
                </div>

                <!-- Footer details inside the guide card -->
                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 space-y-2 text-[10px] text-slate-400 font-medium">
                  <div class="flex items-center justify-between">
                    <span>Experience</span>
                    <strong class="text-slate-800 dark:text-slate-200">{{ member.experienceYears }}</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Languages</span>
                    <strong class="text-slate-800 dark:text-slate-200 max-w-[120px] truncate">{{ member.languages }}</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Fav Destination</span>
                    <strong class="text-[#E8951A]">{{ member.favDest }}</strong>
                  </div>
                </div>

                <button @click="deleteTeamMember(member.id)" class="absolute top-4 right-4 text-xs text-rose-500 hover:text-rose-600 font-black tracking-widest uppercase cursor-pointer">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 7: SERVICES -->
          <div v-else-if="activeTab === 'services'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Our Value Propositions</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Configure high-priority agency services displayed on our portal.</p>
              </div>
              <button 
                @click="showAddServiceForm = !showAddServiceForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddServiceForm ? '✕ Close Form' : '⚙️ Deploy Service' }}</span>
              </button>
            </div>

            <!-- Form -->
            <div v-if="showAddServiceForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Register Agency Value Service</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Service Title (EN)</label>
                  <input v-model="newService.title" placeholder="e.g. VIP VIP Lounge Access" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Service Title (AR)</label>
                  <input v-model="newService.titleAr" placeholder="مثال: دخول مجاني لقاعات كبار الشخصيات" class="premium-input text-xs w-full text-right" dir="rtl" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Icon Emoji</label>
                  <input v-model="newService.icon" placeholder="👑" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Service description</label>
                  <input v-model="newService.description" placeholder="Short value description" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddServiceForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitService" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Deploy Service</button>
              </div>
            </div>

            <!-- List -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                v-for="service in store.services" 
                :key="service.id" 
                class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 p-6 rounded-[24px] flex items-start gap-4 hover:shadow-md transition-all duration-300 relative group"
              >
                <div class="w-12 h-12 rounded-full bg-[#FFF8ED] dark:bg-slate-800/80 border border-[#F5A623]/25 flex items-center justify-center text-xl shrink-0">
                  {{ service.icon }}
                </div>
                <div class="space-y-1">
                  <h3 class="text-base font-serif italic font-extrabold text-slate-900 dark:text-white leading-tight">{{ service.title }}</h3>
                  <span class="text-[10px] font-sans text-slate-400 block" dir="rtl" v-if="service.titleAr">{{ service.titleAr }}</span>
                  <p class="text-xs text-slate-500 mt-2 font-sans">{{ service.description || 'Premium luxury transport and guidance.' }}</p>
                </div>

                <button @click="deleteService(service.id)" class="absolute top-4 right-4 text-xs text-rose-500 hover:text-rose-600 font-bold tracking-widest uppercase cursor-pointer">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 8: PARTNERS -->
          <div v-else-if="activeTab === 'partners'" class="space-y-8 animate-fade-in">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 class="text-2xl font-serif italic font-extrabold text-slate-900 dark:text-white">Allied Global Partners</h2>
                <p class="text-xs text-slate-500 mt-1 font-sans">Active collaborations with international carriers and luxury lodging chains.</p>
              </div>
              <button 
                @click="showAddPartnerForm = !showAddPartnerForm" 
                class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3.5 px-6 shadow-md shadow-amber-500/10 hover:-translate-y-0.5 active:translate-y-0 transition duration-300 cursor-pointer"
              >
                <span>{{ showAddPartnerForm ? '✕ Close Form' : '🤝 Form Partnership' }}</span>
              </button>
            </div>

            <!-- Form -->
            <div v-if="showAddPartnerForm" class="bg-white dark:bg-[#1A1A1A] p-6 rounded-[28px] border border-[#E5E0D8] dark:border-slate-800 space-y-6 animate-slide-up">
              <h3 class="text-sm font-serif italic font-bold text-slate-900 dark:text-white">Record Partnership Agreement</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Partner Name</label>
                  <input v-model="newPartner.name" placeholder="Saudia Airlines" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Partner Type</label>
                  <input v-model="newPartner.type" placeholder="Elite Airline Carrier" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Agreement Description</label>
                  <input v-model="newPartner.desc" placeholder="Details of direct flights or discounts" class="premium-input text-xs w-full" />
                </div>
                <div>
                  <label class="block text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contract Reference ID</label>
                  <input v-model="newPartner.contractId" class="premium-input text-xs w-full" />
                </div>
              </div>
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8] dark:border-slate-800">
                <button @click="showAddPartnerForm = false" class="rounded-full border border-[#E5E0D8] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 transition cursor-pointer">Cancel</button>
                <button @click="submitPartner" class="rounded-full bg-gradient-to-r from-[#F5A623] to-[#E8951A] text-slate-950 font-sans font-bold text-[10px] tracking-widest uppercase py-3 px-6 shadow-sm transition cursor-pointer">Save Partnership</button>
              </div>
            </div>

            <!-- List -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                v-for="partner in store.partners" 
                :key="partner.id" 
                class="bg-white dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-slate-800 p-6 rounded-[24px] flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group"
              >
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="w-11 h-11 bg-gradient-to-br from-[#FFF8ED] to-[#FFF0D9] border border-[#F5A623]/30 text-[#E8951A] font-extrabold text-sm flex items-center justify-center rounded-full">
                      {{ partner.initials || 'TR' }}
                    </div>
                    <span class="font-mono text-[9px] text-[#E8951A] font-bold bg-[#FFF8ED] px-3 py-1 rounded-full border border-[#F5A623]/10 uppercase tracking-widest">
                      ID: {{ partner.contractId }}
                    </span>
                  </div>
                  <div>
                    <h3 class="text-base font-serif italic font-extrabold text-slate-900 dark:text-white leading-tight">{{ partner.name }}</h3>
                    <span class="text-[9px] font-sans font-bold text-[#F5A623] uppercase tracking-widest mt-1 block">{{ partner.type }}</span>
                  </div>
                  <p class="text-xs text-slate-500 font-sans leading-relaxed">
                    {{ partner.desc || 'Provides priority services and tailored VIP access for Tripora pilgrim squads.' }}
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 text-[10px] text-slate-400 flex items-center justify-between font-medium">
                  <span>Agreement status</span>
                  <span class="text-emerald-500 font-black flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    ACTIVE DEED
                  </span>
                </div>

                <button @click="deletePartner(partner.id)" class="absolute top-4 right-4 text-xs text-rose-500 hover:text-rose-600 font-bold tracking-widest uppercase cursor-pointer">
                  ✕
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* High-End inputs with soft background, focus outline and glowing ring */
.premium-input {
  background-color: rgba(245, 242, 237, 0.45);
  border: 1.5px solid #E5E0D8;
  border-radius: 18px;
  padding: 12px 18px;
  color: var(--color-dark);
  font-family: var(--font-sans);
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
}

:global(.dark) .premium-input,
:global(.dark-mode) .premium-input {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: #334155;
  color: #FFFFFF;
}

.premium-input:focus {
  border-color: #F5A623;
  background-color: #FFFFFF;
  box-shadow: 0 0 12px rgba(245, 166, 35, 0.08);
}

:global(.dark) .premium-input:focus,
:global(.dark-mode) .premium-input:focus {
  background-color: #0F172A;
}

/* Custom visual alignment spacing container to prevent navbar overlapping */
.dashboard-custom-container {
  width: 100%;
}

/* Simple keyframe entries matching premium design */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Webkit scrollbar cleaner */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
