# DermaMatch Görsel Deneyim Araştırması

Parallax yaklaşımında arka plan ile ön planı farklı hızlarda hareket ettirmek, görsel sahnede üç boyutlu derinlik algısı oluşturur. Awwwards’ın parallax seçkisi bu tekniğin yalnızca dekoratif bir kaydırma hilesi değil, anlatı ritmini yönlendiren katmanlı bir araç olarak kullanıldığını gösteriyor.[^1]

Framer University’nin güncel örnekleri, sabit bir çerçeveyi viewport içinde tutup nesneleri kısa kaydırma bölümleriyle dönüştürmenin; ürün hikâyesi, metin açılımı, ortam yakınlaşması ve sınırlı 3B hareket için uygulanabilir bir yapı sunduğunu açıklıyor.[^2] DermaMatch için bu, uzun ve dikkat dağıtan bir animasyon yerine, her bölümün net bir bilgi anına karşılık geldiği bir hareket kurgusu anlamına gelir.

| Araştırma bulgusu | DermaMatch uyarlaması |
| --- | --- |
| Katmanlı parallax derinlik sağlar | Hero’daki sıvı, cam, tanecik ve tipografi farklı hızlarda fakat düşük genlikte hareket edecek |
| Sabit sahne anlatıyı sabitler | Yeni ürün-keşif alanında ürün merkezi sabit kalırken kaydırma metni ve ürün özelliğini değiştirecek |
| Dönüş/ölçek bölümleri ritim yaratır | Ürün şişesi kullanıcı imlecine hafifçe yönelir; seçilen faydaya göre kontrollü açı ve ışık değiştirir |
| Kısa, anlamlı hareket daha etkilidir | Ağır 3B sahne yerine CSS tabanlı illüzyonlar ve optimize video kullanılarak mobil yük korunacak |

Three.js örnek galerisi, kullanıcı etkileşimi, fiziksel ışık, cam geçirgenliği, sıkıştırılmış GLTF varlıklar ve işaretçi odaklı animasyon gibi ayrı bileşenlerin seçici şekilde kullanılabildiğini gösteriyor.[^3] Bu nedenle DermaMatch için ağır bir gerçek zamanlı sahne yerine; işaretçiye duyarlı, CSS 3B perspektifini kullanan ve gerçek 3B model gerektirmeyen bir ürün nesnesi seçilecek. Bu seçim, sinematik etkiyi performans ile dengeler.

Güzellik sitesi örnekleri; tam genişlik video, havadar düzen, kontrollü renk paleti, ince hareketli tanecikler ve ürünün dokusunu çağrıştıran atmosferik görsellerin, ürünün duyusal yönünü dijitalde anlatmaya yardımcı olduğunu vurguluyor.[^4] DermaMatch’te yeni ürün keşif sahnesi; etiket yerine doku, ışık, içerik hissi ve yönlendirilmiş etkileşim üzerinden çalışacak.

[^1]: [Awwwards — Best Parallax Websites](https://www.awwwards.com/websites/parallax/).
[^2]: [Framer University — 10 Scroll Animations](https://framer.university/blog/10-scroll-animations-to-make-your-website-stand-out).
[^3]: [Three.js — Examples](https://threejs.org/examples/).
[^4]: [Qode Interactive — 14 Examples of Gorgeous Skincare and Beauty Websites](https://qodeinteractive.com/magazine/examples-of-gorgeous-skincare-beauty-websites/).
