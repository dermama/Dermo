# DermaMatch — Vercel Dağıtım Notu

DermaMatch; **Vite istemcisi**, Vercel’in `/api/trpc.js` CommonJS fonksiyonu, **Neon Postgres** ve **Gmail SMTP** birlikte kullanılarak dağıtılır. `vercel.json` Vite çıktısını `dist/public` altında sunar; Vercel, proje kökündeki `api/` dosyalarını ayrıca Functions olarak algılar. Bu nedenle `/yonetim`, `/gorusme/:benzersiz-token` ve ana sayfa istemci taraflı SPA yollarıdır; `/api/trpc/*` ise dinamik arka uç yoludur.[^1][^2]

## Mimari ve güvenlik sınırları

| Katman | Uygulama | Amaç |
| --- | --- | --- |
| İstemci | React + Vite + Wouter | Başvuru formu, yönetim alanı ve görüşme odası |
| API | `api/trpc.js` | Başvuru, yönetim parolası, token doğrulaması ve mesajlaşma |
| Veri | Neon Postgres + Drizzle | Başvurular, onam zamanları, token hash’leri, oturumlar ve mesajlar |
| E-posta | Gmail SMTP | Kabul bildirimi ve özel görüşme URL’si |

Ham görüşme tokeni yalnız kabul anında üretilir ve e-postaya eklenir; veritabanında yalnız SHA-256 hash’i saklanır. Görüşme erişimi tam olarak yedi gün sonra sona erer; yönetici oturumu ayrıca on iki saatlik imzalı, `httpOnly` çerez kullanır. Yönetici bir görüşmeyi kapattığında ilgili URL anında geçersiz olur.

`pnpm run vercel-build`, kaynak dosya `server/vercel/trpc.ts` içinden sürümlenmiş `api/trpc.js` CommonJS paketini üretir. Bu paket tRPC, Drizzle, Neon, Nodemailer ve token güvenliği bağımlılıklarını işlevin içine alır; `api/trpc.js` elle düzenlenmemelidir. Değişiklikler kaynak TypeScript dosyasında yapılmalı ve ardından bu derleme komutu çalıştırılmalıdır.

## Gerekli Vercel ortam değişkenleri

| Değişken | Kaynak | Zorunluluk |
| --- | --- | --- |
| `DATABASE_URL` | Neon Vercel entegrasyonu | Zorunlu |
| `JWT_SECRET` | Güçlü rastgele sunucu sırrı | Zorunlu |
| `ADMIN_DASHBOARD_PASSWORD` | Yönetici tarafından belirlenen güçlü parola | Zorunlu |
| `GMAIL_SMTP_USER` | Gönderim yapacak Gmail adresi | E-posta kabul bildirimi için zorunlu |
| `GMAIL_SMTP_APP_PASSWORD` | Google Account App Password | E-posta kabul bildirimi için zorunlu |
| `PUBLIC_APP_URL` | Canlı DermaMatch alan adı | Zorunlu |
| `INSTAGRAM_URL` | İsteğe bağlı profil URL’si | İsteğe bağlı |
| `THREADS_URL` | İsteğe bağlı profil URL’si | İsteğe bağlı |

> Gmail hesabınızda iki adımlı doğrulama açık olmalı ve `GMAIL_SMTP_APP_PASSWORD` olarak normal Gmail parolası değil, Google’ın ürettiği 16 haneli **App Password** kullanılmalıdır. Bu App Password kaynak koda veya GitHub deposuna kesinlikle yazılmaz.[^3]

Gmail ile gönderim için Google Account → Security → App Passwords alanından, DermaMatch adına yeni bir App Password oluşturun. Vercel Production ortamında yalnızca Gmail adresini `GMAIL_SMTP_USER`, üretilen App Password değerini ise `GMAIL_SMTP_APP_PASSWORD` olarak saklayın. Hesabın normal Gmail parolasını hiçbir yerde kullanmayın.

## Neon migration uygulaması

Bu depodaki `drizzle/0000_needy_wasp.sql`, **Postgres** biçimindedir. Manus geliştirme veritabanı TiDB/MySQL olduğundan bu migration Manus SQL aracıyla uygulanamaz. Vercel’e bağlı Neon veritabanında şu yöntemlerden biriyle uygulanmalıdır:

1. Neon SQL Editor üzerinden `drizzle/0000_needy_wasp.sql` dosyasının tamamını çalıştırın.
2. Ya da bilgisayarınızda Vercel’in `DATABASE_URL` değerini yalnız o oturum için tanımlayıp `pnpm drizzle-kit migrate` çalıştırın.

Migration; yalnız yeni enum, tablo, unique constraint ve foreign key oluşturur; `DROP` veya veri silen `ALTER` içermez.

## Canlıya alma ve doğrulama

1. [GitHub deposunun](https://github.com/dermama/Dermo) `main` dalını Vercel projesine bağlı tutun.
2. Yukarıdaki ortam değişkenlerini Vercel’de **Production** ve test için gerekirse **Preview** kapsamına ekleyin.
3. Neon migrationını üretim veritabanına uygulayın.
4. `pnpm run vercel-build` komutuyla bağımsız API paketini yenileyin, ardından GitHub’a gelen değişikliği dağıtın; Vercel Functions derlenirken `/api/trpc.js` görülmelidir.
5. `/yonetim` altında parola ile giriş yapın, örnek olmayan gerçek bir test başvurusunu kabul edin, e-postayı ve `/gorusme/<token>` odasını doğrulayın. Ardından yönetimden bağlantıyı kapatıp URL’nin erişilemez olduğunu kontrol edin.

> KVKK/açık rıza metni kullanıcı arayüzünde **taslak** olarak işaretlenmiştir. Canlıya alma öncesinde Türkiye’de yetkin hukuk ve KVKK uyum uzmanı tarafından incelenmelidir.

[^1]: [Vercel — Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
[^2]: [Vercel — Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
[^3]: [Google Account Help — Sign in with app passwords](https://support.google.com/mail/answer/185833?hl=en)
