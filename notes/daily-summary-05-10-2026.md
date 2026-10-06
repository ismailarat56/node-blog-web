# 05.10.2026 Gün Sonu Özeti

Bu not, 05.10 çalışma başlığı için 06.10.2026'da mevcut frontend ve API kaynakları incelenerek tamamlandı. Kaynak koddan doğrulanan davranışlar ve eldeki yanıt kaydı aşağıda ayrılıyor; canlı hesap işlemleri veya API durdurma deneyi bu belge hazırlanırken tekrar yapılmadı.

## Eklediğim Dosyalar

| Dosya | Projeye katkısı |
| --- | --- |
| `src/api/health.js` | `/health` sorgusu ve bağlantı sorunu olayının ortak tanımı. |
| `src/auth/token-expiry.js` | JWT içindeki `exp` değerini milisaniye olarak okuma. |
| `src/components/ApiStatusBanner.jsx` | API kesintisi bildirimi ve Şimdi dene düğmesi. |
| `src/components/ErrorBoundary.jsx` | Ana içerikteki render hatasında açıklama ve yeniden deneme ekranı. |
| `src/components/SessionExpiryNotice.jsx` | Oturumun son iki dakikasında geri sayım ve kaydetme hatırlatması. |
| `src/components/admin/UserForm.jsx` | Yeni kullanıcı ve kullanıcı düzenleme için ortak form; yalnız değişen alanları hesaplama ve alan hataları. |
| `src/components/admin/UserPostList.jsx` | Kullanıcının yazılarını silinenler dahil en fazla 10 kayıt olarak gösterme. |
| `src/pages/admin/AdminNewUserPage.jsx` | Yönetici olarak hesap oluşturma ve ardından detayına geçme. |
| `src/pages/admin/AdminUserPage.jsx` | Kullanıcı ayrıntıları, ad/e-posta düzenleme ve yazı listesi. |
| `src/hooks/useApiHealth.js` | İlk kontrol, sorun bildirimi, sekmeye dönüş ve kesinti sırasında tekrar deneme. |
| `src/utils/user-form.js` | Boş form, düzenleme değerleri ve API hata kodlarının alanlarla eşlenmesi. |
| `src/utils/user-filters.js` | Kullanıcı listesi filtrelerinin URL'den okunması ve URL'ye yazılması. |

Mevcut `App.jsx`, `api/client.js`, `AuthProvider.jsx`, `Layout.jsx`, `UserRow.jsx`, `AdminUsersPage.jsx`, `index.css` ve `vite.config.js` de bu akışları birbirine bağlamak için değişti. Yeni kullanıcı ekranları lazy route olarak eklendi; Vite proxy'ye `/health` dahil edildi. Banner ve hata paneli stilleri ile kullanıcı silme/geri getirme 6 Ekim commitlerinde; diğer yeni kodlar bu not hazırlanırken henüz commit edilmemişti.

## Bugün Bağladığım Uçlar ve Bağlamadıklarım

Bu çalışma kapsamında eklenen bağlantılar:

| Uç | Kullanıldığı yer | Sağladığı davranış |
| --- | --- | --- |
| `POST /api/v1/users` | AdminNewUserPage | Ad, e-posta ve parola ile hesap oluşturma. |
| `GET /api/v1/users/:id` | AdminUserPage | Kullanıcı ayrıntısını yükleme. |
| `PATCH /api/v1/users/:id` | AdminUserPage | Önceden listede aktiflik için kullanılan ucu, yalnız değişen ad/e-posta alanlarıyla da kullanma. |
| `DELETE /api/v1/users/:id` | AdminUsersPage | Onaydan sonra kullanıcıyı soft delete etme. |
| `PATCH /api/v1/users/:id/restore` | AdminUsersPage | Silinmiş hesabı geri getirme. |
| `GET /api/v1/posts?user_id=...` | UserPostList | Önceden kullanılan yazı listesini kullanıcı detayında da kullanma; bu yeni bir API ucu sayılmaz. |
| `GET /health` | useApiHealth | Sunucunun erişilebilirliğini kontrol etme. |

Tam envanter [README'nin API Kapsamı bölümünde](../README.md#api-kapsamı). Hedef 48 uçtan 44'ünü ve ayrıca `/health` ucunu bağlamak. Mevcut kaynakta kayıt sayfası ve `POST /auth/register` çağrısı olmadığı için doğrulanabilen durum **43/48 + `/health`**. Route tablosunda planlanan `/register` satırının bulunması, çalışan bağlantı olduğu anlamına gelmiyor.

Bilinçli olarak kullanılmayan dört uç: `PUT /users/:id`, `PUT /posts/:id`, `PUT /categories/:id` ve `GET /categories/:id` (hepsinin öneki `/api/v1`). İlk üçünde PATCH yalnız değişen alanları gönderiyor; PUT'un beklediği bütün alanları eski form kopyasından göndermek başka birinin değişikliğini ezebilir. PATCH de aynı alanın eşzamanlı düzenlenmesine karşı sürüm kontrolü sağlamıyor. Kategori detayında liste zaten gerekli alanları veriyor; ayrıca detay ucu giriş istiyor. Kapak yüklemek için kullanılan `PUT /posts/:id/cover` bu üç kullanılmayan PUT'tan ayrı.

## Silme ve Geri Getirmede Gördüklerim

API model ve controller kodunda doğrulanan davranış:

- Silme kaydı fiziksel olarak kaldırmıyor; `deleted_at` dolduruluyor ve `is_active=0` yapılıyor.
- Kullanıcının yazıları ve görünür yorumları korunuyor, yazar adı görünmeye devam ediyor. Hesabın silinmesi tek başına içeriklerini gizlemiyor.
- Kullanıcı listesi varsayılan olarak silinmiş kayıtları dışarıda bırakıyor. `include_deleted=1` silinenleri de dahil ediyor; yalnız silinenleri getirmiyor. Aktiflik ve arama filtreleri uygulanmaya devam ediyor.
- Geri getirme `deleted_at=NULL` ve `is_active=1` yapıyor. Önceden pasif olan bir hesap da aktif dönüyor; eski aktiflik bilgisi saklanmıyor.
- E-posta benzersizlik kontrolü silinen hesapları da buluyor. Aynı adresle yeni kayıt `409 EMAIL_ALREADY_EXISTS` veriyor.
- Kullanıcı sonraki yetkili isteğinde `401 AUTHENTICATED_USER_UNAVAILABLE` alabiliyor; frontend 401'de yerel oturumu kapatıyor. Bu sonuç iki pencereli canlı deneyden değil, API ve frontend akışından doğrulandı.

Arayüzde silme önce onay istiyor, geri getirme doğrudan istek gönderiyor. Başarıda kullanıcı listesi tekrar yükleniyor; hata ilgili mesaj alanında gösteriliyor. Kendi hesabının rol, aktiflik ve silme düğmeleri kapalı. API'nin kendini pasifleştirme/silme koruması ayrıca gerekli; düğmenin kapalı olması doğrudan API isteğini engellemiyor.

## Yöneticinin Açtığı Hesap Neden Kod İstedi

`POST /users` ile `POST /auth/register` aynı oluşturma modelini kullansa da controller akışları farklı. Normal kayıt akışı kullanıcıyı oluşturduktan sonra doğrulama kodu üretiyor ve postayı kuyruğa alıyor. Yönetici oluşturma akışı ise kullanıcıyı oluşturup `201` yanıtı dönüyor; doğrulama kodu üretme/gönderme adımı yok.

Giriş controller'ı, parola ve aktiflik kontrolünden sonra `email_verified_at === null` ise `403 EMAIL_NOT_VERIFIED` veriyor. Frontend bu kodu görünce doğrulama ekranına yönlendiriyor. Kullanıcı burada kendisi yeni kod istemek zorunda; yöneticinin hesabı açması adresin doğrulandığı anlamına gelmiyor.

`POST /users` gövdesine `role` eklemek de rol atamıyor: validator yalnız `name`, `email`, `password` kabul ettiği için `422 UNSUPPORTED_FIELDS` dönüyor. Rol sonradan ayrı `/users/:id/role` ucundan değiştiriliyor.

Kullanıcı yönetimi liste/detay yanıtlarında `email_verified_at` yok. Yönetici hesabın aktifliğini görebiliyor ama doğrulanmadığı için giriş yapamadığını bu yanıtlardan anlayamıyor. Yönetimden e-posta değiştirmek de doğrulamalı hesap ayarları yolunu kullanmıyor; yeni adrese kod veya eski adrese uyarı göndermeden alanı güncelliyor. Bu bulgular API kaynağından doğrulandı.

## API Durunca Ne Oldu

Eldeki kesinti yanıtı kaydında `success: false`, hata kodu `UPSTREAM_UNAVAILABLE` ve “Servis su anda yanit veremiyor.” mesajı var. Bu JSON kaydı tek başına HTTP durumunu, deneyin tam zamanını veya tarayıcıda bandın göründüğünü kanıtlamıyor; bu güncellemede API yeniden durdurulmadı.

Mevcut kodun bu durum için kurduğu akış şöyle:

1. Sayfa açılınca `useApiHealth`, `/health` isteği yapıyor. Kontrol HTTP başarısını okuyor; yanıt gövdesindeki bütün servislerin durumunu incelemiyor.
2. Ortak API istemcisinde ağ hatası veya 502/504 yanıtı olursa `api:trouble` olayı yayınlanıyor. Hook yeniden sağlık sorgusu yapıyor; iptal edilen istek kesinti sayılmıyor.
3. Sağlık kontrolü başarısızsa durum `down` oluyor ve bant görünüyor. Bu durumda yaklaşık 10 saniye sonra yeniden deneme zamanlanıyor. “Şimdi dene” düğmesi ve görünür sekmeye dönüş de kontrol başlatıyor.
4. Sağlık kontrolü başarılı olunca bant kapanıyor. Açık sayfanın başarısız veri isteği kendiliğinden tekrarlanmıyor; sağlık kontrolü ile sayfa verisinin yenilenmesi ayrı işler.

Sağlıklıyken sürekli 10 saniyelik sorgu yapılmıyor. İstekler `AbortController` ile temizleniyor; bu hook içinde ayrıca bir ağ zaman aşımı tanımlı değil. Oturum ilk yüklenirken `/auth/me` erişilemezse mevcut AuthProvider oturumu temizliyor; sağlık bandı bu davranışı değiştirmiyor.

## jq ile Okuduklarım

Bu belge hazırlanırken kaydedilmiş kesinti JSON'u şu filtreyle okundu; yalnız durum, hata kodu ve mesaj seçildi:

```bash
jq '{success, code: .error.code, message: .error.message}' /tmp/blog-jq-health-down.json
```

Görülen çıktı:

```json
{
  "success": false,
  "code": "UPSTREAM_UNAVAILABLE",
  "message": "Servis su anda yanit veremiyor."
}
```

`/tmp` dosyası geçici deney kaydıdır, deponun kalıcı parçası değildir. Kullanıcı yanıtları kaydedildiğinde kişisel alanları dökmeden durum ve şemayı okumak için kullanılabilecek filtreler:

```bash
jq '.data[] | {id, role, is_active, deleted_at}' users-response.json
jq '.data | {id, role, is_active, deleted_at}' user-response.json
jq '.data | keys' user-response.json
jq '{success, code: .error.code, fields: .error.details.fields}' error-response.json
```

Son dört komut kullanım örneğidir; bu dosyalar üzerinde çalıştırılmış yeni deneyler olarak sunulmuyor. `keys`, bir alanın yanıtta hiç bulunmaması ile değerinin `null` olması arasındaki farkı görmeye yarar. Hata kodu okunurken `.error.code`, başarılı liste incelenirken `.data[]` kullanılır. Deneme hesabının adresi, parolası, doğrulama kodu veya access token belgelere yazılmadı.

## Adresteki Filtre: Neden Arama Değil

Kullanıcılar sayfasında `active`, `deleted`, `sort`, `order` ve `page` URL'de tutuluyor. `readUserFilters` gelen değerleri kontrol ediyor; geçersiz sayfa için 1, geçersiz sıralama alanı için `created_at` kullanıyor. `toUserFilterParams` varsayılan değerleri yazmayarak URL'yi kısa tutuyor. Bu URL başka yerde açıldığında aynı seçimler okunabiliyor.

Arama metni ise `search` state'inde kalıyor ve son değişiklikten 400 ms sonra API sorgusuna giriyor. Bu tercih, kullanıcının ad/e-posta aramasını paylaşılabilir sayfa adresine ve gezinme geçmişine taşımıyor; her tuş vuruşunda yeni gezinme kaydı oluşmasını da önlüyor. Bunun bedeli, yenilemede arama metninin kaybolması. Bu bir gizlilik garantisi değil: arama metni API isteğinin query string'inde yine gönderiliyor ve sunucu günlüklerine girebilir.

Filtre veya sıralama değişince ilk sayfaya dönülüyor. Arama değişiminde başka sayfadaysak önce sayfa 1'e geçiş, ardından gecikmiş arama yeni istek doğurabilir; debounce bütün state değişikliklerini tek isteğe birleştirmiyor. Kategoriler ve Yazılar yönetim filtreleri henüz URL'ye taşınmadı. Kullanıcı detayından sabit “Kullanıcılar” bağlantısıyla dönüş de eski filtreleri taşımıyor; tarayıcının geri tuşu önceki URL'yi açabiliyor.

## Hata Sınırının Yakaladığı ve Yakalamadığı

`ErrorBoundary`, Layout içindeki ana içeriği sarıyor. Altındaki bileşenin render aşamasında React tarafından yakalanan bir hata olursa `getDerivedStateFromError` hatayı state'e koyuyor; `render` normal içerik yerine hata panelini gösteriyor. `componentDidCatch` mesajı ve bileşen zincirini konsola yazıyor. “Tekrar dene” hatayı temizleyip aynı içeriği tekrar çizmeyi deniyor; sorunun nedenini otomatik düzeltmiyor.

`resetKey={location.pathname}` sayesinde başka yola geçince hata temizleniyor. Sadece query string'in değişmesi resetKey'i değiştirmiyor. Header, Footer ve bantlar bu sınırın dışında.

Tıklama işleyicisinde veya bağımsız async işlemde oluşan hatalar bu sınır tarafından otomatik yakalanmaz; `try/catch` ve sayfanın hata state'i gerekir. Bir API isteğinin 422 dönmesi de kendi başına render hatası değildir. Yeni formun hataları `UserForm.handleSubmit`, liste işlemlerinin hataları ilgili sayfa fonksiyonları tarafından ele alınıyor. Bu bölüm uygulanan kodun kapsamını açıklar; bu güncellemede bilerek render/event hatası üreten tarayıcı deneyi yapılmadı.

## Oturum Süresi: exp, useEffectEvent ve Arka Plandaki Sekme

JWT'nin `exp` alanı saniye cinsinden bitiş zamanıdır. `readTokenExpiry`, payload'ı çözüp tam sayı `exp` değerini 1000 ile çarpar; bozuk veya okunamayan değerde `null` döndürür. Payload'ı okumak imzayı doğrulamak değildir; gerçek token geçerliliği API tarafından denetlenir.

`AuthProvider`, `expiresAt - Date.now()` kadar gecikmeyle `checkExpiry` zamanlayıcısı kurar. `checkExpiry`, gerçekten süre dolduysa `handleExpiry` çağırır. `handleExpiry`, `useEffectEvent` sayesinde güncel `location` bilgisini okuyup kullanıcıyı son bulunduğu konum ve açıklamayla giriş ekranına yönlendirir; zamanlayıcının kurulduğu andaki eski konuma bağlı kalmaz.

Arka plandaki sekmelerin zamanlayıcıları gecikebilir. Bu yüzden `visibilitychange` olayında da `Date.now()` ile bitiş zamanı yeniden karşılaştırılır; yalnız bir kez kurulan timeout'a güvenilmez. Effect temizliği eski zamanlayıcıyı ve dinleyiciyi kaldırır. Bu mantık kaynak koddan incelendi; arka planda gerçek 15 dakika bekleme deneyi bu belge güncellemesinde yapılmadı.

`SessionExpiryNotice` son 120 saniyede saniyelik geri sayım gösterir. Oturumu kapatan bu bileşen değil AuthProvider'dır. Süre dolunca token ve kullanıcı temizlenir; mevcut sayfa public olsa bile oturumlu okuyucu login'e gönderilir. API'de refresh token olmadığından süre uzatılmaz. Uyarı otomatik kayıt yapmaz; form içeriği kaybolabilir.
