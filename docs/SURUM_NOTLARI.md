[← README'ye dön](../README.tr.md)

# Sürüm notları

## URL Filtreleri ve Sunucu Verisi Önbelleği — 07.10.2026

Yönetimde kategori ve yazı filtreleri URL'de tutulur. Kullanıcı listesi/detayı ile kategori ve yazı listeleri TanStack Query üzerinden yüklenir. Liste anahtarları filtreleri ve gecikmeli aramayı içerir; farklı sayfalar ayrı önbellek kayıtlarıdır. Veriler 30 saniye güncel kabul edilir. Kullanıcı ve yazı listelerinde yeni sorgu yüklenirken önceki sonuç gösterilir.

Kullanıcı işlemleri ilgili önbelleği geçersiz kılar; detay düzenlemesi dönen kaydı önbelleğe yazar ve kullanıcı listelerini yeniler. Oturum temizlenirken Query Client önbelleği de temizlenir. 4xx hataları tekrar denenmez; diğer sorgu hataları, ağ hataları dahil, en fazla bir kez tekrar denenir. API sağlığı `down` durumundan `up` durumuna geçtiğinde Query sorguları geçersiz kılınır ve etkin sorgular yeniden yüklenir.

`blog-web-v6`, bu diziden hemen önceki `31b28a3` commit'ini işaretler. Commitleri eskiden yeniye görmek için:

```bash
git log --oneline --reverse blog-web-v6..HEAD
```

Değişiklikler ve doğrulama kapsamı [07.10 gün sonu özetinde](../notes/daily-summary-07-10-2026.md) açıklanır. Commit dizisi ve build/lint kontrolleri 08.10.2026'da tamamlandı.

## Önceki Sürüm Doğrulaması: blog-web-v5

04.10 yönetim paneli çalışmasının sürüm kapanışı 06.10.2026'da doğrulandı. `lazy` tanımları ve `AdminLayout` içindeki `Suspense`, mevcut `b58eb8c` commit'inde zaten bulunuyordu. `perf: lazy load admin pages` commit'i bu uygulamanın paket ve tarayıcı doğrulama kaydını ekler; `docs: update readme and daily summary` commit'i README ve gün sonu özetini tamamlar.

Eksik `blog-web-v4` etiketi, yönetim panelinden önceki 03.10 son commit'i olan `09867a2` üzerine eklendi. `blog-web-v5`, 04.10 işlerinin doğrulanmış kapanışını işaretler.

`blog-web-v5` sürümündeyken kontrol et:

```bash
git status
git describe --tags
git log --oneline blog-web-v4..blog-web-v5
npm run build
npm run lint
```

Çalışma ağacı temiz, `git describe --tags` çıktısı `blog-web-v5` olmalı; commit aralığında yukarıdaki `perf:` ve `docs:` başlıkları görünmeli. Paket boyutları ve tarayıcı sonuçları [doğrulama kaydında](../notes/admin-lazy-verification-06-10-2026.json), yöntem ve bulgular [04.10 gün sonu özetinde](../notes/daily-summary-04-10-2026.md#06102026-tamamlama-doğrulaması) bulunur.
