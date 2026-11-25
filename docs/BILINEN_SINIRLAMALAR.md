[← README'ye dön](../README.md)

# Bilinen Sınırlamalar

- Access token bellekte; sayfaya sızan bir script refresh isteği atıp yeni token alabilir (`httpOnly` cookie yalnız refresh token'ın okunmasını engeller).
- Her açılışta bir refresh isteği gider; anonim ziyaretçide Network'te ve Console'da bir `401` görünür.
- Token yenilenince `useApi` kullanan sayfada istek bir kez iptal edilip yeniden gönderilir.
- Web Locks veya BroadcastChannel olmayan eski tarayıcılarda uygulama açılmaz.
- Kullanıcı, kategori ve yazı yönetiminde arama metni adreste değil; sayfa yenilenince kaybolur.
- Kullanıcı listesinin son sayfasındaki son kayıt silinirse sayfa otomatik geri alınmaz; arama veya filtre değiştirilerek 1. sayfaya dönülür.
- Kategori yönetimi ilk 50 kategoriyi gösterir; sayfalama yok.
- Bütün yorumları tek yerde gösteren bir yönetim sayfası yok; moderasyon yazının düzenleme sayfasında. API'de de bütün yorumları tek listede veren bir uç yok.
- Arayüzdeki rol ve ad en geç bir sonraki token yenilemesinde (15 dakika) güncellenir; yenileme, süresi dolmuş token'la yapılan isteğin `401` almasıyla tetiklenir, zamanlayıcıyla yapılmaz.
- Hata sınırı olay yöneticilerindeki ve async koddaki hataları yakalamaz; bu işlemlerin hataları kendi akışlarında ele alınmalı.
- API geri gelince otomatik veri yenileme Query kullanan sayfaları kapsar; `useApi` kullanan sayfalarda başarısız asıl istek kendiliğinden tekrarlanmaz.
- Açılışta API'ye ulaşılamazsa arayüz anonim açılır; cookie silinmez, API yeniden erişilebilir olduğunda sayfa yenilenince oturum geri gelir.
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
- Önceki veriyi gösterme kullanıcı ve yazı yönetim listelerinde var; kategori listesinde ve `useApi` kullanan sayfalarda yok.
- API'de CORS ayarı yok; uygulama yalnız aynı origin'den (Vite proxy veya nginx) çalışır.
- Repoda kalıcı otomatik test paketi yok; bu oturumdaki geçici tarayıcı kontrolleri örnek API yanıtlarıyla çalıştırıldı.
