# DermaMatch — Vercel Dağıtım Notu

DermaMatch, Vercel üzerinde **statik bir Vite tek sayfa uygulaması** olarak dağıtılacak şekilde yapılandırılmıştır. `vercel.json`, Vercel’in yalnızca istemci derlemesini üretmesini ve `dist/public` klasörünü sunmasını sağlar. Bu yaklaşım, proje içindeki Manus geliştirme sunucusunun Vercel üzerinde dinleyen bir HTTP servisi olarak başlatılmasını engeller.

## Hata tanısı

Paylaşılan Vercel kaydında ayrı bir hata satırı görünmüyor; ancak kaydın son bölümü `server.listen(...)` kullanan Express başlangıç kodunu gösteriyor. Bu sunucu, Manus’un sürekli çalışan geliştirme/üretim düzeni için tasarlanmıştır ve Vercel’in statik Vite dağıtımında kullanılmamalıdır. Bu nedenle Vercel yapılandırması, `pnpm build` içindeki Express paketini değil, yalnızca `pnpm exec vite build` komutunun oluşturduğu istemci çıktısını yayınlar.

## Vercel ayarları

GitHub deposunu içe aktarırken kök dizini depo kökünde bırakın. `vercel.json` aşağıdaki ayarları otomatik uygular.

| Ayar | Değer |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `pnpm exec vite build` |
| Output Directory | `dist/public` |
| SPA yönlendirme | Tüm yollar `index.html` dosyasına yeniden yazılır |

## Ortam değişkenleri

Mevcut tanıtım deneyimi, görüntülenmek için zorunlu bir ortam değişkenine ihtiyaç duymaz. Manus’a özgü analiz betiği dışa aktarılan HTML kabuğundan kaldırılmıştır; bu nedenle Vercel proje ayarlarında bu site için Manus analiz değişkeni tanımlamanıza gerek yoktur.

Bu dışa aktarılan sürüm; Express, tRPC, Manus OAuth ve veritabanı işlevlerini çalıştırmaz. Ana sayfa bu uç noktalara çağrı yapmadığı için görsel deneyim statik olarak çalışır. Gelecekte kimlik doğrulama, veri kaydı veya form gönderimini gerçek bir arka uca bağlamak isterseniz, bunlar için ayrıca Vercel Functions ya da uyumlu bir barındırılan API katmanı kurulmalıdır.

## Dağıtım akışı

1. [GitHub deposunu](https://github.com/dermama/Dermo) Vercel’e aktarın.
2. Vercel’in `vercel.json` içindeki ayarları algıladığını kontrol edin.
3. **Deploy** düğmesini kullanın.
4. Sayfayı doğrudan bir alt URL’den açarak SPA yönlendirmesini kontrol edin.

> Vercel, Vite projeleri için özel üretim komutu ve çıktı klasörü tanımlamayı destekler; tek sayfa Vite uygulamalarında doğrudan bağlantıların çalışması için yeniden yazma kuralı gerekir.[^1][^2]

[^1]: [Vercel — Configuring a Build](https://vercel.com/docs/builds/configure-a-build)
[^2]: [Vercel — Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
