# 08.10.2026 Gün Sonu Özeti

## Eklediğim ve Sildiğim Dosyalar

Arayüze `src/auth/session.js` ve `src/auth/session-channel.js` ekledim; `token-storage.js`, `token-expiry.js` ve `SessionExpiryNotice.jsx` dosyalarını kaldırdım. `AuthProvider.jsx` ile `Layout.jsx` dosyalarını yeni oturum akışına uyarladım; API tarafında refresh token migration'ı, model, servis, yapılandırma, cookie yardımcıları ve kontrol scriptleri yer alıyor.

## İki Token: Neyi Nerede Tutuyorum

Access token'ı yalnız `session.js` içindeki bellekte tutuyorum; `sessionStorage` kullanmıyorum. Refresh token API'nin yazdığı `httpOnly` cookie'de, veritabanında ise token'ın kendisi yerine SHA-256 özeti bulunuyor. Arayüz refresh token'ı okuyamasa da XSS ile çalışan script refresh isteği gönderip yeni access token alabileceği için kullanıcı içeriğini düz metin olarak gösteriyorum.

## Cookie Özellikleri ve Path'siz Silme

Cookie `HttpOnly`, `SameSite=Strict` ve `Path=/api/v1/auth` özellikleriyle yazılıyor; `Secure` yapılandırmadan geliyor ve production'da kapatılamıyor. Express'te Path belirtmeden silmek varsayılan `/` yolunu hedeflediği için `/api/v1/auth` yolundaki cookie'yi kaldırmıyor. Yazma ve silmede aynı cookie seçeneklerini kullanıyorum; silme yanıtı geçmiş bir `Expires` tarihi gönderiyor.

## xxd ile Gördüklerim

Üretilen örneği base64url'den çözüp `xxd` ile incelediğimde 43 karakterlik gösterimin 32 bayt rastgele veriyi taşıdığını gördüm. Aynı baytların hex gösterimi 64 karakter tuttu; `xxd -r -p` ile geri çevirince başlangıçtaki baytlarla eşleşti. Veritabanına yazılan 64 karakterlik SHA-256 özeti ise ayrı bir hesaplama; token, cookie veya parola değerlerini bu nota koymadım.

## Rotation ve Reuse: 20 Paralel İstek

Kaydedilmiş kontrol sonucunda aynı refresh token'la gönderilen 20 paralel isteğin **1'i 200, 19'u 401** döndü; 401 yanıtları `REFRESH_TOKEN_REUSED` hatasıydı. İlk istek eski kaydı kullanılmış işaretleyip aynı ailede yeni kayıt oluşturdu; eski token'ın yeniden kullanılması bütün aileyi iptal etti. Kazanan isteğin ürettiği yeni refresh token'la yapılan sonraki istek de `401 REFRESH_TOKEN_INVALID` aldı.

## Havuz Deneyi ve Commit'ten Önce Fırlatmak

Kayıtlı havuz deneyinde dört bağlantı tutulup yalnız bir bağlantı boş bırakıldığında rotation tamamlandı; işlem içindeki kullanıcı sorgusu da aynı transaction bağlantısını kullanıyor. Reuse tespitinde aileyi iptal ettikten sonra commit'ten önce hata fırlatmak rollback ile iptali geri alırdı. Bu yüzden işlem sonucu transaction'dan dönüyor, önce commit yapılıyor ve 401 hatası daha sonra fırlatılıyor.

## Çıkış ve Parola Değişikliği

Çıkış isteği access token süresi dolmuşsa yenileme yapıp tekrar gönderiliyor; API kullanılan access token'ı ve cookie'deki refresh token ailesini iptal edip cookie'yi siliyor. Parola değişikliği ve sıfırlama kullanıcının bütün refresh token ailelerini iptal ediyor; kayıtlı kontroller bu kapsamı doğruluyor. Arayüz yerel oturumu ve sorgu önbelleğini temizliyor, çıkışı diğer sekmelere duyuruyor.

## StrictMode, Tek Uçuş ve İki Sekme

`pendingRefresh`, aynı sekmedeki eşzamanlı yenilemeleri tek Promise üzerinde topluyor; StrictMode'un açılış effect'ini yinelemesi ikinci bir refresh başlatmıyor. Web Locks farklı sekmelerin refresh isteklerini sıraya koyuyor; sekme içindeki tek uçuş koruması tek başına sekmeler arasındaki yarışı çözmüyor. BroadcastChannel giriş ve çıkış haberini taşıyor, token taşımıyor; anonim sekme giriş haberinde kendi oturumunu refresh ile alıyor.

## Yanıldığım İki Tahmin

İlk tahminim, cookie'yi silerken yalnız adını vermenin yeterli olacağıydı; farklı Path kullanılması asıl cookie'nin kalmasına neden oluyor. İkinci tahminim, reuse tespitinde aileyi iptal edip transaction içinde hemen hata fırlatabileceğimdi; rollback iptali de geri aldığı için hatayı commit sonrasına taşıdım.

## En Çok Zorlandığım Konu

En çok dikkat isteyen konu, tek kullanımlık refresh token'ın aynı sekmede ve farklı sekmelerde eşzamanlı tüketilmesini önlemekti. Sekme içinde `pendingRefresh`, sekmeler arasında Web Locks kullanırken API tarafında satır kilidi ve transaction ile rotation'ı tutarlı tutuyorum. Reuse nedeniyle yapılan aile iptalinin rollback ile geri alınmaması da bu akışın kritik noktasıydı.

## Son Commit ve Tag

Eksik `blog-web-v7` etiketini önceki çalışmanın son commit'i olan `312b3de` üzerine koydum; bellek ve açılışta refresh, 401 sonrası tekrar deneme, sekmeler arası eşgüdüm değişikliklerini ayrı commit'lere ayırdım. Bu belgeyi ve README'yi `docs: update readme and daily summary` commit'iyle tamamlayıp `blog-web-v8` etiketiyle işaretledim; `git log --oneline blog-web-v7..HEAD` dört commit gösteriyor. Commit farklarında `refresh_token=[A-Za-z0-9_-]{43}` kontrolü sıfır eşleşme verdi; commit'leri sırayla, etiketleri de ayrıca pushladım.
