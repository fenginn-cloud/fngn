import type { Lang } from "./translations";
import type { Project } from "./projects";

/** Turkish overrides for the translatable fields of each project. */
type ProjectTr = Pick<
  Project,
  "description" | "overview" | "challenge" | "solution" | "tags" | "results"
>;

const trBySlug: Record<string, ProjectTr> = {
  "curaprox-bosnian-limited-edition": {
    description:
      "CURAPROX için Bosna kültürel mirasını kutlayan sınırlı sayıda ambalaj konsepti.",
    overview:
      "CURAPROX için sınırlı sayıda ambalaj ve sanat yönetimi konsepti — Bosna kültürel mirasını, İsviçreli ağız bakımı ikonunun koleksiyonluk ve premium tasarım diline çevirmek.",
    challenge:
      "CURAPROX, cesur ve oyuncu tasarımıyla küresel çapta tanınır. Bosna'ya özel sınırlı seri, yerel mirası onurlandırırken hem tartışmasız CURAPROX kalmalı hem de turistik değil, koleksiyonluk hissettirmeliydi.",
    solution:
      "Bosna motiflerinden, el sanatından ve renginden beslenen rafine bir sistem — ambalaj, yüzey deseni ve lansman görsellerine uygulandı — ürünü saklamaya değer bir tasarım objesine dönüştürdü.",
    tags: ["Ambalaj", "Sınırlı Seri", "Sanat Yönetimi"],
    results: [
      { label: "Konsept", value: "Koleksiyonluk" },
      { label: "Miras", value: "Yeniden Yorum" },
      { label: "Konumlandırma", value: "Premium" },
    ],
  },
  "doga-real-estate-tourism": {
    description:
      "Doğadan beslenen bir gayrimenkul & turizm girişimi için marka ve pazarlama sistemi.",
    overview:
      "Doğa Real Estate & Tourism için eksiksiz bir marka ve pazarlama kiti — gayrimenkul yatırımını doğanın huzuruyla buluşturuyor.",
    challenge:
      "Doğa'nın, kalabalık bir gayrimenkul pazarında fark yaratırken hem yatırımcılara hem de yaşam tarzı alıcılarına hitap eden, doğa odaklı yumuşak bir vaadi iletmesi gerekiyordu.",
    solution:
      "Toprak tonları, akışkan formlar ve güçlü tipografiyle organik bir görsel dil kurduk; ilanlar, sosyal kampanyalar ve satış materyallerinde tutarlı, premium bir varlık oluşturduk.",
    tags: ["Marka", "Pazarlama", "Baskı"],
    results: [
      { label: "Marka Hatırlanırlığı", value: "+%45" },
      { label: "Müşteri Niteliği", value: "Daha Yüksek" },
      { label: "Temas Noktası", value: "20+" },
    ],
  },
  "talu-textile-social-media": {
    description:
      "Modern bir tekstil üreticisi için ölçeklenebilir bir sosyal içerik sistemi.",
    overview:
      "Talu Textile için uçtan uca bir sosyal medya tasarım sistemi — aylarca içeriğe ölçeklenen şablonlar, kampanyalar ve tanınabilir bir grid.",
    challenge:
      "Talu, görsel kimliği olmadan tutarsız paylaşımlar yapıyordu; bu da markayı unutulur ve üretimi yavaş kılıyordu.",
    solution:
      "Güçlü bir renk ve tipografi ritmine sahip modüler şablon sistemi, ekibin hızla markaya uygun paylaşımlar üretmesini sağladı ve tutarlı, premium bir akış oluşturdu.",
    tags: ["Sosyal", "Kampanya", "İçerik Sistemi"],
    results: [
      { label: "Etkileşim", value: "+%60" },
      { label: "Üretim Süresi", value: "-%50" },
      { label: "Tasarım", value: "100+" },
    ],
  },
  "woodora-brand-design": {
    description:
      "Premium bir ahşap ve iç mekan markası için sıcak, el işçiliğiyle örülmüş kimlik.",
    overview:
      "Woodora için eksiksiz bir kimlik — el işçiliği, sıcaklık ve doğal malzemeler üzerine kurulu bir markayı rafine bir görsel sisteme çevirdik.",
    challenge:
      "Woodora'nın, kategoride yaygın olan soğuk minimalizmden kaçınarak hem premium hem el yapımı hisseden bir kimliğe ihtiyacı vardı.",
    solution:
      "Özgün bir logotype, sıcak palet ve dokunsal dokular; ambalaj, tabela ve dijitalde el işçiliğini ve kaliteyi ifade ediyor.",
    tags: ["Kimlik", "Logo", "Kılavuz"],
    results: [
      { label: "Kimlik Sistemi", value: "Eksiksiz" },
      { label: "Uygulama", value: "15+" },
      { label: "Algı", value: "Premium" },
    ],
  },
  "natural-skin-care-branding": {
    description:
      "Doğal bir cilt bakım serisi için temiz, botanik kimlik ve ambalaj.",
    overview:
      "Doğal bir cilt bakım serisi için botanik odaklı bir kimlik — ambalaj ve dijitalde temiz, sakin ve güven veren.",
    challenge:
      "Markanın hem bilimsel hem doğal hissetmesi; nazik, organik vaadini kaybetmeden rafta öne çıkması gerekiyordu.",
    solution:
      "Yumuşak nötr tonlar, zarif botanik işaretler ve cömert boşluk; ürün yelpazesine ölçeklenen güvenilir, premium bir his yaratıyor.",
    tags: ["Kimlik", "Ambalaj", "Güzellik"],
    results: [
      { label: "Raf Çekiciliği", value: "Yükseldi" },
      { label: "Ürün", value: "8+" },
      { label: "Kimlik", value: "Tutarlı" },
    ],
  },
  "real-estate-agent-logo": {
    description:
      "Bağımsız bir gayrimenkul danışmanı için ayırt edici kişisel logo sistemi.",
    overview:
      "Bağımsız bir gayrimenkul profesyoneli için kişisel marka işareti — kendinden emin, akılda kalıcı ve her temas noktasında esnek.",
    challenge:
      "Danışmanın, tabela, kartvizit ve sosyal avatarlarda küçük boyutlarda dahi çalışan; güven ve hırs aktaran bir işarete ihtiyacı vardı.",
    solution:
      "Geometrik bir monogram ve güçlü bir logotype, her ölçekte varlık sunarak eksiksiz bir kişisel kimliği taşıyor.",
    tags: ["Logo", "Kişisel Marka"],
    results: [
      { label: "Tanınırlık", value: "Güçlü" },
      { label: "Format", value: "Duyarlı" },
      { label: "Temas Noktası", value: "10+" },
    ],
  },
  "eksatent-portable-shelter": {
    description:
      "Taşınabilir bir barınak sistemi için ürün lansman kimliği ve web varlığı.",
    overview:
      "Eksatent için lansman kimliği ve web varlığı — hızlı kurulum için tasarlanmış taşınabilir bir barınak, netlik ve güvenle pazarlandı.",
    challenge:
      "Teknik bir ürünün, faydalarını farklı alıcılara anında anlatan bir pazarlama hikâyesine ve web deneyimine ihtiyacı vardı.",
    solution:
      "Cesur bir ürün anlatısı, temiz teknik sunum ve dönüşüm odaklı bir açılış deneyimi, mühendisliği arzuya çeviriyor.",
    tags: ["Ürün", "Web", "Pazarlama"],
    results: [
      { label: "Netlik", value: "Yüksek" },
      { label: "Lansman", value: "Zamanında" },
      { label: "Dönüşüm", value: "Optimize" },
    ],
  },
  "pav-visual-identity": {
    description: "İddialı bir marka için cesur, modern görsel kimlik sistemi.",
    overview:
      "PAV için eksiksiz bir görsel kimlik — kendinden emin, çağdaş ve her marka yüzeyinde ölçeklenebilir.",
    challenge:
      "PAV'ın, lansmandan itibaren oturmuş ve premium hisseden, gelecekteki büyümeye esnek bir kimliğe ihtiyacı vardı.",
    solution:
      "Ayırt edici bir işaret, disiplinli bir tipografi ölçeği ve güçlü bir renk hikâyesi; anında tanınabilen ve genişletilmesi kolay bir sistem yaratıyor.",
    tags: ["Kimlik", "Sistem", "Strateji"],
    results: [
      { label: "Sistem", value: "Ölçeklenebilir" },
      { label: "Tutarlılık", value: "%100" },
      { label: "Uygulama", value: "12+" },
    ],
  },
  "hiddengarden-villas": {
    description:
      "Lüks bir villa projesi deneyimi için sürükleyici UI/UX.",
    overview:
      "HiddenGarden Villas için sürükleyici bir dijital deneyim — yüksek niyetli alıcıları, sinematik bir arayüzle lüks bir proje boyunca yönlendiriyor.",
    challenge:
      "Lüks alıcılar, ürünle örtüşen bir deneyim bekler. Sitenin, villaların kendisi kadar rafine hissettirmesi gerekiyordu.",
    solution:
      "Sinematik, kaydırma odaklı bir arayüz; zarif galeriler, etkileşimli planlar ve sürtünmesiz bir talep akışıyla algılanan değeri yükseltiyor.",
    tags: ["Web", "Gayrimenkul", "Ürün"],
    results: [
      { label: "Sitede Süre", value: "+%70" },
      { label: "Talepler", value: "Nitelikli" },
      { label: "Deneyim", value: "Sinematik" },
    ],
  },
  "amazon-listing-design": {
    description:
      "Amazon markaları için dönüşüm odaklı A+ içerik ve ilan görselleri.",
    overview:
      "Yüksek dönüşümlü Amazon ilan tasarımı — buy box'ı kazanmak için kurgulanmış A+ içerik, infografik ve görseller.",
    challenge:
      "Satıcılar, güçlü ürünlere rağmen daha iyi sunulan rakiplere dönüşüm kaybediyordu.",
    solution:
      "Fayda odaklı infografikler, temiz yaşam tarzı görselleri ve yapılandırılmış A+ modülleri, gezinenleri alıcıya çeviriyor.",
    tags: ["E-ticaret", "İçerik", "Dönüşüm"],
    results: [
      { label: "Dönüşüm", value: "+%35" },
      { label: "İlan", value: "Çoklu" },
      { label: "Sunum", value: "Premium" },
    ],
  },
  "hece-gayrimenkul-branding": {
    description: "Hece Group için güvenilir, premium bir gayrimenkul markası.",
    overview:
      "Hece Gayrimenkul için eksiksiz bir gayrimenkul markası — her temas noktasında güven, hırs ve premium hizmeti iletiyor.",
    challenge:
      "Hece'nin, Hece Group ekosistemi içinde güvenilirlik ve ölçek işaret eden bir gayrimenkul kimliğine ihtiyacı vardı.",
    solution:
      "Rafine bir işaret, yapılandırılmış bir sistem ve kendinden emin pazarlama materyalleri, Hece Gayrimenkul'ü premium bir pazar oyuncusu olarak konumluyor.",
    tags: ["Marka", "Gayrimenkul", "Sistem"],
    results: [
      { label: "Konumlandırma", value: "Premium" },
      { label: "Sistem", value: "Tutarlı" },
      { label: "Materyal", value: "Tam Set" },
    ],
  },
  "business-card-collection": {
    description: "Premium kartvizit tasarımlarından özenle seçilmiş bir derleme.",
    overview:
      "Sektörlere yayılan, özenle seçilmiş bir kartvizit derlemesi — her kart, küçük ve düşünülmüş bir marka işçiliği parçası.",
    challenge:
      "Her müşterinin, markasını tek bir dokunsal objede yakalayan akılda kalıcı bir ilk izlenime ihtiyacı vardı.",
    solution:
      "Özenli tipografi, baskı sonrası işlemler ve düzenler, her kartı premium bir marka kalitesi beyanına dönüştürüyor.",
    tags: ["Baskı", "Kimlik", "Koleksiyon"],
    results: [
      { label: "Tasarım", value: "20+" },
      { label: "Sektör", value: "Çeşitli" },
      { label: "Baskı", value: "Premium" },
    ],
  },
  "art-movements-poster-collection": {
    description:
      "Modern sanat akımlarını keşfeden anlatımcı bir poster & motion serisi.",
    overview:
      "Tarihi sanat akımlarını çağdaş ve kinetik bir bakışla yorumlayan kişisel bir poster ve motion serisi.",
    challenge:
      "Farklı sanat akımlarının ruhunu, tutarlı ama anlatımcı modern bir görsel seriye çevirmek.",
    solution:
      "Her parça, cesur editöryel düzeni motion çalışmalarıyla birleştirerek akımı kutluyor ve kişisel bir stili öne çıkarıyor.",
    tags: ["Poster", "Motion", "Editöryel"],
    results: [
      { label: "Poster", value: "Seri" },
      { label: "Motion", value: "Çalışmalar" },
      { label: "Stil", value: "Özgün" },
    ],
  },
};

/** Returns a project with locale-appropriate text fields. */
export function localizeProject(project: Project, lang: Lang): Project {
  if (lang === "en") return project;
  const tr = trBySlug[project.slug];
  if (!tr) return project;
  return { ...project, ...tr };
}
