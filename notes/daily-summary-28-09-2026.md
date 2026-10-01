# 28.09.2026 Gün Sonu Özeti

## Eklediğim Dosyalar

- `src/api/client.js`: API istekleri ve hata yönetimi.
- `src/components/Layout.jsx`, `Header.jsx`, `Footer.jsx`: Ortak sayfa düzeni.
- `src/components/PostList.jsx`, `PostCard.jsx`, `LikeButton.jsx`: Yazı listesi, yazı kartı ve yerel beğeni state'i.
- `src/components/StatusMessage.jsx`: Yüklenme, hata ve boş liste mesajları.
- `src/components/CategoryFilter.jsx`, `Pagination.jsx`: Kategori seçimi ve sayfalama.
- `src/components/CommentList.jsx`, `CommentItem.jsx`: Yorumlar ve cevapların gösterimi.
- `src/hooks/useApi.js`: API sonucunu ait olduğu adresle birlikte saklayan hook.
- `src/pages/HomePage.jsx`, `PostDetailPage.jsx`, `NotFoundPage.jsx`: Ana sayfa, yazı detayı ve bulunamayan adres sayfası.
- `src/utils/format-date.js`: Tarih biçimlendirme.

## Props ile State Arasındaki Fark

Props, bir bileşene üst bileşenden gelen bilgilerdir; örneğin `PostCard` yazıyı `post` prop'u ile alır. State, bileşenin tuttuğu ve güncelleyebildiği bilgidir; `HomePage` seçili kategoriyi ve sayfa numarasını state'te tutar. Mevcut props veya state'ten hesaplanabilen değerler için ayrı state gerekmez: `useApi` içindeki `loading`, sonuç adresiyle istenen adres karşılaştırılarak hesaplanır.

## useEffect Ne Zaman Çalışıyor, Cleanup Ne Yapıyor

`useApi` içindeki effect, bileşen ekrana yerleştirildikten sonra ve `path` değiştiğinde çalışır. Cleanup, yeni effect çalışmadan önce ve bileşen kaldırıldığında `controller.abort()` ile önceki isteği iptal eder. StrictMode geliştirmede ek bir setup–cleanup döngüsü çalıştırır; üretim build'inde bu ek kontrol yoktur.

## CORS Hatası Neden Çıktı, Proxy Nasıl Çözdü

Frontend'in 5173, API'nin 8080 portunda olması farklı origin demektir. API uygun CORS izni vermediğinde tarayıcı doğrudan API yanıtını JavaScript'e açmaz. Göreli `/api` adresleri kullanıldığında tarayıcı kendi origin'indeki Vite'a istek gönderir; Vite proxy isteği `127.0.0.1:8080` adresine iletir. `/uploads` için de aynı yönlendirme vardır.

## İki Farklı 502 Deneyinde Ne Gördüm

<!-- Kendi deneylerinle doldur: Her deneyde hangi servisi durdurdun veya hangi ayarı değiştirdin? Network'te, terminalde ve ekranda ne gördün? -->

- Birinci deney: …
- İkinci deney: …
- Aralarındaki fark: …

## Backend'den Bildiğim Hangi Fikir Burada Karşıma Çıktı

Express'teki `/:slug` route parametresinin tarayıcıdaki karşılığı React Router'ın `/posts/:slug` route'u ve `useParams()` oldu. `path="*"`, eşleşmeyen adresleri karşılamasıyla backend'deki not-found middleware'ine benziyor. Vite proxy de isteği başka bir sunucuya iletmesiyle nginx reverse proxy fikrini tekrar karşıma çıkardı.

## En Çok Zorlandığım Konu

<!-- Kendi deneyiminle doldur: Hangi konuda takıldın, ne denedin ve nasıl anladın? -->

…

## Kendi Cümlelerimle Özet

<!-- Bu bölümü kendi cümlelerinle yaz: Uygulama açıldığında verinin API'den ekrana nasıl geldiğini ve bugün öğrendiklerini anlat. -->

…
