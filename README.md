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

Vite proxy, `/api`, `/uploads` ve `/health` isteklerini `http://127.0.0.1:8080` adresine taşır. Tarayıcı istekleri uygulamayla aynı origin'e gönderir; Vite bunları API'ye iletir. Bu geliştirme ayarıdır; üretimde bu yolların web sunucusunda da yönlendirilmesi gerekir.

## Komutlar

| Komut             | Görevi                                                   |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Bağımlılıkları kurar.                                    |
| `npm run dev`     | Geliştirme sunucusunu başlatır.                          |
| `npm run build`   | Üretim dosyalarını `dist/` klasörüne oluşturur.          |
| `npm run preview` | Build çıktısını http://localhost:4173 adresinde önizler. |
| `npm run lint`    | Oxlint ile kodu kontrol eder.                            |

Önizlemeden önce `npm run build` çalıştırılmalıdır. `dist/` yeniden üretilebilir bir çıktıdır ve Git'e eklenmez.

## Sürüm Doğrulaması: blog-web-v5

04.10 yönetim paneli çalışmasının sürüm kapanışı 06.10.2026'da doğrulandı. `lazy` tanımları ve `AdminLayout` içindeki `Suspense`, mevcut `b58eb8c` commit'inde zaten bulunuyordu. `perf: lazy load admin pages` commit'i bu uygulamanın paket ve tarayıcı doğrulama kaydını ekler; `docs: update readme and daily summary` commit'i README ve gün sonu özetini tamamlar.

Eksik `blog-web-v4` etiketi, yönetim panelinden önceki 03.10 son commit'i olan `09867a2` üzerine eklendi. `blog-web-v5`, 04.10 işlerinin doğrulanmış kapanışını işaretler.

`blog-web-v5` sürümündeyken kontrol et:

```bash
git status
git describe --tags
git log --oneline blog-web-v4..blog-web-v5
npm run build
npm run lint
```

Çalışma ağacı temiz, `git describe --tags` çıktısı `blog-web-v5` olmalı; commit aralığında yukarıdaki `perf:` ve `docs:` başlıkları görünmeli. Paket boyutları ve tarayıcı sonuçları [doğrulama kaydında](notes/admin-lazy-verification-06-10-2026.json), yöntem ve bulgular [04.10 gün sonu özetinde](notes/daily-summary-04-10-2026.md#06102026-tamamlama-doğrulaması) bulunur.

## Klasör Yapısı

- `src/api/`: API isteklerini ve hata dönüşümünü yönetir.
- `src/api/health.js`: `/health` kontrolünü yapar; API istemcisindeki bağlantı sorunlarını `api:trouble` olayıyla duyurur.
- `src/auth/`: Oturum state'ini, Context'i ve token saklamayı yönetir.
- `src/auth/token-expiry.js`: JWT payload'ındaki `exp` değerini milisaniyeye çevirir; token imzasını doğrulamaz.
- `src/components/`: Sayfalarda kullanılan arayüz bileşenlerini içerir. `AccountLayout.jsx` hesap menüsünü ve alt sayfaları birleştirir; `CodeField.jsx` doğrulama kodundan rakam dışı karakterleri temizler.
- `src/components/ApiStatusBanner.jsx`: API'ye ulaşılamadığında uyarı ve elle tekrar deneme düğmesi gösterir.
- `src/components/ErrorBoundary.jsx`: Ana içerikteki render hatasında yeniden deneme ve ana sayfaya dönüş ekranı gösterir; yol değişince hatayı temizler.
- `src/components/SessionExpiryNotice.jsx`: Oturumun son 120 saniyesinde geri sayım ve kaydetme hatırlatması gösterir.
- `src/components/RequireAdmin.jsx`: Oturum kontrolünden sonra admin rolünü kontrol eden arayüz kapısı.
- `src/components/AdminLayout.jsx`: Yönetim sekmeleri, `Outlet` ve sayfa yüklenirken gösterilen `Suspense` sınırı.
- `src/components/ConfirmDialog.jsx`: `showModal()` ile açılan, ortak silme ve değişiklik onay penceresi.
- `src/components/admin/`: Yönetim tablolarına özel `SortableHeader`, `CategoryRow`, `CategoryForm`, `AdminPostRow` ve `UserRow`; kullanıcı oluşturma/düzenleme için `UserForm`, kullanıcıya ait yazılar için `UserPostList` bileşenleri.
- `src/hooks/`: Veri, yüklenme ve hata durumunu yöneten `useApi` gibi ortak hook'ları içerir. `useCountdown.js`, her çağrı için bağımsız state ve zamanlayıcıyla geri sayım sağlar.
- `src/hooks/useDebouncedValue.js`: Arama değeri değişmeyi bıraktığında gecikmeli değeri üretir; bekleyen zamanlayıcıyı cleanup ile temizler.
- `src/hooks/useApiHealth.js`: İlk açılışta, bağlantı sorunu bildirildiğinde ve sekmeye dönüldüğünde sağlığı kontrol eder; API erişilemiyorsa 10 saniyelik tekrar deneme zamanlar.
- `src/pages/`: Route'lara karşılık gelen sayfa bileşenlerini içerir.
- `src/pages/admin/`: `lazy` ile yüklenen kategori, yazı ve kullanıcı listeleri; kullanıcı detayı/düzenlemesi için `AdminUserPage`, hesap oluşturmak için `AdminNewUserPage`.
- `src/utils/`: Tarih biçimlendirme gibi yardımcı fonksiyonları içerir. `code-errors.js` kod işlemlerinin hata mesajlarını, `format-countdown.js` geri sayımın dakika:saniye biçimini ortaklaştırır.
- `src/utils/slugify.js`: Türkçe karakter dönüşümü ve uzunluk sınırıyla addan slug önerisi üretir.
- `src/utils/category-form.js`: Boş kategori formunu ve API kaydından form değerlerine dönüşümü tanımlar.
- `src/utils/category-status.js`: Silindi, Aktif ve Pasif etiketlerini belirler; silinme durumuna öncelik verir.
- `src/utils/user-form.js`: Kullanıcı formunun başlangıç değerlerini ve API hata kodlarının alan mesajlarına dönüşümünü tanımlar.
- `src/utils/user-filters.js`: Kullanıcı listesinin aktiflik, silinenleri gösterme, sıralama ve sayfa seçimlerini URL parametrelerinden okur ve URL'ye yazılacak biçime çevirir.

## Sayfalar

| Adres                       | Bileşen                          | API istekleri                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                         | `HomePage`                       | `GET /api/v1/public/posts`, `GET /api/v1/public/categories`                                                                                                                                                                                                                                                                                                         |
| `/posts/:slug`              | `PostDetailPage`                 | `GET /api/v1/public/posts/:slug`, `GET /api/v1/public/posts/:slug/comments`, `POST /api/v1/posts/:id/comments`, `PATCH /api/v1/comments/:id` (yorum düzenleme), `DELETE /api/v1/comments/:id`                                                                                                                                                                       |
| `/login`                    | `LoginPage`                      | `POST /api/v1/auth/login`                                                                                                                                                                                                                                                                                                                                           |
| `/register`                 | `RegisterPage` (henüz eklenmedi) | `POST /api/v1/auth/register`                                                                                                                                                                                                                                                                                                                                        |
| `/forgot-password` | `ForgotPasswordPage` | `POST /api/v1/auth/password/forgot` (`useActionState`) |
| `/reset-password` | `ResetPasswordPage` | `POST /api/v1/auth/password/reset`, `POST /api/v1/auth/password/forgot` (yeni kod) |
| `/verify-email`             | `VerifyEmailPage`                | `POST /api/v1/auth/email/verify`, `POST /api/v1/auth/email/verify/resend`                                                                                                                                                                                                                                                                                           |
| `/account` | `AccountPage` | Korumalı; `AccountLayout` içinde (Bilgiler · Parola · E-posta), veri `AuthContext`'ten gelir. |
| `/account/password` | `ChangePasswordPage` | Korumalı; `POST /api/v1/auth/password/change-code`, `PATCH /api/v1/auth/password` |
| `/account/email` | `ChangeEmailPage` | Korumalı; `POST /api/v1/auth/email/change`, `POST /api/v1/auth/email/change/confirm` (`useReducer`) |
| `/dashboard`                | `DashboardPage`                  | Korumalı; `GET /api/v1/posts?user_id=...`, `DELETE /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/restore`                                                                                                                                                                                                                                                            |
| `/dashboard/posts/new`      | `NewPostPage`                    | Korumalı; `POST /api/v1/posts`, `GET /api/v1/public/categories`                                                                                                                                                                                                                                                                                                     |
| `/dashboard/posts/:id/edit` | `EditPostPage`                   | Korumalı; `GET` ve `PATCH /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/publish`, `PATCH /api/v1/posts/:id/unpublish`, `PUT` ve `DELETE /api/v1/posts/:id/cover`, `GET /api/v1/posts/:id/comments?include_hidden=1&limit=50`, `PATCH /api/v1/comments/:id/hide`, `PATCH /api/v1/comments/:id/unhide`, `DELETE /api/v1/comments/:id`, `GET /api/v1/public/categories` |
| `/admin` | `AdminCategoriesPage` | Korumalı + admin; `GET`/`POST /api/v1/categories`, `PATCH`/`DELETE /api/v1/categories/:id`, `PATCH /api/v1/categories/:id/restore` (`lazy`) |
| `/admin/posts` | `AdminPostsPage` | Korumalı + admin; `GET /api/v1/posts?include_deleted=1` (silinenleri göster seçiliyken), `DELETE /api/v1/posts/:id`, `PATCH /api/v1/posts/:id/restore` (`lazy`) |
| `/admin/users` | `AdminUsersPage` | Korumalı + admin; `GET /api/v1/users?include_deleted=1` (silinenleri göster seçiliyken), `PATCH /api/v1/users/:id/role`, `PATCH`/`DELETE /api/v1/users/:id`, `PATCH /api/v1/users/:id/restore` (`lazy`) |
| `/admin/users/new` | `AdminNewUserPage` | Korumalı + admin; `POST /api/v1/users` (`lazy`) |
| `/admin/users/:id` | `AdminUserPage` | Korumalı + admin; `GET /api/v1/users/:id`, `PATCH /api/v1/users/:id`, `GET /api/v1/posts?user_id=...` (`lazy`) |
| `*` | `NotFoundPage` | — |

`/register` planlanan kayıt sayfasıdır; mevcut uygulamada `RegisterPage.jsx` ve bu rota henüz yoktur.

## API Kapsamı

06.10.2026 kaynak kontrolüne göre uygulama, **48 uygulama ucundan 43'üne ve ayrıca `GET /health` ucuna bağlı**. İstenen **44/48 + `/health` hedefi**, kayıt ekranı tamamlandığında sağlanacak: mevcut `App.jsx` içinde `/register` route'u ve kaynakta `POST /api/v1/auth/register` çağrısı yok. Sayfalar tablosundaki planlanan kayıt satırı bağlantı sayısına katılmadı.

Her HTTP yöntemi + yol çifti bir uç sayılır; query filtreleri yeni bir uç değildir. `/health`, yüklenen dosyalar ve yalnız geliştirmeye ait `/api/v1/dev/mail-outbox/latest` 48 uygulama ucunun dışında tutulur. “Bağlı”, frontend'de çağrı akışı bulunduğu anlamına gelir; bütün uçların canlı API ile yeniden test edildiği anlamına gelmez. Aşağıdaki yollar `/api/v1` önekiyle kullanılır.

| Grup | API'deki uç | Arayüze bağlı |
| --- | ---: | ---: |
| Public | 4 | 4 |
| Oturum ve hesap | 12 | 11 |
| Kullanıcılar | 8 | 7 |
| Kategoriler | 7 | 5 |
| Yazılar ve kapak | 11 | 10 |
| Yorumlar | 6 | 6 |
| **Toplam** | **48** | **43** |
| Sağlık (ayrı) | 1 | 1 |

| Yöntem | Yol | Durum / kullanan ekran veya bileşen |
| --- | --- | --- |
| GET | `/public/posts` | Bağlı — HomePage |
| GET | `/public/posts/:slug` | Bağlı — PostDetailPage |
| GET | `/public/posts/:slug/comments` | Bağlı — CommentList |
| GET | `/public/categories` | Bağlı — CategoryFilter, PostForm |
| POST | `/auth/login` | Bağlı — LoginPage / AuthProvider |
| POST | `/auth/register` | Eksik — RegisterPage ve route henüz yok |
| GET | `/auth/me` | Bağlı — AuthProvider |
| POST | `/auth/logout` | Bağlı — AuthProvider / Header |
| POST | `/auth/email/verify` | Bağlı — VerifyEmailPage |
| POST | `/auth/email/verify/resend` | Bağlı — VerifyEmailPage |
| POST | `/auth/password/forgot` | Bağlı — ForgotPasswordPage, ResetPasswordPage |
| POST | `/auth/password/reset` | Bağlı — ResetPasswordPage |
| POST | `/auth/password/change-code` | Bağlı — ChangePasswordPage |
| PATCH | `/auth/password` | Bağlı — ChangePasswordPage |
| POST | `/auth/email/change` | Bağlı — ChangeEmailPage |
| POST | `/auth/email/change/confirm` | Bağlı — ChangeEmailPage |
| GET | `/users` | Bağlı — AdminUsersPage |
| GET | `/users/:id` | Bağlı — AdminUserPage |
| POST | `/users` | Bağlı — AdminNewUserPage |
| PUT | `/users/:id` | Bilinçli olarak kullanılmıyor — PATCH tercih ediliyor |
| PATCH | `/users/:id` | Bağlı — AdminUserPage, AdminUsersPage |
| DELETE | `/users/:id` | Bağlı — AdminUsersPage |
| PATCH | `/users/:id/restore` | Bağlı — AdminUsersPage |
| PATCH | `/users/:id/role` | Bağlı — AdminUsersPage |
| GET | `/categories` | Bağlı — AdminCategoriesPage |
| GET | `/categories/:id` | Bilinçli olarak kullanılmıyor — liste aynı alanları veriyor |
| POST | `/categories` | Bağlı — AdminCategoriesPage |
| PUT | `/categories/:id` | Bilinçli olarak kullanılmıyor — PATCH tercih ediliyor |
| PATCH | `/categories/:id` | Bağlı — AdminCategoriesPage / CategoryRow |
| DELETE | `/categories/:id` | Bağlı — AdminCategoriesPage |
| PATCH | `/categories/:id/restore` | Bağlı — AdminCategoriesPage |
| GET | `/posts` | Bağlı — DashboardPage, AdminPostsPage, UserPostList |
| GET | `/posts/:id` | Bağlı — EditPostPage |
| POST | `/posts` | Bağlı — NewPostPage |
| PUT | `/posts/:id` | Bilinçli olarak kullanılmıyor — PATCH tercih ediliyor |
| PATCH | `/posts/:id` | Bağlı — EditPostPage |
| DELETE | `/posts/:id` | Bağlı — DashboardPage, AdminPostsPage |
| PATCH | `/posts/:id/restore` | Bağlı — DashboardPage, AdminPostsPage |
| PATCH | `/posts/:id/publish` | Bağlı — PostStatusActions |
| PATCH | `/posts/:id/unpublish` | Bağlı — PostStatusActions |
| PUT | `/posts/:id/cover` | Bağlı — CoverEditor; bu PUT, kullanılmayan üç kayıt değiştirme ucundan farklıdır |
| DELETE | `/posts/:id/cover` | Bağlı — CoverEditor |
| GET | `/posts/:id/comments` | Bağlı — CommentModeration |
| POST | `/posts/:id/comments` | Bağlı — CommentForm |
| PATCH | `/comments/:id` | Bağlı — CommentForm |
| DELETE | `/comments/:id` | Bağlı — CommentItem, CommentModeration |
| PATCH | `/comments/:id/hide` | Bağlı — CommentModeration |
| PATCH | `/comments/:id/unhide` | Bağlı — CommentModeration |

**Bilinçli olarak bağlanmayan dört uç:**

- `PUT /users/:id`: Bütün değiştirme alanlarını tekrar göndermek yerine PATCH yalnız değişen kullanıcı alanlarını gönderiyor.
- `PUT /posts/:id`: Formun eski kopyasındaki bütün alanları göndermek, başka birinin bu sırada değiştirdiği alanları ezebilir; PATCH yalnız değişen alanları gönderiyor.
- `PUT /categories/:id`: Aynı nedenle bütün kayıt yerine değişen kategori alanları PATCH ile gönderiliyor. PUT, sözleşmesindeki tam değiştirme alanlarını ister.
- `GET /categories/:id`: Yönetim listesi detay formunun ihtiyaç duyduğu aynı alanları zaten veriyor; ek GET gerekmiyor. Bu uç public değil, giriş istiyor.

PATCH, değiştirilmeyen alanları göndermeyerek gereksiz üzerine yazmayı azaltır; aynı alanı iki kişinin değiştirmesi sorununu tek başına çözmez. Bunun için API'de sürüm/ETag kontrolü gerekir. Bu dört tasarım tercihine **ek olarak** `POST /auth/register` henüz bağlanmamış bir iştir; bu yüzden mevcut sayı 44 değil 43'tür.

## Oturum

Access token, `node-blog.access-token` anahtarıyla `sessionStorage`'da tutulur. Böylece sayfa yenilenince korunur; sekme kapanınca silinir. Token yalnız 15 dakika geçerli olduğu için `localStorage` ile daha uzun süre saklanmasına gerek yoktur. Bu seçim API değişikliği gerektirmez; ancak XSS durumunda JavaScript token'ı okuyabilir.

`AuthProvider`, ilk açılışta saklanan token'ı okur. Token varsa `/api/v1/auth/me` isteğiyle oturumu doğrular ve kullanıcı bilgisini geri yükler. Bu sırada durum `checking`, doğrulama başarılıysa `authenticated`, token yoksa veya doğrulama başarısızsa `anonymous` olur.

Çıkışta `POST /api/v1/auth/logout` sunucuda token'ı iptal eder; ardından tarayıcıdaki token ve kullanıcı state'i temizlenir. API isteği başarısız olsa da yerel oturum kapatılır.

Oturumlu istekler `authRequest` üzerinden gönderilir. Bir istek `401` döndürürse yerel oturum kapatılır ve gelinen adres korunarak `/login` sayfasına yönlendirilir. Kullanıcı yeniden giriş yaptığında aynı adrese döner. `403` yanıtında oturum korunur; yetki hatası ilgili bileşende gösterilir.

Parola değişince veya sıfırlanınca API bütün oturumları geçersiz kılar: token'ın `iat` değeri `password_changed_at` değerinden eskiyse (`iat < password_changed_at`) token bayat sayılır. Parola değiştirme isteğinin token'ı ayrıca iptal edilir. Diğer cihazlar bunu sonraki yetkili isteklerinde öğrenir. Arayüz, başarılı parola değişikliğinde `closeSession` ile kendi token ve kullanıcı state'ini temizleyip e-posta ve başarı mesajıyla `/login` sayfasına gider; merkezi 401 yönetimi de aynı fonksiyonu kullanır. `closeSession`, oturum temizliği ve `replace: true` ile yönlendirmeyi `startTransition` içinde toplar. Böylece oturum kapanmışken korumalı adresin hâlâ ekranda olduğu ara render'da `RequireAuth`'un kendi yönlendirmesiyle mesajı ve e-postayı değiştirmesi önlenir. Tokensız parola sıfırlama sayfası ise başarı mesajı ve e-postayla doğrudan giriş sayfasına yönlenir.

E-posta değişikliği onaylandığında API'nin döndürdüğü güncel kullanıcı `updateUser(data)` ile Context'e yazılır. Hesap bilgileri ve tamamlanma ekranı adresi `auth.user` üzerinden okuduğu için yeni adresi hemen kullanır. Sunucudaki değişiklik Context'teki eski kopyayı kendiliğinden yenilemez; ayrıca `/auth/me` isteği göndermeye gerek yoktur.

`readTokenExpiry`, JWT'deki saniye cinsinden `exp` değerini milisaniyeye çevirir. `AuthProvider`, bu saate bir zamanlayıcı kurar ve `visibilitychange` olayında da süreyi kontrol eder. `useEffectEvent` içindeki kapanış callback'i güncel konumu okuyarak `closeSession` çağırır. `SessionExpiryNotice`, son 120 saniyede kalan süreyi gösterir; uyarı otomatik kayıt veya oturum yenileme yapmaz.

## Yazar Paneli

`/dashboard` üst route'u tek bir `RequireAuth` ile korunur. `DashboardLayout` ortak menüyü gösterir; iç içe route'ların sayfaları `Outlet` içine yerleşir. Liste, yeni yazı ve düzenleme sayfaları aynı oturum kapısını kullanır. Durum filtresi ve sayfa numarası URL'de tutulur: `/dashboard?status=draft&page=2`.

Yeni yazılar her zaman taslak olarak oluşturulur. Başarılı oluşturmadan sonra düzenleme sayfasına gidilir; yayınlama ve yayından kaldırma ayrı API uçlarına yapılan işlemlerdir. `PostForm`, oluşturma ve düzenlemede ortak kullanılır. Düzenlemede yalnız `initialValues` ile farklı olan alanlar `PATCH` gövdesine eklenir; `category_id`, API'ye gönderilirken sayıya çevrilir.

Silme, onay sonrasında soft delete uygular. Silinen yazının id'si ve başlığı sayfa state'inde tutulur; aynı sayfadaki “Geri al” düğmesi `restore` isteği gönderir. Sayfadan ayrılınca bu bilgi kaybolur.

Kapak seçimi kontrolsüz dosya input'u ile yapılır; yerel önizleme için oluşturulan blob URL seçim değiştiğinde veya bileşen kaldırıldığında temizlenir. Dosya, `FormData` içindeki `cover` alanıyla yüklenir. İstemci bu gövdeyi JSON'a çevirmez ve `Content-Type` başlığını elle yazmaz; multipart boundary'yi tarayıcı belirler. Kapak silmenin boş `204` yanıtı JSON okunmadan başarılı kabul edilir.

Düzenleme sayfası yazı sahibi veya admin için gizli yorumları da listeler; yorumları gizleme, gösterme ve silme araçları sunar. Public sayfada yorum metnini yalnız yorum yazarı veya admin düzenleyebilir. Asıl yetki denetimleri API'dedir.

## Yönetim Paneli

`RequireAuth` oturumu kontrol eder; içindeki `RequireAdmin`, admin olmayan kullanıcıya erişememe nedenini gösteren bir arayüz kolaylığıdır. Asıl yetkiyi API denetler. Arayüzdeki rol, girişte veya `/auth/me` ile alınan kullanıcı bilgisinin bir kopyasıdır; başka bir oturumda rol değişirse sayfa yenilenene kadar bayat kalabilir. Menüde bağlantıyı gizlemek API erişimini güvenceye almaz.

Yönetim sayfaları modül seviyesindeki `lazy` tanımlarıyla ayrı JavaScript dosyalarına bölünür. Admin olmayan okuyucu korumalı sayfayı render edemediği için normal gezinmede bu sayfa dosyalarını indirmez. `AdminLayout` içindeki `Suspense`, içerik yüklenirken mesaj gösterir; sekmeler görünür kalır. Kod bölme bir yetkilendirme mekanizması değildir.

06.10 doğrulamasında üretim build'i tarayıcıda örnek API yanıtlarıyla çalıştırıldı: oturumsuz kullanıcı ve normal kullanıcı admin sayfa dosyalarını indirmedi; admin için de ana sayfada bu dosyalar istenmedi. Üç yönetim adresi ayrı ayrı açıldığında ilgili dosya yüklendi. Dosya yanıtı bekletilirken `Suspense` mesajı ve yönetim sekmeleri görünür kaldı. Aynı kodun yalnız admin import'ları statik hâle getirilen geçici karşılaştırmasında, ilk JavaScript yükü 321.192 bayttan 304.564 bayta; her iki pakete aynı `node:zlib` gzip yöntemi uygulandığında 96.358 bayttan 92.889 bayta düştü. Bunlar dosya boyutlarıdır; HTTP sunucusunda gzip ayarı yapıldığı anlamına gelmez.

Kategori aktifliği `useOptimistic` ile anında değişir; istek sürerken ilgili düğme kapanır. Başarıda API'nin döndürdüğü kayıt, `startTransition` içinde `useApi.updateData` ile aynı geçişte listeye yazılır; ek liste isteği gerekmez. Hatada asıl liste değişmez, geçiş bitince React geçici değeri atar ve rozet eski durumuna döner; hata mesajı ayrıca gösterilir.

Kullanıcı silme, rol ve aktiflik değişikliğiyle aynı onay penceresini kullanır. Silme isteği gövdesiz `DELETE` olarak gönderilir; başarıda liste yeniden yüklenir. “Silinenleri göster”, `include_deleted=1` ile silinmiş kullanıcıları da listeye ekler ve sayfayı 1'e döndürür; aktiflik filtresi ayrıca uygulanır. Silinmiş kullanıcıda “Silindi” rozeti ve yalnız “Geri getir” düğmesi görünür. Geri getirme, `PATCH /api/v1/users/:id/restore` ile hesabı yeniden aktifleştirir. İşlem hataları arayüzde gösterilir.

API koduna göre kullanıcı silme fiziksel silme değildir: `deleted_at` doldurulur ve `is_active=0` yapılır. Diğer penceredeki kullanıcı, bir sonraki yetkili istekte `401 AUTHENTICATED_USER_UNAVAILABLE` alır; arayüz bu yanıtla oturumu kapatır. Mevcut yazı ve yorum kayıtları korunur; görünür yorumlar, yazarın hesabı silindiği için gizlenmez. E-posta kayıtta kalır; aynı adresle yeni kayıt `409 EMAIL_ALREADY_EXISTS` alır. Bu sonuçlar API kaynak kodundan doğrulandı; canlı hesap silinerek denenmedi.

Yeni kullanıcı formu ad, e-posta ve parola gönderir; hesap oluşturulunca detay sayfasına geçilir. Detayda ad ve e-posta düzenlenir, yalnız değişen alanlar PATCH ile gönderilir. Yönetici kendi e-postasını buradan değiştiremez; doğrulamalı Hesabım → E-posta akışını kullanır. Kullanıcıya ait yazılar silinenler dahil en fazla 10 kayıt olarak gösterilir.

Kullanıcı listesinin `active`, `deleted`, `sort`, `order` ve `page` seçimleri URL'dedir; arama metni yalnız component state'inde tutulur ve 400 ms gecikmeyle API sorgusuna eklenir. Detay sayfasındaki sabit listeye dönüş bağlantısı filtreleri taşımaz; tarayıcının geri tuşu önceki URL'ye dönebilir.

`Layout`, API durumu ve oturum süresi bantlarını ortak yerleşimde gösterir. API istemcisindeki ağ hatası veya 502/504 yanıtı yeni bir `/health` kontrolü başlatır. Sağlık kontrolü başarısızsa bant görünür; API erişilemiyorken otomatik tekrar deneme ve “Şimdi dene” seçeneği vardır. `ErrorBoundary` yalnız ana içeriği sarar; Header, Footer ve bantlar bu sınırın dışındadır.

## Bilinen Sınırlamalar

- Kullanıcılar sayfasında arama metni adreste değil; Kategoriler ve Yazılar yönetim sayfalarının filtreleri hâlâ component state'inde.
- Kullanıcı listesinin son sayfasındaki son kayıt silinirse sayfa otomatik geri alınmaz; arama veya filtre değiştirilerek 1. sayfaya dönülür.
- Kategori yönetimi ilk 50 kategoriyi gösterir; sayfalama yok.
- Bütün yorumları tek yerde gösteren bir yönetim sayfası yok; moderasyon yazının düzenleme sayfasında. API'de de bütün yorumları tek listede veren bir uç yok.
- Arayüzdeki rol, başka bir oturumda rol değiştikten sonra sayfa yenilenene kadar eski kalır.
- Token `sessionStorage`'da; XSS olursa JavaScript tarafından okunabilir (`httpOnly` cookie yok).
- Oturum uzatılamıyor; API'de refresh token yok, 15 dakikada bir yeniden giriş gerekiyor.
- Oturum süresi dolunca herkese açık sayfadaki oturumlu okuyucu da giriş sayfasına gönderiliyor.
- Hata sınırı olay yöneticilerindeki ve async koddaki hataları yakalamaz; bu işlemlerin hataları kendi akışlarında ele alınmalı.
- API durumu bandı API geri gelince açık sayfanın verisini kendiliğinden yenilemez; başarısız asıl istek otomatik tekrarlanmaz.
- Oturum yeni sekmeye taşınmaz; sekme kapanınca biter.
- Oturum geri yüklenirken API'ye ulaşılamazsa oturum kapanır.
- Oturum düşünce yazılmakta olan yorum kaybolur.
- Yeni kod bekleme süresi, sayfaya kayıttan `codeSent` bilgisiyle gelince gösterilir; login'den gelince arayüz önceki kodun ne zaman gönderildiğini bilemez. Sayfadan yeni kod istendikten sonra geri sayım başlar.
- Cevabı olan bir yorum silinince cevapları da listeden kaybolur.
- E-posta değişikliğinin adımları bellekte; sayfa yenilenince akış baştan başlar.
- Arayüz bir kodun kaç deneme hakkı kaldığını bilmiyor.
- “Parolayı göster” yalnız sıfırlama ve parola değiştirme sayfalarında; kayıt ve girişte yok (kayıt sayfası henüz eklenmedi).
- Kodlar geliştirmede dev posta kutusundan okunuyor; production'da gerçek mail gerekir.
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
- Repoda kalıcı otomatik test paketi yok; bu oturumdaki geçici tarayıcı kontrolleri örnek API yanıtlarıyla çalıştırıldı.

## API'de Bulduğum Sorunlar

Kullanıcı yönetimine ilişkin aşağıdaki davranışlar API kaynak kodundan kontrol edildi; bu belge güncellemesinde canlı hesap oluşturma, silme veya değiştirme deneyi yapılmadı.

- Silinen kullanıcının yazıları ve görünür yorumları adıyla görünmeye devam ediyor; kullanıcıyı soft delete etmek içerikleri gizlemiyor veya yazar adını anonimleştirmiyor.
- Geri getirilen kullanıcı her zaman aktif oluyor (`is_active=1`); silinmeden önce pasif olduğu bilgisi kayboluyor.
- Silinmiş hesabın e-postası bir daha kullanılamıyor; aynı adresle kayıt `409 EMAIL_ALREADY_EXISTS` dönüyor. E-posta araması silinmiş kayıtları da kapsıyor.
- Yöneticinin e-posta değişikliği doğrulama istemiyor; yeni adrese kod, eski adrese uyarı gitmiyor. Yönetim güncellemesi doğrulamalı hesap ayarları akışını kullanmıyor.
- Yöneticinin açtığı hesaba doğrulama kodu gitmiyor; kullanıcı ilk girişte `403 EMAIL_NOT_VERIFIED` alıyor ve doğrulama ekranından kendisi yeni kod istemek zorunda.
- Kullanıcı yönetimi liste/detay yanıtlarında e-posta doğrulama durumu yok (`email_verified_at` dönmüyor); yönetici bu yanıtlardan bir hesabın doğrulanmadığı için giriş yapamadığını göremiyor.
- `POST /api/v1/users` isteğinde `role` alanı `422 UNSUPPORTED_FIELDS` dönüyor; oluşturma yalnız `name`, `email`, `password` kabul ediyor. Rol, hesap oluşturulduktan sonra ayrı `PATCH /api/v1/users/:id/role` isteğiyle değiştirilmeli.

- Silinmiş bir kategorideki yazı geri getirilebiliyor; restore işlemi kategoriyi kontrol etmiyor. Kategori silinmişse `409` dönmeli.
- Admin kendi hesabını pasifleştirebilir veya silebilir. Kendi rolünü değiştirmede `409 CANNOT_CHANGE_OWN_ROLE` koruması var; aktiflik ve silme işlemlerinde yok. Arayüz kendi satırındaki rol, aktiflik ve “Sil” düğmelerini kapatır; bu yalnız arayüz korumasıdır, doğrudan API isteğini engellemez. API'nin pasifleştirme ve silmede de oturumdaki kullanıcı kimliğini kontrol etmesi gerekir. Tek admin kendi hesabını pasifleştirir veya silerse sonraki yetkili istekte oturumu kapanır ve uygulama üzerinden hesabını geri açacak başka admin kalmaz; bu işlemler denenmemelidir.
- Kullanıcı listesi bilinmeyen sorgu parametrelerini sessizce yok sayıyor; rol filtresi yok. Kategori listesi ise bilinmeyen parametreye `422` veriyor.
- Yazı listesinde `include_deleted=1`, silinen yazıları mevcut listeye ekler; yalnız silinenleri getiren bir parametre yok. Yönetim tablosunda silinen yazılar diğer yazılarla birlikte `updated_at` sırasıyla gösterilir.
- `LIKE` aramasında `%` ve `_` karakterleri kaçırılmıyor; `%` araması her şeyi getiriyor.
- JSON gövde sınırı `20 KB` (20.480 bayt), içerik sınırı ise 50.000 karakter. Gövde sınırını aşan uzun yazılar validator'a ulaşmadan `413` alıyor; hata kodu `INTERNAL_SERVER_ERROR` oluyor. Gövde sınırı içerik sınırıyla uyumlu hâle getirilmeli ve bu hata için uygun bir kod dönülmeli.
- Boundary'siz multipart istek, `400` yerine `500` dönüyor. Bozuk multipart gövdeleri istemci hatası olarak ele alınmalı.
- Gizli bir üst yorumun cevapları public listede görünmüyor, ancak `comment_count` görünür durumdaki bu cevapları sayıyor. Listeleme ve sayım kuralları aynı görünürlük tanımını kullanmalı.
- Yazılarda sürüm kontrolü yok. İstemcinin okuduğu `updated_at` veya ETag ile koşullu güncelleme yapılabilir; sürüm değişmişse `409` veya `412` döndürülebilir. Sürüm karşılaştırması ve güncelleme atomik olmalı.

## Sonraki Adımlar

- API: refresh token ve `httpOnly` cookie ile oturumu uzatmak; yöneticinin e-posta değişikliğine doğrulama eklemek.
- API: sorun listesindeki maddeler; kendini kilitleme koruması, restore kontrolleri, katı kullanıcı sorgusu ve rol filtresi.
- Kategoriler ve Yazılar yönetim sayfalarının filtrelerini adrese taşımak.
- Yönetici işlemleri için kayıt: kim, neyi, ne zaman değiştirdi. Mevcut kullanıcı silme kaydını bütün yönetici işlemlerini ve işlemi yapan kişiyi kapsayacak şekilde genişletmek.
- Kayıt sayfasını ve `POST /api/v1/auth/register` bağlantısını tamamlamak; API kapsamını 44/48'e çıkarmak.
- Bütün yorumlar için merkezi yönetim listesi: önce API listeleme ucu, ardından arayüz.
- Hesap ayarları: 03.10'da eklenen kodla parola değiştirme, şifremi unuttum ve e-posta değiştirme akışlarını canlı API ile doğrulamak (11.09 ve 15.09 API'leri).
- Veri çekmeyi TanStack Query'ye taşımak (önbellek, önceki veriyi tutma).
- `dist/` klasörünü compose'taki nginx ile servis etmek.
- TypeScript.
