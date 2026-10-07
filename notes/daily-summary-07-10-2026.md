# 07.10.2026 — URL Filtreleri ve TanStack Query

Bu dosya 07.10 çalışmasının kodunu özetler. Belgelerin tamamlanması ve commit dizisinin build/lint doğrulaması 08.10.2026'da yapıldı; geçmiş tarihte test çalıştırıldığı iddia edilmez.

## URL'de Tutulan Seçimler

- Kategoriler: `deleted`, `sort`, `order`.
- Yazılar: `status`, `deleted`, `category`, `user`, `page`.
- Kullanıcılar: önceki çalışmada eklenen `active`, `deleted`, `sort`, `order`, `page` korunur.

Okuma yardımcıları geçersiz değerler için varsayılan seçimleri kullanır. Yazma yardımcıları varsayılanları URL'ye eklemez. Kategori satırındaki “Yazıları” bağlantısı `/admin/posts?category=...` adresini açar. Kullanıcı detayındaki “Yönetimde aç” bağlantısı `/admin/posts?user=...&deleted=1` adresini açar. Yazı listesinde kategori/yazar kapsamı gösterilir ve “Süzgeci kaldır” ile temizlenir.

Arama metni component state'inde kalır, 400 ms gecikmeyle API isteğine eklenir; yenilemede kaybolur. Sayfa URL'sine yazılmaması, API sorgu parametrelerinde veya sunucu günlüklerinde bulunmayacağı anlamına gelmez.

## Sunucu Verisi ve Önbellek

`QueryClientProvider` uygulamayı sarar; geliştirmede React Query Devtools kullanılabilir. `src/api/query-keys.js`, kullanıcı listeleri/detayları ile kategori ve yazı listelerinin anahtarlarını tanımlar. Liste anahtarlarında filtreler, sayfa ve gecikmeli arama bulunur.

`AdminUsersPage`, `AdminUserPage`, `AdminCategoriesPage` ve `AdminPostsPage` artık `useQuery` kullanır. Sorgu fonksiyonları iptal sinyalini `authRequest`'e geçirir. `staleTime: 30_000`, başarılı veriyi 30 saniye güncel kabul eder; bu ayar bir periyodik sorgulama zamanlayıcısı değildir.

Kullanıcı ve yazı listelerinde `placeholderData: keepPreviousData`, yeni filtre/sayfa yüklenirken önceki sonucu tutar. Tablonun `aria-busy` değeri bu durumu bildirir. Kullanıcı ve kategori listeleri arka plan isteğinde “Güncelleniyor...” gösterir.

## Değişiklikten Sonra Yenileme

- Kullanıcı rolü, aktifliği ve silme işlemi `useMutation` ile yürür; başarıda kullanıcı sorguları geçersiz kılınır. Geri getirme de aynı sorguları geçersiz kılar.
- Kullanıcı detayında kaydetme, dönen kaydı detay önbelleğine yazar ve kullanıcı listelerini geçersiz kılar.
- Kategori oluşturma, silme ve geri getirme kategori sorgularını geçersiz kılar. Düzenleme ayrıca yazı sorgularını geçersiz kılar. Aktiflik değişimi mevcut kategori listesini `setQueryData` ile günceller.
- Yazı silme ve geri getirme yazı sorgularını geçersiz kılar.
- Oturum temizlenirken `queryClient.clear()` çağrılır.

Geçersiz kılma etkin sorguları yeniden yükler; etkin olmayan kayıtlar sonraki kullanım için bayat işaretlenir. Yeni kullanıcı oluşturma ve yönetim dışındaki yazı düzenleme akışlarının önbellek yenilemesi bu değişikliklerin kapsamında değildir.

## Hata ve API'nin Geri Gelmesi

Ortak tekrar deneme politikası 4xx yanıtlarında tekrar denemez. Diğer sorgu hatalarını, ağ hataları dahil, en fazla bir kez tekrar dener. İstenen commit başlığındaki “only server errors” ifadesine rağmen kod yalnız 5xx kontrolü yapmaz; koşul 4xx dışındaki hataları kapsar.

`useApiHealth`, sağlık kontrolü sonucunda `down` → `up` geçişi görürse Query sorgularını geçersiz kılar. Böylece etkin Query sorguları yeniden yüklenir. Hâlâ `useApi` kullanan sayfalar bu yenilemeye dahil değildir. Sağlık kontrolünün erişilemezken 10 saniyede bir yeniden denemesi ayrı bir mekanizmadır.

## Commit Sırası

`blog-web-v6` tabanı, ilk stil commit'inin ebeveyni `31b28a3` olarak belirlenmiştir. İlk stil commit'i `85828e8` zaten GitHub'daydı; kalan değişiklikler mevcut kod korunarak aşağıdaki sıraya ayrıldı:

1. `style: add url filter and cache styles`
2. `feature: keep category filters in the url`
3. `feature: keep post filters in the url and link to them`
4. `chore: add a query client for server data`
5. `refactor: load the user list with useQuery`
6. `perf: cache user pages and keep the previous page while loading`
7. `feature: refresh cached users after changes`
8. `refactor: load categories and posts with useQuery`
9. `feature: retry only server errors and refetch when the api is back`
10. `docs: update readme and daily summary`

Eskiden yeniye kontrol:

```bash
git log --oneline --reverse blog-web-v6..HEAD
```

`--reverse` olmadan en yeni commit önce görünür.

## Doğrulama — 08.10.2026

- Mevcut son kodda `npm run build`, `npm run lint` ve `git diff --check` başarılı.
- 2–9 numaralı commitlerin her birinin ayrı dosya görüntüsünde build ve lint başarılı.
- Bölme işleminin sonunda kaynak dosyaları ve paket dosyaları başlangıçtaki çalışma ağacıyla bayt düzeyinde aynı; bu çalışma mevcut uygulama değişikliklerini commitlere ayırır.
- Bu oturumda tarayıcı, canlı API kesintisi veya canlı kullanıcı değiştirme/silme deneyi yapılmadı. Build ve lint sonuçları çalışma zamanı davranışlarının tamamının test edildiği anlamına gelmez.
