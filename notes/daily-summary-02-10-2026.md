# 02.10.2026 Gün Sonu Özeti

## Eklediğim Dosyalar

- `src/components/DashboardLayout.jsx`: Ortak panel menüsü ve alt sayfalar için `Outlet`.
- `src/pages/DashboardPage.jsx`: URL'den filtreleme, sayfalama, yazı listesi, silme ve geri alma.
- `src/pages/NewPostPage.jsx`: Taslak oluşturma ve düzenleme sayfasına yönlendirme.
- `src/pages/EditPostPage.jsx`: Yazıyı yükleme, sahiplik kontrolü ve değişen alanları kaydetme.
- `src/components/PostRow.jsx`: Yazı tablosunun satırı ve işlem düğmeleri.
- `src/components/PostForm.jsx`: Oluşturma ve düzenlemede ortak form.
- `src/components/PostStatusActions.jsx`: Yayınlama ve yayından kaldırma.
- `src/components/CoverEditor.jsx`: Dosya seçimi, önizleme, yükleme ve kapak kaldırma.
- `src/components/CommentModeration.jsx`: Gizli yorumları listeleme, gizleme, gösterme ve silme.
- `src/utils/parse-positive-int.js`: Ana sayfa ve panelin ortak pozitif sayı ayrıştırıcısı.
- `src/utils/post-status.js`: Durumların Türkçe etiketleri.
- `src/utils/post-form.js`: API verisi ile form değerleri arasındaki dönüşümler.

Mevcut `useApi`, `FormField`, yorum bileşenleri, API istemcisi, route'lar ve Header da güncellendi.

## Sonsuz İstek Deneyinde Ne Gördüm

Bu oturumda sonsuz istek deneyi canlı çalıştırılmadı. Koddan beklenen davranış: effect bağımlılıkları fonksiyonların içindeki koda göre değil, `Object.is` ile referanslarına göre karşılaştırılır. Her render'da yeni bir ok fonksiyonu verilirse effect yeniden çalışır; istek sonucu state'i değiştirince bu döngü tekrar edebilir.

`path` ve `request` aynı render'da değişirse iki ayrı effect çalışması oluşmaz. Geliştirmedeki StrictMode'un ilk bağlanma kontrolü ayrıca dikkate alınmalıdır.

## Yalnız Değişeni Göndermek ve Kaybolan Güncelleme

`PostForm`, yerel form değerlerini `initialValues` ile karşılaştırır ve yalnız farklı alanları PATCH ile gönderir. Ancak yeniden çekilen sunucu verisi `initialValues`'ı değiştirirken `useState(initialValues)` ile kurulmuş form state'ini değiştirmez.

Bu yüzden dışarıdan değiştirilen başlık, formdaki eski başlıktan farklı olur. Kullanıcı başlığa dokunmasa bile eski değer `changes` içine girip kayıtta sunucuya geri yazılabilir. PATCH tek başına kaybolan güncellemeyi önlemez; API'de atomik sürüm kontrolü gerekir. Bu senaryo kod üzerinden incelendi; canlı iki istemci deneyi yapılmadı.

## Dosya Input'u Neden Kontrolsüz; useRef Ne İşe Yaradı

Dosya seçimi `event.target.files[0]` üzerinden okunur. Tarayıcı, dosya input'una programla dosya adı yazılmasını reddeder; yalnız boş metinle temizlemeye izin verir. `useRef`, “Vazgeç” işleminde gerçek input'a erişip `value = ""` yazmak için kullanıldı.

Tarayıcı deneyinde dosya adını `value` olarak vermek beklenen hatayı üretti ve React ağacı boşaldı. Geçerli dosya blob URL ile HTTP isteği olmadan önizlendi. Cleanup kapalıyken eski URL `200` verdi; cleanup açıkken seçim değişince veya bileşen kaldırılınca eski URL'yi okumak `TypeError` üretti. Deney değişiklikleri proje koduna bırakılmadı.

## FormData, Boundary ve İki Ayrı 413

Dosya `FormData` nesnesine `cover` adıyla eklenir. `apiRequest`, bu gövdeyi JSON'a çevirmez ve `Content-Type` yazmaz; boundary dahil multipart biçimini tarayıcı oluşturur.

Kapak yüklemede iki ayrı sunucu sınırı vardır: multer'ın 2 MiB dosya sınırı ve nginx'in 3 MiB istek gövdesi sınırı. İstemci kontrolü aşılarak gönderilen dosyanın boyutuna göre 413 farklı katmanlardan gelebilir. Bunlardan ayrı olarak JSON yazı istekleri Express'in 20 KiB sınırına takılabilir. Bu sunucu sınırlarının tamamı bu oturumda canlı olarak denenmedi.

Tarayıcı testlerinde multipart alanı, dosya boyutu, başarı sonrası seçim temizliği ve hata mesajları örnek API yanıtlarıyla doğrulandı. Sahte PNG tür kontrolünden geçti ama görsel olarak açılamadı. Kapak silmede boş `204` yanıtının önce yanlışlıkla hata sayıldığı doğrulandı; istemci düzeltildikten sonra JSON okunmadan başarı döndü.

## Arayüzden Bulduğum API Sorunları

Dersin README'ye kaydedilen bulguları:

- JSON sınırı 20 KiB iken içerik doğrulaması 50.000 karaktere izin veriyor; büyük gövdenin 413 yanıtında `INTERNAL_SERVER_ERROR` kullanılıyor.
- Boundary'siz multipart istek 400 yerine 500 dönüyor.
- Gizlenen üst yorumun görünür cevapları public listeden kayboluyor ama yorum sayısına dahil kalıyor.
- Yazılarda sürüm kontrolü yok; eşzamanlı değişikliklerde son yazan kazanıyor.

JSON sınırı ve sürüm kontrolünün yokluğu backend kodunda incelendi. Boundary ve yorum sayımı deneyleri bu oturumda canlı çalıştırılmadı.

## Yanıldığım İki Tahmin

Kişisel değerlendirme için doldurulacak:

1. İlk tahminim: … Deneyde gördüğüm: … Neden farklıydı: …
2. İlk tahminim: … Deneyde gördüğüm: … Neden farklıydı: …

## En Çok Zorlandığım Konu

Kişisel değerlendirme için doldurulacak: Hangi konuda zorlandım, hangi deney açıklığa kavuşturdu ve neyi tekrar etmeliyim?
