import { useState, useMemo } from "react";
import { 
  Sparkles, 
  ShoppingBag, 
  Send, 
  Check, 
  MessageSquare, 
  Star, 
  Gift, 
  ChevronRight, 
  Heart, 
  HelpCircle, 
  Users, 
  Coffee, 
  Tag, 
  Smile, 
  RefreshCw, 
  CheckCircle,
  Menu,
  X,
  MapPin,
  Mail,
  Smartphone,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Image URLs generated specifically for this application
const HERO_IMAGE = "/src/assets/images/warm_hampers_hero_1784118974437.jpg";
const IMAGES = {
  hemat: "/src/assets/images/paket_hemat_1783174870977.jpg",
  standard: "/src/assets/images/paket_standard_1783174885199.jpg",
  custom: "/src/assets/images/paket_custom_1783174898324.jpg"
};

// Raw static data representing the Hampers products
interface HamperItem {
  id: string;
  name: string;
  priceLabel: string;
  priceNumeric: number; // 1: <50k, 2: 50k-100k, 3: Custom
  image: string;
  rating: number;
  orders: string;
  description: string;
  contents: string[];
  occasions: string[]; // wisuda, ultah, pacar, keluarga, rekan
  ctaType: "shopee" | "wa";
  ctaUrl: string;
  badge: string;
}

const DYNAMIC_CONTENTS: Record<string, Record<string, string[]>> = {
  "paket-hemat": {
    "teman": [
      "Snack & minuman ringan pilihan (aesthetic layout)",
      "Boneka wisuda mini bertoga (12cm)",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita warna cantik)",
      "Gratis Kartu Ucapan Custom (wisuda)",
      "Shredded paper dekoratif"
    ],
    "ultah": [
      "Snack manis pilihan (Cokelat/Cookies/Permen premium)",
      "Aesthetic mini scented candle (lilin aroma terapi)",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita warna cantik)",
      "Gratis Kartu Ucapan Custom (Happy Birthday)",
      "Shredded paper dekoratif"
    ],
    "pacar": [
      "Cokelat premium & milk box mini (matching color layout)",
      "Gantungan kunci rajut handmade bentuk cute",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita warna cantik)",
      "Gratis Kartu Ucapan Custom romantis",
      "Shredded paper dekoratif"
    ],
    "keluarga": [
      "1 Toples kue kering premium (Putri Salju / Nastar / Cookies)",
      "1 Pack special blend tea / local coffee ground",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita tema hijau/earthy cantik)",
      "Gratis Kartu Ucapan Custom hari raya",
      "Shredded paper dekoratif"
    ],
    "rekan": [
      "Coffee drip bag selection / Teh artisan premium",
      "Desk planner / Sticky notes aesthetic untuk kerja",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita warna formal & elegan)",
      "Gratis Kartu Ucapan Custom (formal/terima kasih)",
      "Shredded paper dekoratif"
    ]
  },
  "paket-standard": {
    "teman": [
      "Pilihan hadiah premium: Buket bunga jinjing flanel + Slempang nama bordir, atau Set Notebook & Pena eksklusif",
      "Boneka wisuda ukuran sedang (bisa request nama + gelar di medali)",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ],
    "ultah": [
      "Pilihan hadiah premium: Dompet minimalis + Parfum premium, atau Skincare/Bodycare set",
      "Mini flower bouquet (buket bunga kering mini awet)",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ],
    "pacar": [
      "Pilihan hadiah premium: Couple tumblers minimalis, atau Set Parfum mewah Unisex + Dompet kartu kulit",
      "Preserved rose (bunga mawar abadi di dalam botol kaca kecil)",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ],
    "keluarga": [
      "Pilihan hadiah premium: Sajadah travel premium + Tasbih kayu estetik, atau Set cangkir keramik + 2 Toples kue kering",
      "Dekorasi tambahan ornamen kayu/ketupat mini estetik",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ],
    "rekan": [
      "Pilihan hadiah premium: Stainless steel Tumbler dengan grafir nama, atau Set Leather Journal Book + Pulpen premium",
      "Reed diffuser (pewangi ruangan stik) aroma menenangkan",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ]
  }
};

const HAMPERS_DATA: HamperItem[] = [
  {
    id: "paket-hemat",
    name: "Paket Hemat (di bawah Rp50k)",
    priceLabel: "Mulai Rp35.000 - Rp49.000",
    priceNumeric: 1,
    image: IMAGES.hemat,
    rating: 4.8,
    orders: "40+ terjual",
    description: "Pilihan hadiah manis, ekonomis, namun tetap terlihat rapi dan estetik untuk teman atau rekan seperjuangan.",
    contents: [
      "Snack & minuman ringan pilihan (aesthetic layout)",
      "Kemasan box kraft rustic ramah lingkungan",
      "Satin ribbon (pita warna cantik)",
      "Gratis Kartu Ucapan Custom (bebas tulis kata-kata ucapan)",
      "Shredded paper dekoratif"
    ],
    occasions: ["teman", "ultah", "pacar", "keluarga", "rekan"],
    ctaType: "shopee",
    ctaUrl: "https://shopee.co.id/search?keyword=hampers+aesthetic+hemat",
    badge: "Terlaris untuk Mahasiswa"
  },
  {
    id: "paket-standard",
    name: "Paket Standard (Rp50k - Rp100k)",
    priceLabel: "Rp50.000 - Rp95.000",
    priceNumeric: 2,
    image: IMAGES.standard,
    rating: 4.9,
    orders: "60+ terjual",
    description: "Kombinasi hadiah premium yang sangat fungsional dan istimewa, dibungkus dalam kemasan elegan, sangat cocok untuk orang tersayang.",
    contents: [
      "Isi hadiah premium (pilihan: Skincare, produk perawatan diri, atau keperluan sehari-hari lainnya)",
      "Box hampers premium tebal dengan pita satin mewah",
      "Gratis Kartu Ucapan Custom dengan amplop mini estetik",
      "Free bubble wrap tebal 3 lapis",
      "Foto real-time hampers sebelum dikirim ke kurir"
    ],
    occasions: ["teman", "ultah", "pacar", "keluarga", "rekan"],
    ctaType: "shopee",
    ctaUrl: "https://shopee.co.id/search?keyword=hampers+mug+lilin+aromaterapi",
    badge: "Paling Populer"
  },
  {
    id: "paket-custom",
    name: "Paket Custom (Bebas / Nego)",
    priceLabel: "Harga Menyesuaikan Budget",
    priceNumeric: 3,
    image: IMAGES.custom,
    rating: 5.0,
    orders: "20+ dibuat",
    description: "Bebas berkreasi menentukan isi, warna tema, serta jenis keranjang/box sesuai keinginan Anda. Konsultasi 100% gratis dengan admin ramah kami.",
    contents: [
      "Bebas pilih isi (Mug, Journal Book, Perfume, Hijab, Tumbler, dll)",
      "Pilihan wadah: Box hardboard tebal atau Keranjang Rotan etnik",
      "Tema warna kustom penuh (Lilac, Pastel, Earthy, dll)",
      "Kartu ucapan premium dengan wax seal (stempel lilin)",
      "Sesi konsultasi & review tata letak foto sebelum dikirim"
    ],
    occasions: ["teman", "ultah", "pacar", "keluarga", "rekan"],
    ctaType: "wa",
    ctaUrl: "https://wa.me/628123456789?text=Halo%20Hampersta'%2C%20saya%20mau%20konsultasi%20tentang%20Paket%20Custom%20dong",
    badge: "Eksklusif & Personal"
  }
];

export function HamperstaLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* HEART SHAPE RIBBON */}
      <path
        d="M100,68 C90,56 78,46 78,34 C78,22 91,18 100,28 C109,18 122,22 122,34 C122,46 110,56 100,68 Z"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* RIBBON CURLS */}
      <path
        d="M93,65 C85,58 70,58 63,63"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M107,65 C115,58 130,58 137,63"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* ISOMETRIC GIFT BOX */}
      {/* Top Face */}
      <path
        d="M100,66 L140,80 L100,94 L60,80 Z"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Vertical Edges */}
      <path
        d="M60,80 L60,115"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M100,94 L100,129"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M140,80 L140,115"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bottom Face Edges */}
      <path
        d="M60,115 L100,129 L140,115"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Small dots on the right face of the box */}
      <circle cx="112" cy="110" r="3" fill="currentColor" />
      <circle cx="122" cy="110" r="3" fill="currentColor" />

      {/* LEFT HAND (Cupping the box) */}
      {/* Outer wrist and arm curve */}
      <path
        d="M72,142 C54,142 38,118 38,98 C38,82 42,66 42,71 C42,85 45,102 58,116"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fingers */}
      <path
        d="M48,114 C43,105 42,92 48,82 C49,79 52,79 52,82 C48,92 51,103 59,109"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56,110 C53,104 53,96 57,89 C58,86 61,86 61,89 C58,96 61,102 68,107"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* RIGHT HAND (Cupping the box) */}
      {/* Outer wrist and arm curve */}
      <path
        d="M128,142 C146,142 162,118 162,98 C162,82 158,66 158,71 C158,85 155,102 142,116"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fingers */}
      <path
        d="M152,114 C157,105 158,92 152,82 C151,79 148,79 148,82 C152,92 149,103 141,109"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144,110 C147,104 147,96 143,89 C142,86 139,86 139,89 C142,96 139,102 132,107"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filtering states
  const [selectedBudget, setSelectedBudget] = useState<number | "all">("all");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all");

  // Quiz States (Hampers Finder Wizard)
  const [quizStep, setQuizStep] = useState(0); // 0: intro, 1: recipient/occasion, 2: budget, 3: result
  const [quizAnswers, setQuizAnswers] = useState({
    recipient: "",
    budget: 0
  });
  const [quizResult, setQuizResult] = useState<HamperItem | null>(null);

  // Filter products based on selected tab states
  const filteredHampers = useMemo(() => {
    return HAMPERS_DATA.filter((item) => {
      // "paket-custom" is ONLY displayed when selectedBudget === 3 (Filter Custom)
      if (item.id === "paket-custom" && selectedBudget !== 3) {
        return false;
      }
      
      const matchBudget = selectedBudget === "all" || item.priceNumeric === selectedBudget;
      const matchOccasion = selectedOccasion === "all" || item.occasions.includes(selectedOccasion);
      return matchBudget && matchOccasion;
    }).map((item) => {
      if (selectedOccasion !== "all" && DYNAMIC_CONTENTS[item.id]?.[selectedOccasion]) {
        return {
          ...item,
          contents: DYNAMIC_CONTENTS[item.id][selectedOccasion]
        };
      }
      return item;
    });
  }, [selectedBudget, selectedOccasion]);

  // Quiz progression logic
  const handleQuizAnswer = (key: "recipient" | "budget", value: string | number) => {
    const updatedAnswers = { ...quizAnswers, [key]: value };
    setQuizAnswers(updatedAnswers);

    if (key === "recipient") {
      setQuizStep(2);
    } else if (key === "budget") {
      // Find recommendation based on answers
      const budgetVal = value as number;
      let matched = HAMPERS_DATA.find((h) => h.priceNumeric === budgetVal);
      // Fallback if not directly matched
      if (!matched) {
        matched = HAMPERS_DATA[1]; // default standard
      }
      setQuizResult(matched);
      setQuizStep(3);
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({ recipient: "", budget: 0 });
    setQuizResult(null);
    setQuizStep(0);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-lilac-light font-sans text-brown-dark selection:bg-lilac-dark selection:text-brown-dark overflow-x-hidden">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-lilac-medium/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-11 h-11 rounded-full bg-lilac-medium flex items-center justify-center border border-brown-medium/20 shadow-inner group-hover:scale-105 transition-transform duration-300 p-1">
                <HamperstaLogo className="w-full h-full text-brown-dark" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-brown-dark">
                  Hampersta<span className="text-lilac-accent">'</span>
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-brown-light -mt-1 uppercase">
                  Est. 2026 • Premium Gift
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 font-medium">
              <button 
                onClick={() => scrollToSection("hero")} 
                className="hover:text-lilac-accent text-brown-dark/80 transition-colors duration-200 cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("finder")} 
                className="hover:text-lilac-accent text-brown-dark/80 transition-colors duration-200 cursor-pointer relative"
              >
                Hampers Finder
                <span className="absolute -top-3.5 -right-6 px-1.5 py-0.5 bg-brown-dark text-[8px] font-mono text-cream rounded-full animate-bounce">
                  NEW
                </span>
              </button>
              <button 
                onClick={() => scrollToSection("katalog")} 
                className="hover:text-lilac-accent text-brown-dark/80 transition-colors duration-200 cursor-pointer"
              >
                Paket Hampers
              </button>
              <button 
                onClick={() => scrollToSection("manfaat")} 
                className="hover:text-lilac-accent text-brown-dark/80 transition-colors duration-200 cursor-pointer"
              >
                Kenapa Kami?
              </button>
              <button 
                onClick={() => scrollToSection("testimoni")} 
                className="hover:text-lilac-accent text-brown-dark/80 transition-colors duration-200 cursor-pointer"
              >
                Testimoni
              </button>
            </div>

            {/* Desktop Action Button */}
            <div className="hidden md:block">
              <a 
                href="https://wa.me/628123456789?text=Halo%20Hampersta'%2C%20saya%20ingin%20bertanya%20tentang%20hampers%20premium%20Kalian" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-brown-dark text-brown-dark rounded-full font-semibold hover:bg-brown-dark hover:text-cream transition-all duration-300 text-sm tracking-wide shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Hubungi Kami
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-brown-dark hover:bg-lilac-medium/30 transition-colors duration-200"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-lilac-medium overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col font-medium">
                <button 
                  onClick={() => scrollToSection("hero")} 
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-lilac-light text-brown-dark transition-all duration-200"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("finder")} 
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-lilac-light text-brown-dark flex items-center justify-between transition-all duration-200"
                >
                  <span>Hampers Finder</span>
                  <span className="px-2 py-0.5 bg-brown-dark text-[8px] font-mono text-cream rounded-full uppercase">NEW</span>
                </button>
                <button 
                  onClick={() => scrollToSection("katalog")} 
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-lilac-light text-brown-dark transition-all duration-200"
                >
                  Paket Hampers
                </button>
                <button 
                  onClick={() => scrollToSection("manfaat")} 
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-lilac-light text-brown-dark transition-all duration-200"
                >
                  Kenapa Kami?
                </button>
                <button 
                  onClick={() => scrollToSection("testimoni")} 
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-lilac-light text-brown-dark transition-all duration-200"
                >
                  Testimoni
                </button>
                <div className="pt-2 border-t border-lilac-medium/50">
                  <a 
                    href="https://wa.me/628123456789?text=Halo%20Hampersta'%2C%20saya%20ingin%20bertanya%20tentang%20hampers%20premium%20Kalian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 w-full py-3 bg-brown-dark text-cream rounded-xl font-semibold hover:bg-brown-medium transition-all duration-300 text-sm shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Hubungi via WA
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section id="hero" className="relative py-12 md:py-24 bg-gradient-to-b from-white to-lilac-light overflow-hidden">
        {/* Soft background circles decoration */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-lilac-medium/30 blur-3xl -z-10" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-lilac-accent/20 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text side */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lilac-medium border border-lilac-dark/40 rounded-full text-xs font-semibold text-brown-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-lilac-accent fill-lilac-accent" />
                Estetik • Rapi • Worthy Gift
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brown-dark leading-tight">
                Hampersta' <br />
                <span className="text-brown-light italic font-normal font-serif">untuk</span> Momentta'
              </h1>
              
              <p className="text-base sm:text-lg text-brown-medium/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                Menyediakan rangkaian hadiah dan hampers premium yang ditata rapi, sangat estetik, dan layak dikirimkan kepada orang tersayang. Buat setiap perayaan kecil maupun besar menjadi kenangan manis yang tak terlupakan.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => scrollToSection("katalog")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brown-dark hover:bg-brown-medium text-cream rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 tracking-wide cursor-pointer"
                >
                  Lihat Paket
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollToSection("finder")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-brown-dark hover:bg-lilac-medium/30 text-brown-dark rounded-full font-bold transition-all duration-300 tracking-wide cursor-pointer"
                >
                  Cari Hampers Sesuai Budget
                </button>
              </div>

              {/* Mini highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-lilac-dark/40 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block text-2xl font-bold font-serif text-brown-dark">100%</span>
                  <span className="text-xs text-brown-light">Customizable</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-2xl font-bold font-serif text-brown-dark">Premium</span>
                  <span className="text-xs text-brown-light">Packaging</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block text-2xl font-bold font-serif text-brown-dark">Makassar</span>
                  <span className="text-xs text-brown-light">Layanan Cepat</span>
                </div>
              </div>
            </motion.div>

            {/* Photo side with premium presentation framing */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Visual shadow block */}
                <div className="absolute -inset-2 bg-lilac-medium rounded-2xl rotate-2 transform scale-102 -z-10 shadow-lg border border-lilac-dark/30" />
                
                {/* Main Image Frame */}
                <div className="bg-white p-3 rounded-3xl shadow-xl border border-lilac-medium">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-cream">
                    <img
                      src={HERO_IMAGE}
                      alt="Hampersta Hampers Box"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-brown-dark text-cream py-6 relative overflow-hidden shadow-md"
      >
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-6 md:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-cream/20">
              
              <div className="py-2 sm:py-0 px-4 flex flex-col items-center sm:items-start">
                <span className="text-xl sm:text-2xl font-serif font-bold text-lilac-medium">95%</span>
                <span className="text-xs text-cream/75 tracking-wider uppercase font-light">Kepuasan Pelanggan</span>
              </div>
              
              <div className="py-2 sm:py-0 px-4 flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-serif font-bold text-lilac-medium">&lt; Rp50k</span>
                <span className="text-xs text-cream/75 tracking-wider uppercase font-light">Harga Mulai</span>
              </div>
              
              <div className="py-2 sm:py-0 px-4 flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-serif font-bold text-lilac-medium">100+</span>
                <span className="text-xs text-cream/75 tracking-wider uppercase font-light">Pesanan Selesai</span>
              </div>

              <div className="py-2 sm:py-0 px-4 flex flex-col items-center sm:items-start">
                <span className="text-sm font-semibold text-lilac-medium">Custom Sesukamu</span>
                <span className="text-xs text-cream/75 tracking-wider uppercase font-light">Sesuai Keinginan</span>
              </div>

            </div>

            <div className="w-full md:w-auto">
              <button 
                onClick={() => scrollToSection("katalog")}
                className="w-full md:w-auto bg-cream hover:bg-white text-brown-dark px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer"
              >
                Cek Koleksi
              </button>
            </div>

          </div>
        </div>
      </motion.section>

      {/* INTERACTIVE HAMPERS FINDER (PENYARING INTERAKTIF UTAMA) */}
      <section id="finder" className="py-16 bg-cream border-y border-lilac-medium/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-brown-dark">
              Temukan Hampers Ideal-mu 🌸
            </h2>
            <p className="text-sm text-brown-medium mt-2">
              Bingung memilih? Jawab 2 pertanyaan singkat berikut untuk mencarikan paket hampers yang paling pas dengan budget dan kebutuhan acara Anda!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-lilac-medium/60 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-lilac-medium/40 rounded-bl-full -z-0" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-cream rounded-tr-full -z-0" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                
                {/* Step 0: Intro */}
                {quizStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-lilac-medium flex items-center justify-center mx-auto text-brown-dark border border-lilac-dark">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold font-serif text-brown-dark">Asisten Pencari Hadiah</h3>
                      <p className="text-sm text-brown-medium max-w-md mx-auto">
                        Kami akan menyaring database produk kami secara otomatis untuk merekomendasikan hadiah terbaik bagi orang spesial Anda.
                      </p>
                    </div>
                    <button
                      onClick={() => setQuizStep(1)}
                      className="px-8 py-3.5 bg-brown-dark hover:bg-brown-medium text-cream rounded-full font-bold text-sm tracking-wider transition-colors duration-200 cursor-pointer"
                    >
                      Mulai Sekarang
                    </button>
                  </motion.div>
                )}

                {/* Step 1: Occasion / Recipient */}
                {quizStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-lilac-medium/60 pb-3">
                      <span className="text-xs font-mono text-brown-light uppercase tracking-wider">Pertanyaan 1 dari 2</span>
                      <span className="text-xs font-bold bg-lilac-medium text-brown-dark px-2.5 py-1 rounded-full">Penerima</span>
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-brown-dark text-center">
                      Siapa penerima utama hampers ini?
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <button
                        onClick={() => handleQuizAnswer("recipient", "teman")}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-left transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-brown-medium group-hover:scale-110 transition-transform">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-brown-dark">Sahabat / Teman Kuliah</span>
                          <span className="text-xs text-brown-light">Kado wisuda, ulang tahun, sidang</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuizAnswer("recipient", "pacar")}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-left transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-brown-medium group-hover:scale-110 transition-transform">
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-brown-dark">Pasangan (Pacar/Suami/Istri)</span>
                          <span className="text-xs text-brown-light">Anniversary, valentine, ucapan sayang</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuizAnswer("recipient", "keluarga")}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-left transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-brown-medium group-hover:scale-110 transition-transform">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-brown-dark">Keluarga / Kerabat</span>
                          <span className="text-xs text-brown-light">Hantaran nikah, lebaran, atau lekas sembuh</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleQuizAnswer("recipient", "rekan")}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-left transition-all duration-200 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-brown-medium group-hover:scale-110 transition-transform">
                          <Smile className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-sm text-brown-dark">Rekan Kerja / Dosen</span>
                          <span className="text-xs text-brown-light">Ucapan terimakasih, apresiasi, pensiun</span>
                        </div>
                      </button>
                    </div>

                    <div className="flex justify-center pt-2">
                      <button 
                        onClick={() => setQuizStep(0)}
                        className="text-xs font-semibold text-brown-light hover:text-brown-dark flex items-center gap-1 cursor-pointer"
                      >
                        Kembali ke halaman awal
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Budget */}
                {quizStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-lilac-medium/60 pb-3">
                      <span className="text-xs font-mono text-brown-light uppercase tracking-wider">Pertanyaan 2 dari 2</span>
                      <span className="text-xs font-bold bg-lilac-medium text-brown-dark px-2.5 py-1 rounded-full">Budget</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-serif font-bold text-brown-dark text-center">
                      Berapa rentang budget yang Anda siapkan?
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <button
                        onClick={() => handleQuizAnswer("budget", 1)}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-center transition-all duration-200 group cursor-pointer"
                      >
                        <span className="text-xs font-mono text-brown-light uppercase mb-1">Hemat</span>
                        <span className="block font-bold text-lg text-brown-dark">&lt; Rp 50.000</span>
                        <span className="text-[11px] text-brown-light mt-2 bg-white px-2 py-0.5 rounded-full shadow-sm">Snack & Drinks</span>
                      </button>

                      <button
                        onClick={() => handleQuizAnswer("budget", 2)}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-center transition-all duration-200 group cursor-pointer"
                      >
                        <span className="text-xs font-mono text-brown-light uppercase mb-1">Standard</span>
                        <span className="block font-bold text-lg text-brown-dark">Rp 50k - Rp 100k</span>
                        <span className="text-[11px] text-brown-light mt-2 bg-white px-2 py-0.5 rounded-full shadow-sm">Mug / Candle Premium</span>
                      </button>

                      <button
                        onClick={() => handleQuizAnswer("budget", 3)}
                        className="flex flex-col items-center justify-center p-6 rounded-2xl border border-lilac-dark/40 hover:border-brown-medium hover:bg-lilac-medium/30 text-center transition-all duration-200 group cursor-pointer"
                      >
                        <span className="text-xs font-mono text-brown-light uppercase mb-1">Custom / Nego</span>
                        <span className="block font-bold text-lg text-brown-dark">Bebas / Custom</span>
                        <span className="text-[11px] text-brown-light mt-2 bg-white px-2 py-0.5 rounded-full shadow-sm">Eksklusif Bebas Pilih</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button 
                        onClick={() => setQuizStep(1)}
                        className="text-xs font-semibold text-brown-light hover:text-brown-dark cursor-pointer"
                      >
                        &larr; Kembali ke Pertanyaan 1
                      </button>
                      <button 
                        onClick={resetQuiz}
                        className="text-xs font-semibold text-brown-light hover:text-brown-dark flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Reset
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Result */}
                {quizStep === 3 && quizResult && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-lilac-medium/60 pb-3">
                      <span className="text-xs font-mono text-brown-light uppercase tracking-wider">Hasil Rekomendasi</span>
                      <span className="text-xs font-bold bg-lilac-accent/30 text-brown-dark px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 fill-brown-dark" /> Cocok 100%
                      </span>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-brown-dark">
                        Sempurna! Kami merekomendasikan:
                      </h3>
                      <p className="text-xs text-brown-light mt-1">
                        Pilihan berdasarkan kriteria budget dan kebutuhan spesial Anda
                      </p>
                    </div>

                    {/* Recommendation Card */}
                    {(() => {
                      const recommendedContents = (quizResult && DYNAMIC_CONTENTS[quizResult.id]?.[quizAnswers.recipient]) || (quizResult?.contents || []);
                      return (
                        <div className="bg-lilac-light/50 rounded-2xl p-4 sm:p-6 border border-lilac-dark/40 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          
                          {/* Image */}
                          <div className="md:col-span-5 rounded-xl overflow-hidden aspect-square shadow bg-white border border-lilac-medium">
                            <img
                              src={quizResult.image}
                              alt={quizResult.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="md:col-span-7 space-y-4">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 bg-brown-dark text-cream rounded-full text-[10px] font-bold tracking-wide uppercase">
                                {quizResult.badge}
                              </span>
                              <h4 className="text-lg font-bold text-brown-dark font-serif mt-1">{quizResult.name}</h4>
                              <p className="text-sm font-bold text-brown-light mt-0.5">{quizResult.priceLabel}</p>
                            </div>

                            <p className="text-xs sm:text-sm text-brown-medium leading-relaxed font-light">
                              {quizResult.description}
                            </p>

                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-brown-dark uppercase tracking-wider">Isi Paket Termasuk:</p>
                              <ul className="grid grid-cols-1 gap-1 text-[11px] sm:text-xs text-brown-medium">
                                {recommendedContents.slice(0, 3).map((item, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-brown-medium shrink-0" />
                                    <span className="line-clamp-1">{item}</span>
                                  </li>
                                ))}
                                {recommendedContents.length > 3 && (
                                  <li className="text-[10px] text-brown-light italic pl-5">
                                    + {recommendedContents.length - 3} item premium lainnya...
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Order button matching recommended CTA */}
                            <div className="pt-2">
                              {quizResult.ctaType === "shopee" ? (
                                <a
                                  href={quizResult.ctaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-brown-dark hover:bg-brown-medium text-cream rounded-xl font-bold text-xs tracking-wider transition-all shadow"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  Pesan & Checkout di Shopee
                                </a>
                              ) : (
                                <a
                                  href={quizResult.ctaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-brown-dark hover:bg-brown-medium text-cream rounded-xl font-bold text-xs tracking-wider transition-all shadow"
                                >
                                  <Send className="w-4 h-4" />
                                  Konsultasi via WA Gratis
                                </a>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })()}

                    <div className="flex justify-between items-center pt-2">
                      <button 
                        onClick={() => scrollToSection("katalog")}
                        className="text-xs font-semibold text-brown-dark underline hover:text-brown-light cursor-pointer"
                      >
                        Bandingkan Semua Paket di Katalog
                      </button>
                      <button 
                        onClick={resetQuiz}
                        className="text-xs font-bold bg-lilac-medium text-brown-dark px-4 py-2 rounded-full hover:bg-lilac-dark flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Ulangi Pencarian
                      </button>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* KATALOG HAMPERS SECTION */}
      <section id="katalog" className="py-16 md:py-24 bg-white scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section catalog */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-16 space-y-4"
          >
            <span className="text-xs font-mono tracking-widest text-brown-light uppercase font-bold bg-lilac-medium px-3 py-1 rounded-full">
              Koleksi Unggulan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark leading-tight">
              Etalase Digital Hampersta'
            </h2>
            <p className="text-sm sm:text-base text-brown-medium max-w-2xl mx-auto leading-relaxed">
              Pilih paket hampers yang dirancang dengan cinta dan seni estetika tinggi. Kami memastikan setiap paket dikemas sangat rapi, wangi, dan aman sampai tujuan.
            </p>
          </motion.div>

          {/* FILTERING CONTROLS (TABS & SELECTORS) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-12 bg-lilac-light/60 p-4 rounded-3xl border border-lilac-medium/40 max-w-4xl mx-auto space-y-4"
          >
            
            {/* Filter Group 1: Budget */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <span className="text-xs font-bold text-brown-light uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-lilac-accent fill-lilac-accent" /> Filter Harga:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedBudget("all")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    selectedBudget === "all"
                      ? "bg-brown-dark text-cream shadow-sm"
                      : "bg-white text-brown-dark/70 hover:bg-lilac-medium border border-lilac-medium/50"
                  }`}
                >
                  Semua Harga
                </button>
                <button
                  onClick={() => setSelectedBudget(1)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    selectedBudget === 1
                      ? "bg-brown-dark text-cream shadow-sm"
                      : "bg-white text-brown-dark/70 hover:bg-lilac-medium border border-lilac-medium/50"
                  }`}
                >
                  &lt; Rp50k
                </button>
                <button
                  onClick={() => setSelectedBudget(2)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    selectedBudget === 2
                      ? "bg-brown-dark text-cream shadow-sm"
                      : "bg-white text-brown-dark/70 hover:bg-lilac-medium border border-lilac-medium/50"
                  }`}
                >
                  Rp50k - Rp100k
                </button>
                <button
                  onClick={() => setSelectedBudget(3)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                    selectedBudget === 3
                      ? "bg-brown-dark text-cream shadow-sm"
                      : "bg-white text-brown-dark/70 hover:bg-lilac-medium border border-lilac-medium/50"
                  }`}
                >
                  Paket Custom
                </button>
              </div>
            </div>

            {/* Filter Group 2: Occasions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-lilac-medium/30">
              <span className="text-xs font-bold text-brown-light uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-lilac-accent fill-lilac-accent" /> Filter Acara:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Semua Acara" },
                  { id: "teman", label: "Sidang / Wisuda" },
                  { id: "ultah", label: "Ulang Tahun" },
                  { id: "pacar", label: "Kasih Sayang / Pasangan" },
                  { id: "keluarga", label: "Keluarga / Lebaran" },
                  { id: "rekan", label: "Rekan Kerja / Dosen" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedOccasion(item.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      selectedOccasion === item.id
                        ? "bg-brown-dark text-cream shadow-sm"
                        : "bg-white/70 text-brown-dark/70 hover:bg-lilac-medium border border-lilac-medium/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </motion.div>

          {/* DYNAMIC CATALOG CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            <AnimatePresence mode="popLayout">
              {filteredHampers.map((hamper) => (
                <motion.div
                  layout
                  key={hamper.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-cream rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-lilac-medium/50 flex flex-col h-full group"
                >
                  {/* Card Image */}
                  <div className="relative aspect-square overflow-hidden bg-white border-b border-lilac-medium/40">
                    <img
                      src={hamper.image}
                      alt={hamper.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Absolute Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-brown-dark/95 text-cream text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                        {hamper.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brown-dark flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{hamper.rating}</span>
                      <span className="text-brown-light font-normal">| {hamper.orders}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brown-dark leading-snug">
                        {hamper.name}
                      </h3>
                      <p className="text-base font-bold text-brown-light mt-1">
                        {hamper.priceLabel}
                      </p>
                    </div>

                    <p className="text-xs text-brown-medium font-light leading-relaxed">
                      {hamper.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2 pt-2 border-t border-lilac-medium/40 flex-grow">
                      <p className="text-[11px] font-bold text-brown-dark uppercase tracking-wider">Isi Kotak Hampers:</p>
                      <ul className="space-y-1.5">
                        {hamper.contents.map((content, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-brown-medium">
                            <Check className="w-4 h-4 text-brown-medium shrink-0 mt-0.5" />
                            <span>{content}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions direct redirect (No Cart, No Paywall) */}
                    <div className="pt-4">
                      {hamper.ctaType === "shopee" ? (
                        <a
                          href={hamper.ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3.5 bg-brown-dark hover:bg-brown-medium text-cream rounded-xl font-bold text-xs tracking-wider transition-all shadow duration-300 group-hover:shadow-md"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          BELI DI SHOPEE
                        </a>
                      ) : (
                        <a
                          href={hamper.ctaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3.5 bg-brown-dark hover:bg-brown-medium text-cream rounded-xl font-bold text-xs tracking-wider transition-all shadow duration-300 group-hover:shadow-md"
                        >
                          <Send className="w-4 h-4" />
                          KONSULTASI VIA WA
                        </a>
                      )}
                      
                      <p className="text-[10px] text-center text-brown-light mt-2.5 font-light">
                        *Klik tombol di atas untuk bertransaksi secara aman.
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty filter fallback */}
            {filteredHampers.length === 0 && (
              <div className="col-span-full py-16 text-center space-y-4">
                <div className="w-12 h-12 bg-lilac-medium rounded-full flex items-center justify-center mx-auto text-brown-light">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-brown-dark text-lg">Tidak ada paket yang cocok</p>
                  <p className="text-xs text-brown-light mt-1">Coba sesuaikan filter budget atau acara Anda.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedBudget("all");
                    setSelectedOccasion("all");
                  }}
                  className="px-5 py-2 bg-brown-dark text-cream text-xs font-bold rounded-full hover:bg-brown-medium cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* SECTION MANFAAT / KENAPA PILIH KAMI? */}
      <section id="manfaat" className="py-16 md:py-24 bg-lilac-light/70 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <span className="text-xs font-mono tracking-widest text-brown-light uppercase font-bold bg-lilac-medium px-3 py-1 rounded-full">
              Keunggulan Kami
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark">
              Kenapa Memilih Hampersta'?
            </h2>
            <p className="text-sm text-brown-medium max-w-xl mx-auto font-light">
              Kami percaya kado terbaik dikerjakan dengan penuh ketelitian dan perhatian khusus. Berikut adalah standar pelayanan kami.
            </p>
          </motion.div>

          {/* Grid of benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.0 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-800 mb-6 border border-amber-200">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Budget-Friendly</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Mulai dari Rp35.000 saja, Anda sudah bisa memberikan hadiah yang dikemas rapi layaknya hadiah jutaan rupiah. Tidak menguras dompet!
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-800 mb-6 border border-purple-200">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Kemasan Sangat Rapi</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Setiap lipatan kertas, letak pita satin, hingga penyusunan isi dalam box dikerjakan dengan presisi tinggi demi tampilan visual yang estetik.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-800 mb-6 border border-rose-200">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Tepat Waktu & Aman</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Dipacking dengan bubble wrap tebal berlapis-lapis untuk menjaga hampers tetap aman. Siap dikirim tepat sesuai kesepakatan momen Anda.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.0 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-800 mb-6 border border-emerald-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Gratis Custom Kartu Ucapan</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Bebas menyusun kata-kata manis Anda sendiri. Kami mencetaknya dengan font aesthetic yang rapi di atas kertas premium tebal.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-800 mb-6 border border-teal-200">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Hand-made dengan Cinta</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Setiap box hampers dirakit dengan sentuhan personal yang penuh rasa kasih. Kami peduli terhadap kebahagiaan penerima kado Anda.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-800 mb-6 border border-blue-200">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brown-dark font-serif mb-2">Respons Cepat & Ramah</h3>
              <p className="text-sm text-brown-medium leading-relaxed font-light flex-grow">
                Admin kami siap melayani diskusi, tanya jawab, atau kustomisasi pesanan Anda dengan sabar sampai Anda menemukan kombinasi kado terbaik.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* PRODUCT EDUCATION / CARA MEMESAN ("Momentta' Guide") */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-cream rounded-3xl p-8 md:p-12 border border-lilac-medium/60 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Text / Intro */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-6"
              >
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brown-light bg-white px-3 py-1 rounded-full shadow-sm">
                  Momentta' Guide
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark">
                  Bagaimana Cara Memesan Hampers di Hampersta'?
                </h2>
                <p className="text-sm text-brown-medium leading-relaxed font-light">
                  Membeli kado untuk orang spesial kini menjadi sangat mudah, menyenangkan, dan bebas repot. Kami membimbing Anda di setiap langkahnya.
                </p>
                <div className="p-4 bg-white/80 rounded-2xl border border-lilac-medium text-xs text-brown-medium font-light flex items-start gap-3">
                  <Info className="w-5 h-5 text-lilac-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>Edukasi Kepuasan:</strong> Kami selalu mengirimkan <strong>foto real-time</strong> kado hampers Anda yang sudah selesai dirakit sebelum diserahkan ke kurir atau Shopee Express demi memastikan hasil persis sesuai harapan Anda.
                  </span>
                </div>
              </motion.div>

              {/* Steps Timeline Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.0 }}
                  className="bg-white p-6 rounded-2xl border border-lilac-medium shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center text-brown-dark font-bold font-serif shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brown-dark mb-1">Pilih Paket Hadiah</h4>
                    <p className="text-xs text-brown-medium font-light leading-relaxed">
                      Eksplor menu etalase kami di atas atau manfaatkan fitur <strong>Hampers Finder</strong> kami yang otomatis mencarikan kado tercocok.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-lilac-medium shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center text-brown-dark font-bold font-serif shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brown-dark mb-1">Pilih Jalur Checkout</h4>
                    <p className="text-xs text-brown-medium font-light leading-relaxed">
                      Klik <strong>"Beli di Shopee"</strong> untuk transaksi kilat bergaransi atau klik <strong>"Konsultasi via WA"</strong> untuk paket custom sepuasnya.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl border border-lilac-medium shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center text-brown-dark font-bold font-serif shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brown-dark mb-1">Isi Detail Kartu Ucapan</h4>
                    <p className="text-xs text-brown-medium font-light leading-relaxed">
                      Tulis teks ucapan tulus Anda. Tim kami akan mendesain, melayout, dan mencetaknya rapi tanpa biaya tambahan sedikit pun.
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white p-6 rounded-2xl border border-lilac-medium shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center text-brown-dark font-bold font-serif shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-brown-dark mb-1">Review Foto & Pengiriman</h4>
                    <p className="text-xs text-brown-medium font-light leading-relaxed">
                      Dapatkan foto hampers real-time Anda untuk disetujui, lalu produk langsung meluncur via kurir instan (Makassar) atau ekspedisi terpercaya.
                    </p>
                  </div>
                </motion.div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION TESTIMONI / ULASAN ("Kata Mereka") */}
      <section id="testimoni" className="py-16 md:py-24 bg-lilac-light/50 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <span className="text-xs font-mono tracking-widest text-brown-light uppercase font-bold bg-lilac-medium px-3 py-1 rounded-full">
              Ulasan Pelanggan
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brown-dark">
              Kata Mereka yang Telah Berbagi Bahagia
            </h2>
            <p className="text-sm text-brown-medium max-w-xl mx-auto font-light">
              Kepuasan pelanggan adalah prioritas mutlak kami. Simak cerita kebahagiaan dari pembeli asli kami di bawah ini.
            </p>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.0 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-brown-medium italic font-light leading-relaxed">
                  "Suka sekali belanja di Hampersta'! Pilih Paket Hemat di bawah 50 ribu tapi tampilannya mewah sekali. Box-nya wangi, pitanya rapi, dan kartu ucapannya estetik banget. Temanku yang wisuda senang sekali."
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-lilac-medium/40">
                <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center font-bold text-brown-dark text-sm">
                  AR
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brown-dark">Andi Rania</h4>
                  <span className="text-[10px] text-brown-light uppercase tracking-wider block">Mahasiswa Unhas, Makassar</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-brown-medium italic font-light leading-relaxed">
                  "Kemarin pesan Paket Standard isi mug keramik untuk anniversary. Pelayanannya sangat memuaskan, adminnya ramah mengirimkan foto hampers real sebelum dipack kirim. Bubble wrap tebal sekali aman sampai Gowa."
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-lilac-medium/40">
                <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center font-bold text-brown-dark text-sm">
                  FF
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brown-dark">Fajar Firdaus</h4>
                  <span className="text-[10px] text-brown-light uppercase tracking-wider block">Swasta, Gowa</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-3xl border border-lilac-medium/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-brown-medium italic font-light leading-relaxed">
                  "Sangat merekomendasikan Paket Custom di Hampersta'. Saya pesan hampers rotan isi sajadah & tumbler untuk kado pernikahan sepupu, hasilnya luar biasa estetik dan elegan. Nego harganya gampang dan bersahabat!"
                </p>
              </div>
              <div className="flex items-center gap-3.5 mt-8 pt-4 border-t border-lilac-medium/40">
                <div className="w-10 h-10 rounded-full bg-lilac-medium flex items-center justify-center font-bold text-brown-dark text-sm">
                  HS
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-brown-dark">Hj. Syarifah</h4>
                  <span className="text-[10px] text-brown-light uppercase tracking-wider block">Ibu Rumah Tangga, Makassar</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Shopee / WA trust footer inside testimoni */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 bg-white rounded-2xl p-6 border border-lilac-medium/80 text-center max-w-2xl mx-auto shadow-sm"
          >
            <p className="text-xs text-brown-medium leading-relaxed font-light">
              Telah dipercaya mengirimkan kebahagiaan ke wilayah Makassar, Gowa, Maros, dan sekitarnya. Semua ulasan di atas adalah ulasan jujur bergaransi kepuasan 100%!
            </p>
          </motion.div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-cream border-t border-lilac-medium/50 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h2 className="font-serif text-3xl font-bold text-brown-dark">
            Kirimkan Senyuman Manis Hari Ini 🌸
          </h2>
          <p className="text-sm sm:text-base text-brown-medium max-w-xl mx-auto leading-relaxed font-light">
            Jangan biarkan momen spesial lewat begitu saja. Hubungi kami sekarang atau kunjungi Shopee untuk segera mengamankan hampers estetik impian Anda!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="https://shopee.co.id/search?keyword=hampers+aesthetic"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brown-dark hover:bg-brown-medium text-cream rounded-full font-bold text-sm tracking-wide transition-all shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Beli Langsung di Shopee
            </a>
            <a
              href="https://wa.me/628123456789?text=Halo%20Hampersta'%2C%20saya%20mau%20konsultasi%20tentang%20hampers%20custom%20dong"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-brown-dark text-brown-dark rounded-full font-bold text-sm tracking-wide hover:bg-brown-dark hover:text-cream transition-all shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Konsultasi WhatsApp Gratis
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brown-dark text-cream pt-16 pb-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-cream/20 pb-12 mb-8">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center border border-brown-light/20 p-1">
                  <HamperstaLogo className="w-full h-full text-brown-dark" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-cream">
                  Hampersta<span className="text-lilac-accent">'</span>
                </span>
              </div>
              
              <p className="text-xs text-cream/75 leading-relaxed font-light max-w-sm">
                Hampersta' adalah spesialis hampers premium, kado wisuda, kado ultah, dan hantaran estetik dengan pengemasan hand-made super rapi dan harga yang sangat bersahabat bagi kantong Anda.
              </p>

              <div className="pt-2 text-[11px] font-mono text-cream/60 uppercase tracking-widest">
                Makassar • Sulawesi Selatan
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-serif font-bold text-sm text-lilac-medium uppercase tracking-wider">Navigasi Cepat</h4>
              <ul className="space-y-2 text-xs text-cream/80 font-light">
                <li>
                  <button onClick={() => scrollToSection("hero")} className="hover:text-lilac-accent hover:underline cursor-pointer">
                    Halaman Utama
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("finder")} className="hover:text-lilac-accent hover:underline cursor-pointer">
                    Hampers Finder
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("katalog")} className="hover:text-lilac-accent hover:underline cursor-pointer">
                    Paket Katalog
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("manfaat")} className="hover:text-lilac-accent hover:underline cursor-pointer">
                    Kenapa Pilih Hampersta'
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("testimoni")} className="hover:text-lilac-accent hover:underline cursor-pointer">
                    Testimoni Pelanggan
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact / Info Column */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif font-bold text-sm text-lilac-medium uppercase tracking-wider">Informasi Kontak</h4>
              <ul className="space-y-3 text-xs text-cream/80 font-light">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4.5 h-4.5 text-lilac-accent shrink-0 mt-0.5" />
                  <span>Kec. Rappocini, Kota Makassar, Sulawesi Selatan, Indonesia (90222)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-lilac-accent shrink-0" />
                  <span>halo@hampersta.com</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Smartphone className="w-4.5 h-4.5 text-lilac-accent shrink-0" />
                  <span>+62 812-3456-789</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar copyright & terms */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cream/60">
            <div>
              &copy; {new Date().getFullYear()} Hampersta' Premium Gift Store. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span className="font-mono text-[9px] uppercase tracking-wider text-lilac-accent">Aesthetic hampers for momentta'</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
