<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useI18n } from '../i18n';

const { t, locale } = useI18n();

const travelersCount = ref(100);

onMounted(() => {
  let current = 100;
  const target = 1450;
  const step = 45;
  const timer = setInterval(() => {
    if (current >= target) {
      travelersCount.value = target;
      clearInterval(timer);
    } else {
      current += step;
      travelersCount.value = current;
    }
  }, 35);
});

// Interactive state for Umrah Modal
const showModal = ref(false);

const isMobile = ref(false);
const currentActiveIndex = ref(0);
const sliderTrack = ref<HTMLElement | null>(null);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;
};

const scrollSlider = (direction: 'left' | 'right') => {
  if (!sliderTrack.value) return;
  const container = sliderTrack.value;
  const scrollAmount = container.clientWidth * 0.8;
  
  if (direction === 'left') {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  } else {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};

const checkScrollLimits = () => {
  if (!sliderTrack.value) return;
  const container = sliderTrack.value;
  const itemWidth = container.scrollWidth / packages.value.length;
  if (itemWidth > 0) {
    const scrollLeftValue = container.scrollLeft;
    const index = Math.round(Math.abs(scrollLeftValue) / itemWidth);
    currentActiveIndex.value = Math.max(0, Math.min(index, packages.value.length - 1));
  }
};

const scrollToItem = (index: number) => {
  if (!sliderTrack.value) return;
  const container = sliderTrack.value;
  const itemWidth = container.scrollWidth / packages.value.length;
  const isRtlVal = document.documentElement.dir === 'rtl' || locale.value === 'ar';
  const targetScroll = isRtlVal ? -index * itemWidth : index * itemWidth;
  
  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  });
  currentActiveIndex.value = index;
};

watch(showModal, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      checkMobile();
    }, 50);
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  document.body.style.overflow = '';
  window.removeEventListener('resize', checkMobile);
});
const selectedPkgId = ref<number | null>(null);
const activeTab = ref<'overview' | 'itinerary' | 'included' | 'book'>('overview');

// Form States
const pilgrimName = ref('');
const pilgrimPhone = ref('');
const pilgrimEmail = ref('');
const preferredDate = ref('');
const numPilgrims = ref(1);
const sharingType = ref('double');
const bookingConfirmed = ref(false);
const bookingRef = ref('');

// Helper to open/close modal
const openUmrahModal = () => {
  showModal.value = true;
  selectedPkgId.value = null; // show list
  bookingConfirmed.value = false;
  resetForm();
};

const closeUmrahModal = () => {
  if (selectedPkgId.value !== null) {
    selectedPkgId.value = null;
  } else {
    showModal.value = false;
  }
};

const selectPackage = (id: number) => {
  selectedPkgId.value = id;
  activeTab.value = 'overview';
  bookingConfirmed.value = false;
};

const goBackToPackages = () => {
  selectedPkgId.value = null;
};

const resetForm = () => {
  pilgrimName.value = '';
  pilgrimPhone.value = '';
  pilgrimEmail.value = '';
  preferredDate.value = '';
  numPilgrims.value = 1;
  sharingType.value = 'double';
  bookingConfirmed.value = false;
  bookingRef.value = '';
};

const handleBooking = () => {
  if (!pilgrimName.value || !pilgrimPhone.value) return;
  
  // Generate booking reference
  const randNum = Math.floor(1000 + Math.random() * 9000);
  bookingRef.value = `UMR-2026-${randNum}`;
  bookingConfirmed.value = true;
};

// Language & RTL direction
const isRtl = computed(() => locale.value === 'ar');

const labels = computed(() => {
  if (locale.value === 'ar') {
    return {
      modalTitle: 'باقات العمرة المباركة 🕋',
      modalSubtitle: 'اختر باقة العمرة التي تناسبك واستمتع برحلة روحانية فريدة من الجزائر',
      pkgDuration: 'المدة:',
      pkgPrice: 'السعر من:',
      pkgRating: 'التقييم:',
      selectPkg: 'عرض التفاصيل والحجز',
      backToList: '← العودة للباقات',
      tabOverview: 'نظرة عامة',
      tabItinerary: 'البرنامج اليومي',
      tabIncluded: 'ماذا تشمل الباقة؟',
      tabBook: 'احجز الآن',
      makkahHotelLabel: 'فندق مكة المكرمة:',
      madinahHotelLabel: 'فندق المدينة المنورة:',
      flightLabel: 'تذكرة الطيران:',
      distanceLabel: 'المسافة عن الحرم:',
      formName: 'الاسم الكامل للمعتمر الرئيسي:',
      formPhone: 'رقم الهاتف (الجزائر أو رقم دولي):',
      formEmail: 'البريد الإلكتروني (اختياري):',
      formDate: 'تاريخ السفر المفضل:',
      formCount: 'عدد المعتمرين:',
      formSharing: 'نوع الغرفة المفضلة:',
      sharingDouble: 'غرفة ثنائية',
      sharingTriple: 'غرفة ثلاثية',
      sharingQuad: 'غرفة رباعية',
      sharingSingle: 'غرفة فردية',
      submitBook: 'تأكيد طلب الحجز المبدئي',
      successTitle: 'تم إرسال طلب الحجز بنجاح! 🎉',
      successRef: 'رقم مرجع الحجز الخاص بك:',
      successDesc1: 'تقبل الله منا ومنكم صالح الأعمال. لقد تم تسجيل طلب الحجز الخاص بك لرحلة العمرة بنجاح.',
      successDesc2: 'سيقوم مستشار العمرة والتأشيرات لدينا بالتواصل معك عبر الهاتف خلال 24 ساعة لتأكيد موعد الرحلة واستلام الوثائق المطلوبة (جواز السفر، شهادة التطعيم، إلخ).',
      successChecklist: 'الوثائق المطلوبة لتسليمها للمكتب:',
      doc1: 'جواز سفر بيومتري صالح لمدة لا تقل عن 6 أشهر.',
      doc2: 'نسخة من بطاقة التعريف الوطنية وصورة بخلفية بيضاء.',
      doc3: 'شهادة طبية أو وثائق التطعيم المطلوبة.',
      bookAnother: 'حجز باقة أخرى',
      closeBtn: 'إغلاق',
      includedTitle: 'الخدمات المشمولة في الباقة:',
    };
  } else if (locale.value === 'fr') {
    return {
      modalTitle: 'Nos Offres de Omra Bénies 🕋',
      modalSubtitle: 'Choisissez votre formule et vivez un pèlerinage spirituel unique au départ d’Algérie',
      pkgDuration: 'Durée :',
      pkgPrice: 'Prix à partir de :',
      pkgRating: 'Note :',
      selectPkg: 'Détails & Réservation',
      backToList: '← Retour aux formules',
      tabOverview: 'Vue d\'ensemble',
      tabItinerary: 'Programme',
      tabIncluded: 'Inclusions',
      tabBook: 'Réserver',
      makkahHotelLabel: 'Hôtel à Makkah :',
      madinahHotelLabel: 'Hôtel à Médine :',
      flightLabel: 'Vol :',
      distanceLabel: 'Distance :',
      formName: 'Nom complet du pèlerin principal :',
      formPhone: 'Numéro de téléphone (Algérie) :',
      formEmail: 'Adresse e-mail (optionnel) :',
      formDate: 'Date de départ souhaitée :',
      formCount: 'Nombre de pèlerins :',
      formSharing: 'Type de chambre :',
      sharingDouble: 'Chambre Double',
      sharingTriple: 'Chambre Triple',
      sharingQuad: 'Chambre Quadruple',
      sharingSingle: 'Chambre Individuelle',
      submitBook: 'Confirmer la pré-réservation',
      successTitle: 'Demande de réservation validée ! 🎉',
      successRef: 'Numéro de référence de réservation :',
      successDesc1: 'Qu’Allah accepte vos nobles intentions. Votre demande de réservation pour la Omra a été enregistrée avec succès.',
      successDesc2: 'Notre conseiller expert en Omra et visas vous contactera par téléphone sous 24 heures pour finaliser votre départ et convenir du dépôt des pièces justificatives.',
      successChecklist: 'Documents requis à fournir :',
      doc1: 'Passeport biométrique valide au moins 6 mois.',
      doc2: 'Copie de la carte d\'identité nationale et photo d\'identité.',
      doc3: 'Certificat médical et preuve de vaccination.',
      bookAnother: 'Réserver une autre offre',
      closeBtn: 'Fermer',
      includedTitle: 'Services inclus dans cette formule :',
    };
  } else {
    return {
      modalTitle: 'Our Blessed Umrah Packages 🕋',
      modalSubtitle: 'Choose your curated Umrah package for a spiritual pilgrimage of a lifetime from Algeria',
      pkgDuration: 'Duration:',
      pkgPrice: 'Price from:',
      pkgRating: 'Rating:',
      selectPkg: 'View Details & Book',
      backToList: '← Back to Packages',
      tabOverview: 'Overview',
      tabItinerary: 'Itinerary',
      tabIncluded: 'Inclusions',
      tabBook: 'Book Now',
      makkahHotelLabel: 'Makkah Accommodation:',
      madinahHotelLabel: 'Madinah Accommodation:',
      flightLabel: 'Flight Details:',
      distanceLabel: 'Distance:',
      formName: 'Main Pilgrim Full Name:',
      formPhone: 'Phone Number (Algeria/Intl):',
      formEmail: 'Email Address (Optional):',
      formDate: 'Preferred Departure Date:',
      formCount: 'Number of Pilgrims:',
      formSharing: 'Room Preference:',
      sharingDouble: 'Double Room',
      sharingTriple: 'Triple Room',
      sharingQuad: 'Quad Room',
      sharingSingle: 'Single Room',
      submitBook: 'Confirm Pre-Booking',
      successTitle: 'Reservation Request Submitted! 🎉',
      successRef: 'Booking Reference Number:',
      successDesc1: 'May Allah accept your sacred intentions. Your Umrah reservation request has been registered.',
      successDesc2: 'Our dedicated Umrah & Visa consultant will contact you via phone within 24 hours to confirm dates, room availability, and organize passport/document collection.',
      successChecklist: 'Next Steps - Required Documents:',
      doc1: 'Biometric Passport valid for at least 6 months.',
      doc2: 'Copy of National ID Card and physical passport photos.',
      doc3: 'Medical certificates and vaccination records.',
      bookAnother: 'Book Another Package',
      closeBtn: 'Close',
      includedTitle: 'Services included in this package:',
    };
  }
});

const packages = computed(() => {
  if (locale.value === 'ar') {
    return [
      {
        id: 1,
        name: 'باقة العمرة الاقتصادية',
        tagline: 'توفير متميز مع راحة وخدمة متكاملة',
        price: '165,000 د.ج',
        priceVal: '165,000 د.ج',
        duration: '15 يومًا / 14 ليلة',
        rating: '4.7',
        reviews: '124 تقييم',
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'أبراج الكسوة (★ ★ ★)',
        makkahDist: '1200 متر عن الحرم (حافلات مجانية 24/7)',
        madinahHotel: 'فندق الشرفة (★ ★ ★)',
        madinahDist: '250 متر عن المسجد النبوي الشريف',
        flight: 'الخطوط الجوية الجزائرية (رحلة مباشرة: الجزائر - جدة)',
        itinerary: [
          { day: 'اليوم 1', title: 'الوصول والاستقرار', desc: 'الوصول بمشيئة الله إلى مطار جدة الدولي، الانتقال إلى مكة المكرمة بالباص السياحي المريح، استلام الغرف في فندق أبراج الكسوة وأداء مناسك العمرة.' },
          { day: 'اليوم 2 - 7', title: 'إقامة مكة المكرمة', desc: 'التفرغ للعبادة والصلاة في الحرم المكي الشريف، مع رحلة مخصصة لزيارة جبل ثور، جبل عرفات، ومزدلفة ومنى.' },
          { day: 'اليوم 8', title: 'الانتقال إلى المدينة المنورة', desc: 'مغادرة مكة والانتقال إلى طيبة الطيبة عبر حافلاتنا الفاخرة، استلام الغرف والتشرف بالسلام على رسول الله ﷺ.' },
          { day: 'اليوم 9 - 14', title: 'إقامة المدينة المنورة', desc: 'زيارة المعالم النبوية الشريفة (مسجد قباء، مقبرة شهداء أحد، جبل أحد)، والتمتع بالصلاة في الروضة الشريفة.' },
          { day: 'اليوم 15', title: 'العودة إلى أرض الوطن', desc: 'الانتقال إلى مطار الأمير محمد بن عبد العزيز بالمدينة المنورة للعودة إلى الجزائر.' }
        ],
        included: [
          'تأشيرة العمرة الإلكترونية والتأمين الطبي الشامل',
          'تذاكر الطيران ذهابًا وإيابًا مع الخطوط الجوية الجزائرية',
          'الإقامة بالفنادق المذكورة (أو ما يعادلها) مع كامل الخدمات',
          'الانتقالات الداخلية بحافلات حديثة ومكيفة',
          'مرافقة إدارية ودينية مؤهلة طوال فترة الرحلة',
          'توزيع ماء زمزم المبارك وكتيب توجيهي للمعتمرين'
        ]
      },
      {
        id: 2,
        name: 'باقة العمرة المريحة (المميزة)',
        tagline: 'إقامة فاخرة قريبة جداً من الحرمين الشريفين',
        price: '245,000 د.ج',
        priceVal: '245,000 د.ج',
        duration: '15 يومًا / 14 ليلة',
        rating: '4.9',
        reviews: '238 تقييم',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'سويس أوتيل مكة (★ ★ ★ ★ ★)',
        makkahDist: 'مباشرة على ساحة الحرم المكي',
        madinahHotel: 'بلمان زمزم المدينة (★ ★ ★ ★ ★)',
        madinahDist: '50 متر فقط عن الحرم النبوي الشريف',
        flight: 'الخطوط السعودية (رحلة مباشرة: الجزائر - المدينة المنورة)',
        itinerary: [
          { day: 'اليوم 1', title: 'الوصول المباشر لطيبة', desc: 'الهبوط بمطار المدينة المنورة، الانتقال الفاخر للفندق، استلام الغرف والسلام على سيد الخلق ﷺ.' },
          { day: 'اليوم 2 - 7', title: 'إقامة المدينة المنورة المتميزة', desc: 'التمتع بالقرب الشديد من الحرم النبوي، أداء الصلوات في الروضة الشريفة (بموجب تصريح نسك)، والقيام بالمزارات النبوية.' },
          { day: 'اليوم 8', title: 'الانتقال إلى مكة المكرمة', desc: 'الإحرام من الميقات (ذو الحليفة) والانتقال إلى مكة عبر باصات حديثة مكيفة، استلام الغرف في سويس أوتيل وأداء العمرة.' },
          { day: 'اليوم 9 - 14', title: 'روحانية مكة الفاخرة', desc: 'الصلاة والعبادة أمام الكعبة المشرفة، جولات الإرشاد الديني، مع رحلات خاصة لآثار مكة المكرمة التاريخية.' },
          { day: 'اليوم 15', title: 'العودة المباركة', desc: 'المغادرة من فندق مكة باتجاه مطار الملك عبد العزيز بجدة للعودة برعاية الله إلى الجزائر.' }
        ],
        included: [
          'تأشيرة العمرة السريعة والتأمين الصحي المتكامل بحدود تغطية كاملة',
          'رحلة طيران مباشرة على الخطوط السعودية',
          'إقامة فاخرة 5 نجوم مع بوفيه إفطار يومي مفتوح',
          'انتقالات ممتازة عبر حافلات VIP مريحة للغاية',
          'مرشد ومطوف خاص لشرح مناسك العمرة والأدعية',
          'هدايا فاخرة للمعتمرين (حقيبة ظهر، سجاد صلاة، وكتيب حصن المسلم)'
        ]
      },
      {
        id: 3,
        name: 'الباقة الملكية VIP',
        tagline: 'تجربة روحانية استثنائية لكبار الشخصيات بأعلى معايير الرفاهية',
        price: '390,000 د.ج',
        priceVal: '390,000 د.ج',
        duration: '10 أيام / 9 ليالٍ',
        rating: '5.0',
        reviews: '92 تقييم',
        image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'فندق فيرمونت برج الساعة مكة (★ ★ ★ ★ ★ ملكي)',
        makkahDist: 'إطلالة كاملة ومباشرة على الكعبة المشرفة',
        madinahHotel: 'أوبيروي المدينة الشريفة (★ ★ ★ ★ ★ فاخر)',
        madinahDist: 'إطلالة مباشرة على الروضة الشريفة والساحة الشمالية',
        flight: 'طيران الدرجة الأولى (الجزائر - جدة / المدينة - الجزائر)',
        itinerary: [
          { day: 'اليوم 1', title: 'استقبال كبار الشخصيات', desc: 'استقبال خاص في قاعة كبار الشخصيات بمطار جدة، الانتقال بسيارة GMC فاخرة خاصة إلى مكة المكرمة، التسكين في جناح مطلع على الكعبة المشرّفة وأداء العمرة بمرافقة مطوف خاص.' },
          { day: 'اليوم 2 - 5', title: 'في حضرة الكعبة المشرفة', desc: 'التواجد في الجناح الملكي الفاخر الشامل للإفطار والعشاء الفاخرين، خدمات الغرف على مدار الساعة، وإرشاد خاص للزيارات الخاصة.' },
          { day: 'اليوم 6', title: 'قطار الحرمين السريع الفخم', desc: 'الانتقال إلى المدينة المنورة عبر درجة رجال الأعمال بقطار الحرمين السريع، والاستقرار بفندق الأوبيروي الفاخر.' },
          { day: 'اليوم 7 - 9', title: 'طيبة الطيبة بنبض ملكي', desc: 'التنعم بالعبادة والصلاة والتشرف بالسلام على رسول الله ﷺ وصاحبيه، حجز حصرى ومضمون لزيارة الروضة الشريفة.' },
          { day: 'اليوم 10', title: 'توديع بسلام', desc: 'الانتقال بالسيارة الخاصة إلى مطار المدينة المنورة والصعود لرحلة العودة الفخمة للجزائر.' }
        ],
        included: [
          'تأشيرة VIP سريعة الإصدار وتأمين طبي شامل متميز',
          'تذاكر طيران للدرجة الأولى / رجال الأعمال مباشرة',
          'إقامة في أجنحة فاخرة مطلة مباشرة على الكعبة والمسجد النبوي الشريفين',
          'وجبات الإفطار والعشاء في بوفيهات الفنادق العالمية الراقية',
          'مواصلات خاصة بـ GMC عائلية حديثة بين جميع المدن والمزارات',
          'حجز مؤكد وتصاريح رسمية فورية لزيارة الروضة الشريفة وصلاة الفريضة',
          'مرشد دينى مرافق ومطوّف خاص على مدار الساعة لتلبية كافة الطلبات'
        ]
      }
    ];
  } else if (locale.value === 'fr') {
    return [
      {
        id: 1,
        name: 'Formule Omra Économique',
        tagline: 'Le meilleur rapport qualité-prix pour votre pèlerinage',
        price: '165 000 DZD',
        priceVal: '165 000 DZD',
        duration: '15 Jours / 14 Nuits',
        rating: '4.7',
        reviews: '124 avis',
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Al Kiswah Towers (★ ★ ★)',
        makkahDist: '1200m du Haram (Navette gratuite 24h/24, 7j/7)',
        madinahHotel: 'Al Shourfah Hotel (★ ★ ★)',
        madinahDist: '250m de Masjid an-Nabawi',
        flight: 'Air Algérie (Vol direct Alger - Jeddah)',
        itinerary: [
          { day: 'Jour 1', title: 'Arrivée & Installation', desc: 'Arrivée à l\'aéroport de Jeddah, transfert à Makkah en bus climatisé confortable, installation à l\'hôtel Al Kiswah et accomplissement des rites de la Omra.' },
          { day: 'Jour 2 - 7', title: 'Séjour à Makkah', desc: 'Temps libre pour la prière et la dévotion au Masjid al-Haram. Visite guidée des lieux saints (Mont Arafat, Mina, Jabal al-Nour).' },
          { day: 'Jour 8', title: 'Transfert vers Médine', desc: 'Départ pour Médine la Radieuse en bus de tourisme premium. Arrivée, installation et salut au Prophète ﷺ.' },
          { day: 'Jour 9 - 14', title: 'Séjour à Médine', desc: 'Prières à Masjid an-Nabawi et visites historiques (Mosquée de Quba, Mont Uhud, etc.). Entrée à la Rawdah Chérifale selon les permis Nusk.' },
          { day: 'Jour 15', title: 'Retour au Pays', desc: 'Transfert vers l\'aéroport de Médine pour le vol de retour direct vers Alger.' }
        ],
        included: [
          'Visa électronique Omra et assurance médicale complète',
          'Billet d\'avion aller-retour avec Air Algérie',
          'Hébergement dans les hôtels mentionnés (ou similaires)',
          'Tous les transferts internes en bus modernes climatisés',
          'Accompagnement administratif et religieux tout au long du séjour',
          'Eau de Zamzam offerte et guide papier complet du pèlerin'
        ]
      },
      {
        id: 2,
        name: 'Formule Omra Confort (Privilège)',
        tagline: 'Un séjour d\'exception au plus près des Lieux Saints',
        price: '245 000 DZD',
        priceVal: '245 000 DZD',
        duration: '15 Jours / 14 Nuits',
        rating: '4.9',
        reviews: '238 avis',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Swissôtel Makkah (★ ★ ★ ★ ★)',
        makkahDist: 'Directement sur l\'esplanade du Haram',
        madinahHotel: 'Pullman Zamzam Madinah (★ ★ ★ ★ ★)',
        madinahDist: 'À seulement 50m de Masjid an-Nabawi',
        flight: 'Saudi Arabian Airlines (Vol direct Alger - Médine)',
        itinerary: [
          { day: 'Jour 1', title: 'Arrivée Directe à Médine', desc: 'Atterrissage à Médine, accueil VIP à l\'aéroport, transfert de luxe et installation au Pullman Zamzam. Salut au Prophète ﷺ.' },
          { day: 'Jour 2 - 7', title: 'Séjour à Médine', desc: 'Profitez de la proximité immédiate de la mosquée sacrée. Recueillement à la Rawdah (via application Nusk) et visites de Quba et Uhud.' },
          { day: 'Jour 8', title: 'Trajet vers Makkah', desc: 'Sacralisation (Ihram) au Miqat, puis trajet vers Makkah en bus VIP. Installation au Swissôtel et accomplissement de la Omra.' },
          { day: 'Jour 9 - 14', title: 'Dévotion à Makkah', desc: 'Prière et contemplation devant la Kaaba. Conseils religieux personnalisés et visites guidées approfondies.' },
          { day: 'Jour 15', title: 'Retour Béni', desc: 'Départ de l\'hôtel vers l\'aéroport de Jeddah pour le vol direct de retour vers l\'Algérie.' }
        ],
        included: [
          'Visa Omra express et assurance médicale haut de gamme',
          'Billet d\'avion sur vol régulier direct de Saudi Arabian Airlines',
          'Hébergement 5 étoiles avec petit-déjeuner buffet quotidien',
          'Transferts inter-villes en bus VIP ultra-confortables',
          'Guide-accompagnateur et conférencier bilingue',
          'Kit pèlerin premium (sac à dos, tapis de prière, invocations)'
        ]
      },
      {
        id: 3,
        name: 'Formule Royale VIP',
        tagline: 'Une expérience spirituelle sublime et luxueuse',
        price: '390 000 DZD',
        priceVal: '390 000 DZD',
        duration: '10 Jours / 9 Nuits',
        rating: '5.0',
        reviews: '92 avis',
        image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Fairmont Makkah Clock Royal Tower (★ ★ ★ ★ ★ Royal)',
        makkahDist: 'Vue panoramique complète sur la Sainte Kaaba',
        madinahHotel: 'The Oberoi Madinah (★ ★ ★ ★ ★ Luxe)',
        madinahDist: 'Vue directe sur la Rawdah et le dôme vert',
        flight: 'Vols directs en Première Classe ou Classe Affaires',
        itinerary: [
          { day: 'Jour 1', title: 'Accueil VIP & Suite Royale', desc: 'Accueil au salon d\'honneur de l\'aéroport, transfert en GMC privée haut de gamme vers Makkah, installation dans votre suite avec vue Kaaba et Omra accompagnée d\'un Mutawwif privé.' },
          { day: 'Jour 2 - 5', title: 'Dévotion Royale à Makkah', desc: 'Prière en suite ou au Haram. Pension complète gourmet, service de conciergerie 24h/24 et visites archéologiques privées.' },
          { day: 'Jour 6', title: 'Train Rapide Al-Haramain', desc: 'Transfert en Première Classe à bord du train à grande vitesse vers Médine. Installation à l\'hôtel The Oberoi.' },
          { day: 'Jour 7 - 9', title: 'Sérénité Royale à Médine', desc: 'Recueillement exclusif, visites sur mesure avec guide privé, permis Rawdah garanti.' },
          { day: 'Jour 10', title: 'Départ en toute quiétude', desc: 'Transfert en véhicule privé vers l\'aéroport de Médine pour votre vol de retour de prestige.' }
        ],
        included: [
          'Visa VIP prioritaire et couverture médicale internationale maximale',
          'Vols directs en Première Classe ou Business',
          'Hébergement de prestige en suites avec vues panoramiques Haram/Kaaba',
          'Demi-pension ou pension complète dans les restaurants gastronomiques',
          'Véhicule privé (type GMC) à votre disposition exclusive durant le séjour',
          'Accès Garanti de confiance pour la Rawdah et le Haram',
          'Accompagnement 24h/24 par un guide Mutawwif et un majordome dédié'
        ]
      }
    ];
  } else {
    return [
      {
        id: 1,
        name: 'Economic Umrah Package',
        tagline: 'Premium value, ultimate peace of mind, and direct flights',
        price: '$1,250',
        priceVal: '165,000 DZD',
        duration: '15 Days / 14 Nights',
        rating: '4.7',
        reviews: '124 reviews',
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Al Kiswah Towers (★ ★ ★)',
        makkahDist: '1200m from Haram (Free 24/7 dedicated Shuttle)',
        madinahHotel: 'Al Shourfah Hotel (★ ★ ★)',
        madinahDist: '250m from Masjid an-Nabawi',
        flight: 'Air Algérie (Direct Flight Algiers - Jeddah)',
        itinerary: [
          { day: 'Day 1', title: 'Arrival & Installation', desc: 'Land at Jeddah Airport, direct comfortable air-conditioned transfer to Makkah, check-in at Al Kiswah Towers, and perform your Umrah rites with our local representative.' },
          { day: 'Day 2 - 7', title: 'Makkah Devotion & Prayers', desc: 'Spend blessed days praying at Masjid al-Haram. Take part in our organized historical Ziyarat (Mount Arafat, Mina, Muzdalifah, Mount Al-Noor).' },
          { day: 'Day 8', title: 'Transfer to Madinah', desc: 'Depart Makkah on our private air-conditioned coach to Al Madinah Al Munawwarah. Check-in at Al Shourfah Hotel and salute the Beloved Prophet ﷺ.' },
          { day: 'Day 9 - 14', title: 'Madinah Peace & Ziyarat', desc: 'Enjoy close access to Masjid an-Nabawi. We guide you to historical sights including Quba Mosque, Mount Uhud, and secure Rawdah permits via the Nusk app.' },
          { day: 'Day 15', title: 'Journey Home', desc: 'Transfer to Prince Mohammad bin Abdulaziz Airport in Madinah for your direct return flight to Algiers.' }
        ],
        included: [
          'Electronic Umrah Visa & comprehensive health insurance',
          'Round-trip direct flights with Air Algérie',
          'Hotel accommodation as listed (or equivalent high-quality)',
          'All internal transfers in modern, air-conditioned tour coaches',
          'Expert administrative and spiritual guides throughout the trip',
          '5L Zamzam water bottle allocation and a detailed pocket guidebook'
        ]
      },
      {
        id: 2,
        name: 'Comfort Umrah Package (Privilege)',
        tagline: 'Luxury stay within steps of the sacred mosque courtyards',
        price: '$1,850',
        priceVal: '245,000 DZD',
        duration: '15 Days / 14 Nights',
        rating: '4.9',
        reviews: '238 reviews',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Swissôtel Makkah (★ ★ ★ ★ ★)',
        makkahDist: 'Directly on the Haram courtyard',
        madinahHotel: 'Pullman Zamzam Madinah (★ ★ ★ ★ ★)',
        madinahDist: 'Just 50 meters from Masjid an-Nabawi',
        flight: 'Saudi Arabian Airlines (Direct Flight Algiers - Madinah)',
        itinerary: [
          { day: 'Day 1', title: 'Direct Landing in Madinah', desc: 'Enjoy a direct flight to Madinah. Enjoy VIP airport assistance, transfer to the 5-star Pullman Zamzam, and salute the Holy Prophet ﷺ.' },
          { day: 'Day 2 - 7', title: 'Blessed Days in Madinah', desc: 'Experience the beautiful serenity of Masjid an-Nabawi with 5-star comfort. Pay your respects in the Rawdah Chérifale and enjoy detailed local historic tours.' },
          { day: 'Day 8', title: 'Ihram & Makkah Transition', desc: 'Perform your Ihram at Dhul Hulaifah Miqat, and ride our premium VIP coach to Makkah. Check-in at Swissôtel and perform Umrah.' },
          { day: 'Day 9 - 14', title: 'Makkah Splendor & Haram Vibe', desc: 'Pray right on the Haram esplanade. Enjoy direct elevator access from the clock tower. Guided excursions to deep historic sites of Makkah.' },
          { day: 'Day 15', title: 'Return in Blessing', desc: 'Depart Swissôtel Makkah directly to King Abdulaziz Airport in Jeddah for your direct Saudia flight back to Algiers.' }
        ],
        included: [
          'Fast-track Umrah Visa and premium full-coverage health insurance',
          'Direct flights on regular schedules with Saudi Arabian Airlines',
          '5-star luxury hotel accommodation with premium daily open-buffet breakfast',
          'All inter-city transitions in deluxe VIP coaches',
          'Highly experienced, bilingual spiritual guides & scholars',
          'Premium pilgrim kit (backpack, plush prayer mat, dua book)'
        ]
      },
      {
        id: 3,
        name: 'VIP Gold Royal Package',
        tagline: 'An elite spiritual journey of unparalleled luxury and peace',
        price: '$2,950',
        priceVal: '390,000 DZD',
        duration: '10 Days / 9 Nights',
        rating: '5.0',
        reviews: '92 reviews',
        image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80',
        makkahHotel: 'Fairmont Makkah Clock Royal Tower (★ ★ ★ ★ ★ Royal)',
        makkahDist: 'Full panoramic view of the Holy Kaaba',
        madinahHotel: 'The Oberoi Madinah (★ ★ ★ ★ ★ Ultra Luxury)',
        madinahDist: 'Front-row view of the Green Dome & Rawdah esplanade',
        flight: 'First Class or Business Class Direct Flights',
        itinerary: [
          { day: 'Day 1', title: 'VIP Reception & Royal Check-In', desc: 'VIP private lounge greeting at Jeddah Airport. Travel in an exclusive GMC vehicle to Makkah. Settle into your Kaaba-view suite and perform Umrah with a private Mutawwif scholar.' },
          { day: 'Day 2 - 5', title: 'In the Presence of the Kaaba', desc: 'Indulge in royal comfort with 24/7 private room service, gourmet full board, and custom private historical trips around sacred sites.' },
          { day: 'Day 6', title: 'Haramain High-Speed Bullet Train', desc: 'Travel in Business Class luxury on the high-speed rail to Madinah. Direct luxury transfer to the prestigious Oberoi Hotel.' },
          { day: 'Day 7 - 9', title: 'Sovereign Peace in Madinah', desc: 'Pray with panoramic views of Masjid an-Nabawi. Direct Rawdah permit pre-booked and guaranteed VIP access.' },
          { day: 'Day 10', title: 'Farewell & Return', desc: 'Direct private luxury transfer to Madinah Airport. Embark on your premium First Class flight back to Algiers.' }
        ],
        included: [
          'Immediate VIP Visa issuance with max medical & travel cover',
          'First Class or Business Class round-trip tickets',
          'Sovereign suites with breathtaking panoramic views of Kaaba & Prophet\'s Mosque',
          'Gourmet half-board/full-board dining at world-class hotel restaurants',
          'Private deluxe GMC SUV at your exclusive service 24/7 during the entire tour',
          'Guaranteed official permits for Rawdah entry',
          'Around-the-clock accompaniment by a dedicated Mutawwif scholar and butler'
        ]
      }
    ];
  }
});

const currentActivePackage = computed(() => {
  return packages.value.find(p => p.id === selectedPkgId.value) || null;
});
</script>

<template>
  <section class="hero" id="hero">
    <!-- Background Image with Ken Burns animation class (Swapped to premium Medina Masjid an-Nabawi) -->
    <div class="hero__bg overflow-hidden">
      <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1920&q=80" alt="Beautiful Masjid an-Nabawi in Madinah" class="animate-ken-burns scale-105 filter brightness-95" />
      <div class="hero__overlay"></div>
    </div>

    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar__brand">
        <svg class="navbar__logo-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="logo-path" d="M15 15 L25 35 L35 15" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <span class="navbar__name">{{ t('nav.logo') }}</span>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="hero__content">
      <div class="hero__text">
        <!-- Decorative elements -->
        <div class="hero__deco-plane">
          <!-- Moon & Stars / Spiritual icon substitute for plain airplane -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 0-.67-3.4 6.75 6.75 0 0 1-8.33-8.33A9.73 9.73 0 0 0 12 3z" fill="currentColor" class="text-amber-400"/>
          </svg>
        </div>
        <div class="hero__deco-x">✕</div>

        <h1 class="hero__title">
          <span class="hero__title-line">{{ t('hero.title1') }}</span>
          <span class="hero__title-line"><em>{{ t('hero.title2') }}</em></span>
          <span class="hero__title-line"><em>{{ t('hero.title3') }}</em></span>
        </h1>
        <p class="hero__desc">
          {{ t('hero.subtitle') }}
        </p>
        <div class="hero__actions">
          <button @click="openUmrahModal" class="hero__btn hero__btn--primary transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer">
            <span>{{ t('hero.exploreBtn') }}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="animate-pulse">
              <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="hero__stats">
        <div class="hero__avatars">
          <!-- Customized warm pilgrim color indicators -->
          <div class="hero__avatar" style="background: #E5A93C; border: 1.5px solid white;"></div>
          <div class="hero__avatar" style="background: #F0B343; border: 1.5px solid white;"></div>
          <div class="hero__avatar" style="background: #C48520; border: 1.5px solid white;"></div>
          <div class="hero__avatar" style="background: #915F11; border: 1.5px solid white;"></div>
        </div>
        <div class="hero__rating">
          <div class="hero__stars">
            <span class="hero__rating-value">4.9/5</span>
            <span class="hero__stars-icons">★★★★★</span>
          </div>
          <span class="hero__travelers">{{ travelersCount }}+ {{ t('hero.travelers') }}</span>
        </div>
      </div>
    </div>

    <!-- Dashed path decoration -->
    <svg class="hero__deco-path" viewBox="0 0 200 100" fill="none">
      <path d="M10 80 Q 60 10, 120 50 T 190 20" stroke="white" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.4" fill="none"/>
      <polygon points="188,18 192,24 185,22" fill="white" opacity="0.4"/>
    </svg>

    <!-- PREMIUM INTERACTIVE UMRAH MODAL OVERLAY -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="umrah-modal-backdrop" @click.self="closeUmrahModal" id="umrah-modal">
        <div class="umrah-modal-card" :dir="isRtl ? 'rtl' : 'ltr'">
          
          <!-- Sticky Header -->
          <div class="modal-header">
            <div class="header-content">
              <span class="header-icon-badge">🕋</span>
              <div>
                <h2>{{ labels.modalTitle }}</h2>
                <p>{{ labels.modalSubtitle }}</p>
              </div>
            </div>
            <button @click="closeUmrahModal" class="close-modal-btn flex items-center justify-center" :aria-label="selectedPkgId !== null ? labels.backToList : labels.closeBtn">
              <template v-if="selectedPkgId !== null">
                <!-- If RTL, show right-pointing arrow, else show left-pointing arrow -->
                <svg v-if="isRtl || locale === 'ar'" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
              <template v-else>✕</template>
            </button>
          </div>

          <!-- Modal Scrollable Content Container -->
          <div class="modal-body-scrollable">

            <!-- VIEW 1: CHOOSE A PACKAGE -->
            <div v-if="selectedPkgId === null" class="packages-slider-view animate-fade-in">
              <div class="packages-slider-container">
                <!-- Navigation Buttons -->
                <button 
                  @click="scrollSlider('left')" 
                  class="slider-nav-btn prev-btn" 
                  :aria-label="locale === 'ar' ? 'السابق' : 'Previous'"
                >
                  ‹
                </button>

                <div ref="sliderTrack" class="packages-slider-track" @scroll="checkScrollLimits">
                  <div v-for="pkg in packages" :key="pkg.id" class="packages-slider-item" :id="`pkg-${pkg.id}`">
                    <div class="umrah-pkg-card">
                      <div class="pkg-card-img-wrap">
                        <img :src="pkg.image" :alt="pkg.name" />
                        <span class="pkg-duration-badge">⏱ {{ pkg.duration }}</span>
                        <span v-if="pkg.id === 3" class="pkg-featured-badge">★ Premium VIP</span>
                      </div>

                      <div class="pkg-card-content">
                        <div class="pkg-rating-row">
                          <span class="stars">★★★★★</span>
                          <span class="reviews">{{ pkg.rating }} ({{ pkg.reviews }})</span>
                        </div>
                        <h3 class="pkg-name-title">{{ pkg.name }}</h3>
                        <p class="pkg-tagline-text">{{ pkg.tagline }}</p>

                        <div class="hotel-summaries">
                          <div class="hotel-line">
                            <span class="icon">🕋</span>
                            <span class="text"><strong>Makkah:</strong> {{ pkg.makkahHotel }}</span>
                          </div>
                          <div class="hotel-line">
                            <span class="icon">🕌</span>
                            <span class="text"><strong>Madinah:</strong> {{ pkg.madinahHotel }}</span>
                          </div>
                          <div class="hotel-line">
                            <span class="icon">✈</span>
                            <span class="text">{{ pkg.flight.split('(')[0] }}</span>
                          </div>
                        </div>

                        <div class="pkg-price-footer">
                          <div class="price-box">
                            <span class="price-lbl">{{ labels.pkgPrice }}</span>
                            <span class="price-val">{{ pkg.priceVal }}</span>
                          </div>
                          <button @click="selectPackage(pkg.id)" class="pkg-details-btn cursor-pointer">
                            {{ labels.selectPkg }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  @click="scrollSlider('right')" 
                  class="slider-nav-btn next-btn" 
                  :aria-label="locale === 'ar' ? 'التالي' : 'Next'"
                >
                  ›
                </button>
              </div>

              <!-- Indicators / Dot Navigation -->
              <div class="slider-dots">
                <span 
                  v-for="(_, idx) in packages" 
                  :key="idx" 
                  class="dot" 
                  :class="{ active: currentActiveIndex === idx }"
                  @click="scrollToItem(idx)"
                ></span>
              </div>
            </div>

            <!-- VIEW 2: DETAILED PACKAGE VIEWER -->
            <div v-else class="package-details-view animate-fade-in">
              <!-- Back Navigator and Header -->
              <div class="details-nav-header">
                <button @click="goBackToPackages" class="back-btn cursor-pointer">
                  {{ labels.backToList }}
                </button>
                <div class="flex items-center gap-4 mt-2">
                  <h3 class="pkg-detailed-title">{{ currentActivePackage?.name }}</h3>
                  <span class="detail-dur-badge">{{ currentActivePackage?.duration }}</span>
                </div>
                <p class="pkg-detailed-sub font-sans text-gray-500 italic">{{ currentActivePackage?.tagline }}</p>
              </div>

              <!-- Content Split Screen -->
              <div class="details-grid">
                
                <!-- Left Column: Media & Highlights Summary -->
                <div class="details-left-pane">
                  <div class="featured-media">
                    <img :src="currentActivePackage?.image" :alt="currentActivePackage?.name" class="rounded-2xl w-full h-[240px] object-cover shadow-sm" />
                    <div class="media-overlay"></div>
                  </div>

                  <div class="hotel-detailed-box">
                    <h4 class="box-title">📍 {{ labels.includedTitle }}</h4>
                    
                    <div class="detail-field">
                      <strong>{{ labels.makkahHotelLabel }}</strong>
                      <span>{{ currentActivePackage?.makkahHotel }}</span>
                      <p class="field-desc">↳ {{ labels.distanceLabel }} {{ currentActivePackage?.makkahDist }}</p>
                    </div>

                    <div class="detail-field mt-3">
                      <strong>{{ labels.madinahHotelLabel }}</strong>
                      <span>{{ currentActivePackage?.madinahHotel }}</span>
                      <p class="field-desc">↳ {{ labels.distanceLabel }} {{ currentActivePackage?.madinahDist }}</p>
                    </div>

                    <div class="detail-field mt-3">
                      <strong>{{ labels.flightLabel }}</strong>
                      <span>{{ currentActivePackage?.flight }}</span>
                    </div>
                  </div>
                </div>

                <!-- Right Column: Interactive Tabs Container -->
                <div class="details-right-pane">
                  <!-- Tab Bar -->
                  <div class="tabs-bar">
                    <button 
                      v-for="tab in ['overview', 'itinerary', 'included', 'book']" 
                      :key="tab"
                      @click="activeTab = tab as any"
                      :class="{ active: activeTab === tab }"
                      class="tab-btn font-sans font-bold cursor-pointer"
                    >
                      {{ 
                        tab === 'overview' ? labels.tabOverview :
                        tab === 'itinerary' ? labels.tabItinerary :
                        tab === 'included' ? labels.tabIncluded :
                        labels.tabBook 
                      }}
                    </button>
                  </div>

                  <!-- Tab Contents Window -->
                  <div class="tab-window-content">
                    
                    <!-- TAB 1: OVERVIEW -->
                    <div v-if="activeTab === 'overview'" class="tab-pane animate-fade-in">
                      <div class="overview-grid">
                        <div class="overview-stat-card">
                          <span class="label">✈ {{ labels.flightLabel }}</span>
                          <strong>Direct Flights</strong>
                        </div>
                        <div class="overview-stat-card">
                          <span class="label">⏱ {{ labels.pkgDuration }}</span>
                          <strong>{{ currentActivePackage?.duration }}</strong>
                        </div>
                        <div class="overview-stat-card font-semibold">
                          <span class="label">⭐ Rating</span>
                          <strong>{{ currentActivePackage?.rating }} / 5.0</strong>
                        </div>
                      </div>
                      
                      <div class="highlights-box-content mt-6">
                        <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-2 font-serif text-lg">📜 Core Package Values</h4>
                        <p class="text-sm text-gray-600 leading-relaxed font-sans mb-4">
                          Our agency has curated this spiritual package to provide absolute peace of mind for Algerian pilgrims. Every aspect is certified under the official Ministry of Religious Affairs (وزارة الشؤون الدينية) and authorized by Saudi Nusk.
                        </p>
                        <div class="flex flex-wrap gap-2">
                          <span class="badge">✓ Direct Flights</span>
                          <span class="badge">✓ Licensed Guide</span>
                          <span class="badge">✓ 24/7 Assistance</span>
                          <span class="badge">✓ Medical Cover</span>
                        </div>
                      </div>
                    </div>

                    <!-- TAB 2: DAILY ITINERARY -->
                    <div v-if="activeTab === 'itinerary'" class="tab-pane itinerary-scroller animate-fade-in">
                      <div class="itinerary-steps-vertical">
                        <div v-for="(step, sIdx) in currentActivePackage?.itinerary" :key="sIdx" class="itinerary-node">
                          <div class="node-bullet">{{ step.day }}</div>
                          <div class="node-content">
                            <h5 class="node-title">{{ step.title }}</h5>
                            <p class="node-desc">{{ step.desc }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- TAB 3: INCLUSIONS CHECKLIST -->
                    <div v-if="activeTab === 'included'" class="tab-pane animate-fade-in">
                      <h4 class="font-serif font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">{{ labels.includedTitle }}</h4>
                      <div class="inclusions-list-wrapper">
                        <div v-for="(inc, incIdx) in currentActivePackage?.included" :key="incIdx" class="inclusion-check-item">
                          <span class="check-icon">✓</span>
                          <span class="check-text font-sans text-sm">{{ inc }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- TAB 4: BOOK NOW FORM -->
                    <div v-if="activeTab === 'book'" class="tab-pane animate-fade-in">
                      <div v-if="!bookingConfirmed" class="booking-form-wrapper">
                        <form @submit.prevent="handleBooking" class="space-y-4">
                          
                          <div class="form-row">
                            <label class="form-label">{{ labels.formName }} *</label>
                            <input type="text" v-model="pilgrimName" placeholder="Yassine Belkacem" required class="form-input-field" />
                          </div>

                          <div class="form-row">
                            <label class="form-label">{{ labels.formPhone }} *</label>
                            <input type="tel" v-model="pilgrimPhone" placeholder="+213 550 123 456" required class="form-input-field" />
                          </div>

                          <div class="form-row">
                            <label class="form-label">{{ labels.formEmail }}</label>
                            <input type="email" v-model="pilgrimEmail" placeholder="yassine@example.com" class="form-input-field" />
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-row">
                              <label class="form-label">{{ labels.formDate }}</label>
                              <input type="date" v-model="preferredDate" required class="form-input-field" />
                            </div>

                            <div class="form-row">
                              <label class="form-label">{{ labels.formCount }}</label>
                              <input type="number" min="1" max="15" v-model="numPilgrims" class="form-input-field" />
                            </div>
                          </div>

                          <div class="form-row">
                            <label class="form-label">{{ labels.formSharing }}</label>
                            <select v-model="sharingType" class="form-input-field">
                              <option value="double">{{ labels.sharingDouble }}</option>
                              <option value="triple">{{ labels.sharingTriple }}</option>
                              <option value="quad">{{ labels.sharingQuad }}</option>
                              <option value="single">{{ labels.sharingSingle }}</option>
                            </select>
                          </div>

                          <button type="submit" class="booking-submit-btn cursor-pointer">
                            {{ labels.submitBook }}
                          </button>

                        </form>
                      </div>

                      <!-- BOOKING SUCCESS SCREEN -->
                      <div v-else class="booking-success-message-card">
                        <div class="success-badge-icon">✓</div>
                        <h4 class="success-main-title">{{ labels.successTitle }}</h4>
                        
                        <div class="ref-container">
                          <span>{{ labels.successRef }}</span>
                          <strong class="ref-code">{{ bookingRef }}</strong>
                        </div>

                        <p class="success-intro">{{ labels.successDesc1 }}</p>
                        <p class="success-explanation">{{ labels.successDesc2 }}</p>

                        <div class="documents-checklist-card">
                          <h5>📋 {{ labels.successChecklist }}</h5>
                          <ul>
                            <li><strong>•</strong> {{ labels.doc1 }}</li>
                            <li><strong>•</strong> {{ labels.doc2 }}</li>
                            <li><strong>•</strong> {{ labels.doc3 }}</li>
                          </ul>
                        </div>

                        <button @click="resetForm" class="btn-book-another font-sans font-bold cursor-pointer">
                          {{ labels.bookAnother }}
                        </button>
                      </div>

                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
        </div>
      </Transition>
    </Teleport>

  </section>
</template>

<style scoped>
/* Transitive animation styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal Overlay backdrop */
.umrah-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 10, 10, 0.45);
  backdrop-filter: blur(15px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Modal Inner Card */
.umrah-modal-card {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  background-color: var(--color-off-white);
  border: none;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: none;
  color: var(--color-dark);
}

/* Modal Sticky Header */
.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-bg-card);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1100px;
  width: 100%;
}

.header-icon-badge {
  font-size: 36px;
}

.modal-header h2 {
  font-family: var(--font-serif);
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--color-dark);
  margin: 0;
}

.modal-header p {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text-light);
  margin: 4px 0 0 0;
}

.close-modal-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--color-dark);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.close-modal-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

/* Modal Scrollable Area */
.modal-body-scrollable {
  flex-grow: 1;
  overflow-y: auto;
  padding: 40px 32px 60px;
  background-color: var(--color-off-white);
}

/* Packages Slider Display */
.packages-slider-view {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.packages-slider-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.packages-slider-track {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  padding: 12px 4px;
}

.packages-slider-track::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.packages-slider-item {
  flex: 0 0 calc(33.333% - 16px);
  min-width: 320px;
  scroll-snap-align: start;
}

/* On medium screen (Tablet) show 2 items */
@media (max-width: 1024px) {
  .packages-slider-item {
    flex: 0 0 calc(50% - 12px);
    min-width: 280px;
  }
}

/* On mobile show 1 item (slightly narrower than container so next is visible) */
@media (max-width: 640px) {
  .packages-slider-item {
    flex: 0 0 85vw;
    min-width: 260px;
  }
  .packages-slider-track {
    gap: 16px;
  }
}

/* Premium Navigation Buttons */
.slider-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-dark);
  cursor: pointer;
  z-index: 10;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slider-nav-btn:hover {
  background-color: #F5A623;
  color: white;
  border-color: #F5A623;
  box-shadow: 0 6px 16px rgba(245, 166, 35, 0.3);
  transform: translateY(-50%) scale(1.08);
}

.slider-nav-btn:active {
  transform: translateY(-50%) scale(0.95);
}

.prev-btn {
  left: -23px;
}

.next-btn {
  right: -23px;
}

/* In RTL language mode, adjust absolute buttons logically if document dir is RTL */
html[dir="rtl"] .prev-btn,
html.dark-mode[dir="rtl"] .prev-btn {
  left: auto;
  right: -23px;
}
html[dir="rtl"] .next-btn,
html.dark-mode[dir="rtl"] .next-btn {
  right: auto;
  left: -23px;
}

/* Hide navigation buttons on mobile devices or if track is not scrollable */
@media (max-width: 768px) {
  .slider-nav-btn {
    display: none; /* Rely on native touch swipe on mobile */
  }
}

/* Indicator dots */
.slider-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.slider-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-border);
  cursor: pointer;
  transition: all 0.25s;
}

.slider-dots .dot.active {
  background-color: #F5A623;
  width: 24px;
  border-radius: 4px;
}

/* Detailed Package View */
.package-details-view {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.umrah-pkg-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
}

.umrah-pkg-card:hover {
  transform: translateY(-6px);
  border-color: #F5A623; /* Warm gold */
  box-shadow: 0 16px 36px rgba(245, 166, 35, 0.08);
}

.pkg-card-img-wrap {
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
}

.pkg-card-img-wrap img {
  width: 100%;
  height: 100%;
  object-cover: cover;
  transition: transform 0.5s;
}

.umrah-pkg-card:hover .pkg-card-img-wrap img {
  transform: scale(1.06);
}

.pkg-duration-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 20px;
  font-family: var(--font-sans);
}

.pkg-featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #F5A623;
  color: var(--color-dark);
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 20px;
  font-family: var(--font-sans);
}

/* Card content */
.pkg-card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.pkg-rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pkg-rating-row .stars {
  color: #F5A623;
  font-size: 13px;
}

.pkg-rating-row .reviews {
  font-size: 11px;
  font-weight: bold;
  color: var(--color-text-light);
  font-family: var(--font-sans);
}

.pkg-name-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-dark);
  margin: 0 0 6px 0;
}

.pkg-tagline-text {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0 0 16px 0;
  line-height: 1.4;
}

.hotel-summaries {
  border-top: 1px dashed var(--color-border);
  padding-top: 14px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hotel-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.hotel-line .icon {
  font-size: 14px;
  flex-shrink: 0;
}

.hotel-line .text {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-light);
}

.pkg-price-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.price-box {
  display: flex;
  flex-direction: column;
}

.price-lbl {
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.price-val {
  font-family: var(--font-sans);
  font-size: 1.25rem;
  font-weight: 900;
  color: #15803D; /* Deep green */
}

.pkg-details-btn {
  background-color: var(--color-primary);
  color: var(--color-dark);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 800;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  transition: background-color 0.2s, transform 0.2s;
}

.pkg-details-btn:hover {
  background-color: var(--color-primary-dark, #e09416);
  transform: translateY(-2px);
}

/* DETAILED VIEW LAYOUT */
.details-nav-header {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 800;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  text-decoration: underline;
}

.pkg-detailed-title {
  font-family: var(--font-serif);
  font-size: 1.85rem;
  font-weight: 900;
  color: var(--color-dark);
  margin: 0;
}

.detail-dur-badge {
  background-color: rgba(21, 128, 61, 0.1);
  color: #15803D;
  border: 1px solid rgba(21, 128, 61, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: bold;
}

.details-grid {
  display: grid;
  grid-template-cols: 1fr 1.5fr;
  gap: 32px;
}

.details-left-pane {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.featured-media {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.hotel-detailed-box {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 24px;
}

.hotel-detailed-box .box-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: bold;
  color: var(--color-dark);
  margin: 0 0 16px 0;
}

.detail-field {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-dark);
}

.detail-field strong {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.detail-field p.field-desc {
  font-size: 12px;
  color: #15803D;
  font-weight: bold;
  margin: 2px 0 0 0;
}

/* Tabs structure */
.details-right-pane {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  overflow: hidden;
}

.tabs-bar {
  display: flex;
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
}

.tab-btn {
  flex-grow: 1;
  border: none;
  background: none;
  padding: 16px;
  font-size: 13px;
  color: var(--color-text-light);
  transition: color 0.2s, background-color 0.2s;
  text-align: center;
}

.tab-btn.active {
  background-color: var(--color-white);
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}

.tab-window-content {
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

/* Tab panes */
.overview-grid {
  display: grid;
  grid-template-cols: repeat(3, 1fr);
  gap: 16px;
}

.overview-stat-card {
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.overview-stat-card .label {
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--color-text-muted);
}

.overview-stat-card strong {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-dark);
}

.highlights-box-content {
  background-color: rgba(245, 166, 35, 0.04);
  border: 1px solid rgba(245, 166, 35, 0.15);
  border-radius: 16px;
  padding: 20px;
}

.badge {
  display: inline-block;
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: bold;
  border-radius: 8px;
  color: var(--color-text-light);
}

/* Vertical Timeline for Itinerary */
.itinerary-scroller {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.itinerary-steps-vertical {
  position: relative;
  border-left: 2px solid var(--color-border);
  padding-left: 20px;
  margin-left: 10px;
}

html[dir="rtl"] .itinerary-steps-vertical {
  border-left: none;
  border-right: 2px solid var(--color-border);
  padding-left: 0;
  padding-right: 20px;
  margin-left: 0;
  margin-right: 10px;
}

.itinerary-node {
  position: relative;
  margin-bottom: 24px;
}

.itinerary-node:last-child {
  margin-bottom: 0;
}

.node-bullet {
  position: absolute;
  top: 0;
  left: -32px;
  width: 24px;
  height: 24px;
  background-color: #15803D;
  color: white;
  border-radius: 50%;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

html[dir="rtl"] .node-bullet {
  left: auto;
  right: -32px;
}

.node-content {
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 14px 18px;
}

.node-title {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: bold;
  color: var(--color-dark);
  margin: 0 0 4px 0;
}

.node-desc {
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--color-text-light);
  line-height: 1.4;
  margin: 0;
}

/* Inclusions checklist */
.inclusions-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inclusion-check-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.inclusion-check-item .check-icon {
  color: #15803D;
  font-weight: bold;
  font-size: 14px;
}

.inclusion-check-item .check-text {
  color: var(--color-text-light);
  line-height: 1.4;
}

/* Booking Form Elements */
.booking-form-wrapper {
  width: 100%;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.form-label {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: bold;
  color: var(--color-text-light);
}

.form-input-field {
  width: 100%;
  padding: 12px;
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--color-dark);
  transition: border-color 0.2s, background-color 0.2s;
}

.form-input-field:focus {
  outline: none;
  border-color: var(--color-primary);
  background-color: var(--color-white);
}

.booking-submit-btn {
  width: 100%;
  background-color: #15803D; /* Deep sacred green */
  color: white;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: bold;
  padding: 14px;
  border: none;
  border-radius: 12px;
  margin-top: 12px;
  transition: background-color 0.2s, transform 0.2s;
}

.booking-submit-btn:hover {
  background-color: #166534;
  transform: translateY(-2px);
}

/* Booking Success Card */
.booking-success-message-card {
  text-align: center;
  padding: 24px 0;
}

.success-badge-icon {
  width: 64px;
  height: 64px;
  background-color: rgba(21, 128, 61, 0.1);
  color: #15803D;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 16px;
}

.success-main-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 800;
  color: #15803D;
  margin: 0 0 16px 0;
}

.ref-container {
  display: inline-block;
  background-color: var(--color-off-white);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 8px 16px;
  margin-bottom: 20px;
  font-family: var(--font-sans);
  font-size: 13px;
}

.ref-code {
  color: #15803D;
  font-size: 15px;
  font-weight: bold;
  margin-left: 8px;
}

.success-intro {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: bold;
  color: var(--color-dark);
  margin-bottom: 8px;
}

.success-explanation {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-light);
  line-height: 1.5;
  max-width: 550px;
  margin: 0 auto 24px auto;
}

.documents-checklist-card {
  background-color: rgba(21, 128, 61, 0.03);
  border: 1px solid rgba(21, 128, 61, 0.1);
  border-radius: 16px;
  padding: 20px;
  max-width: 550px;
  margin: 0 auto 24px auto;
  text-align: left;
}

html[dir="rtl"] .documents-checklist-card {
  text-align: right;
}

.documents-checklist-card h5 {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: bold;
  color: var(--color-dark);
  margin: 0 0 10px 0;
}

.documents-checklist-card ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.documents-checklist-card li {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-light);
  line-height: 1.4;
}

.btn-book-another {
  background: none;
  border: 1px solid var(--color-border);
  padding: 10px 20px;
  font-size: 13px;
  border-radius: 10px;
  color: var(--color-text-light);
  transition: background-color 0.2s, color 0.2s;
}

.btn-book-another:hover {
  background-color: var(--color-off-white);
  color: var(--color-dark);
}

/* Dark Mode Overrides */
html.dark-mode .umrah-modal-card {
  background-color: var(--color-off-white);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--color-dark);
}

html.dark-mode .modal-header {
  background-color: var(--color-bg-card);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .modal-header h2 {
  color: var(--color-dark);
}

html.dark-mode .modal-body-scrollable {
  background-color: var(--color-off-white);
}

html.dark-mode .umrah-pkg-card {
  background-color: var(--color-white);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .pkg-name-title {
  color: var(--color-dark);
}

html.dark-mode .hotel-summaries {
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .pkg-price-footer {
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .close-modal-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-white);
}

html.dark-mode .close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

html.dark-mode .details-nav-header {
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .pkg-detailed-title {
  color: var(--color-white);
}

html.dark-mode .hotel-detailed-box {
  background-color: var(--color-dark);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .hotel-detailed-box .box-title {
  color: var(--color-white);
}

html.dark-mode .detail-field {
  color: var(--color-white);
}

html.dark-mode .details-right-pane {
  background-color: var(--color-dark);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .tabs-bar {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .tab-btn.active {
  background-color: var(--color-dark);
}

html.dark-mode .overview-stat-card {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .overview-stat-card strong {
  color: var(--color-white);
}

html.dark-mode .highlights-box-content {
  background-color: rgba(245, 166, 35, 0.02);
  border-color: rgba(245, 166, 35, 0.08);
}

html.dark-mode .highlights-box-content h4 {
  color: var(--color-white);
}

html.dark-mode .node-content {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .node-title {
  color: var(--color-white);
}

html.dark-mode .inclusion-check-item .check-text {
  color: var(--color-text-muted);
}

html.dark-mode .form-input-field {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.08);
  color: var(--color-white);
}

html.dark-mode .form-input-field:focus {
  background-color: var(--color-dark);
}

html.dark-mode .ref-container {
  background-color: var(--color-dark-soft);
  border-color: rgba(255, 255, 255, 0.08);
}

html.dark-mode .success-intro {
  color: var(--color-white);
}

html.dark-mode .documents-checklist-card {
  background-color: rgba(21, 128, 61, 0.02);
  border-color: rgba(21, 128, 61, 0.08);
}

html.dark-mode .documents-checklist-card h5 {
  color: var(--color-white);
}

html.dark-mode .btn-book-another:hover {
  background-color: var(--color-dark-soft);
  color: var(--color-white);
}

/* Responsive Styles */
@media (max-width: 991px) {
  .details-grid {
    grid-template-cols: 1fr;
  }
}

@media (max-width: 768px) {
  .modal-header {
    padding: 16px 20px;
  }
  .modal-header h2 {
    font-size: 1.35rem;
  }
  .modal-body-scrollable {
    padding: 20px;
  }
  .overview-grid {
    grid-template-cols: 1fr;
  }
  .tab-btn {
    padding: 10px;
    font-size: 11px;
  }
  .tab-window-content {
    padding: 16px;
  }
}
</style>
