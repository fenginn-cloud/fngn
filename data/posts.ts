import { site } from "./site";

export interface PostBlock {
  heading?: string;
  body?: string[];
  list?: string[];
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO (YYYY-MM-DD)
  tags: string[];
  readMinutes: number;
  accent: string;
  content: PostBlock[];
}

/**
 * BLOG POSTS
 * ----------
 * Add a new post by appending an object here — it appears on /blog,
 * gets its own /blog/<slug> page, and is added to the sitemap automatically.
 */
export const posts: Post[] = [
  {
    slug: "gayrimenkulde-5-sosyal-medya-ipucu",
    title: "Gayrimenkulde Fark Yaratan 5 Sosyal Medya İpucu",
    excerpt:
      "Emlak markaları ve danışmanlar için sosyal medyada güven inşa eden, akışta durduran ve satışa dönüşen 5 pratik ipucu.",
    date: "2026-10-15",
    tags: ["Sosyal Medya", "Gayrimenkul"],
    readMinutes: 5,
    accent: "#E26205",
    content: [
      {
        body: [
          "Gayrimenkulde alıcılar artık yolculuğa Google'dan ve sosyal medyadan başlıyor. Bir mülkü beğenmeden önce markaya güveniyorlar. İyi kurgulanmış bir sosyal medya varlığı, bu güveni daha ilk saniyede kazandırır. İşte emlak markanızı öne çıkaracak beş pratik ipucu.",
        ],
      },
      {
        heading: "1. Tutarlı bir görsel dil kullanın",
        body: [
          "Her gönderinin aynı aileden göründüğü bir sistem kurun: sabit renkler, tipografi ve şablonlar. Tutarlılık, hesabınıza ilk bakışta profesyonel ve kurumsal bir hava katar; dağınık bir feed ise ne kadar iyi mülk paylaşırsanız paylaşın güveni zedeler.",
        ],
      },
      {
        heading: "2. Mülkü değil, deneyimi satın",
        body: [
          "İnsanlar metrekare değil, bir yaşam hayal eder. Fotoğrafın yanında o evde geçecek sabahları, manzarayı, konumun sağladığı rahatlığı anlatın. Hikâye, ilanı sıradan bir duyurudan arzu edilen bir fırsata dönüştürür.",
        ],
      },
      {
        heading: "3. Düzenli ve planlı paylaşın",
        body: [
          "Algoritma süreklilik sever, takipçi de öyle. Haftalık bir içerik planı yapın: ilan, bölge tanıtımı, müşteri yorumu, ekip ve süreç içerikleri dönüşümlü gitsin. Bir şablon sistemi, bu düzeni hızla ve markaya uygun şekilde üretmenizi sağlar.",
        ],
      },
      {
        heading: "4. Sosyal kanıtı öne çıkarın",
        body: [
          "Mutlu müşteri yorumları, teslim anları ve 'satıldı' paylaşımları, potansiyel alıcıya 'burada iş biter' mesajı verir. Gerçek referanslar, en ikna edici reklamınızdır.",
        ],
      },
      {
        heading: "5. Net bir çağrı (CTA) bırakın",
        body: [
          "Her gönderi bir sonraki adımı söylemeli: 'DM'den detay iste', 'Randevu al', 'Profilimizdeki siteyi ziyaret et'. İnsanlar ne yapacaklarını bildiklerinde harekete geçer.",
        ],
      },
      {
        heading: "Özetle",
        body: [
          "Tutarlı görsel dil, deneyim odaklı anlatım, düzenli paylaşım, sosyal kanıt ve net çağrı — bu beşi bir araya geldiğinde sosyal medya bir vitrin olmaktan çıkıp gerçek bir satış kanalına dönüşür.",
        ],
      },
    ],
  },
  {
    slug: "iyi-logo-ve-marka-kimliginin-onemi",
    title: "İyi Bir Logo ve Marka Kimliğinin Önemi",
    excerpt:
      "Logo sadece bir simge değildir; markanızın ilk izlenimi, vaadi ve hafızadaki yeridir. Güçlü bir kimlik neden fark yaratır?",
    date: "2026-10-08",
    tags: ["Marka", "Kimlik"],
    readMinutes: 4,
    accent: "#FF7A1A",
    content: [
      {
        body: [
          "Bir markayla ilk karşılaşma genellikle birkaç saniye sürer ve bu saniyelerde logo konuşur. İyi bir logo ve onu çevreleyen kimlik sistemi, 'ciddi bir işletmeyle mi yoksa amatör bir girişimle mi karşı karşıyayım?' sorusunu bir bakışta yanıtlar.",
        ],
      },
      {
        heading: "Logo bir simge, kimlik bir sistemdir",
        body: [
          "Logo buzdağının görünen kısmıdır. Asıl gücü; renk paleti, tipografi, görsel ton ve bunların tutarlı kullanımından oluşan bütünlük sağlar. Kartvizitten web sitesine, sosyal medyadan tabelaya kadar her yerde aynı dili konuşmak, markayı tanınır ve güvenilir kılar.",
        ],
      },
      {
        heading: "Güçlü kimliğin getirdikleri",
        list: [
          "İlk izlenimde güven ve profesyonellik",
          "Rakipler arasında ayırt edilebilirlik",
          "Her mecrada tutarlı, tanınır bir görünüm",
          "Daha kolay hatırlanma ve ağızdan ağıza yayılma",
          "Fiyatı değil değeri konuşan, premium bir algı",
        ],
      },
      {
        heading: "İyi bir kimlik neye benzer?",
        body: [
          "Basittir ama akılda kalır; her ölçekte çalışır — minik bir avatar da olsa dev bir tabela da. Markanın karakterini yansıtır ve yıllarca eskimeyecek kadar sağlam, esneyebilecek kadar da canlıdır.",
        ],
      },
      {
        heading: "Sonuç",
        body: [
          "Kimlik bir masraf değil, yatırımdır. Doğru kurulduğunda markanızın her temas noktasında sizin yerinize konuşur ve kazandığı güven, uzun vadede en değerli varlığınız olur.",
        ],
      },
    ],
  },
  {
    slug: "emlakciya-neden-web-sitesi-sart",
    title: "Emlak Danışmanına Neden Profesyonel Web Sitesi Şart?",
    excerpt:
      "Sosyal medya önemli ama yeterli değil. Kendi web siteniz, güveninizi, portföyünüzü ve kontrolü size geri verir.",
    date: "2026-09-28",
    tags: ["Web", "Gayrimenkul"],
    readMinutes: 5,
    accent: "#3FA796",
    content: [
      {
        body: [
          "Birçok emlak danışmanı tüm varlığını sosyal medyaya kurar. Oysa sosyal medya kiralık bir alandır — kuralları, erişimi ve hatta hesabınızın geleceği sizin elinizde değildir. Kendi web siteniz ise sahip olduğunuz, kontrol ettiğiniz dijital merkezinizdir.",
        ],
      },
      {
        heading: "Güven verir",
        body: [
          "Alıcılar, isminizi aradığında karşılarına özenli bir web sitesi çıkmasını bekler. Profesyonel bir site, 'bu kişi işini ciddiye alıyor' mesajını anında verir ve sizi vitrin ilanların arasından çıkarır.",
        ],
      },
      {
        heading: "Portföyünüzü siz kurgularsınız",
        body: [
          "Sosyal medyanın akışında kaybolan ilanlarınızı, web sitenizde dilediğiniz gibi düzenler, öne çıkarır ve kalıcı kılarsınız. Satılan projeler bile referans olarak çalışmaya devam eder.",
        ],
      },
      {
        heading: "Google'dan müşteri getirir",
        body: [
          "İyi kurulmuş bir site, 'bölgenizde emlak', 'konut danışmanı' gibi aramalarda sizi görünür kılar. Sosyal medya bugünü getirir; web sitesi + SEO ise sürekli, kendiliğinden gelen müşteri demektir.",
        ],
      },
      {
        heading: "Tüm kanalları tek merkezde toplar",
        body: [
          "WhatsApp, Instagram, telefon ve iletişim formu tek bir yerde buluşur. Ziyaretçi tek tıkla size ulaşır; siz de kaç kişinin geldiğini ve ne yaptığını ölçebilirsiniz.",
        ],
      },
      {
        heading: "Sonuç",
        body: [
          "Sosyal medya tanışma, web sitesi ise ikna ve dönüşüm yeridir. İkisi birlikte çalıştığında danışman değil, akılda kalan bir marka olursunuz.",
        ],
      },
    ],
  },
  {
    slug: "sosyal-medyada-marka-tutarliligi",
    title: "Sosyal Medyada Marka Tutarlılığı Nasıl Sağlanır?",
    excerpt:
      "Tutarlılık, tanınırlığın temelidir. Görsel dil, şablon sistemi ve tonla markanızı her gönderide aynı marka yapmanın yolu.",
    date: "2026-09-15",
    tags: ["Sosyal Medya", "Marka"],
    readMinutes: 4,
    accent: "#5B6CFF",
    content: [
      {
        body: [
          "Bir markayı güçlü kılan, tek bir harika gönderi değil; yüzlerce gönderide korunan tutarlılıktır. İnsanlar tanıdıkları şeye güvenir. Peki her paylaşımda 'aynı marka' hissini nasıl verirsiniz?",
        ],
      },
      {
        heading: "Bir görsel sistem belirleyin",
        body: [
          "Renk paleti, tipografi, ızgara ve boşluk kurallarını netleştirin. Bu kurallar, kim üretirse üretsin feed'in bütünlüklü görünmesini sağlar.",
        ],
      },
      {
        heading: "Şablonlarla üretin",
        body: [
          "Her içerik türü için (ilan, duyuru, alıntı, yorum) hazır şablonlar oluşturun. Şablonlar hem üretimi hızlandırır hem de tutarlılığı garanti eder — her seferinde sıfırdan tasarlamazsınız.",
        ],
      },
      {
        heading: "Tek bir ses tonu kullanın",
        body: [
          "Görsel kadar dil de markadır. Samimi mi, kurumsal mı, iddialı mı? Bir ton seçin ve başlıklardan yanıtlara kadar her yerde koruyun.",
        ],
      },
      {
        heading: "Küçük bir marka kılavuzu hazırlayın",
        list: [
          "Renk kodları ve kullanım oranları",
          "Yazı tipleri ve başlık/gövde hiyerarşisi",
          "Logo kullanımı ve boşluk kuralları",
          "Örnek gönderiler ve yapılmayacaklar",
        ],
      },
      {
        heading: "Sonuç",
        body: [
          "Tutarlılık sıkıcılık değildir; tanınırlıktır. Bir sistem kurduğunuzda, markanız her gönderide kendini tekrar hatırlatır ve zamanla akışta tek bakışta tanınır hâle gelir.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Posts sorted newest-first for listing. */
export const sortedPosts = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function formatDate(iso: string, lang: "tr" | "en"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const blogUrl = `${site.url}/blog`;
