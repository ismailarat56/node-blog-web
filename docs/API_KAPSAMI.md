[← README'ye dön](../README.md)

# API Kapsamı

Her HTTP yöntemi + yol çifti bir uç sayılır; query filtreleri yeni bir uç değildir. `/health`, yüklenen dosyalar ve yalnız geliştirmeye ait `/api/v1/dev/mail-outbox/latest` 49 uygulama ucunun dışında tutulur. “Bağlı”, frontend'de çağrı akışı bulunduğu anlamına gelir; bütün uçların canlı API ile yeniden test edildiği anlamına gelmez. Aşağıdaki yollar `/api/v1` önekiyle kullanılır.

| Grup | API'deki uç | Arayüze bağlı |
| --- | ---: | ---: |
| Public | 4 | 4 |
| Hesap (auth) | 13 | 13 |
| Kullanıcılar | 8 | 7 |
| Kategoriler | 7 | 5 |
| Yazılar ve kapak | 11 | 10 |
| Yorumlar | 6 | 6 |
| **Toplam** | **49** | **45** |
| Sağlık (ayrı) | 1 | 1 |

İstenen kapsam özetine göre **49 uçtan 45'i ve ayrıca `GET /health` bağlı**. Kaynak notu: mevcut çalışma ağacında kayıt ekranı ve `POST /auth/register` çağrısı henüz yok; yeni `AuthProvider` da `GET /auth/me` çağırmıyor. Bu nedenle yukarıdaki istenen sayılar mevcut çağrı akışlarının fiilî sayımı değildir; aşağıdaki ayrıntılı tablo bu eksikleri gösterir.

| Yöntem | Yol | Durum / kullanan ekran veya bileşen |
| --- | --- | --- |
| GET | `/public/posts` | Bağlı — HomePage |
| GET | `/public/posts/:slug` | Bağlı — PostDetailPage |
| GET | `/public/posts/:slug/comments` | Bağlı — CommentList |
| GET | `/public/categories` | Bağlı — CategoryFilter, PostForm |
| POST | `/auth/login` | Bağlı — LoginPage / AuthProvider |
| POST | `/auth/register` | Eksik — RegisterPage ve route henüz yok |
| POST | `/auth/refresh` | Bağlı — AuthProvider / session.js |
| GET | `/auth/me` | Kullanılmıyor — kullanıcı bilgisi login ve refresh yanıtından alınır |
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

PATCH, değiştirilmeyen alanları göndermeyerek gereksiz üzerine yazmayı azaltır; aynı alanı iki kişinin değiştirmesi sorununu tek başına çözmez. Bunun için API'de sürüm/ETag kontrolü gerekir. Bu dört tasarım tercihine ek olarak `POST /auth/register` henüz bağlanmamıştır; `GET /auth/me` yerine login ve refresh yanıtındaki kullanıcı bilgisi kullanılır.
