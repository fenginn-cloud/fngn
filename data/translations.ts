export type Lang = "en" | "tr";

export interface HeadlineToken {
  text: string;
  accent?: boolean;
}

const en = {
  nav: {
    links: [
      { label: "Work", href: "/#work" },
      { label: "Services", href: "/#services" },
      { label: "About", href: "/#about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/#contact" },
    ],
    letsTalk: "Let's talk",
    home: "home",
  },
  hero: {
    badge: "Digital Design Studio",
    titleBold: "We transform your ideas",
    titleItalic: "into digital experiences.",
    subhead:
      "We craft websites, brands and digital solutions that feel considered, not rushed — for businesses that care about design.",
    viewProjects: "View Projects",
    getInTouch: "Get In Touch",
    scroll: "Scroll",
  },
  stats: {
    items: [
      { value: 50, suffix: "+", label: "Design Projects" },
      { value: 100, suffix: "+", label: "Web Projects" },
      { value: 20, suffix: "+", label: "Brand Identity Systems" },
      { value: 1000, suffix: "+", label: "Social Media Designs" },
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
    downloadCv: "Download CV",
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
      "Have a project, a brand or a product in mind? We'd love to hear about it. Reach out through any channel below.",
    startProject: "Start a project",
    labels: {
      email: "Email",
      phone: "Phone",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      behance: "Behance",
    },
    copy: "Copy",
    form: {
      name: "Your name",
      email: "Your email",
      message: "Tell me about your project",
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks! Your message is on its way — we'll reply soon.",
      error: "Something went wrong. Please email hello@fngn.com.tr instead.",
    },
  },
  footer: {
    tagline: ["Designed with purpose.", "Built with precision.", "Crafted by FNGN."],
    navHeading: "Navigate",
    navLinks: [
      { label: "Work", href: "/#work" },
      { label: "Services", href: "/#services" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/#contact" },
    ],
    connectHeading: "Connect",
    rights: "© 2026 FNGN. All rights reserved.",
    privacy: "Privacy & Cookies",
    cookiePrefs: "Cookie settings",
  },
  consent: {
    title: "We value your privacy",
    text: "We use cookies to measure site traffic with Google Analytics and improve your experience. Analytics only runs if you accept. You can change your choice anytime.",
    accept: "Accept",
    reject: "Reject",
    learnMore: "Learn more",
  },
  privacy: {
    title: "Privacy & Cookie Policy",
    updated: "Last updated: 16 October 2026",
    backHome: "Back home",
    sections: [
      {
        heading: "Who we are",
        body: "This website (fngn.com.tr) is operated by Mahmud Feyzullah Engin (FNGN), the data controller. For any request you can reach us at hello@fngn.com.tr.",
      },
      {
        heading: "What data we collect",
        body: "We do not ask for personal data to browse this site. We collect anonymous, aggregated usage statistics (pages viewed, approximate country, device type, referring site) to understand how the site is used.",
      },
      {
        heading: "Cookies & analytics",
        body: "Vercel Web Analytics runs without cookies and does not identify you. Google Analytics is only loaded after you click “Accept”, and sets cookies to measure visits with an anonymised IP address. If you click “Reject”, no analytics cookies are set.",
      },
      {
        heading: "Legal basis (KVKK / GDPR)",
        body: "Analytics cookies are processed based on your explicit consent, in line with Türkiye's KVKK (Law No. 6698) and the GDPR. Cookieless, aggregated measurement is used for our legitimate interest in operating the site.",
      },
      {
        heading: "Your rights",
        body: "Under KVKK Article 11 and the GDPR you may ask what data is processed, request correction or deletion, and withdraw consent at any time via the “Cookie settings” link in the footer. To exercise your rights, email hello@fngn.com.tr.",
      },
      {
        heading: "Contact",
        body: "Mahmud Feyzullah Engin — Sakarya, Türkiye — hello@fngn.com.tr",
      },
    ],
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
  whatsapp: {
    aria: "Message on WhatsApp",
    label: "WhatsApp",
    message: "Hi Mahmud, I'd like to talk about a project with you.",
  },
  services: {
    eyebrow: "Services",
    title: "What we can do for your brand.",
    description:
      "Clear, end-to-end offerings — pick a single focus or combine them into a full engagement.",
    cta: "Discuss a project",
    items: [
      {
        title: "Brand & Identity",
        description:
          "A distinctive identity system your brand can grow with.",
        points: [
          "Logo & wordmark",
          "Brand guidelines",
          "Color & type system",
          "Templates & assets",
        ],
      },
      {
        title: "Web & Interface",
        description:
          "High-end websites and product interfaces, designed and built.",
        points: [
          "Landing & corporate sites",
          "UI/UX design",
          "Frontend (Next.js)",
          "Fast & responsive",
        ],
      },
      {
        title: "Social Media & Content",
        description:
          "A recognisable, scalable content system that performs.",
        points: [
          "Post & campaign templates",
          "Content direction",
          "Monthly design support",
          "Ad creatives",
        ],
      },
      {
        title: "Real Estate Marketing",
        description:
          "Marketing that sells the experience, not just the property.",
        points: [
          "Listing & residence campaigns",
          "Project branding",
          "Social & print collateral",
          "Launch support",
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    description:
      "A few words from the brands and teams I've worked with.",
    items: [
      {
        name: "RE/MAX Dream",
        field: "Real Estate",
        quote:
          "Since we started working with FNGN Dijital, our social media has taken on a far more professional and corporate look. A team that understands the dynamics of real estate and adds value to our brand with creative ideas and quality content.",
      },
      {
        name: "Sapanca Realty",
        field: "Real Estate",
        quote:
          "Having our brand represented correctly in the digital world mattered to us. FNGN Dijital delivered work that met our expectations with original designs, compelling content and great attention to detail. They bring a professional approach at every stage.",
      },
      {
        name: "Kent Emlak",
        field: "Real Estate",
        quote:
          "On social media it's not only about being visible, but about building a trustworthy brand identity. FNGN Dijital carried our corporate presence onto digital platforms with content suited to our sector and a modern design approach. A team that does its work with care.",
      },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions.",
    description: "Everything you might want to know before we start.",
    items: [
      {
        q: "Which services do you offer?",
        a: "Brand identity, web design & development, UI/UX, social media design and real estate marketing — handled end to end, from strategy to delivery.",
      },
      {
        q: "How does a project work?",
        a: "Four clear steps: Discover, Design, Build, Launch. We start with a short conversation about your goals, then share a plan, timeline and quote before any work begins.",
      },
      {
        q: "How long does a project take?",
        a: "A logo or identity is roughly 1–2 weeks, a website around 2–4 weeks, and social media is ongoing monthly support. The exact timing depends on the scope.",
      },
      {
        q: "Which languages do you work in?",
        a: "We work in Turkish (native level) and English (C1 · Advanced), comfortably with both local and international clients.",
      },
      {
        q: "Do you work remotely?",
        a: "Yes — we're based in Sakarya, Türkiye and work with clients across Türkiye and abroad, fully remotely.",
      },
      {
        q: "How do I get a quote or start?",
        a: "Message us on WhatsApp or email hello@fngn.com.tr with a few words about your project. We'll reply with the next steps and a tailored quote.",
      },
    ],
  },
  blog: {
    eyebrow: "Blog",
    title: "Notes on design, brand & marketing.",
    description:
      "Practical thoughts on branding, social media and digital — for brands and real estate.",
    readMore: "Read",
    backToBlog: "All posts",
    minRead: "min read",
    backHome: "Back home",
  },
  assistant: {
    aria: "Open chat",
    title: "FNGN Assistant",
    subtitle: "Typically replies in minutes",
    greeting:
      "Hi! 👋 How can we help? Pick a question below, or reach us directly.",
    quick: "Quick questions",
    whatsapp: "Chat on WhatsApp",
    email: "Send an email",
    close: "Close",
  },
};

export type Dict = typeof en;

const tr: Dict = {
  nav: {
    links: [
      { label: "İşler", href: "/#work" },
      { label: "Hizmetler", href: "/#services" },
      { label: "Hakkımda", href: "/#about" },
      { label: "Blog", href: "/blog" },
      { label: "İletişim", href: "/#contact" },
    ],
    letsTalk: "İletişime geç",
    home: "ana sayfa",
  },
  hero: {
    badge: "Dijital Tasarım Stüdyosu",
    titleBold: "Fikirlerinizi dijital deneyimlere",
    titleItalic: "dönüştürüyoruz.",
    subhead:
      "Markalar, gayrimenkul ve modern ürünler için aceleye gelmemiş, özenle kurgulanmış web siteleri, kimlikler ve dijital çözümler üretiyoruz.",
    viewProjects: "Projeleri Gör",
    getInTouch: "İletişime Geç",
    scroll: "Kaydır",
  },
  stats: {
    items: [
      { value: 50, suffix: "+", label: "Tasarım Projesi" },
      { value: 100, suffix: "+", label: "Web Projesi" },
      { value: 20, suffix: "+", label: "Marka Kimliği Sistemi" },
      { value: 1000, suffix: "+", label: "Sosyal Medya Tasarımı" },
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
    downloadCv: "CV İndir",
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
      "Aklında bir proje, marka ya da ürün mü var? Duymak isteriz. Aşağıdaki kanallardan birinden bize ulaş.",
    startProject: "Projeye başla",
    labels: {
      email: "E-posta",
      phone: "Telefon",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      behance: "Behance",
    },
    copy: "Kopyala",
    form: {
      name: "Adın",
      email: "E-posta adresin",
      message: "Projenden kısaca bahset",
      submit: "Mesaj gönder",
      sending: "Gönderiliyor…",
      success: "Teşekkürler! Mesajın yola çıktı — en kısa sürede döneceğiz.",
      error: "Bir şeyler ters gitti. Bunun yerine hello@fngn.com.tr adresine yazabilirsin.",
    },
  },
  footer: {
    tagline: ["Amaçla tasarlandı.", "Özenle inşa edildi.", "FNGN tarafından üretildi."],
    navHeading: "Gezin",
    navLinks: [
      { label: "İşler", href: "/#work" },
      { label: "Hizmetler", href: "/#services" },
      { label: "Blog", href: "/blog" },
      { label: "İletişim", href: "/#contact" },
    ],
    connectHeading: "Bağlan",
    rights: "© 2026 FNGN. Tüm hakları saklıdır.",
    privacy: "Gizlilik & Çerezler",
    cookiePrefs: "Çerez ayarları",
  },
  consent: {
    title: "Gizliliğinize önem veriyoruz",
    text: "Site trafiğini Google Analytics ile ölçmek ve deneyiminizi iyileştirmek için çerez kullanıyoruz. Analitik yalnızca kabul ederseniz çalışır. Tercihinizi istediğiniz zaman değiştirebilirsiniz.",
    accept: "Kabul Et",
    reject: "Reddet",
    learnMore: "Detaylı bilgi",
  },
  privacy: {
    title: "Gizlilik & Çerez Politikası",
    updated: "Son güncelleme: 16 Ekim 2026",
    backHome: "Ana sayfaya dön",
    sections: [
      {
        heading: "Biz kimiz",
        body: "Bu web sitesi (fngn.com.tr) veri sorumlusu Mahmud Feyzullah Engin (FNGN) tarafından işletilmektedir. Her türlü talebiniz için hello@fngn.com.tr adresinden bize ulaşabilirsiniz.",
      },
      {
        heading: "Hangi verileri topluyoruz",
        body: "Siteyi gezmek için sizden kişisel veri istemiyoruz. Sitenin nasıl kullanıldığını anlamak amacıyla anonim ve toplu kullanım istatistikleri (görüntülenen sayfalar, yaklaşık ülke, cihaz türü, yönlendiren site) topluyoruz.",
      },
      {
        heading: "Çerezler & analitik",
        body: "Vercel Web Analytics çerez kullanmaz ve sizi tanımlamaz. Google Analytics yalnızca siz “Kabul Et” dedikten sonra yüklenir ve ziyaretleri anonimleştirilmiş IP adresiyle ölçmek için çerez kullanır. “Reddet” derseniz hiçbir analitik çerez yerleştirilmez.",
      },
      {
        heading: "Hukuki dayanak (KVKK / GDPR)",
        body: "Analitik çerezler, 6698 sayılı KVKK ve GDPR uyarınca açık rızanıza dayanılarak işlenir. Çerezsiz ve toplu ölçüm, siteyi işletmeye yönelik meşru menfaatimiz kapsamında kullanılır.",
      },
      {
        heading: "Haklarınız",
        body: "KVKK 11. madde ve GDPR kapsamında; hangi verilerin işlendiğini öğrenme, düzeltilmesini veya silinmesini isteme ve rızanızı dilediğiniz zaman geri çekme hakkınız vardır. Rızanızı footer'daki “Çerez ayarları” bağlantısından geri çekebilirsiniz. Haklarınızı kullanmak için hello@fngn.com.tr adresine yazın.",
      },
      {
        heading: "İletişim",
        body: "Mahmud Feyzullah Engin — Sakarya, Türkiye — hello@fngn.com.tr",
      },
    ],
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
  whatsapp: {
    aria: "WhatsApp'tan yaz",
    label: "WhatsApp",
    message: "Merhaba Mahmud, sizinle bir proje hakkında konuşmak istiyorum.",
  },
  services: {
    eyebrow: "Hizmetler",
    title: "Markan için neler yapabiliriz.",
    description:
      "Net, uçtan uca hizmetler — tek bir alana odaklan ya da hepsini birleştirip tam kapsamlı çalışalım.",
    cta: "Proje konuşalım",
    items: [
      {
        title: "Marka & Kimlik",
        description: "Markanın birlikte büyüyebileceği ayırt edici bir kimlik sistemi.",
        points: [
          "Logo & logotype",
          "Marka kılavuzu",
          "Renk & tipografi sistemi",
          "Şablonlar & materyaller",
        ],
      },
      {
        title: "Web & Arayüz",
        description: "Tasarlanıp geliştirilen üst düzey web siteleri ve ürün arayüzleri.",
        points: [
          "Tanıtım & kurumsal site",
          "UI/UX tasarımı",
          "Frontend (Next.js)",
          "Hızlı & duyarlı",
        ],
      },
      {
        title: "Sosyal Medya & İçerik",
        description: "Tanınabilir, ölçeklenebilir ve sonuç getiren bir içerik sistemi.",
        points: [
          "Gönderi & kampanya şablonları",
          "İçerik yönetimi",
          "Aylık tasarım desteği",
          "Reklam görselleri",
        ],
      },
      {
        title: "Gayrimenkul Pazarlama",
        description: "Sadece mülkü değil, deneyimi satan pazarlama.",
        points: [
          "İlan & rezidans kampanyaları",
          "Proje markalaşması",
          "Sosyal & basılı materyal",
          "Lansman desteği",
        ],
      },
    ],
  },
  testimonials: {
    eyebrow: "Referanslar",
    title: "Müşteriler ne diyor.",
    description:
      "Birlikte çalıştığım markalardan ve ekiplerden birkaç söz.",
    items: [
      {
        name: "RE/MAX Dream",
        field: "Gayrimenkul",
        quote:
          "FNGN Dijital ile çalışmaya başladığımızdan bu yana sosyal medya hesaplarımız çok daha profesyonel ve kurumsal bir görünüme kavuştu. Gayrimenkul sektörünün dinamiklerini anlayan, yaratıcı fikirleri ve kaliteli içerikleriyle markamıza değer katan bir ekip.",
      },
      {
        name: "Sapanca Realty",
        field: "Gayrimenkul",
        quote:
          "Markamızın dijital dünyada doğru şekilde temsil edilmesi bizim için önemliydi. FNGN Dijital, özgün tasarımları, etkileyici içerikleri ve detaylara verdiği önemle beklentilerimizi karşılayan bir çalışma ortaya koydu. Her aşamada profesyonel bir yaklaşım sergiliyorlar.",
      },
      {
        name: "Kent Emlak",
        field: "Gayrimenkul",
        quote:
          "Sosyal medyada yalnızca görünür olmak değil, güven veren bir marka kimliği oluşturmak da önemli. FNGN Dijital, sektörümüze uygun içerikleri ve modern tasarım anlayışıyla kurumsal duruşumuzu dijital platformlara başarıyla taşıdı. İşini özenle yapan bir ekip.",
      },
    ],
  },
  faq: {
    eyebrow: "SSS",
    title: "Sıkça sorulan sorular.",
    description: "Başlamadan önce merak edebileceğin her şey.",
    items: [
      {
        q: "Hangi hizmetleri sunuyorsunuz?",
        a: "Marka kimliği, web tasarımı & geliştirme, UI/UX, sosyal medya tasarımı ve gayrimenkul pazarlama — stratejiden teslime kadar uçtan uca.",
      },
      {
        q: "Bir proje nasıl ilerliyor?",
        a: "Dört net adım: Keşfet, Tasarla, İnşa Et, Yayınla. Önce hedeflerini kısa bir görüşmeyle konuşuruz; işe başlamadan önce sana plan, zaman çizelgesi ve teklif sunarız.",
      },
      {
        q: "Bir proje ne kadar sürer?",
        a: "Logo veya kimlik yaklaşık 1–2 hafta, web sitesi 2–4 hafta civarı, sosyal medya ise aylık süren bir destektir. Net süre işin kapsamına göre değişir.",
      },
      {
        q: "Hangi dillerde çalışıyorsunuz?",
        a: "Türkçe (ana dil) ve İngilizce (C1 · İleri) — hem yerel hem uluslararası müşterilerle rahatça çalışıyoruz.",
      },
      {
        q: "Uzaktan çalışıyor musunuz?",
        a: "Evet — Sakarya, Türkiye merkezliyiz ve Türkiye'nin her yerinden ve yurt dışından müşterilerle tamamen uzaktan çalışıyoruz.",
      },
      {
        q: "Nasıl teklif alırım veya başlarım?",
        a: "WhatsApp'tan yaz ya da hello@fngn.com.tr adresine projenden kısaca bahset. Sana sonraki adımları ve sana özel bir teklifi iletelim.",
      },
    ],
  },
  blog: {
    eyebrow: "Blog",
    title: "Tasarım, marka ve pazarlama üzerine notlar.",
    description:
      "Markalar ve gayrimenkul için marka, sosyal medya ve dijital üzerine pratik yazılar.",
    readMore: "Oku",
    backToBlog: "Tüm yazılar",
    minRead: "dk okuma",
    backHome: "Ana sayfaya dön",
  },
  assistant: {
    aria: "Sohbeti aç",
    title: "FNGN Asistan",
    subtitle: "Genellikle dakikalar içinde yanıt",
    greeting:
      "Merhaba! 👋 Nasıl yardımcı olabiliriz? Aşağıdan bir soru seç ya da doğrudan bize ulaş.",
    quick: "Hızlı sorular",
    whatsapp: "WhatsApp'tan yaz",
    email: "E-posta gönder",
    close: "Kapat",
  },
};

export const dictionaries: Record<Lang, Dict> = { en, tr };
