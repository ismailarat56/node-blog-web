[← README'ye dön](../README.md)

# Klasör Yapısı

- `src/api/`: API isteklerini ve hata dönüşümünü yönetir.
- `src/api/query-client.js`: Ortak Query Client, 30 saniyelik güncellik süresi ve sorgu tekrar deneme politikasını tanımlar.
- `src/api/query-keys.js`: Kullanıcı, kategori ve yazı önbellek anahtarlarını ortaklaştırır.
- `src/api/health.js`: `/health` kontrolünü yapar; API istemcisindeki bağlantı sorunlarını `api:trouble` olayıyla duyurur.
- `src/auth/`: oturum state'i, Context, bellekteki access token ve refresh (`session.js`), sekmeler arası mesaj (`session-channel.js`).
- `src/components/`: Sayfalarda kullanılan arayüz bileşenlerini içerir. `AccountLayout.jsx` hesap menüsünü ve alt sayfaları birleştirir; `CodeField.jsx` doğrulama kodundan rakam dışı karakterleri temizler.
- `src/components/ApiStatusBanner.jsx`: API'ye ulaşılamadığında uyarı ve elle tekrar deneme düğmesi gösterir.
- `src/components/ErrorBoundary.jsx`: Ana içerikteki render hatasında yeniden deneme ve ana sayfaya dönüş ekranı gösterir; yol değişince hatayı temizler.
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
- `src/utils/category-filters.js`: Kategorilerin silinenleri gösterme ve sıralama seçimlerini URL'den okur/yazar.
- `src/utils/post-filters.js`: Yazıların durum, silinenleri gösterme, kategori, yazar ve sayfa seçimlerini URL'den okur/yazar.
