[← README'ye dön](../README.md)

# Yazar ve yönetim panelleri

## Yazar Paneli

`/dashboard` üst route'u tek bir `RequireAuth` ile korunur. `DashboardLayout` ortak menüyü gösterir; iç içe route'ların sayfaları `Outlet` içine yerleşir. Liste, yeni yazı ve düzenleme sayfaları aynı oturum kapısını kullanır. Durum filtresi ve sayfa numarası URL'de tutulur: `/dashboard?status=draft&page=2`.

Yeni yazılar her zaman taslak olarak oluşturulur. Başarılı oluşturmadan sonra düzenleme sayfasına gidilir; yayınlama ve yayından kaldırma ayrı API uçlarına yapılan işlemlerdir. `PostForm`, oluşturma ve düzenlemede ortak kullanılır. Düzenlemede yalnız `initialValues` ile farklı olan alanlar `PATCH` gövdesine eklenir; `category_id`, API'ye gönderilirken sayıya çevrilir.

Silme, onay sonrasında soft delete uygular. Silinen yazının id'si ve başlığı sayfa state'inde tutulur; aynı sayfadaki “Geri al” düğmesi `restore` isteği gönderir. Sayfadan ayrılınca bu bilgi kaybolur.

Kapak seçimi kontrolsüz dosya input'u ile yapılır; yerel önizleme için oluşturulan blob URL seçim değiştiğinde veya bileşen kaldırıldığında temizlenir. Dosya, `FormData` içindeki `cover` alanıyla yüklenir. İstemci bu gövdeyi JSON'a çevirmez ve `Content-Type` başlığını elle yazmaz; multipart boundary'yi tarayıcı belirler. Kapak silmenin boş `204` yanıtı JSON okunmadan başarılı kabul edilir.

Düzenleme sayfası yazı sahibi veya admin için gizli yorumları da listeler; yorumları gizleme, gösterme ve silme araçları sunar. Public sayfada yorum metnini yalnız yorum yazarı veya admin düzenleyebilir. Asıl yetki denetimleri API'dedir.

## Yönetim Paneli

`RequireAuth` oturumu kontrol eder; içindeki `RequireAdmin`, admin olmayan kullanıcıya erişememe nedenini gösteren bir arayüz kolaylığıdır. Asıl yetkiyi API denetler. Arayüzdeki rol, girişte veya token yenilemesinde alınan kullanıcı bilgisinin bir kopyasıdır; başka bir oturumda rol değişirse bir sonraki yenilemeye kadar bayat kalabilir. Menüde bağlantıyı gizlemek API erişimini güvenceye almaz.

Yönetim sayfaları modül seviyesindeki `lazy` tanımlarıyla ayrı JavaScript dosyalarına bölünür. Admin olmayan okuyucu korumalı sayfayı render edemediği için normal gezinmede bu sayfa dosyalarını indirmez. `AdminLayout` içindeki `Suspense`, içerik yüklenirken mesaj gösterir; sekmeler görünür kalır. Kod bölme bir yetkilendirme mekanizması değildir.

06.10 doğrulamasında üretim build'i tarayıcıda örnek API yanıtlarıyla çalıştırıldı: oturumsuz kullanıcı ve normal kullanıcı admin sayfa dosyalarını indirmedi; admin için de ana sayfada bu dosyalar istenmedi. Üç yönetim adresi ayrı ayrı açıldığında ilgili dosya yüklendi. Dosya yanıtı bekletilirken `Suspense` mesajı ve yönetim sekmeleri görünür kaldı. Aynı kodun yalnız admin import'ları statik hâle getirilen geçici karşılaştırmasında, ilk JavaScript yükü 321.192 bayttan 304.564 bayta; her iki pakete aynı `node:zlib` gzip yöntemi uygulandığında 96.358 bayttan 92.889 bayta düştü. Bunlar dosya boyutlarıdır; HTTP sunucusunda gzip ayarı yapıldığı anlamına gelmez.

Kategori aktifliği `useOptimistic` ile anında değişir; istek sürerken ilgili düğme kapanır. Başarıda API'nin döndürdüğü kayıt, `queryClient.setQueryData` ile mevcut filtrelerin önbellek kaydına yazılır; ek liste isteği gerekmez. Hatada asıl liste değişmez, geçiş bitince React geçici değeri atar ve rozet eski durumuna döner; hata mesajı ayrıca gösterilir. Oluşturma, silme ve geri getirme kategori sorgularını geçersiz kılar; düzenleme ayrıca yazı sorgularını da geçersiz kılar.

Kullanıcı silme, rol ve aktiflik değişikliğiyle aynı onay penceresini kullanır. Silme isteği gövdesiz `DELETE` olarak gönderilir; başarıda liste yeniden yüklenir. “Silinenleri göster”, `include_deleted=1` ile silinmiş kullanıcıları da listeye ekler ve sayfayı 1'e döndürür; aktiflik filtresi ayrıca uygulanır. Silinmiş kullanıcıda “Silindi” rozeti ve yalnız “Geri getir” düğmesi görünür. Geri getirme, `PATCH /api/v1/users/:id/restore` ile hesabı yeniden aktifleştirir. İşlem hataları arayüzde gösterilir.

API koduna göre kullanıcı silme fiziksel silme değildir: `deleted_at` doldurulur ve `is_active=0` yapılır. Diğer penceredeki kullanıcı, bir sonraki yetkili istekte `401 AUTHENTICATED_USER_UNAVAILABLE` alır; arayüz bu yanıtla oturumu kapatır. Mevcut yazı ve yorum kayıtları korunur; görünür yorumlar, yazarın hesabı silindiği için gizlenmez. E-posta kayıtta kalır; aynı adresle yeni kayıt `409 EMAIL_ALREADY_EXISTS` alır. Bu sonuçlar API kaynak kodundan doğrulandı; canlı hesap silinerek denenmedi.

Yeni kullanıcı formu ad, e-posta ve parola gönderir; hesap oluşturulunca detay sayfasına geçilir. Detayda ad ve e-posta düzenlenir, yalnız değişen alanlar PATCH ile gönderilir. Yönetici kendi e-postasını buradan değiştiremez; doğrulamalı Hesabım → E-posta akışını kullanır. Kullanıcıya ait yazılar silinenler dahil en fazla 10 kayıt olarak gösterilir.

Kullanıcı listesinin `active`, `deleted`, `sort`, `order` ve `page` seçimleri URL'dedir; arama metni yalnız component state'inde tutulur ve 400 ms gecikmeyle API sorgusuna eklenir. Detay sayfasındaki sabit listeye dönüş bağlantısı filtreleri taşımaz; tarayıcının geri tuşu önceki URL'ye dönebilir.

Kategorilerde `deleted`, `sort` ve `order`; yazılarda `status`, `deleted`, `category`, `user` ve `page` URL'de tutulur. Geçersiz değerlerde varsayılanlar kullanılır; varsayılan seçimler URL'den çıkarılır. Arama metni bu sayfalarda da yalnız state'tedir. Kategori satırındaki “Yazıları” bağlantısı kategoriye, kullanıcı detayındaki “Yönetimde aç” bağlantısı yazara göre filtrelenmiş yazı listesine gider. “Süzgeci kaldır” kategori ve yazar kapsamını temizler.

`Layout`, API durumu bandını ortak yerleşimde gösterir. API istemcisindeki ağ hatası veya 502/504 yanıtı yeni bir `/health` kontrolü başlatır. Sağlık kontrolü başarısızsa bant görünür; API erişilemiyorken otomatik tekrar deneme ve “Şimdi dene” seçeneği vardır. `ErrorBoundary` yalnız ana içeriği sarar; Header, Footer ve bantlar bu sınırın dışındadır.
