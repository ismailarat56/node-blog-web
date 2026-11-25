[← README'ye dön](../README.md)

# API'de Bulduğum Sorunlar

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
