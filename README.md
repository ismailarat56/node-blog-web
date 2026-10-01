# Node Blog Web

Node Blog API'sindeki yazıları, kategorileri ve yorumları gösteren React uygulaması.

## Gereksinimler

- Node.js 22.22 veya üstü ve npm.
- Docker Compose ile çalışan API stack'i (8080 portu).

## Çalıştırma

1. API projesinin klasöründe servisleri başlat:

   ```bash
   docker compose up -d
   ```

2. Bu projenin klasöründe bağımlılıkları kur ve geliştirme sunucusunu başlat:

   ```bash
   npm install
   npm run dev
   ```

3. Tarayıcıda http://localhost:5173 adresini aç.

Vite proxy, `/api` ve `/uploads` isteklerini `http://127.0.0.1:8080` adresine taşır. Tarayıcı istekleri uygulamayla aynı origin'e gönderir; Vite bunları API'ye iletir.

## Komutlar

| Komut | Görevi |
| --- | --- |
| `npm install` | Bağımlılıkları kurar. |
| `npm run dev` | Geliştirme sunucusunu başlatır. |
| `npm run build` | Üretim dosyalarını `dist/` klasörüne oluşturur. |
| `npm run preview` | Build çıktısını http://localhost:4173 adresinde önizler. |
| `npm run lint` | Oxlint ile kodu kontrol eder. |

Önizlemeden önce `npm run build` çalıştırılmalıdır. `dist/` yeniden üretilebilir bir çıktıdır ve Git'e eklenmez.

## Klasör Yapısı

- `src/api/`: API isteklerini ve hata dönüşümünü yönetir.
- `src/auth/`: Oturum state'ini, Context'i ve token saklamayı yönetir.
- `src/components/`: Sayfalarda kullanılan arayüz bileşenlerini içerir.
- `src/hooks/`: Veri, yüklenme ve hata durumunu yöneten `useApi` gibi ortak hook'ları içerir.
- `src/pages/`: Route'lara karşılık gelen sayfa bileşenlerini içerir.
- `src/utils/`: Tarih biçimlendirme gibi yardımcı fonksiyonları içerir.

## Sayfalar

| Adres | Bileşen | API istekleri |
| --- | --- | --- |
| `/` | `HomePage` | `GET /api/v1/public/posts`, `GET /api/v1/public/categories` |
| `/posts/:slug` | `PostDetailPage` | `GET /api/v1/public/posts/:slug`, `GET /api/v1/public/posts/:slug/comments`, `POST /api/v1/posts/:id/comments`, `DELETE /api/v1/comments/:id` |
| `/login` | `LoginPage` | `POST /api/v1/auth/login` |
| `/register` | `RegisterPage` (henüz eklenmedi) | `POST /api/v1/auth/register` |
| `/verify-email` | `VerifyEmailPage` | `POST /api/v1/auth/email/verify`, `POST /api/v1/auth/email/verify/resend` |
| `/account` | `AccountPage` | Korumalı; veri `AuthContext`'ten gelir. |
| `*` | `NotFoundPage` | — |

`/register` planlanan kayıt sayfasıdır; mevcut uygulamada `RegisterPage.jsx` ve bu rota henüz yoktur.

## Oturum

Access token, `node-blog.access-token` anahtarıyla `sessionStorage`'da tutulur. Böylece sayfa yenilenince korunur; sekme kapanınca silinir. Token yalnız 15 dakika geçerli olduğu için `localStorage` ile daha uzun süre saklanmasına gerek yoktur. Bu seçim API değişikliği gerektirmez; ancak XSS durumunda JavaScript token'ı okuyabilir.

`AuthProvider`, ilk açılışta saklanan token'ı okur. Token varsa `/api/v1/auth/me` isteğiyle oturumu doğrular ve kullanıcı bilgisini geri yükler. Bu sırada durum `checking`, doğrulama başarılıysa `authenticated`, token yoksa veya doğrulama başarısızsa `anonymous` olur.

Çıkışta `POST /api/v1/auth/logout` sunucuda token'ı iptal eder; ardından tarayıcıdaki token ve kullanıcı state'i temizlenir. API isteği başarısız olsa da yerel oturum kapatılır.

Oturumlu istekler `authRequest` üzerinden gönderilir. Bir istek `401` döndürürse yerel oturum kapatılır ve gelinen adres korunarak `/login` sayfasına yönlendirilir. Kullanıcı yeniden giriş yaptığında aynı adrese döner. `403` yanıtında oturum korunur; yetki hatası ilgili bileşende gösterilir.

## Bilinen Sınırlamalar

- Token `sessionStorage`'da; XSS olursa JavaScript tarafından okunabilir (`httpOnly` cookie yok).
- Refresh token yok; token'ın 15 dakikalık süresi dolunca yeniden giriş gerekir.
- Oturum yeni sekmeye taşınmaz; sekme kapanınca biter.
- Oturum geri yüklenirken API'ye ulaşılamazsa oturum kapanır.
- Oturum düşünce yazılmakta olan yorum kaybolur.
- Yeni kod bekleme süresi, sayfaya kayıttan `codeSent` bilgisiyle gelince gösterilir; login'den gelince arayüz önceki kodun ne zaman gönderildiğini bilemez. Sayfadan yeni kod istendikten sonra geri sayım başlar.
- Cevabı olan bir yorum silinince cevapları da listeden kaybolur.
- Yorum düzenleme, şifremi unuttum ve parola değiştirme sayfaları yok.
- Beğeni sayısı yalnız tarayıcı state'inde; API'ye yazılmıyor, sayfa değişince sıfırlanıyor.
- Yorumlar yalnız ilk sayfa (API'nin varsayılan limiti) kadar gösteriliyor.
- Post ve yorum istekleri art arda gidiyor (request waterfall).
- Filtre veya sayfa değişince liste kaybolup yeniden yükleniyor; önceki veri gösterilmiyor.
- API'de CORS ayarı yok; uygulama yalnız aynı origin'den (Vite proxy veya nginx) çalışır.
- Bir component render sırasında hata verirse bütün sayfa boş kalır (error boundary yok).
- Otomatik test yok.

## Sonraki Adımlar

- Yazar paneli: post oluşturma, düzenleme, yayınlama ve kapak yükleme (`FormData`).
- Yorum düzenleme (`PATCH /api/v1/comments/:id`).
- Şifremi unuttum ve parola sıfırlama sayfaları.
- API tarafında refresh token ve `httpOnly` cookie.
- Veri çekmeyi TanStack Query'ye taşımak (önbellek, önceki veriyi tutma).
- `dist/` klasörünü compose'taki nginx ile servis etmek.
- TypeScript.
