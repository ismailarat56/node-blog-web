<div align="center">

# Node Blog Web

**Node Blog API için React arayüzü: blog sayfaları, yazar paneli ve yönetim paneli.**

![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Lisans](https://img.shields.io/badge/lisans-MIT-2ea44f)

[Öne çıkanlar](#öne-çıkanlar) · [Kurulum](#kurulum-ve-çalıştırma) · [Sayfalar](#sayfalar) · [Oturum](#oturum-ve-veri-katmanı) · [Belgeler](#belgeler)

</div>

[node-blog-api](https://github.com/ismailarat56/node-blog-api) üzerindeki yazıları, kategorileri ve yorumları gösteren tek sayfalık bir React uygulaması. Okuyucular için blog sayfalarını, yazarlar için yazı panelini, yöneticiler için kategori, yazı ve kullanıcı yönetimini içerir. React 19, React Router 8, Vite 8 ve TanStack Query 5 ile, JavaScript (JSX) olarak yazıldı.

## Öne çıkanlar

- **Blog sayfaları:** yazı listesi, kategori filtresi, sayfalama, yazı detayı ve cevaplanabilen yorumlar.
- **Oturum:** access token yalnız bellekte tutulur; refresh token'ı API `httpOnly` cookie olarak yazar, arayüz hiç görmez.
- **Token yenileme:** açılışta ve `401` yanıtında token bir kez yenilenir, asıl istek yeni token'la tekrar gönderilir.
- **Sekmeler arası eşgüdüm:** yenileme Web Locks ile sıraya girer; giriş ve çıkış BroadcastChannel ile diğer sekmelere duyurulur.
- **Hesap akışları:** e-posta doğrulama, parola sıfırlama, kodla parola değiştirme ve e-posta değiştirme.
- **Yazar paneli:** taslak oluşturma, düzenleme, yayınlama ve yayından kaldırma, kapak görseli yükleme, silme ve geri alma, yorum moderasyonu.
- **Yönetim paneli:** kategori, yazı ve kullanıcı yönetimi; sayfaları `lazy` ile ayrı JavaScript dosyalarına bölünür.
- **Sunucu verisi önbelleği:** yönetim listeleri TanStack Query ile yüklenir; veri 30 saniye güncel sayılır, 4xx hataları tekrar denenmez.
- **URL'de filtreler:** yazar ve yönetim listelerinin filtre, sıralama ve sayfa seçimleri adreste tutulur; yönetimde arama 400 ms gecikmeyle sorguya eklenir.
- **İyimser güncelleme:** kategori aktifliği `useOptimistic` ile anında değişir, hatada rozet eski durumuna döner.
- **API durumu bandı:** API'ye ulaşılamadığında uyarı gösterir ve 10 saniye sonra yeniden dener; ana içerikteki render hataları için `ErrorBoundary` vardır.

## Gereksinimler

- Node.js 22.22 veya üstü ve npm.
- Docker Compose ile çalışan [node-blog-api](https://github.com/ismailarat56/node-blog-api) stack'i (8080 portu).

## Kurulum ve çalıştırma

1. API projesinin ([node-blog-api](https://github.com/ismailarat56/node-blog-api)) klasöründe servisleri başlat:

    ```bash
    docker compose up -d
    ```

2. Bu projenin klasöründe bağımlılıkları kur ve geliştirme sunucusunu başlat:

    ```bash
    npm install
    npm run dev
    ```

3. Tarayıcıda http://localhost:5173 adresini aç.

Vite proxy, `/api`, `/uploads` ve `/health` isteklerini `http://127.0.0.1:8080` adresine taşır. Tarayıcı istekleri uygulamayla aynı origin'e gönderir; Vite bunları API'ye iletir. Bu geliştirme ayarıdır; üretimde bu yolların web sunucusunda da yönlendirilmesi gerekir.

### Komutlar

| Komut             | Görevi                                                   |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Bağımlılıkları kurar.                                    |
| `npm run dev`     | Geliştirme sunucusunu başlatır.                          |
| `npm run build`   | Üretim dosyalarını `dist/` klasörüne oluşturur.          |
| `npm run preview` | Build çıktısını http://localhost:4173 adresinde önizler. |
| `npm run lint`    | Oxlint ile kodu kontrol eder.                            |

Önizlemeden önce `npm run build` çalıştırılmalıdır. `dist/` yeniden üretilebilir bir çıktıdır ve Git'e eklenmez.

## Sayfalar

| Bölüm | Adresler | Erişim |
| --- | --- | --- |
| Blog | `/`, `/posts/:slug` | Herkese açık |
| Giriş ve hesap kurtarma | `/login`, `/forgot-password`, `/reset-password`, `/verify-email` | Herkese açık |
| Hesabım | `/account`, `/account/password`, `/account/email` | Oturum gerekir |
| Yazar paneli | `/dashboard`, `/dashboard/posts/new`, `/dashboard/posts/:id/edit` | Oturum gerekir |
| Yönetim paneli | `/admin`, `/admin/posts`, `/admin/users`, `/admin/users/new`, `/admin/users/:id` | Oturum ve admin rolü gerekir |

Her sayfanın bileşeni ve gönderdiği API istekleri: [docs/SAYFALAR.md](docs/SAYFALAR.md)

## API kapsamı

Arayüz, API'nin `/api/v1` önekli uçlarını ve ayrıca `GET /health` ucunu kullanır. Uç uç tabloda API'nin 49 uygulama ucundan 43'ü bir ekrana ya da bileşene bağlıdır. Kalan altı uç:

- `POST /auth/register`: kayıt sayfası henüz eklenmedi.
- `GET /auth/me`: kullanıcı bilgisi login ve refresh yanıtından alınır.
- `PUT /users/:id`, `PUT /posts/:id`, `PUT /categories/:id`: yalnız değişen alanları göndermek için PATCH tercih edilir.
- `GET /categories/:id`: yönetim listesi aynı alanları zaten verir.

Tam tablo ve gerekçeler: [docs/API_KAPSAMI.md](docs/API_KAPSAMI.md). Arayüzü yazarken API'de görülen sorunlar: [docs/API_SORUNLARI.md](docs/API_SORUNLARI.md)

## Oturum ve veri katmanı

- Açılışta `AuthProvider` bir kez `POST /api/v1/auth/refresh` gönderir. Başarılıysa durum `authenticated`, değilse `anonymous` olur.
- Oturumlu istekler `authRequest` üzerinden gider. Aynı anda gelen `401` yanıtları tek yenilemeyi bekler; yenileme de `401` alırsa oturum kapanır.
- `RequireAuth` oturumu, `RequireAdmin` admin rolünü kontrol eder. Bunlar arayüz kapılarıdır; asıl yetkiyi API denetler.
- Kullanıcı içeriği düz metin olarak basılır, `dangerouslySetInnerHTML` kullanılmaz.
- Yönetimdeki kullanıcı, kategori ve yazı listeleri TanStack Query ile yüklenir. Blog sayfaları ve yazar paneli `useApi` hook'unu kullanır.
- Çıkışta token, kullanıcı state'i ve Query Client önbelleği temizlenir.

Ayrıntı: [docs/OTURUM.md](docs/OTURUM.md) ve [docs/PANELLER.md](docs/PANELLER.md)

## Klasör yapısı

```
src/
  main.jsx           giriş noktası: QueryClientProvider, BrowserRouter, AuthProvider
  App.jsx            route tanımları; yönetim sayfaları lazy ile yüklenir
  api/               istek istemcisi, hata dönüşümü, /health kontrolü, Query Client, önbellek anahtarları
  auth/              oturum state'i, Context, bellekteki access token, refresh, sekmeler arası mesaj
  components/        ortak bileşenler, yerleşimler, RequireAuth ve RequireAdmin
  components/admin/  yönetim tablolarının satır, form ve başlık bileşenleri
  hooks/             useApi, useApiHealth, useCountdown, useDebouncedValue
  pages/             route'lara karşılık gelen sayfalar
  pages/admin/       lazy ile yüklenen yönetim sayfaları
  utils/             tarih, slug, form ve URL filtresi yardımcıları
  index.css          stiller
public/              favicon
docs/                ayrıntılı belgeler
notes/               geliştirme sürecinin gün sonu özetleri ve doğrulama kaydı
vite.config.js       geliştirme proxy'si
```

Dosya dosya açıklama: [docs/KLASOR_YAPISI.md](docs/KLASOR_YAPISI.md)

## Bilinen eksikler

- Kayıt sayfası yok. `/register` rotası ve `POST /api/v1/auth/register` çağrısı henüz eklenmedi; menüdeki ve giriş sayfasındaki "Kayıt ol" bağlantıları bulunamadı sayfasına gider.
- Repoda kalıcı otomatik test paketi yok. Kod kontrolü `npm run lint` ve `npm run build` ile yapılır.
- API'de CORS ayarı yok; uygulama yalnız aynı origin'den (Vite proxy veya nginx) çalışır.
- Web Locks veya BroadcastChannel olmayan eski tarayıcılarda uygulama açılmaz.
- Eşzamanlı düzenlemede son yazan kazanır; sürüm kontrolü yok.

Tam liste: [docs/BILINEN_SINIRLAMALAR.md](docs/BILINEN_SINIRLAMALAR.md). Planlanan işler: [docs/SONRAKI_ADIMLAR.md](docs/SONRAKI_ADIMLAR.md)

## Belgeler

| Dosya | İçerik |
| --- | --- |
| [docs/SAYFALAR.md](docs/SAYFALAR.md) | Adres, bileşen ve API isteği tablosu |
| [docs/API_KAPSAMI.md](docs/API_KAPSAMI.md) | API uçlarının arayüze bağlanma durumu |
| [docs/OTURUM.md](docs/OTURUM.md) | Token saklama, yenileme, sekmeler arası eşgüdüm, çıkış |
| [docs/PANELLER.md](docs/PANELLER.md) | Yazar paneli ve yönetim panelinin çalışma biçimi |
| [docs/KLASOR_YAPISI.md](docs/KLASOR_YAPISI.md) | Klasör ve dosyaların görevleri |
| [docs/SURUM_NOTLARI.md](docs/SURUM_NOTLARI.md) | URL filtreleri ve önbellek değişikliği, sürüm etiketlerinin doğrulaması |
| [docs/BILINEN_SINIRLAMALAR.md](docs/BILINEN_SINIRLAMALAR.md) | Bilinen sınırlamaların tam listesi |
| [docs/API_SORUNLARI.md](docs/API_SORUNLARI.md) | Arayüzü yazarken API'de bulunan sorunlar |
| [docs/SONRAKI_ADIMLAR.md](docs/SONRAKI_ADIMLAR.md) | Planlanan işler |

Gün sonu özetleri [notes/](notes/) klasöründedir.

## Lisans

Kod [MIT lisansı](LICENSE) ile sunulur.
