# Node Blog Web

Node Blog API'sindeki yazıları, kategorileri ve yorumları gösteren React uygulaması.

## Gereksinimler

- Node.js 22.22 veya üstü ve npm.
- Docker Compose ile çalışan API stack'i (8080 portu).

## Çalıştırma

1. API projesinin klasöründe servisleri başlat:

   ```bash
   docker compose up -d
   ```

2. Bu projenin klasöründe bağımlılıkları kur ve geliştirme sunucusunu başlat:

   ```bash
   npm install
   npm run dev
   ```

3. Tarayıcıda http://localhost:5173 adresini aç.

Vite proxy, `/api` ve `/uploads` isteklerini `http://127.0.0.1:8080` adresine taşır. Tarayıcı istekleri uygulamayla aynı origin'e gönderir; Vite bunları API'ye iletir.

## Komutlar

| Komut | Görevi |
| --- | --- |
| `npm install` | Bağımlılıkları kurar. |
| `npm run dev` | Geliştirme sunucusunu başlatır. |
| `npm run build` | Üretim dosyalarını `dist/` klasörüne oluşturur. |
| `npm run preview` | Build çıktısını http://localhost:4173 adresinde önizler. |
| `npm run lint` | Oxlint ile kodu kontrol eder. |

Önizlemeden önce `npm run build` çalıştırılmalıdır. `dist/` yeniden üretilebilir bir çıktıdır ve Git'e eklenmez.

## Klasör Yapısı

- `src/api/`: API isteklerini ve hata dönüşümünü yönetir.
- `src/components/`: Sayfalarda kullanılan arayüz bileşenlerini içerir.
- `src/hooks/`: Veri, yüklenme ve hata durumunu yöneten `useApi` gibi ortak hook'ları içerir.
- `src/pages/`: Route'lara karşılık gelen sayfa bileşenlerini içerir.
- `src/utils/`: Tarih biçimlendirme gibi yardımcı fonksiyonları içerir.

## Sayfalar

| Adres | Bileşen | API istekleri |
| --- | --- | --- |
| `/` | `HomePage` | `GET /api/v1/public/posts`, `GET /api/v1/public/categories` |
| `/posts/:slug` | `PostDetailPage` | `GET /api/v1/public/posts/:slug`, `GET /api/v1/public/posts/:slug/comments` |
| `*` | `NotFoundPage` | — |

## Bilinen Sınırlamalar

- Yalnız public okuma var; login, kayıt ve yorum yazma yok.
- Beğeni sayısı yalnız tarayıcı state'inde; API'ye yazılmıyor, sayfa değişince sıfırlanıyor.
- Kategori ve sayfa bilgisi URL'de değil; sayfa yenilenince ilk sayfaya dönülüyor.
- Yorumlar yalnız ilk sayfa (API'nin varsayılan limiti) kadar gösteriliyor.
- Post ve yorum istekleri art arda gidiyor (request waterfall).
- Filtre veya sayfa değişince liste kaybolup yeniden yükleniyor; önceki veri gösterilmiyor.
- API'de CORS ayarı yok; uygulama yalnız aynı origin'den (Vite proxy veya nginx) çalışır.
- Bir component render sırasında hata verirse bütün sayfa boş kalır (error boundary yok).
- Otomatik test yok.

## Sonraki Adımlar

- Login ve kayıt formları; token'ın nerede saklanacağı kararı.
- Yorum yazma formu.
- Filtre ve sayfayı URL'de tutmak (`useSearchParams`).
- `dist/` klasörünü compose'taki nginx ile servis etmek.
- Veri çekmeyi TanStack Query'ye taşımak (önbellek, önceki veriyi tutma).
- TypeScript.
