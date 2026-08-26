export type ServicePillar = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
};

export type ConsultationPlan = {
  name: string;
  timing: string;
  summary: string;
  includes: string[];
};

export const servicePillars: ServicePillar[] = [
  {
    number: "01",
    eyebrow: "Cildinizi okumak",
    title: "Bariyer ve ritim",
    description:
      "Cildin verdiği sinyalleri; his, görünüm, rutin ve çevresel yüklerle birlikte sakin bir çerçevede değerlendiririz.",
    accent: "Kırılgan değil, anlaşılmayı bekleyen bir denge.",
  },
  {
    number: "02",
    eyebrow: "Rutini sadeleştirmek",
    title: "Seçici bakım",
    description:
      "Birbiriyle yarışan adımlar yerine, ihtiyaçla konuşan ve gündelik hayatınıza uyum sağlayan net bir bakım akışı kurarız.",
    accent: "Daha çok ürün değil; daha doğru kararlar.",
  },
  {
    number: "03",
    eyebrow: "Işığı korumak",
    title: "Uzun vadeli eşlik",
    description:
      "Mevsimler, stres ve yaşam döngüsü değiştikçe rutininizin nasıl adapte olacağını birlikte planlarız.",
    accent: "Cilt bakımı, tek seferlik değil; yaşayan bir diyalog.",
  },
];

export const consultationPlans: ConsultationPlan[] = [
  {
    name: "Cilt Haritası",
    timing: "45 dakika",
    summary: "İlk görüşme için sakin, detaylı ve yön belirleyici bir başlangıç.",
    includes: ["Rutin ve tolerans değerlendirmesi", "Önceliklendirilmiş bakım notları", "Kişisel takip eksenleri"],
  },
  {
    name: "Mevsimsel Yenileme",
    timing: "30 dakika",
    summary: "Değişen hava, tempo veya ihtiyaçlar için mevcut rutini yeniden dengeleme.",
    includes: ["Mevcut ürünlerin sadeleştirilmesi", "Doku ve sıklık ayarı", "Kısa dönem adaptasyon planı"],
  },
  {
    name: "Ritüel Kurgusu",
    timing: "60 dakika",
    summary: "Bakımı daha bilinçli ve keyifli bir ritme dönüştürmek isteyenler için bütünsel oturum.",
    includes: ["Sabah–akşam ritim tasarımı", "Duyusal kullanım rehberi", "Dört haftalık bakım perspektifi"],
  },
];

export const faqs = [
  {
    question: "Görüşmeye nasıl hazırlanmalıyım?",
    answer:
      "Kullandığınız ürünleri, cildinizde tekrar eden hisleri ve son dönemde değiştirdiğiniz alışkanlıkları kısaca not etmeniz yeterli. Kusursuz bir hazırlık değil, dürüst bir başlangıç arıyoruz.",
  },
  {
    question: "Ürün önerisi mi alacağım?",
    answer:
      "Öneriler, ürün isminden önce ihtiyaç ve kullanım mantığı üzerinden şekillenir. Görüşmenin amacı daha fazla ürün eklemek değil; seçimlerinizi daha anlaşılır hale getirmektir.",
  },
  {
    question: "Bu görüşme dermatolojik muayene yerine geçer mi?",
    answer:
      "Hayır. Bu hizmet tanı, tedavi veya reçete yerine geçmez. Şüpheli, ani veya rahatsız edici cilt durumlarında uygun sağlık profesyoneline başvurmanız gerekir.",
  },
];
