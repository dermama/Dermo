# DermaMatch Görsel Yenileme Planı

## Tasarım Kararı

DermaMatch’in yeni deneyimi, güzellik reklamı gibi davranan yoğun bir WebGL sahnesi yerine **editoryal sinema ile kontrollü ürün etkileşimini** birleştirecek. Böylece site hem daha özgün ve katmanlı hissedecek hem de mobil cihazlarda sakin, okunabilir ve hızlı kalacaktır. Araştırma, parallax derinliğinin katmanlar arasındaki hız farkıyla; sabit sahne anlatımının ise kısa kaydırma bölümleriyle güçlü bir hikâye kurabildiğini gösteriyor.[^1] [^2]

| Bölüm | Yenileme | Kullanıcı etkisi | Uygulama yaklaşımı |
| --- | --- | --- | --- |
| Hero | Cam, sıvı, ışık ve metinden oluşan dört parallax düzlemi; imlece duyarlı ışık yansıması | İlk bakışta derinlik ve premium atmosfer | Mevcut videonun üstünde CSS `transform` katmanları; düşük genlikli işaretçi hareketi |
| Formula Explorer | Etiketsiz bir DermaMatch serum objesi; kullanıcı imleciyle hafif yön değiştirir, üç bakım odağı seçildikçe ışık/renk/anlatı değişir | Ürünü pasif bir görsel olmaktan çıkarıp keşfedilebilir bir objeye dönüştürür | Gerçek zamanlı WebGL yerine AI üretimli ürün render’ı, CSS 3B perspektifi ve state tabanlı etkileşim |
| Scroll Specimen | Sık kullanılan bir ürün sahnesi sayfa içinde sabit kalır; metin kaydıkça ürünün açısı, arka plan halkaları ve kısa özellik notu değişir | Kaydırmayı anlatının parçası haline getirir | `IntersectionObserver` ile faz geçişi, isteğe bağlı hafif `translateY` parallax |
| Hizmet Kartları | Kartların üzerinde ışık kesiti, ince kenar akışı ve odak değişimi | Bilgi yoğun bölümlere duyusal geri bildirim ekler | CSS mask/gradient, kısa hover ve klavye odağı geçişleri |
| İletişim | Form arkasında yavaş hareket eden ışık halkaları ve seçime karşılık gelen küçük sinyal | Dönüşüm anını daha anlamlı ama sakin kılar | Yalnızca `opacity` ve `transform` ile çalışan düşük maliyetli hareket |

## Hareket Sistemi

Hareket, kullanıcının dikkatini çalmak yerine içeriğin ritmini destekleyecek. Yüksek frekanslı etkileşimler 160–240 ms aralığında kalacak; hero ve ürün sahnesi gibi seyrek karşılaşılan anlarda daha yumuşak 500–800 ms geçişler kullanılacak. Kaydırma ile tetiklenen ürün fazları, her biri tek bir mesajı taşıyan üç kısa aşamaya bölünecek: **Dengele**, **Seç**, **Koru**.

> Parallax, dekoratif gürültü olarak değil; camın, sıvının, tipografinin ve ışığın birbirinden farklı fiziksel düzlemlerde algılanmasını sağlayan bir derinlik aracı olarak kullanılacaktır.

| Etkileşim | Masaüstü | Mobil / dokunmatik | Azaltılmış hareket tercihi |
| --- | --- | --- | --- |
| Hero ışık alanı | İmleci yumuşakça takip eder | Sabit atmosferik ışık | Statik arka plan |
| 3B ürün yönelimi | İmlece göre 4–7 derece dönüş | Seçim düğmesine göre sınırlı açı değişimi | Düz, sabit ürün görünümü |
| Scroll Specimen | Fazlar arası yumuşak geçiş | Kaydırma eşiğinde anlık ama sakin geçiş | İlk faz görünür, diğerleri metinle erişilir |
| Kart vurgusu | Hover ışığı ve hafif yükselme | Dokunma sonrası aktif durum | Renk/kenar değişimi; dönüş yok |

## Varlık Planı

Yeni sahne için üç özgün varlık hazırlanacaktır: yarı saydam buzlu cam şişe render’ı, ürünün etrafında dönen soyut serum halkalarını gösteren kısa bir video döngüsü ve cilt/serum dokusunu çağrıştıran yakın plan arka plan görseli. Bu varlıklar, marka etiketi veya gerçek ürün iddiası içermeyen konsept görseller olacak; sayfanın danışmanlık niteliğini koruyacaktır.

## Başarı Ölçütleri

Yenileme tamamlandığında masaüstü ve mobilde ürün sahnesi okunabilir kalmalı, etkileşimler klavyeyle erişilebilir olmalı ve `prefers-reduced-motion` seçeneği tüm zorunlu olmayan hareketleri durdurmalıdır. İstemci paketi mevcut performans sınırını aşmayacak; video yalnızca hero/ürün sahnesi görünür olduğunda oynatılacaktır.

[^1]: [Awwwards — Best Parallax Websites](https://www.awwwards.com/websites/parallax/).
[^2]: [Framer University — 10 Scroll Animations](https://framer.university/blog/10-scroll-animations-to-make-your-website-stand-out).
