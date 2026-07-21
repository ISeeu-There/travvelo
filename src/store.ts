import { reactive, watch } from 'vue';

// Types
export interface UmrahPackage {
  id: number;
  name: string;
  nameAr?: string;
  nameFr?: string;
  tagline: string;
  taglineAr?: string;
  taglineFr?: string;
  price: string;
  priceVal: string;
  duration: string;
  durationAr?: string;
  durationFr?: string;
  rating: string;
  reviews: string;
  image: string;
  makkahHotel: string;
  makkahHotelAr?: string;
  makkahHotelFr?: string;
  makkahDist: string;
  makkahDistAr?: string;
  makkahDistFr?: string;
  madinahHotel: string;
  madinahHotelAr?: string;
  madinahHotelFr?: string;
  madinahDist: string;
  madinahDistAr?: string;
  madinahDistFr?: string;
  flight: string;
  flightAr?: string;
  flightFr?: string;
  itinerary: Array<{
    day: string;
    dayAr?: string;
    dayFr?: string;
    title: string;
    titleAr?: string;
    titleFr?: string;
    desc: string;
    descAr?: string;
    descFr?: string;
  }>;
}

export interface Booking {
  id: string;
  packageId: number;
  packageName: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  departureDate: string;
  pilgrimsCount: number;
  roomPreference: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  createdAt: string;
  notes?: string;
}

export interface MoneyTransaction {
  id: string;
  description: string;
  descriptionAr?: string;
  type: 'revenue' | 'expense';
  amount: number; // in DZD
  date: string;
  category: string;
  dealReference?: string; // option link to a phone number or booking reference
}

export interface Destination {
  id: number;
  name: string;
  nameAr?: string;
  nameFr?: string;
  image: string;
  location: string;
  locationAr?: string;
  locationFr?: string;
  key: string;
  regionKey: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleAr?: string;
  roleFr?: string;
  image: string;
  bio: string;
  bioAr?: string;
  bioFr?: string;
  languages: string;
  experienceYears: string;
  countriesVisited: number;
  favDest: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  titleAr?: string;
  titleFr?: string;
  icon: string;
  key: string;
  description?: string;
}

export interface Partner {
  id: string;
  initials: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  type: string;
  typeAr?: string;
  typeFr?: string;
  desc: string;
  descAr?: string;
  descFr?: string;
  contractId: string;
}

// Initial Data
const initialPackages: UmrahPackage[] = [
  {
    id: 1,
    name: 'Economic Umrah Package',
    nameAr: 'باقة العمرة الاقتصادية',
    nameFr: 'Formule Omra Économique',
    tagline: 'Premium value, ultimate peace of mind, and direct flights',
    taglineAr: 'توفير متميز مع راحة وخدمة متكاملة',
    taglineFr: 'Rapport qualité-prix exceptionnel et vols directs',
    price: '165,000 DZD',
    priceVal: '165,000 DZD',
    duration: '15 Days / 14 Nights',
    durationAr: '15 يومًا / 14 ليلة',
    durationFr: '15 Jours / 14 Nuits',
    rating: '4.7',
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80',
    makkahHotel: 'Al Kiswah Towers (★★★)',
    makkahHotelAr: 'أبراج الكسوة (★ ★ ★)',
    makkahHotelFr: 'Al Kiswah Towers (★ ★ ★)',
    makkahDist: '1200m from Haram (Free 24/7 Shuttle)',
    makkahDistAr: '1200 متر عن الحرم (حافلات مجانية 24/7)',
    makkahDistFr: '1200m du Haram (Navette Gratuite 24h/24)',
    madinahHotel: 'Al Shourfah Hotel (★★★)',
    madinahHotelAr: 'فندق الشرفة (★ ★ ★)',
    madinahHotelFr: 'Al Shourfah Hotel (★ ★ ★)',
    madinahDist: '250m from Masjid an-Nabawi',
    madinahDistAr: '250 متر عن المسجد النبوي الشريف',
    madinahDistFr: '250m de la Mosquée du Prophète',
    flight: 'Air Algérie (Direct Flight Algiers - Jeddah)',
    flightAr: 'الخطوط الجوية الجزائرية (رحلة مباشرة: الجزائر - جدة)',
    flightFr: 'Air Algérie (Vol Direct Alger - Djeddah)',
    itinerary: [
      {
        day: 'Day 1',
        dayAr: 'اليوم 1',
        dayFr: 'Jour 1',
        title: 'Arrival & Check-in',
        titleAr: 'الوصول والاستقرار',
        titleFr: 'Arrivée & Installation',
        desc: 'Arrival at Jeddah Airport, transfer to Makkah in air-conditioned coaches, check-in at Al Kiswah Towers, and perform your Umrah rites.',
        descAr: 'الوصول بمشيئة الله إلى مطار جدة الدولي، الانتقال إلى مكة المكرمة بالباص السياحي المريح، استلام الغرف في فندق أبراج الكسوة وأداء مناسك العمرة.',
        descFr: 'Arrivée à l\'Aéroport de Djeddah, transfert à La Mecque, installation à l\'hôtel Al Kiswah Towers et accomplissement de la Omra.'
      },
      {
        day: 'Day 2-7',
        dayAr: 'اليوم 2 - 7',
        dayFr: 'Jour 2-7',
        title: 'Makkah Devotion & Ziyarat',
        titleAr: 'إقامة مكة المكرمة',
        titleFr: 'Prières & Visites à La Mecque',
        desc: 'Enjoy prayers in the Holy Sanctuary. Included is a guided group trip to historical sites (Jabal Thawr, Jabal al-Nour, Arafat, Mina).',
        descAr: 'التفرغ للعبادة والصلاة في الحرم المكي الشريف، مع رحلة مخصصة لزيارة جبل ثور، جبل عرفات، ومزدلفة ومنى.',
        descFr: 'Consacrez votre temps à la prière au Haram. Une excursion guidée est incluse pour visiter les lieux saints historiques.'
      }
    ]
  },
  {
    id: 2,
    name: 'Comfort Umrah Package',
    nameAr: 'باقة العمرة المريحة',
    nameFr: 'Formule Omra Confort',
    tagline: 'Ideal distance, upgraded hotels, and guided ziyarats',
    taglineAr: 'مسافة مثالية، فنادق راقية، وزيارات إضافية متكاملة',
    taglineFr: 'Proximité idéale, hôtels de standing supérieur et guides expérimentés',
    price: '210,000 DZD',
    priceVal: '210,000 DZD',
    duration: '15 Days / 14 Nights',
    durationAr: '15 يومًا / 14 ليلة',
    durationFr: '15 Jours / 14 Nuits',
    rating: '4.8',
    reviews: '96',
    image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=600&q=80',
    makkahHotel: 'Anjum Makkah (★★★★)',
    makkahHotelAr: 'فندق أنجم مكة (★ ★ ★ ★)',
    makkahHotelFr: 'Anjum Makkah (★ ★ ★ ★)',
    makkahDist: '350m from Haram courtyard (Walking distance)',
    makkahDistAr: '350 متر عن ساحة الحرم (مشياً على الأقدام)',
    makkahDistFr: '350m de l\'esplanade du Haram',
    madinahHotel: 'Saja Al Madinah (★★★★)',
    madinahHotelAr: 'سجى المدينة (★ ★ ★ ★)',
    madinahHotelFr: 'Saja Al Madinah (★ ★ ★ ★)',
    madinahDist: '180m from Masjid an-Nabawi (North Area)',
    madinahDistAr: '180 متر عن المسجد النبوي الشريف (المنطقة الشمالية)',
    madinahDistFr: '180m de la Mosquée du Prophète',
    flight: 'Air Algérie (Direct Flight Alger - Madinah / Return Jeddah)',
    flightAr: 'الخطوط الجوية الجزائرية (الجزائر - المدينة / جدة - الجزائر)',
    flightFr: 'Air Algérie (Alger - Médine / Retour Djeddah)',
    itinerary: [
      {
        day: 'Day 1',
        dayAr: 'اليوم 1',
        dayFr: 'Jour 1',
        title: 'Direct Landing in Madinah',
        titleAr: 'الوصول المباشر للمدينة',
        titleFr: 'Arrivée à Médine',
        desc: 'Land directly in Madinah Airport. Transfer to Saja Al Madinah, rest, and visit the Prophet\'s Holy Mosque.',
        descAr: 'الوصول المباشر إلى مطار المدينة المنورة الدولي. الانتقال إلى فندق سجى المدينة والاستراحة ثم زيارة المسجد النبوي الشريف للسلام على النبي ﷺ.',
        descFr: 'Arrivée directe à l\'Aéroport de Médine. Transfert à l\'hôtel, repos et salut au Prophète ﷺ.'
      }
    ]
  },
  {
    id: 3,
    name: 'Premium VIP Umrah Package',
    nameAr: 'باقة العمرة الفاخرة VIP',
    nameFr: 'Formule Omra VIP Premium',
    tagline: '5-Star luxury, front-row Haram views, and private transfers',
    taglineAr: 'إقامة ملكية 5 نجوم، إطلالة مباشرة على الكعبة، وتدبير متكامل',
    taglineFr: 'Luxe 5 Étoiles, vue panoramique sur le Haram et transferts privés',
    price: '340,000 DZD',
    priceVal: '340,000 DZD',
    duration: '15 Days / 14 Nights',
    durationAr: '15 يومًا / 14 ليلة',
    durationFr: '15 Jours / 14 Nuits',
    rating: '4.9',
    reviews: '48',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&w=600&q=80',
    makkahHotel: 'Pullman ZamZam Makkah (★★★★★)',
    makkahHotelAr: 'بواَمان زمزم مكة (★ ★ ★ ★ ★)',
    makkahHotelFr: 'Pullman ZamZam Makkah (★ ★ ★ ★ ★)',
    makkahDist: '0m inside Abraj Al Bait (Directly on the Haram)',
    makkahDistAr: '0 متر داخل أبراج البيت (إطلالة مباشرة على ساحة الحرم)',
    makkahDistFr: '0m dans les Abraj Al Bait (Face au Haram)',
    madinahHotel: 'Anwar Al Madinah Mövenpick (★★★★★)',
    madinahHotelAr: 'أنوار المدينة موفنبيك (★ ★ ★ ★ ★)',
    madinahHotelFr: 'Anwar Al Madinah Mövenpick (★ ★ ★ ★ ★)',
    madinahDist: '0m on Haram courtyard (Integrated mall access)',
    madinahDistAr: '0 متر على ساحة المسجد النبوي الشريف',
    madinahDistFr: '0m de la cour de la Mosquée du Prophète',
    flight: 'Saudi Arabian Airlines (Direct Flight - Business Class options)',
    flightAr: 'الخطوط الجوية السعودية (رحلة مباشرة - خيار درجة الأعمال)',
    flightFr: 'Saudi Arabian Airlines (Vol Direct - Classe Affaires possible)',
    itinerary: [
      {
        day: 'Day 1',
        dayAr: 'اليوم 1',
        dayFr: 'Jour 1',
        title: 'VIP Welcome in Makkah',
        titleAr: 'استقبال كبار الشخصيات',
        titleFr: 'Accueil VIP',
        desc: 'Private VIP transfer from Jeddah Airport to Pullman ZamZam Makkah. Check-in to Premium rooms and enjoy priority assistance.',
        descAr: 'استقبال خاص في مطار جدة، نقل بسيارة VIP خاصة إلى فندق بولمان زمزم مكة. استلام الغرف الفاخرة المطلة والبدء في العبادة.',
        descFr: 'Accueil VIP personnalisé à l\'aéroport et transfert privé haut de gamme vers l\'hôtel.'
      }
    ]
  }
];

const initialDestinations: Destination[] = [
  {
    id: 1,
    name: 'Greece',
    nameAr: 'اليونان',
    nameFr: 'Grèce',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    location: 'Europe',
    locationAr: 'أوروبا',
    locationFr: 'Europe',
    key: 'greece',
    regionKey: 'europe'
  },
  {
    id: 2,
    name: 'Japan',
    nameAr: 'اليابان',
    nameFr: 'Japon',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    location: 'Asia',
    locationAr: 'آسيا',
    locationFr: 'Asie',
    key: 'japan',
    regionKey: 'asia'
  },
  {
    id: 3,
    name: 'Dubai',
    nameAr: 'دبي',
    nameFr: 'Dubaï',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    location: 'Middle East',
    locationAr: 'الشرق الأوسط',
    locationFr: 'Moyen-Orient',
    key: 'dubai',
    regionKey: 'middleEast'
  },
  {
    id: 4,
    name: 'Bali',
    nameAr: 'بالي',
    nameFr: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    location: 'Indonesia',
    locationAr: 'إندونيسيا',
    locationFr: 'Indonésie',
    key: 'bali',
    regionKey: 'indonesia'
  }
];

const initialTeam: TeamMember[] = [
  {
    id: 'yassine',
    name: 'Yassine B.',
    role: 'Founder & CEO',
    roleAr: 'المؤسس والمدير التنفيذي',
    roleFr: 'Fondateur & Directeur Général',
    image: '/src/assets/team-yassine.png',
    bio: 'Yassine is an explorer and entrepreneur with over 15 years in luxury tourism. Having traversed 6 continents, his mission is to build highly curated journeys that respect local ecosystems.',
    bioAr: 'ياسين مستكشف ورائد أعمال يتمتع بخبرة تزيد عن 15 عامًا في مجال السياحة الفاخرة. بعد أن طاف بـ 6 قارات، تتمثل مهمته في بناء رحلات منسقة للغاية تحترم النظم البيئية المحلية.',
    bioFr: 'Yassine est un explorateur et entrepreneur avec plus de 15 ans d\'expérience dans le tourisme de luxe. Ayant parcouru 6 continents, sa mission est de concevoir des voyages sur mesure d\'exception.',
    languages: 'Arabic, French, English, Spanish',
    experienceYears: '15 Years',
    countriesVisited: 84,
    favDest: 'Kyoto, Japan'
  },
  {
    id: 'lina',
    name: 'Lina D.',
    role: 'Travel Planner',
    roleAr: 'مخططة رحلات',
    roleFr: 'Planificatrice de Voyages',
    image: '/src/assets/team-lina.png',
    bio: 'Lina specializes in custom European retreats and cultural getaways. Her attention to detail and relationships with boutique hotels ensures a flawless trip.',
    bioAr: 'تتخصص لينا في تخطيط العطلات الأوروبية المخصصة والملاذات الثقافية. اهتمامها الكبير بالتفاصيل وعلاقاتها مع الفنادق الراقية يضمن رحلة مثالية خالية من العيوب.',
    bioFr: 'Lina est spécialisée dans les retraites européennes sur mesure et les escapades culturelles. Son sens du détail assure un voyage absolument parfait.',
    languages: 'French, English, Italian',
    experienceYears: '6 Years',
    countriesVisited: 32,
    favDest: 'Amalfi Coast, Greece'
  },
  {
    id: 'amine',
    name: 'Amine K.',
    role: 'Experience Manager',
    roleAr: 'مدير التجارب والرحلات الاستكشافية',
    roleFr: 'Responsable des Expériences',
    image: '/src/assets/team-amine.png',
    bio: 'Amine leads our physical exploration routes and verifies each local guide. If you are doing an alpine assault, Amine personally coordinates the safety packets.',
    bioAr: 'يقود أمين مسارات الاستكشاف والرحلات المغامرة بنفسه ويشرف على انتقاء المرشدين المحليين الأكفاء لضمان السلامة الكاملة والتشويق.',
    bioFr: 'Amine dirige nos itinéraires d\'exploration physique et valide chaque guide local. Il coordonne personnellement les protocoles de sécurité.',
    languages: 'Arabic, English, Berber',
    experienceYears: '8 Years',
    countriesVisited: 22,
    favDest: 'Atlas Mountains, Algeria'
  }
];

const initialServices: ServiceItem[] = [
  { id: 1, title: 'Flight Booking', titleAr: 'حجز رحلات الطيران', titleFr: 'Réservation de Vols', icon: '✈️', key: 'flight', description: 'Priority access, best fares, and direct connections.' },
  { id: 2, title: 'Hotel Reservation', titleAr: 'حجز الفنادق الفاخرة', titleFr: 'Réservation d\'Hôtels', icon: '🏨', key: 'hotel', description: 'Curated 5-star and boutique hotels globally.' },
  { id: 3, title: 'Visa Assistance', titleAr: 'تسهيل وإصدار التأشيرات', titleFr: 'Assistance Visa', icon: '🎫', key: 'visa', description: 'Fast processing and document compliance assistance.' },
  { id: 4, title: 'Travel Insurance', titleAr: 'تأمين السفر الدولي', titleFr: 'Assurance Voyage', icon: '🛡️', key: 'insurance', description: 'Comprehensive coverage for medical and flight assistance.' },
  { id: 5, title: 'Tour Guides', titleAr: 'مرشدون سياحيون محليون', titleFr: 'Guides Touristiques', icon: '🗺️', key: 'guides', description: 'Certified guides to give you deep cultural access.' },
  { id: 6, title: '24/7 Support', titleAr: 'دعم وإرشاد على مدار 24/7', titleFr: 'Support 24h/24', icon: '📞', key: 'support', description: 'Live assistance at every point of your journey.' }
];

const initialPartners: Partner[] = [
  {
    id: 'airalgeria',
    initials: 'AA',
    name: 'Air Algérie',
    nameAr: 'الخطوط الجوية الجزائرية',
    nameFr: 'Air Algérie',
    type: 'National Air Carrier',
    typeAr: 'الناقل الجوي الوطني المعتمد',
    typeFr: 'Transporteur Aérien National',
    desc: 'Exclusive discounts of up to 15% on flight tickets for Tripora Premium customers.',
    descAr: 'رحلات مباشرة وحصرية وتخفيضات تصل إلى 15% لجميع درجات الحجز لعملاء تريفيو المتميزين.',
    descFr: 'Remises exclusives allant jusqu\'à 15% sur les billets pour les clients Tripora.',
    contractId: 'TRV-1025'
  },
  {
    id: 'airfrance',
    initials: 'AF',
    name: 'Air France',
    nameAr: 'الخطوط الجوية الفرنسية',
    nameFr: 'Air France',
    type: 'Global Airline Partner',
    typeAr: 'شريك الطيران العالمي',
    typeFr: 'Partenaire Aérien Mondial',
    desc: 'Priority boarding and complimentary lounge access worldwide.',
    descAr: 'أولوية صعود الطائرة، ودخول مجاني لصالات كبار الشخصيات حول العالم للدرجات الأولى.',
    descFr: 'Embarquement prioritaire et accès gratuit aux salons VIP du monde entier.',
    contractId: 'TRV-1026'
  },
  {
    id: 'sheraton',
    initials: 'SH',
    name: 'Sheraton Hotels',
    nameAr: 'فنادق شيراتون العالمية',
    nameFr: 'Sheraton Hotels',
    type: 'Luxury Lodging Partner',
    typeAr: 'شريك الإقامة الفاخرة المعتمد',
    typeFr: 'Partenaire Hébergement de Luxe',
    desc: 'Complimentary room upgrades and early check-ins for Tripora guests.',
    descAr: 'ترقية مجانية للغرف والترقيات الفورية وتسجيل وصول مبكر ومغادرة متأخرة في جميع فنادق السلسلة.',
    descFr: 'Surclassements de chambre gratuits et arrivées anticipées pour nos clients.',
    contractId: 'TRV-2054'
  }
];

const initialBookings: Booking[] = [
  {
    id: 'UMR-2026-8841',
    packageId: 1,
    packageName: 'Economic Umrah Package',
    clientName: 'Amir Bensaid',
    clientPhone: '0552148769',
    clientEmail: 'amir.b@example.com',
    departureDate: '2026-08-15',
    pilgrimsCount: 2,
    roomPreference: 'double',
    status: 'pending',
    createdAt: '2026-07-19T14:32:00Z',
    notes: 'Requested near- Haram room if possible.'
  },
  {
    id: 'UMR-2026-1049',
    packageId: 3,
    packageName: 'Premium VIP Umrah Package',
    clientName: 'Fatma Zahra Haddad',
    clientPhone: '0661998471',
    clientEmail: 'f.haddad@example.com',
    departureDate: '2026-09-02',
    pilgrimsCount: 4,
    roomPreference: 'quad',
    status: 'approved',
    createdAt: '2026-07-20T01:12:00Z',
    notes: 'Elderly pilgrim needs wheel chair assistance.'
  }
];

const initialTransactions: MoneyTransaction[] = [
  {
    id: 'TXN-101',
    description: 'Booking Advance Payment - Amir Bensaid',
    descriptionAr: 'دفعة مقدمة للحجز - أمير بن سعيد',
    type: 'revenue',
    amount: 150000,
    date: '2026-07-19',
    category: 'Umrah Package',
    dealReference: '0552148769'
  },
  {
    id: 'TXN-102',
    description: 'Pullman ZamZam Makkah Room Deposit',
    descriptionAr: 'مستحقات حجز فندق بولمان زمزم مكة',
    type: 'expense',
    amount: 95000,
    date: '2026-07-20',
    category: 'Hotel Booking'
  },
  {
    id: 'TXN-103',
    description: 'VIP Package Full Payment - Fatma Zahra',
    descriptionAr: 'دفعة كاملة لباقة كبار الشخصيات - فاطمة الزهراء',
    type: 'revenue',
    amount: 1360000,
    date: '2026-07-20',
    category: 'Umrah Package',
    dealReference: '0661998471'
  }
];

// Helper to safely parse local storage
function getStored<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
}

// Reactive store properties
export const store = reactive({
  packages: getStored<UmrahPackage[]>('trv_packages', initialPackages),
  bookings: getStored<Booking[]>('trv_bookings', initialBookings),
  destinations: getStored<Destination[]>('trv_destinations', initialDestinations),
  teamMembers: getStored<TeamMember[]>('trv_team', initialTeam),
  services: getStored<ServiceItem[]>('trv_services', initialServices),
  partners: getStored<Partner[]>('trv_partners', initialPartners),
  moneyTransactions: getStored<MoneyTransaction[]>('trv_transactions', initialTransactions),
});

// Watchers to auto-save to localStorage
watch(() => store.packages, (val) => {
  localStorage.setItem('trv_packages', JSON.stringify(val));
}, { deep: true });

watch(() => store.bookings, (val) => {
  localStorage.setItem('trv_bookings', JSON.stringify(val));
}, { deep: true });

watch(() => store.destinations, (val) => {
  localStorage.setItem('trv_destinations', JSON.stringify(val));
}, { deep: true });

watch(() => store.teamMembers, (val) => {
  localStorage.setItem('trv_team', JSON.stringify(val));
}, { deep: true });

watch(() => store.services, (val) => {
  localStorage.setItem('trv_services', JSON.stringify(val));
}, { deep: true });

watch(() => store.partners, (val) => {
  localStorage.setItem('trv_partners', JSON.stringify(val));
}, { deep: true });

watch(() => store.moneyTransactions, (val) => {
  localStorage.setItem('trv_transactions', JSON.stringify(val));
}, { deep: true });

// Actions
export const addUmrahPackage = (pkg: Omit<UmrahPackage, 'id'>) => {
  const maxId = store.packages.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const newPkg: UmrahPackage = {
    ...pkg,
    id: maxId + 1,
    reviews: pkg.reviews || '0',
    rating: pkg.rating || '5.0'
  };
  store.packages.push(newPkg);
  return newPkg;
};

export const deleteUmrahPackage = (id: number) => {
  store.packages = store.packages.filter(p => p.id !== id);
};

export const updateUmrahPackage = (id: number, updated: Partial<UmrahPackage>) => {
  const index = store.packages.findIndex(p => p.id === id);
  if (index !== -1) {
    store.packages[index] = { ...store.packages[index], ...updated } as UmrahPackage;
  }
};

export const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newBooking: Booking = {
    ...booking,
    id: `UMR-2026-${randNum}`,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  store.bookings.unshift(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']) => {
  const index = store.bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    store.bookings[index].status = status;
  }
};

export const deleteBooking = (id: string) => {
  store.bookings = store.bookings.filter(b => b.id !== id);
};

export const addDestination = (dest: Omit<Destination, 'id' | 'key' | 'regionKey'>) => {
  const maxId = store.destinations.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const key = dest.name.toLowerCase().replace(/\s+/g, '-');
  const regionKey = (dest.location || 'global').toLowerCase().replace(/\s+/g, '-');
  const newDest: Destination = {
    ...dest,
    id: maxId + 1,
    key,
    regionKey
  };
  store.destinations.push(newDest);
  return newDest;
};

export const deleteDestination = (id: number) => {
  store.destinations = store.destinations.filter(d => d.id !== id);
};

export const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
  const id = member.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newMember: TeamMember = {
    ...member,
    id: store.teamMembers.some(m => m.id === id) ? `${id}-${Date.now().toString().slice(-4)}` : id
  };
  store.teamMembers.push(newMember);
  return newMember;
};

export const deleteTeamMember = (id: string) => {
  store.teamMembers = store.teamMembers.filter(t => t.id !== id);
};

export const addService = (service: Omit<ServiceItem, 'id' | 'key'>) => {
  const maxId = store.services.reduce((max, item) => (item.id > max ? item.id : max), 0);
  const key = service.title.toLowerCase().replace(/\s+/g, '-');
  const newService: ServiceItem = {
    ...service,
    id: maxId + 1,
    key
  };
  store.services.push(newService);
  return newService;
};

export const deleteService = (id: number) => {
  store.services = store.services.filter(s => s.id !== id);
};

export const addPartner = (partner: Omit<Partner, 'id' | 'initials'>) => {
  const id = partner.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const initials = partner.name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
  const newPartner: Partner = {
    ...partner,
    id,
    initials
  };
  store.partners.push(newPartner);
  return newPartner;
};

export const deletePartner = (id: string) => {
  store.partners = store.partners.filter(p => p.id !== id);
};

export const addTransaction = (txn: Omit<MoneyTransaction, 'id'>) => {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const newTxn: MoneyTransaction = {
    ...txn,
    id: `TXN-${randNum}`
  };
  store.moneyTransactions.unshift(newTxn);
  return newTxn;
};

export const deleteTransaction = (id: string) => {
  store.moneyTransactions = store.moneyTransactions.filter(t => t.id !== id);
};
