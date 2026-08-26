import { ArrowUpRight, CheckCircle2, ChevronDown, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { trpc } from "@/lib/trpc";

const consultationTypes = ["Rutin başlangıcı", "Rutin değerlendirmesi", "İçerik ve ürün okuması", "Mevsimsel bakım odağı"] as const;

export function AppointmentApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [consultationType, setConsultationType] = useState<(typeof consultationTypes)[number]>(consultationTypes[0]);
  const [inquirySummary, setInquirySummary] = useState("");
  const [careScopeAccepted, setCareScopeAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitApplication = trpc.consultation.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    submitApplication.mutate({ fullName, email, consultationType, inquirySummary, careScopeAccepted: true, privacyAccepted: true });
  };

  if (submitted) {
    return <div className="appointment-success" role="status"><CheckCircle2 size={28} /><div><p>Talebiniz alındı.</p><span>Uygunluk değerlendirmesi tamamlandığında e-posta adresiniz üzerinden sizinle iletişime geçeceğiz.</span></div></div>;
  }

  return (
    <form className="contact-form appointment-form" onSubmit={handleSubmit}>
      <div className="appointment-form-heading"><span><LockKeyhole size={14} /> GÜVENLİ BAŞVURU</span><p>İlk adımı kısa ve nazik tutuyoruz.</p></div>
      <label>Adınız ve soyadınız<input required value={fullName} onChange={event => setFullName(event.target.value)} autoComplete="name" placeholder="Adınızı yazın" /></label>
      <label>E-posta adresiniz<input required type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="merhaba@ornek.com" /></label>
      <label>Size nasıl eşlik edelim?<select value={consultationType} onChange={event => setConsultationType(event.target.value as (typeof consultationTypes)[number])}>{consultationTypes.map(type => <option key={type}>{type}</option>)}</select></label>
      <label>Genel notunuz<textarea required value={inquirySummary} onChange={event => setInquirySummary(event.target.value)} minLength={8} maxLength={900} rows={4} placeholder="Bakım rutininiz veya genel beklentinizle ilgili kısa birkaç satır..." /><small>Tanı, fotoğraf, tıbbi geçmiş veya reçete bilgisi paylaşmayın.</small></label>
      <div className="appointment-consents">
        <label className="consent-check"><input required type="checkbox" checked={careScopeAccepted} onChange={event => setCareScopeAccepted(event.target.checked)} /><span>DermaMatch’in tıbbi tanı, tedavi, reçete veya acil sağlık hizmeti sunmadığını; görüşmenin yalnızca genel bakım ve estetik önerisi çerçevesinde olduğunu kabul ediyorum.</span></label>
        <label className="consent-check"><input required type="checkbox" checked={privacyAccepted} onChange={event => setPrivacyAccepted(event.target.checked)} /><span>Kişisel verilerimin başvurumun değerlendirilmesi ve benimle iletişim kurulması amacıyla işlenmesine ilişkin <strong>KVKK / açık rıza taslağını</strong> okudum ve kabul ediyorum.</span></label>
        <details className="legal-draft"><summary>Tam metni görüntüle <ChevronDown size={15} /></summary><div><strong>Bilgilendirme ve açık rıza taslağı</strong><p>Paylaştığınız ad, e-posta, görüşme tercihi ve kısa açıklama; talebinizi değerlendirmek, iletişim kurmak ve kabul edilmesi hâlinde size özel görüşme alanını yönetmek için işlenir. Verileriniz, kanuni saklama yükümlülükleri dışında amaçla sınırlı olarak tutulur ve yetkisiz erişime karşı korunur. Talebinizi geri çekme, veri silme veya bilgi isteme taleplerinizi e-posta yoluyla iletebilirsiniz.</p><p><em>Bu metin yayından önce Türkiye’de yetkin bir hukuk ve KVKK uyum uzmanı tarafından gözden geçirilmesi gereken taslaktır.</em></p></div></details>
      </div>
      {submitApplication.error && <p className="form-error" role="alert">Başvuru şu anda gönderilemedi. Lütfen kısa süre sonra yeniden deneyin.</p>}
      <button type="submit" className="form-submit" disabled={submitApplication.isPending || !careScopeAccepted || !privacyAccepted}>{submitApplication.isPending ? <><Loader2 className="spin" size={18} /> Gönderiliyor</> : <>Talebi gönder <ArrowUpRight size={18} /></>}</button>
      <p className="form-disclaimer"><ShieldCheck size={15} /> Bu alan acil durumlar için uygun değildir. Acil ya da tıbbi bir ihtiyaçta ilgili sağlık profesyoneline başvurun.</p>
    </form>
  );
}
