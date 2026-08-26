import { useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Droplets,
  FlaskConical,
  Menu,
  Play,
  ScanFace,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  consultationPlans,
  faqs,
  servicePillars,
} from "@shared/siteContent";

const navItems = [
  { label: "Yaklaşım", href: "#yaklasim" },
  { label: "Danışmanlıklar", href: "#danismanliklar" },
  { label: "Neden DermaMatch", href: "#neden-dermamatch" },
];

function scrollToSection(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="noor-app">
      <a className="skip-link" href="#icerik">İçeriğe geç</a>

      <header className="site-header">
        <a className="brand-mark" href="#ust" aria-label="DermaMatch ana sayfa">
          <span className="brand-orbit" aria-hidden="true" />
          <span>DermaMatch</span>
          <small>GÜZELLİK BİLİNCİ</small>
        </a>

        <nav className="desktop-nav" aria-label="Ana navigasyon">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <button className="header-cta" onClick={() => scrollToSection("#randevu")}>
          Görüşme talep et <ArrowUpRight size={15} aria-hidden="true" />
        </button>

        <button className="menu-trigger" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true" aria-label="Mobil navigasyon">
          <div className="mobile-menu-panel">
            <div className="mobile-menu-top"><span className="mobile-brand">DermaMatch</span><button aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)}><X size={22} /></button></div>
            <p className="mobile-subtitle">Bilinçli güzellik için sakin bir başlangıç.</p>
            <nav className="mobile-nav" aria-label="Mobil navigasyon">
              {navItems.map((item, index) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  <span>0{index + 1}</span>{item.label}<ArrowUpRight size={16} />
                </a>
              ))}
              <button onClick={() => { setMenuOpen(false); scrollToSection("#randevu"); }}>
                Görüşme talep et <ArrowRight size={16} />
              </button>
            </nav>
          </div>
        </div>
      )}

      <main id="icerik">
        <section id="ust" className="hero-section">
          <div className="hero-media" aria-hidden="true">
            <video autoPlay muted loop playsInline poster="/manus-storage/noor-hero-editorial_eeba30cf.png">
              <source src="/manus-storage/noor-liquid-ambient_4319808e.mp4" type="video/mp4" />
            </video>
            <div className="hero-overlay" />
            <div className="hero-grain" />
          </div>
          <div className="hero-arc hero-arc-one" aria-hidden="true" />
          <div className="hero-arc hero-arc-two" aria-hidden="true" />
          <div className="hero-content page-shell">
            <div className="hero-topline reveal-up">
              <span className="eyebrow-light"><i /> ECZACI YAKLAŞIMIYLA KİŞİSEL BAKIM</span>
              <span>İSTANBUL · ONLINE</span>
            </div>
            <div className="hero-main">
              <p className="hero-index reveal-up">01<span>/</span>01</p>
              <h1 className="hero-title reveal-up">Cildinizin<br /><em>sesini</em> dinleyin.</h1>
              <div className="hero-aside reveal-up">
                <p>Bilimsel merak ile duyusal zarafeti buluşturan, size ait bir bakım ritmi.</p>
                <button className="circle-play" aria-label="DermaMatch yaklaşımına git" onClick={() => scrollToSection("#yaklasim")}>
                  <Play size={16} fill="currentColor" aria-hidden="true" />
                  <span>KEŞFET</span>
                </button>
              </div>
            </div>
            <div className="hero-bottom reveal-up">
              <p>Güzellik bir formül değil, size dikkatle eşlik eden bir pratiktir.</p>
              <button className="scroll-cue" onClick={() => scrollToSection("#yaklasim")}>
                <span>Kaydırarak keşfedin</span><ArrowDown size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="hero-stamp" aria-hidden="true">DERMAMATCH · BAKIMI YAVAŞLAT · DERMAMATCH · BAKIMI YAVAŞLAT ·</div>
        </section>

        <section id="yaklasim" className="manifesto-section section-padding">
          <div className="page-shell manifesto-layout">
            <div className="manifesto-label reveal-up"><span>MANİFESTO</span><span>(01)</span></div>
            <div className="manifesto-copy">
              <p className="overline reveal-up">Cildinize karşı değil, cildinizle birlikte.</p>
              <h2 className="display-heading reveal-up">Daha <em>az</em> gürültü.<br />Daha çok <em>anlam.</em></h2>
              <p className="body-large reveal-up">DermaMatch, cilt bakımını trendlerin temposundan çıkarır. Eczacılık bilgisini; tolerans, içerik ve kullanım alışkanlıklarını anlamak için kullanır. Sonuç, ezberlenmiş bir rutin değil; nedenlerini bildiğiniz bir bakım dilidir.</p>
              <a className="text-link reveal-up" href="#neden-dermamatch">Yaklaşımın ayrıntıları <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="manifesto-ribbon" aria-label="DermaMatch yaklaşımı">ÖNCE DİNLE · SONRA SEÇ · YAVAŞÇA İZLE ·</div>
        </section>

        <section className="editorial-section section-padding">
          <div className="page-shell editorial-grid">
            <div className="editorial-image-wrap reveal-clip">
              <img src="/manus-storage/noor-pharmacist-editorial_893e3702.png" alt="DermaMatch yaklaşımını temsil eden eczacı portresi" loading="lazy" />
              <span className="image-caption">BİLİM · DUYU · DENGE</span>
            </div>
            <div className="editorial-message">
              <span className="chapter-number reveal-up">02</span>
              <h2 className="display-heading small reveal-up">Bilgi, ancak<br /><em>şefkatle</em> verildiğinde<br />işe yarar.</h2>
              <p className="body-copy reveal-up">Bir cilt rutini, duş rafınızdaki adımların toplamı değildir. Uyku, mevsim, stres, doku tercihi ve süreklilik; aynı hikâyenin farklı satırlarıdır. Görüşmelerimiz bu satırları birlikte okumak için tasarlanır.</p>
              <div className="signature-row reveal-up">
                <div className="signature-orb"><Sparkles size={18} /></div>
                <div><strong>Ritüel, farkındalıkla başlar.</strong><span>— DermaMatch yaklaşımı</span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="neden-dermamatch" className="pillars-section">
          <div className="page-shell pillars-intro">
            <div className="manifesto-label light reveal-up"><span>DERMAMATCH METODU</span><span>(03)</span></div>
            <h2 className="display-heading inverse reveal-up">Üç sade<br />hareket.</h2>
            <p className="body-copy inverse-soft reveal-up">Her görüşme, cildi hedef alan değil; ciltle ortaklık kuran bir sistemin başlangıcıdır.</p>
          </div>
          <div className="pillars-list page-shell">
            {servicePillars.map((pillar, index) => (
              <article className="pillar-card" key={pillar.number}>
                <div className="pillar-number">{pillar.number}</div>
                <div className="pillar-icon" aria-hidden="true">
                  {index === 0 ? <ScanFace size={26} /> : index === 1 ? <FlaskConical size={26} /> : <Droplets size={26} />}
                </div>
                <div className="pillar-content">
                  <p className="pillar-eyebrow">{pillar.eyebrow}</p>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
                <p className="pillar-accent">{pillar.accent}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="danismanliklar" className="plans-section section-padding">
          <div className="page-shell plans-heading">
            <div>
              <span className="overline reveal-up">KİŞİSEL GÖRÜŞMELER</span>
              <h2 className="display-heading reveal-up">Bakımın,<br /><em>size uyan</em> hali.</h2>
            </div>
            <p className="body-copy reveal-up">İhtiyacınız bir başlangıç, bir yön değişikliği ya da yeni bir ritim olabilir. Aşağıdaki görüşme biçimlerinden size en yakın olanı seçin.</p>
          </div>
          <div className="page-shell plans-layout">
            <div className="plan-tabs" role="tablist" aria-label="Danışmanlık seçimi">
              {consultationPlans.map((plan, index) => (
                <button
                  key={plan.name}
                  role="tab"
                  aria-selected={selectedPlan === index}
                  className={selectedPlan === index ? "active" : ""}
                  onClick={() => setSelectedPlan(index)}
                >
                  <span>0{index + 1}</span><strong>{plan.name}</strong><ArrowUpRight size={18} />
                </button>
              ))}
            </div>
            <article className="plan-detail">
              <div className="plan-detail-top"><span>{consultationPlans[selectedPlan].timing}</span><span>ONLINE / YÜZ YÜZE</span></div>
              <h3>{consultationPlans[selectedPlan].name}</h3>
              <p>{consultationPlans[selectedPlan].summary}</p>
              <ul>
                {consultationPlans[selectedPlan].includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}
              </ul>
              <button className="dark-cta" onClick={() => scrollToSection("#randevu")}>Bu görüşmeyi seç <ArrowRight size={17} /></button>
            </article>
          </div>
        </section>

        <section className="texture-section">
          <div className="texture-card texture-card-one"><span>SOFT</span><span>SCIENCE</span></div>
          <div className="texture-visual"><img src="/manus-storage/noor-ingredient-still-life_8d26945b.png" alt="Serum dokusu ve mat camdan oluşan soyut bakım kompozisyonu" loading="lazy" /></div>
          <div className="texture-card texture-card-two"><span>RITUAL</span><span>OVER</span><span>RUSH</span></div>
        </section>

        <section className="faq-section section-padding">
          <div className="page-shell faq-layout">
            <div className="faq-intro">
              <span className="overline reveal-up">BİLMEK İSTEYEBİLECEKLERİNİZ</span>
              <h2 className="display-heading reveal-up">Sakin bir<br /><em>başlangıç</em> için.</h2>
              <p className="body-copy reveal-up">Danışmanlık sürecini açık ve anlaşılır tutmak, DermaMatch’in bakım anlayışının bir parçasıdır.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div className={`faq-item ${openFaq === index ? "open" : ""}`} key={faq.question}>
                  <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>
                    <span>0{index + 1}</span><strong>{faq.question}</strong><ChevronDown size={20} />
                  </button>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="randevu" className="contact-section">
          <div className="contact-orb contact-orb-one" aria-hidden="true" />
          <div className="contact-orb contact-orb-two" aria-hidden="true" />
          <div className="page-shell contact-layout">
            <div className="contact-copy">
              <span className="overline light reveal-up">BİR NEFESLİK YER AÇIN</span>
              <h2 className="display-heading inverse reveal-up">Cildiniz için<br /><em>bir randevu</em><br />değil, bir<br />buluşma.</h2>
              <p className="body-copy inverse-soft reveal-up">Kısaca kendinizi anlatın. Size en uygun görüşme biçimi ve uygun zamanlar için geri dönelim.</p>
              <div className="contact-notes"><span><ShieldCheck size={16} /> Yargısız alan</span><span><Sparkles size={16} /> Kişisel ritim</span></div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Adınız<input required name="name" placeholder="Adınızı yazın" /></label>
              <label>E-posta adresiniz<input required type="email" name="email" placeholder="merhaba@ornek.com" /></label>
              <label>Size nasıl eşlik edelim?<select name="interest" defaultValue=""><option value="" disabled>Bir görüşme seçin</option>{consultationPlans.map((plan) => <option key={plan.name}>{plan.name}</option>)}</select></label>
              <label>Bir not bırakın<textarea name="note" rows={3} placeholder="Cildiniz, rutininiz veya beklentinizle ilgili birkaç satır..." /></label>
              <button type="submit" className="form-submit">Gönder <ArrowUpRight size={18} /></button>
              {submitted && <p className="form-success" role="status">Teşekkürler. İlk uygun zamanda size dönüş yapılması için notunuzu aldık.</p>}
              <p className="form-disclaimer">Bu form tanı veya tedavi talebi için kullanılmaz. Acil ya da tıbbi bir durum için uygun sağlık profesyoneline başvurun.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-main"><a className="footer-logo" href="#ust">DermaMatch</a><p>Bilimle şekillenen, size ait güzellik ritüelleri.</p><a href="mailto:merhaba@dermamatch.com">merhaba@dermamatch.com <ArrowUpRight size={14} /></a></div>
        <div className="page-shell footer-bottom"><span>© 2026 DermaMatch</span><span>İstanbul · Online</span><button onClick={() => scrollToSection("#ust")}>Yukarı dön <ArrowUpRight size={14} /></button></div>
      </footer>
    </div>
  );
}
