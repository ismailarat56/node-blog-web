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

| Komut             | Görevi                                                   |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Bağımlılıkları kurar.                                    |
| `npm run dev`     | Geliştirme sunucusunu başlatır.                          |
| `npm run build`   | Üretim dosyalarını `dist/` klasörüne oluşturur.          |
| `npm run preview` | Build çıktısını http://localhost:4173 adresinde önizler. |
| `npm run lint`    | Oxlint ile kodu kontrol eder.                            |

Önizlemeden önce `npm run build` çalıştırılmalıdır. `dist/` yeniden üretilebilir bir çıktıdır ve Git'e eklenmez.

## Klasör Yapısı

- `src/api/`: API isteklerini ve hata dönüşümünü yönetir.
- `src/auth/`: Oturum state'ini, Context'i ve token saklamayı yönetir.
- `src/components/`: Sayfalarda kullanılan arayüz bileşenlerini içerir.
- `src/hooks/`: Veri, yüklenme ve hata durumunu yöneten `useApi` gibi ortak hook'ları içerir.
- `src/pages/`: Route'lara karşılık gelen sayfa bileşenlerini içerir.
- `src/utils/`: Tarih biçimlendirme gibi yardımcı fonksiyonları içerir.

## Sayfalar

| Adres                       | Bileşen                          | API istekleri                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                         | `HomePage`                       | `GET /api/v1/public/posts`, `GET /api/v1/public/categories`                                                                                                                                                                                                                                                                                                         |
| `/posts/:slug`              | `PostDetailPage`                 | `GET /api/v1/public/posts/:slug`, `GET /api/v1/public/posts/:slug/comments`, `POST /api/v1/posts/:id/comments`, `PATCH /api/v1/comments/:id` (yorum düzenleme), `DELETE /api/v1/comments/:id`                                                                                                                                                                       |
| `/login`                    | `LoginPage`                      | `POST /api/v1/auth/login`                                                                                                                                                                                                                                                                                                                                           |
| `/register`                 | `RegisterPage` (henüz eklenmedi) | `POST /api/v1/auth/register`                                                                                                                                                                                                                                                                                                                                        |
| `/verify-email`             | `VerifyEmailPage`                | `POST /api/v1/auth/email/verify`, `POST /api/v1/auth/email/verify/resend`                                                                                                                                                                                                                                                                                           |
| `/account`                  | `AccountPage`                    | Korumalı; veri `AuthContext`'ten gelir.                                                                                                                                                                                                                                                                                                                             |
| `/dashboard`                | `DashboardPage`                  | Korumalı; `GET /api/v1/posts?user_id=...`, `DELETE /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/restore`                                                                                                                                                                                                                                                            |
| `/dashboard/posts/new`      | `NewPostPage`                    | Korumalı; `POST /api/v1/posts`, `GET /api/v1/public/categories`                                                                                                                                                                                                                                                                                                     |
| `/dashboard/posts/:id/edit` | `EditPostPage`                   | Korumalı; `GET` ve `PATCH /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/publish`, `PATCH /api/v1/posts/:id/unpublish`, `PUT` ve `DELETE /api/v1/posts/:id/cover`, `GET /api/v1/posts/:id/comments?include_hidden=1&limit=50`, `PATCH /api/v1/comments/:id/hide`, `PATCH /api/v1/comments/:id/unhide`, `DELETE /api/v1/comments/:id`, `GET /api/v1/public/categories` |
| `*`                         | `NotFoundPage`                   | —                                                                                                                                                                                                                                                                                                                                                                   |

`/register` planlanan kayıt sayfasıdır; mevcut uygulamada `RegisterPage.jsx` ve bu rota henüz yoktur.

## Oturum

Access token, `node-blog.access-token` anahtarıyla `sessionStorage`'da tutulur. Böylece sayfa yenilenince korunur; sekme kapanınca silinir. Token yalnız 15 dakika geçerli olduğu için `localStorage` ile daha uzun süre saklanmasına gerek yoktur. Bu seçim API değişikliği gerektirmez; ancak XSS durumunda JavaScript token'ı okuyabilir.

`AuthProvider`, ilk açılışta saklanan token'ı okur. Token varsa `/api/v1/auth/me` isteğiyle oturumu doğrular ve kullanıcı bilgisini geri yükler. Bu sırada durum `checking`, doğrulama başarılıysa `authenticated`, token yoksa veya doğrulama başarısızsa `anonymous` olur.

Çıkışta `POST /api/v1/auth/logout` sunucuda token'ı iptal eder; ardından tarayıcıdaki token ve kullanıcı state'i temizlenir. API isteği başarısız olsa da yerel oturum kapatılır.

Oturumlu istekler `authRequest` üzerinden gönderilir. Bir istek `401` döndürürse yerel oturum kapatılır ve gelinen adres korunarak `/login` sayfasına yönlendirilir. Kullanıcı yeniden giriş yaptığında aynı adrese döner. `403` yanıtında oturum korunur; yetki hatası ilgili bileşende gösterilir.

## Yazar Paneli

`/dashboard` üst route'u tek bir `RequireAuth` ile korunur. `DashboardLayout` ortak menüyü gösterir; iç içe route'ların sayfaları `Outlet` içine yerleşir. Liste, yeni yazı ve düzenleme sayfaları aynı oturum kapısını kullanır. Durum filtresi ve sayfa numarası URL'de tutulur: `/dashboard?status=draft&page=2`.

Yeni yazılar her zaman taslak olarak oluşturulur. Başarılı oluşturmadan sonra düzenleme sayfasına gidilir; yayınlama ve yayından kaldırma ayrı API uçlarına yapılan işlemlerdir. `PostForm`, oluşturma ve düzenlemede ortak kullanılır. Düzenlemede yalnız `initialValues` ile farklı olan alanlar `PATCH` gövdesine eklenir; `category_id`, API'ye gönderilirken sayıya çevrilir.

Silme, onay sonrasında soft delete uygular. Silinen yazının id'si ve başlığı sayfa state'inde tutulur; aynı sayfadaki “Geri al” düğmesi `restore` isteği gönderir. Sayfadan ayrılınca bu bilgi kaybolur.

Kapak seçimi kontrolsüz dosya input'u ile yapılır; yerel önizleme için oluşturulan blob URL seçim değiştiğinde veya bileşen kaldırıldığında temizlenir. Dosya, `FormData` içindeki `cover` alanıyla yüklenir. İstemci bu gövdeyi JSON'a çevirmez ve `Content-Type` başlığını elle yazmaz; multipart boundary'yi tarayıcı belirler. Kapak silmenin boş `204` yanıtı JSON okunmadan başarılı kabul edilir.

Düzenleme sayfası yazı sahibi veya admin için gizli yorumları da listeler; yorumları gizleme, gösterme ve silme araçları sunar. Public sayfada yorum metnini yalnız yorum yazarı veya admin düzenleyebilir. Asıl yetki denetimleri API'dedir.

## Bilinen Sınırlamalar

- Token `sessionStorage`'da; XSS olursa JavaScript tarafından okunabilir (`httpOnly` cookie yok).
- Refresh token yok; token'ın 15 dakikalık süresi dolunca yeniden giriş gerekir.
- Oturum yeni sekmeye taşınmaz; sekme kapanınca biter.
- Oturum geri yüklenirken API'ye ulaşılamazsa oturum kapanır.
- Oturum düşünce yazılmakta olan yorum kaybolur.
- Yeni kod bekleme süresi, sayfaya kayıttan `codeSent` bilgisiyle gelince gösterilir; login'den gelince arayüz önceki kodun ne zaman gönderildiğini bilemez. Sayfadan yeni kod istendikten sonra geri sayım başlar.
- Cevabı olan bir yorum silinince cevapları da listeden kaybolur.
- Şifremi unuttum ve parola değiştirme sayfaları yok.
- Eşzamanlı düzenlemede son yazan kazanır; sürüm kontrolü yok.
- “Yayınla” düğmesi formdaki kaydedilmemiş değişiklikleri göndermez.
- Kaydedilmemiş değişiklik uyarısı yok; sayfadan çıkınca değişiklikler kaybolur.
- Arayüzde silinen yazı yalnız aynı sayfadaki “Geri al” ile döner; sonrasında silinmiş yazıları yalnız admin listeleyebilir. Yazar id'yi biliyorsa API'nin `restore` ucunu kullanabilir.
- Kapak yüklemede ilerleme çubuğu yok.
- Moderasyon listesi en fazla 50 üst yorum ve onların cevaplarını gösterir; sayfalama arayüzü yok.
- Beğeni sayısı yalnız tarayıcı state'inde; API'ye yazılmıyor, sayfa değişince sıfırlanıyor.
- Yorumlar yalnız ilk sayfa (API'nin varsayılan limiti) kadar gösteriliyor.
- Post ve yorum istekleri art arda gidiyor (request waterfall).
- Filtre veya sayfa değişince liste kaybolup yeniden yükleniyor; önceki veri gösterilmiyor.
- API'de CORS ayarı yok; uygulama yalnız aynı origin'den (Vite proxy veya nginx) çalışır.
- Bir component render sırasında hata verirse bütün sayfa boş kalır (error boundary yok).
- Repoda kalıcı otomatik test paketi yok; bu oturumdaki geçici tarayıcı kontrolleri örnek API yanıtlarıyla çalıştırıldı.

## API'de Bulduğum Sorunlar

- JSON gövde sınırı `20 KB` (20.480 bayt), içerik sınırı ise 50.000 karakter. Gövde sınırını aşan uzun yazılar validator'a ulaşmadan `413` alıyor; hata kodu `INTERNAL_SERVER_ERROR` oluyor. Gövde sınırı içerik sınırıyla uyumlu hâle getirilmeli ve bu hata için uygun bir kod dönülmeli.
- Boundary'siz multipart istek, `400` yerine `500` dönüyor. Bozuk multipart gövdeleri istemci hatası olarak ele alınmalı.
- Gizli bir üst yorumun cevapları public listede görünmüyor, ancak `comment_count` görünür durumdaki bu cevapları sayıyor. Listeleme ve sayım kuralları aynı görünürlük tanımını kullanmalı.
- Yazılarda sürüm kontrolü yok. İstemcinin okuduğu `updated_at` veya ETag ile koşullu güncelleme yapılabilir; sürüm değişmişse `409` veya `412` döndürülebilir. Sürüm karşılaştırması ve güncelleme atomik olmalı.

## Sonraki Adımlar

- Hesap ayarları: kodla parola değiştirme, şifremi unuttum ve e-posta değiştirme (11.09 ve 15.09 API'leri).
- Admin paneli: kategori yönetimi, silinmiş yazılar ve geri getirme.
- API: yukarıdaki dört sorunu düzeltmek; refresh token ve `httpOnly` cookie eklemek.
- Veri çekmeyi TanStack Query'ye taşımak (önbellek, önceki veriyi tutma).
- `dist/` klasörünü compose'taki nginx ile servis etmek.
- TypeScript.
