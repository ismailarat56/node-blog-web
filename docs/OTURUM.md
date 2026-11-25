[← README'ye dön](../README.md)

# Oturum

Access token yalnız bellekte, `src/auth/session.js` içinde tutulur; `sessionStorage` kullanılmaz. Refresh token'ı arayüz hiç görmez: API onu `httpOnly` cookie olarak yazar, tarayıcı yalnız `/api/v1/auth` kapsamındaki isteklere ekler.

Açılışta `AuthProvider` bir kez `POST /api/v1/auth/refresh` gönderir; bu sırada durum `checking` olur. Başarılı yanıttaki access token belleğe, kullanıcı bilgisi Context'e alınır ve durum `authenticated` olur; başarısızlıkta arayüz `anonymous` açılır. `pendingRefresh`, StrictMode'un yinelenen effect çağrılarının da aynı yenilemeyi beklemesini sağlar.

Oturumlu istekler `authRequest` üzerinden gönderilir. `401` alan istek için token bir kez yenilenir ve asıl istek yeni token'la tekrar gönderilir; yenileme de `401` alırsa oturum kapanır ve kullanıcı giriş sayfasına yönlendirilir. Aynı anda gelen `401` yanıtları tek yenilemeyi (`pendingRefresh`) bekler; başka bir istek token'ı zaten yenilemişse güncel token kullanılır. Tekrar gönderilen istek de `401` alırsa oturum kapanır; `403` yetki hatasında korunur.

Sekmeler yenilemeyi Web Locks ile sırayla yapar; böylece aynı refresh token'ın paralel kullanılması önlenir. Giriş ve çıkış `session-channel.js` içindeki BroadcastChannel ile duyurulur; token mesajla paylaşılmaz. Anonim sekme giriş haberinde kendi refresh isteğini yapar, çıkış haberinde yerel oturumunu temizler.

Çıkışta `POST /api/v1/auth/logout` gönderilir; access token süresi dolmuşsa önce yenilenir, ardından logout tekrar gönderilir. API ilgili refresh token ailesini ve kullanılan access token'ı iptal eder, cookie'yi siler. Arayüz token'ı, kullanıcı state'ini ve Query Client önbelleğini temizleyip diğer sekmelere çıkışı duyurur; API isteği başarısız olsa da yerel oturum kapanır.

Parola değişikliği veya sıfırlama API'de kullanıcının bütün refresh token ailelerini iptal eder; eski access token'lar da parola değişikliği kontrolüne tabidir. Başarılı parola değişikliğinde arayüz `closeSession` ile oturumu temizler ve giriş sayfasına gider. E-posta değişikliği onaylandığında dönen kullanıcı bilgisi `updateUser` ile Context'e yazılır.

`httpOnly` cookie XSS'i engellemez: sayfaya sızan script refresh isteği atıp yeni access token alabilir. Bu yüzden kullanıcı içeriği düz metin olarak basılır, `dangerouslySetInnerHTML` kullanılmaz; `httpOnly` yalnız refresh token'ın JavaScript tarafından okunmasını engeller.
