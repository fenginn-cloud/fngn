export type Lang = "en" | "tr";

export interface HeadlineToken {
  text: string;
  accent?: boolean;
}

const en = {
  nav: {
    links: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Expertise", href: "#expertise" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
    letsTalk: "Let's talk",
    home: "home",
  },
  hero: {
    badge: "Available for select projects",
    headlineTokens: [
      { text: "Digital" },
      { text: "Designer" },
      { text: "&" },
      { text: "Creative", accent: true },
      { text: "Technologist", accent: true },
    ] as HeadlineToken[],
    subhead:
      "I create digital experiences, visual identities and software-driven solutions for brands, real estate businesses and modern products.",
    viewProjects: "View Projects",
    getInTouch: "Get In Touch",
    scroll: "Scroll",
  },
  stats: {
    items: [
      { value: 50, suffix: "+", label: "Design Projects" },
      { value: 20, suffix: "+", label: "Web Projects" },
      { value: 5, suffix: "+", label: "Brand Identity Systems" },
      { value: 100, suffix: "+", label: "Social Media Designs" },
    ],
  },
  about: {
    eyebrow: "About",
    title:
      "A multidisciplinary creative working where design meets technology.",
    p1: "Mahmud Feyzullah Engin is a multidisciplinary creative professional working at the intersection of design, technology and digital marketing. His work spans web design, software interfaces, branding, social media campaigns and real estate marketing solutions.",
    p2: "The goal is always the same — work that performs as beautifully as it looks, built with intention from the first idea to the final pixel.",
    tags: ["Design", "Technology", "Branding", "Marketing", "Real Estate"],
    experienceEyebrow: "Experience",
    timeline: [
      {
        company: "RE/MAX Dream",
        role: "Social Media & IT",
        description:
          "Driving social media strategy, creative production and IT operations for a leading real estate brand.",
      },
      {
        company: "Ertemel Investment",
        role: "Marketing & Design",
        description:
          "Leading marketing creative and brand communication for an investment-focused real estate venture.",
      },
      {
        company: "Cabir Group",
        role: "Visual Design",
        description:
          "Producing visual design and brand collateral across the group's ventures.",
      },
      {
        company: "TRT",
        role: "Broadcast Coordination",
        description:
          "Broadcast coordination experience within Türkiye's national public broadcaster.",
      },
      {
        company: "Ipsi Initiative",
        role: "Social Media Editor",
        description:
          "Editing and shaping social media content for a purpose-driven initiative.",
      },
      {
        company: "Copy BA",
        role: "Graphic Designer & Illustrator",
        description:
          "Crafting graphic design systems and original illustration work for clients.",
      },
    ],
    languagesEyebrow: "Languages",
    languages: [
      { name: "Turkish", level: "Native", value: 100 },
      { name: "English", level: "C1 · Advanced", value: 85 },
      { name: "Bosnian", level: "A2 · Elementary", value: 35 },
    ],
  },
  expertise: {
    eyebrow: "Expertise",
    title: "Capabilities that span the whole creative stack.",
    description:
      "From the first strategic idea to a shipped, production-grade product — design, brand and code under one roof.",
    items: [
      {
        title: "UI/UX Design",
        description:
          "Intuitive interfaces and product flows built around real user behaviour and clarity.",
      },
      {
        title: "Web Design",
        description:
          "High-end marketing sites and web experiences that convert and feel alive.",
      },
      {
        title: "Software Interfaces",
        description:
          "Dashboards, tools and SaaS surfaces designed for speed and confidence.",
      },
      {
        title: "Brand Identity",
        description:
          "Logos, systems and guidelines that give brands a distinct, lasting voice.",
      },
      {
        title: "Social Media Design",
        description:
          "Scroll-stopping campaign systems engineered for reach and recognition.",
      },
      {
        title: "Creative Direction",
        description:
          "Holistic art direction that aligns visuals, message and business goals.",
      },
      {
        title: "Motion Graphics",
        description:
          "Kinetic typography and animation that bring static identities to life.",
      },
      {
        title: "Real Estate Marketing",
        description:
          "Listing, residence and development campaigns that sell the experience.",
      },
      {
        title: "Frontend Development",
        description:
          "Production React / Next.js builds — pixel-faithful, fast and accessible.",
      },
    ],
  },
  clients: {
    eyebrow: "Featured Clients & Projects",
    title: "Trusted by brands building something lasting.",
    description:
      "A selection of clients and ventures across real estate, sport, product and digital.",
    items: [
      { name: "RE/MAX Dream", field: "Real Estate" },
      { name: "Dream Residence", field: "Residential Development" },
      { name: "Eksado", field: "Product & Industry" },
      { name: "Sapanca Kurtköyspor", field: "Sports Club" },
      { name: "Hece Group", field: "Holding" },
      { name: "Kartvizit.up", field: "Digital Business Cards" },
    ],
  },
  work: {
    eyebrow: "Selected Works",
    title: "A curated body of design, brand and digital work.",
    description:
      "Filter by discipline to explore case studies across branding, product, real estate and more.",
    filterAll: "All",
    viewCaseStudy: "View Case Study",
    behance: "Behance",
  },
  process: {
    eyebrow: "Process",
    title: "A clear path from idea to launch.",
    description:
      "A focused four-step method that keeps work strategic, considered and on time.",
    items: [
      {
        step: "01",
        title: "Discover",
        description:
          "Deep research into goals, audience and market to define the strategic foundation.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "Concepts, systems and high-fidelity design that translate strategy into form.",
      },
      {
        step: "03",
        title: "Build",
        description:
          "Production-grade development and asset delivery, faithful to the design vision.",
      },
      {
        step: "04",
        title: "Launch",
        description:
          "Refinement, handoff and launch support — built to perform from day one.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build work that performs as beautifully as it looks.",
    description:
      "Have a project, a brand or a product in mind? I'd love to hear about it. Reach out through any channel below.",
    startProject: "Start a project",
    labels: {
      email: "Email",
      phone: "Phone",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      behance: "Behance",
    },
    copy: "Copy",
  },
  footer: {
    tagline: ["Designed with purpose.", "Built with precision.", "Crafted by FNGN."],
    navHeading: "Navigate",
    navLinks: [
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Expertise", href: "#expertise" },
      { label: "Contact", href: "#contact" },
    ],
    connectHeading: "Connect",
    rights: "© 2026 FNGN. All rights reserved.",
  },
  caseStudy: {
    allWork: "All Work",
    overview: "Overview",
    challenge: "Challenge",
    solution: "Solution",
    toolsUsed: "Tools Used",
    results: "Results",
    gallery: "Gallery",
    galleryNote: {
      pre: "Gallery is image-ready — drop files in",
      mid: "and list them in",
      post: ".",
    },
    nextProject: "Next Project",
    meta: {
      client: "Client",
      year: "Year",
      discipline: "Discipline",
      role: "Role",
      roleValue: "Design & Direction",
    },
    viewOnBehance: "View on Behance",
  },
  categories: {
    Branding: "Branding",
    "UI/UX": "UI/UX",
    "Social Media": "Social Media",
    "Real Estate": "Real Estate",
    Motion: "Motion",
    "Web Design": "Web Design",
  } as Record<string, string>,
  switcher: { label: "Language", en: "EN", tr: "TR" },
};

export type Dict = typeof en;

const tr: Dict = {
  nav: {
    links: [
      { label: "İşler", href: "#work" },
      { label: "Hakkımda", href: "#about" },
      { label: "Uzmanlık", href: "#expertise" },
      { label: "Süreç", href: "#process" },
      { label: "İletişim", href: "#contact" },
    ],
    letsTalk: "İletişime geç",
    home: "ana sayfa",
  },
  hero: {
    badge: "Seçili projeler için müsait",
    headlineTokens: [
      { text: "Dijital" },
      { text: "Tasarımcı" },
      { text: "&" },
      { text: "Kreatif", accent: true },
      { text: "Teknolog", accent: true },
    ],
    subhead:
      "Markalar, gayrimenkul işletmeleri ve modern ürünler için dijital deneyimler, görsel kimlikler ve yazılım odaklı çözümler tasarlıyorum.",
    viewProjects: "Projeleri Gör",
    getInTouch: "İletişime Geç",
    scroll: "Kaydır",
  },
  stats: {
    items: [
      { value: 50, suffix: "+", label: "Tasarım Projesi" },
      { value: 20, suffix: "+", label: "Web Projesi" },
      { value: 5, suffix: "+", label: "Marka Kimliği Sistemi" },
      { value: 100, suffix: "+", label: "Sosyal Medya Tasarımı" },
    ],
  },
  about: {
    eyebrow: "Hakkımda",
    title:
      "Tasarımın teknolojiyle buluştuğu noktada çalışan çok disiplinli bir kreatif.",
    p1: "Mahmud Feyzullah Engin; tasarım, teknoloji ve dijital pazarlamanın kesişiminde çalışan çok disiplinli bir kreatif profesyoneldir. Çalışmaları web tasarımı, yazılım arayüzleri, marka kimliği, sosyal medya kampanyaları ve gayrimenkul pazarlama çözümlerini kapsar.",
    p2: "Amaç her zaman aynı — göründüğü kadar iyi performans gösteren, ilk fikirden son piksele kadar bilinçli kurgulanmış işler üretmek.",
    tags: ["Tasarım", "Teknoloji", "Marka", "Pazarlama", "Gayrimenkul"],
    experienceEyebrow: "Deneyim",
    timeline: [
      {
        company: "RE/MAX Dream",
        role: "Sosyal Medya & BT",
        description:
          "Önde gelen bir gayrimenkul markası için sosyal medya stratejisi, kreatif üretim ve BT operasyonlarını yönetmek.",
      },
      {
        company: "Ertemel Investment",
        role: "Pazarlama & Tasarım",
        description:
          "Yatırım odaklı bir gayrimenkul girişimi için pazarlama kreatifi ve marka iletişimini yürütmek.",
      },
      {
        company: "Cabir Group",
        role: "Görsel Tasarım",
        description:
          "Grubun girişimleri genelinde görsel tasarım ve marka materyalleri üretmek.",
      },
      {
        company: "TRT",
        role: "Yayın Koordinasyonu",
        description:
          "Türkiye'nin ulusal kamu yayıncısında yayın koordinasyonu deneyimi.",
      },
      {
        company: "Ipsi Initiative",
        role: "Sosyal Medya Editörü",
        description:
          "Amaç odaklı bir girişim için sosyal medya içeriklerini düzenlemek ve şekillendirmek.",
      },
      {
        company: "Copy BA",
        role: "Grafik Tasarımcı & İllüstratör",
        description:
          "Müşteriler için grafik tasarım sistemleri ve özgün illüstrasyon çalışmaları üretmek.",
      },
    ],
    languagesEyebrow: "Diller",
    languages: [
      { name: "Türkçe", level: "Ana dil", value: 100 },
      { name: "İngilizce", level: "C1 · İleri", value: 85 },
      { name: "Boşnakça", level: "A2 · Başlangıç", value: 35 },
    ],
  },
  expertise: {
    eyebrow: "Uzmanlık",
    title: "Tüm kreatif yelpazeyi kapsayan yetkinlikler.",
    description:
      "İlk stratejik fikirden, yayına hazır profesyonel ürüne kadar — tasarım, marka ve kod tek çatı altında.",
    items: [
      {
        title: "UI/UX Tasarımı",
        description:
          "Gerçek kullanıcı davranışı ve sadelik üzerine kurulu sezgisel arayüzler ve ürün akışları.",
      },
      {
        title: "Web Tasarımı",
        description:
          "Dönüşüm sağlayan ve canlı hisseden üst düzey tanıtım siteleri ve web deneyimleri.",
      },
      {
        title: "Yazılım Arayüzleri",
        description:
          "Hız ve güven için tasarlanmış paneller, araçlar ve SaaS ekranları.",
      },
      {
        title: "Marka Kimliği",
        description:
          "Markalara ayırt edici ve kalıcı bir ses kazandıran logolar, sistemler ve kılavuzlar.",
      },
      {
        title: "Sosyal Medya Tasarımı",
        description:
          "Erişim ve tanınırlık için kurgulanmış, akışı durduran kampanya sistemleri.",
      },
      {
        title: "Kreatif Direksiyon",
        description:
          "Görseli, mesajı ve iş hedeflerini hizalayan bütünsel sanat yönetimi.",
      },
      {
        title: "Hareketli Grafik",
        description:
          "Statik kimlikleri hayata geçiren kinetik tipografi ve animasyon.",
      },
      {
        title: "Gayrimenkul Pazarlama",
        description:
          "Deneyimi satan ilan, rezidans ve proje kampanyaları.",
      },
      {
        title: "Frontend Geliştirme",
        description:
          "Üretim seviyesinde React / Next.js geliştirme — piksele sadık, hızlı ve erişilebilir.",
      },
    ],
  },
  clients: {
    eyebrow: "Öne Çıkan Müşteriler & Projeler",
    title: "Kalıcı işler kuran markaların güvendiği isim.",
    description:
      "Gayrimenkul, spor, ürün ve dijital alanlardan seçili müşteriler ve girişimler.",
    items: [
      { name: "RE/MAX Dream", field: "Gayrimenkul" },
      { name: "Dream Residence", field: "Konut Geliştirme" },
      { name: "Eksado", field: "Ürün & Endüstri" },
      { name: "Sapanca Kurtköyspor", field: "Spor Kulübü" },
      { name: "Hece Group", field: "Holding" },
      { name: "Kartvizit.up", field: "Dijital Kartvizit" },
    ],
  },
  work: {
    eyebrow: "Seçili İşler",
    title: "Tasarım, marka ve dijital işlerden özenle seçilmiş bir derleme.",
    description:
      "Marka, ürün, gayrimenkul ve daha fazlasındaki vaka çalışmalarını keşfetmek için disipline göre filtrele.",
    filterAll: "Tümü",
    viewCaseStudy: "Vaka Çalışmasını Gör",
    behance: "Behance",
  },
  process: {
    eyebrow: "Süreç",
    title: "Fikirden yayına net bir yol.",
    description:
      "İşi stratejik, özenli ve zamanında tutan, dört adımlı odaklı bir yöntem.",
    items: [
      {
        step: "01",
        title: "Keşfet",
        description:
          "Stratejik temeli belirlemek için hedef, kitle ve pazara dair derin araştırma.",
      },
      {
        step: "02",
        title: "Tasarla",
        description:
          "Stratejiyi forma dönüştüren konseptler, sistemler ve yüksek çözünürlüklü tasarım.",
      },
      {
        step: "03",
        title: "İnşa Et",
        description:
          "Tasarım vizyonuna sadık, üretim seviyesinde geliştirme ve materyal teslimi.",
      },
      {
        step: "04",
        title: "Yayınla",
        description:
          "İnce ayar, teslim ve yayın desteği — ilk günden performans için kurgulandı.",
      },
    ],
  },
  contact: {
    eyebrow: "İletişim",
    title: "Göründüğü kadar iyi performans gösteren işler üretelim.",
    description:
      "Aklında bir proje, marka ya da ürün mü var? Duymak isterim. Aşağıdaki kanallardan birinden bana ulaş.",
    startProject: "Projeye başla",
    labels: {
      email: "E-posta",
      phone: "Telefon",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      behance: "Behance",
    },
    copy: "Kopyala",
  },
  footer: {
    tagline: ["Amaçla tasarlandı.", "Özenle inşa edildi.", "FNGN tarafından üretildi."],
    navHeading: "Gezin",
    navLinks: [
      { label: "İşler", href: "#work" },
      { label: "Hakkımda", href: "#about" },
      { label: "Uzmanlık", href: "#expertise" },
      { label: "İletişim", href: "#contact" },
    ],
    connectHeading: "Bağlan",
    rights: "© 2026 FNGN. Tüm hakları saklıdır.",
  },
  caseStudy: {
    allWork: "Tüm İşler",
    overview: "Genel Bakış",
    challenge: "Zorluk",
    solution: "Çözüm",
    toolsUsed: "Kullanılan Araçlar",
    results: "Sonuçlar",
    gallery: "Galeri",
    galleryNote: {
      pre: "Galeri görsele hazır — dosyaları şuraya koy:",
      mid: "ve şurada listele:",
      post: ".",
    },
    nextProject: "Sonraki Proje",
    meta: {
      client: "Müşteri",
      year: "Yıl",
      discipline: "Disiplin",
      role: "Rol",
      roleValue: "Tasarım & Yönetim",
    },
    viewOnBehance: "Behance'te Gör",
  },
  categories: {
    Branding: "Marka",
    "UI/UX": "UI/UX",
    "Social Media": "Sosyal Medya",
    "Real Estate": "Gayrimenkul",
    Motion: "Motion",
    "Web Design": "Web Tasarımı",
  },
  switcher: { label: "Dil", en: "EN", tr: "TR" },
};

export const dictionaries: Record<Lang, Dict> = { en, tr };
