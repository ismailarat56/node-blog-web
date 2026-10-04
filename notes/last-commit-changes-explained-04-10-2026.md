# Son committen sonraki değişikliklerin satır satır açıklaması — 04.10.2026

Bu belge, `f3b2984` (`style: add admin panel styles`) commitindeki kodu mevcut çalışma alanıyla karşılaştırır. Dünkü [03.10.2026 açıklamasının](last-commit-changes-explained-03-10-2026.md) düzenini izler: klasörün katkısı, dosyanın amacı, fonksiyonların görevleri ve kaynak satırı / kod / açıklama tabloları.

**Kapsam:** Bu raporun kendisi hariç son commite göre 21 dosya var: 18 JavaScript/JSX dosyası ve 3 Markdown belgesi. Kod dosyalarının 15’i yeni, 3’ü mevcut dosya değişikliği; belgelerden README değişmiş, iki not Git’te izlenmeyen dosya durumunda. Dünkü açıklama dosyası izlenmiyor olsa da bugünün uygulama kodu değildir; referans belge olarak ayrıca kaydedildi. `src/index.css` yönetim stilleri temel alınan committe zaten bulunduğundan bu farkın dışında kalır.

Yeni kod dosyalarının **bütün boş olmayan satırları**, mevcut kod dosyalarının yalnız **HEAD’e göre eklenen/değişen satırları** açıklanır. Kapanış satırları da dahil edilir. Tablodaki numaralar bu belge hazırlanırkenki gerçek kaynak satırlarıdır; ileride düzenleme yapılırsa değişebilir. Belge dosyaları çalıştırılan kod içermediğinden bölüm ve satır aralıklarıyla açıklanır. Klasörler ortak bileşen → bağlantı → ortak mantık → yönetim bileşenleri → sayfalar sırasıyla okunabilir biçimde düzenlendi; bu sıra commit kronolojisi değildir.

## Genel özet

Yönetim paneli üç sekmeye ayrıldı: kategoriler, bütün yazılar ve kullanıcılar. Kategorilerde arama/sıralama, oluşturma, düzenleme, iyimser aktiflik değişikliği, modal onaylı silme ve geri getirme var. Yazılarda arama/durum/silinme filtreleri, sayfalama, düzenleme bağlantısı, silme ve geri getirme var. Kullanıcılarda arama/aktiflik filtresi/sıralama/sayfalama ve onaylı rol/aktiflik değişikliği var; kendi hesap düğmeleri kapalı.

| Klasör | Genel katkısı |
| --- | --- |
| `src/components` | Admin kapısı, sekmeli yerleşim, ortak modal ve Header bağlantısı. |
| `src` | Üç lazy yönetim sayfası ve oturum/admin korumalı route ağacı. |
| `src/hooks` | 400 ms debounce ve istek atmadan listeyi güncelleme. |
| `src/utils` | Türkçe slug önerisi, form normalizasyonu ve durum etiketi. |
| `src/components/admin` | Ortak sıralama başlığı, kategori formu ve üç tablo satırı. |
| `src/pages/admin` | Filtre state’i, CRUD/rol işlemleri, onaylar ve liste yenileme. |
| Proje kökü | README’de kullanım, mimari, sınırlama ve API bulguları. |
| `notes` | Gün özeti, ölçümler ve önceki açıklama belgesi. |

Bu değişiklikler frontend içindir; backend endpoint veya veritabanı şeması eklenmedi. API davranışına ilişkin ders bulguları, bu dosyalarda uygulanmış sunucu düzeltmeleri olarak okunmamalıdır.

## 1. src/components

Ortak arayüz kapısı, yönetim yerleşimi ve native onay penceresi eklendi; Header admin bağlantısını gösterir.

### RequireAdmin.jsx

**Dosya:** [src/components/RequireAdmin.jsx](../src/components/RequireAdmin.jsx)

**Değişiklik:** Yeni dosya.

RequireAuth oturum yokken yönlendirir ve checking sırasında bekler. Bu bileşen onun içinde kaldığından null kullanıcıyı ayrıca kontrol etmez; sıra ters çevrilmemelidir.

**Fonksiyonların görevleri**

- `RequireAdmin`: AuthContext içindeki rolü kontrol eder; admin değilse hata ve ana sayfa bağlantısı, admin ise children döndürür. RequireAuth içinde kullanılmalıdır.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { Link } from "react-router"; `` | İçeri alır: Link — istemci tarafında sayfa bağlantısı. |
| 2 | `` import useAuth from "../auth/useAuth.js"; `` | İçeri alır: useAuth — AuthContext kullanıcı ve istek fonksiyonları. |
| 3 | `` import StatusMessage from "./StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 5 | `` export default function RequireAdmin({ children }) { `` | AuthContext içindeki rolü kontrol eder; admin değilse hata ve ana sayfa bağlantısı, admin ise children döndürür. RequireAuth içinde kullanılmalıdır. Bu satır fonksiyon tanımıdır. |
| 6 | `` const auth = useAuth(); `` | Oturum Context’inden kullanıcı bilgisini ve authRequest dahil yardımcıları alır. |
| 8 | `` if (auth.user.role !== "admin") { `` | Rol admin değilse erişim mesajını döndürecek kola girer; dış RequireAuth kullanıcıyı önceden kontrol etmiştir. |
| 9 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 10 | `` <StatusMessage type="error"> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar. |
| 11 | `` Bu bölüm yalnız yöneticilere açık.{" "} `` | Erişim reddi metnini ve ardından gelecek bağlantıdan önce açık bir boşluğu üretir. |
| 12 | `` <Link to="/">Ana sayfaya dön</Link> `` | Erişemeyen kullanıcıya ana sayfaya istemci tarafında dönüş bağlantısı gösterir. |
| 13 | `` </StatusMessage> `` | StatusMessage elementinin/bileşeninin içeriğini kapatır. |
| 14 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 15 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 17 | `` return children; `` | Admin kullanıcı için sarılan içeriği render edilmeye bırakır. |
| 18 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### AdminLayout.jsx

**Dosya:** [src/components/AdminLayout.jsx](../src/components/AdminLayout.jsx)

**Değişiklik:** Yeni dosya.

Sekmeler Suspense sınırının dışında kalır. Kategoriler bağlantısındaki end yalnız tam /admin eşleşmesini vurgular; alt sayfa yerleşimi Outlet ile sağlanır.

**Fonksiyonların görevleri**

- `AdminLayout`: Yönetimin üç sekmesini gösterir; alt route içeriğini Outlet ve Suspense ile yükler.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { Suspense } from "react"; `` | İçeri alır: Suspense — lazy içerik beklerken fallback gösterme. |
| 2 | `` import { NavLink, Outlet } from "react-router"; `` | İçeri alır: NavLink — aktif route’u işaretleyen bağlantı; Outlet — eşleşen alt route içeriği. |
| 3 | `` import StatusMessage from "./StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 5 | `` export default function AdminLayout() { `` | Yönetimin üç sekmesini gösterir; alt route içeriğini Outlet ve Suspense ile yükler. Bu satır fonksiyon tanımıdır. |
| 6 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 7 | `` <section> `` | Sayfa/bölüm kapsayıcısını açar. |
| 8 | `` <nav className="admin__nav" aria-label="Yönetim paneli"> `` | Yönetim sekmelerini ortak nav stiliyle açar; erişilebilir adını Yönetim paneli yapar. |
| 9 | `` <NavLink to="/admin" end> `` | Kategoriler sekmesini açar; end yalnız tam /admin adresinde seçili görünmesini sağlar. |
| 10 | `` Kategoriler `` | Bağlantı/düğme/seçim kutusunda görünen “Kategoriler” metnidir. |
| 11 | `` </NavLink> `` | NavLink elementinin/bileşeninin içeriğini kapatır. |
| 12 | `` <NavLink to="/admin/posts">Yazılar</NavLink> `` | Yazılar sekmesini /admin/posts adresine bağlar. |
| 13 | `` <NavLink to="/admin/users">Kullanıcılar</NavLink> `` | Kullanıcılar sekmesini /admin/users adresine bağlar. |
| 14 | `` </nav> `` | nav elementinin/bileşeninin içeriğini kapatır. |
| 16 | `` <Suspense `` | Lazy sayfa için yükleme sınırını bu konuma yerleştirir. |
| 17 | `` fallback={ `` | İçerik yüklenene kadar gösterilecek alternatif JSX’i başlatır. |
| 18 | `` <StatusMessage>Yönetim sayfası yükleniyor...</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 19 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 20 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 21 | `` <Outlet /> `` | Eşleşen /admin alt route’unun sayfasını burada gösterir. |
| 22 | `` </Suspense> `` | Suspense elementinin/bileşeninin içeriğini kapatır. |
| 23 | `` </section> `` | section elementinin/bileşeninin içeriğini kapatır. |
| 24 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 25 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### ConfirmDialog.jsx

**Dosya:** [src/components/ConfirmDialog.jsx](../src/components/ConfirmDialog.jsx)

**Değişiklik:** Yeni dosya.

Dialog her zaman DOM’dadır; JSX open niteliği yerine showModal/close çağrılır. Böylece modal odak davranışı ve CSS ::backdrop çalışır. İlk odaklanabilir düğme Vazgeç’tir. busy düğmeleri kapatır; kodda Escape’i engelleyen onCancel yoktur, beklerken de Escape pencereyi kapatabilir. onClose tekrar çağrılsa da mevcut ebeveynler yalnız state’i null yapar.

**Fonksiyonların görevleri**

- `ConfirmDialog`: open prop’unu yerel dialog DOM metotlarıyla eşler; başlık, içerik, onay/vazgeç düğmeleri ve busy durumunu ortaklaştırır.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useEffect, useId, useRef } from "react"; `` | İçeri alır: useEffect — render sonrası dış etki ve cleanup; useId — erişilebilir başlık/alan bağlantıları için kararlı kimlik; useRef — DOM referansını render’lar arasında saklama. |
| 3 | `` export default function ConfirmDialog({ `` | open prop’unu yerel dialog DOM metotlarıyla eşler; başlık, içerik, onay/vazgeç düğmeleri ve busy durumunu ortaklaştırır. Bu satır fonksiyon tanımıdır. |
| 4 | `` open, `` | Ebeveynin istediği açık/kapalı durumunu alır. |
| 5 | `` title, `` | Pencerenin başlık metnini alır. |
| 6 | `` children, `` | Bileşenin içine yazılan JSX içeriğini alır. |
| 7 | `` confirmLabel, `` | Normal durumdaki onay düğmesi metnini alır. |
| 8 | `` danger = false, `` | Tehlike stili belirtilmediyse normal düğme görünümünü varsayar. |
| 9 | `` busy = false, `` | Bekleme durumu belirtilmediyse düğmeleri kullanılabilir varsayar. |
| 10 | `` onConfirm, `` | Onay tıklamasında çağrılacak ebeveyn fonksiyonunu alır. |
| 11 | `` onClose, `` | Kapanış/vazgeç olayında çağrılacak ebeveyn fonksiyonunu alır. |
| 12 | `` }) { `` | Destructure edilmiş parametre listesini kapatır ve fonksiyon gövdesini açar. |
| 13 | `` const dialogRef = useRef(null); `` | Dialog DOM elementini saklayacak ref’i başlangıçta null olarak oluşturur. |
| 14 | `` const titleId = useId(); `` | Başlığı aria-labelledby ile eşlemek için bileşene özel kararlı kimlik üretir. |
| 16 | `` useEffect(() => { `` | Render sonrası native dialog’un açık/kapalı durumunu prop ile eşleyecek effect’i başlatır. |
| 17 | `` const dialog = dialogRef.current; `` | Render edilmiş dialog elementini ref üzerinden alır. |
| 19 | `` if (open && !dialog.open) { `` | Dış state açık istiyorsa ve native dialog henüz açık değilse açma koluna girer. |
| 20 | `` dialog.showModal(); `` | Dialog’u modal açar; arka plan etkileşimini sınırlar, odağı taşır ve ::backdrop katmanını etkinleştirir. |
| 21 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 23 | `` if (!open && dialog.open) { `` | Dış state kapalı istiyorsa ve dialog hâlâ açıksa kapatır. |
| 24 | `` dialog.close(); `` | Native dialog’u kapatır; close olayı da onClose callback’ine ulaşır. |
| 25 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 26 | `` }, [open]); `` | Effect’i ilk kurulumda ve open değeri değişince yeniden çalıştırır. |
| 28 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 29 | `` <dialog `` | Native modal pencere elementini açar. |
| 30 | `` ref={dialogRef} `` | Native dialog DOM elementini ref’e bağlar. |
| 31 | `` className="dialog" `` | Görünümü belirleyen CSS sınıfını “dialog” olarak belirler. |
| 32 | `` aria-labelledby={titleId} `` | Dialog’un erişilebilir adını h2 kimliğine bağlar. |
| 33 | `` onClose={onClose} `` | Native close olayını ebeveyne bildirir; Escape veya dialog.close() da bu yolu kullanır. |
| 34 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 35 | `` <h2 id={titleId}>{title}</h2> `` | Modal başlığını, aria-labelledby’nin işaret ettiği kimlikle gösterir. |
| 37 | `` {children} `` | Ebeveynin modal içine verdiği açıklama ve hata içeriğini yerleştirir. |
| 39 | `` <div className="dialog__actions"> `` | Modalın Vazgeç ve onay düğmelerini ortak sağa hizalı işlem alanında gruplar. |
| 40 | `` <button `` | Eylem düğmesini açar. |
| 41 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 42 | `` className="button button--secondary" `` | Görünümü belirleyen CSS sınıfını “button button--secondary” olarak belirler. |
| 43 | `` disabled={busy} `` | İşlem sürerken bu modal düğmesini kapatır. |
| 44 | `` onClick={onClose} `` | Vazgeç düğmesinde ebeveynin kapanış callback’ini çağırır. |
| 45 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 46 | `` Vazgeç `` | Bağlantı/düğme/seçim kutusunda görünen “Vazgeç” metnidir. |
| 47 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 48 | `` <button `` | Eylem düğmesini açar. |
| 49 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 50 | `` className={danger ? "button button--danger" : "button"} `` | Tehlikeli onaylarda danger düğme stilini, diğerlerinde normal stili seçer. |
| 51 | `` disabled={busy} `` | İşlem sürerken bu modal düğmesini kapatır. |
| 52 | `` onClick={onConfirm} `` | Onay düğmesinde ebeveynin asıl API işlemini başlatır. |
| 53 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 54 | `` {busy ? "Bekle..." : confirmLabel} `` | İşlem sürerken Bekle…, normalde verilen onay metnini gösterir. |
| 55 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 56 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 57 | `` </dialog> `` | dialog elementinin/bileşeninin içeriğini kapatır. |
| 58 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 59 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### Header.jsx

**Dosya:** [src/components/Header.jsx](../src/components/Header.jsx)

**Değişiklik:** Mevcut dosyaya 3 satır eklendi.

Yönetim bağlantısı authenticated bloğundaki Yazılarım bağlantısının altına gelir. Yalnız rolü admin olan kullanıcı görür; end olmadığı için /admin altındaki sayfalarda da seçili kalır. Header ve handleLogout mevcut fonksiyonlardır; bu değişiklik çıkış davranışını değiştirmez.

**Fonksiyonların görevleri**

- `Header`: Mevcut hesap menüsüne admin rolüne koşullu yönetim bağlantısını ekler. Mevcut `handleLogout` değişmedi.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 33 | `` {auth.user.role === "admin" && ( `` | Header’ın oturumlu bölümünde bağlantıyı yalnız admin rolüne koşullar. |
| 34 | `` <NavLink to="/admin">Yönetim</NavLink> `` | Header’a yönetim bağlantısı ekler; end olmadığı için bütün admin alt sayfalarında aktif görünür. |
| 35 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |

## 2. src

Ana uygulama yönetim sayfalarını lazy ile böler; korumalı, iç içe route ağacını kurar.

### App.jsx

**Dosya:** [src/App.jsx](../src/App.jsx)

**Değişiklik:** Mevcut dosyaya importlar, üç lazy tanımı ve admin alt route ağacı eklendi.

App mevcut ana route bileşenidir; değişiklik yönetim ağacını ekler. lazy tanımları modül seviyesindedir, her App render’ında yeni bileşen türü oluşturmaz. /admin koruması RequireAuth → RequireAdmin → AdminLayout sırasındadır; üç sayfa bu kapıları paylaşır.

**Fonksiyonların görevleri**

- `App`: Mevcut route ağacına yönetim dalını ekler. Üç `lazy` callback’i, ilgili sayfa render edildiğinde dinamik import ile modül yükler.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { lazy } from "react"; `` | İçeri alır: lazy — bileşenin modülünü render gerektiğinde dinamik import ile yükleme. |
| 4 | `` import AdminLayout from "./components/AdminLayout.jsx"; `` | İçeri alır: AdminLayout — yönetim sekmeleri ve alt sayfa yerleşimi. |
| 7 | `` import RequireAdmin from "./components/RequireAdmin.jsx"; `` | İçeri alır: RequireAdmin — admin rol kapısı. |
| 23 | `` const AdminCategoriesPage = lazy( `` | Sayfayı her render’da yeniden tanımlamadan modül seviyesinde lazy bileşen olarak oluşturur. |
| 24 | `` () => import("./pages/admin/AdminCategoriesPage.jsx") `` | İlgili yönetim sayfasına ihtiyaç olduğunda çalışacak dinamik import’u tanımlar; ilk dosya değerlendirmesinde hemen çağrılmaz. |
| 25 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 26 | `` const AdminPostsPage = lazy( `` | Sayfayı her render’da yeniden tanımlamadan modül seviyesinde lazy bileşen olarak oluşturur. |
| 27 | `` () => import("./pages/admin/AdminPostsPage.jsx") `` | İlgili yönetim sayfasına ihtiyaç olduğunda çalışacak dinamik import’u tanımlar; ilk dosya değerlendirmesinde hemen çağrılmaz. |
| 28 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 29 | `` const AdminUsersPage = lazy( `` | Sayfayı her render’da yeniden tanımlamadan modül seviyesinde lazy bileşen olarak oluşturur. |
| 30 | `` () => import("./pages/admin/AdminUsersPage.jsx") `` | İlgili yönetim sayfasına ihtiyaç olduğunda çalışacak dinamik import’u tanımlar; ilk dosya değerlendirmesinde hemen çağrılmaz. |
| 31 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 70 | `` <Route `` | Route tanımını bu konuma yerleştirir. |
| 71 | `` path="/admin" `` | Yönetim alt route ağacının kök yolunu /admin yapar. |
| 72 | `` element={ `` | Route eşleştiğinde render edilecek koruma ve yerleşim ağacını açar. |
| 73 | `` <RequireAuth> `` | Oturum kontrol kapısını bu konuma yerleştirir. |
| 74 | `` <RequireAdmin> `` | Admin rol kapısını bu konuma yerleştirir. |
| 75 | `` <AdminLayout /> `` | Yönetim yerleşimini bu konuma yerleştirir. |
| 76 | `` </RequireAdmin> `` | RequireAdmin elementinin/bileşeninin içeriğini kapatır. |
| 77 | `` </RequireAuth> `` | RequireAuth elementinin/bileşeninin içeriğini kapatır. |
| 78 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 79 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 80 | `` <Route index element={<AdminCategoriesPage />} /> `` | Üst /admin yolunun index sayfası olarak lazy Kategoriler bileşenini bağlar; ek bir alt yol gerekmez. |
| 81 | `` <Route path="posts" element={<AdminPostsPage />} /> `` | Göreli posts alt yolunu /admin/posts olarak eşler ve lazy Bütün yazılar sayfasını açar. |
| 82 | `` <Route path="users" element={<AdminUsersPage />} /> `` | Göreli users alt yolunu /admin/users olarak eşler ve lazy Kullanıcılar sayfasını açar. |
| 83 | `` </Route> `` | Route elementinin/bileşeninin içeriğini kapatır. |

## 3. src/hooks

Tekrarlanan gecikmeli arama mantığı ortaklaştı; useApi yerel liste güncelleme yeteneği kazandı.

### useDebouncedValue.js

**Dosya:** [src/hooks/useDebouncedValue.js](../src/hooks/useDebouncedValue.js)

**Değişiklik:** Yeni dosya.

İlk state value ile kurulur; ilk liste isteği bekletilmez. Her sonraki value/delay değişiminde eski timeout temizlenir. Hook istek atmaz, yalnız yerleşmiş bir değer üretir.

**Fonksiyonların görevleri**

- `useDebouncedValue`: İlk değeri hemen döndürür; sonraki değişimleri delay kadar bekletir ve eski timeout’u cleanup ile iptal eder. Her hook çağrısı kendi state’ini tutar.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useEffect, useState } from "react"; `` | İçeri alır: useEffect — render sonrası dış etki ve cleanup; useState — bileşene ait state. |
| 3 | `` export default function useDebouncedValue(value, delay) { `` | İlk değeri hemen döndürür; sonraki değişimleri delay kadar bekletir ve eski timeout’u cleanup ile iptal eder. Her hook çağrısı kendi state’ini tutar. Bu satır fonksiyon tanımıdır. |
| 4 | `` const [debouncedValue, setDebouncedValue] = useState(value); `` | Yerleşmiş değeri ilk kurulumda doğrudan value ile başlatır. |
| 6 | `` useEffect(() => { `` | Render sonrası gecikmeli değer için zamanlayıcı kuracak effect’i başlatır. |
| 7 | `` const timeoutId = setTimeout(() => { `` | Son değer için tek seferlik zamanlayıcı başlatır; iptal etmek için kimliğini saklar. |
| 8 | `` setDebouncedValue(value); `` | Bekleme dolunca bu effect çalışmasının yakaladığı değeri dışarı verilen state’e yazar. |
| 9 | `` }, delay); `` | Callback’i delay milisaniye sonra çalışacak biçimde zamanlar. |
| 11 | `` return () => clearTimeout(timeoutId); `` | Yeni effect öncesinde veya unmount sırasında eski zamanlayıcıyı iptal eder. |
| 12 | `` }, [value, delay]); `` | Girdi ya da gecikme değişince zamanlayıcıyı yeniden kurar. |
| 14 | `` return debouncedValue; `` | Bekleme sonunda yerleşmiş değeri hook çağıran bileşene verir. |
| 15 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### useApi.js

**Dosya:** [src/hooks/useApi.js](../src/hooks/useApi.js)

**Değişiklik:** Mevcut dosyaya updateData fonksiyonu ve dönüş alanı eklendi.

Mevcut useApi, path/version/request değişince GET akışını çalıştırır; reload version değerini artırır. Yeni updateData yalnız eldeki sonucu değiştirir, meta sayımlarını hesaplamaz. current.data null olabilir; çağıranın güncellemesi bu durumu hesaba katmalıdır. Kategori map güncellemesi liste bekler. Değişmeyen fetch, cleanup ve reload satırları tabloda tekrarlanmaz.

**Fonksiyonların görevleri**

- `updateData`: useApi sonucunun yalnız data alanını çağıranın güncelleyici fonksiyonuyla değiştirir; path, meta ve error alanlarını korur, HTTP isteği göndermez.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 40 | `` function updateData(update) { `` | useApi sonucunun yalnız data alanını çağıranın güncelleyici fonksiyonuyla değiştirir; path, meta ve error alanlarını korur, HTTP isteği göndermez. Bu satır fonksiyon tanımıdır. |
| 41 | `` setResult((current) => ({ `` | Son useApi sonucunu fonksiyonel state güncellemesiyle alır ve yeni nesneyi döndürmeye başlar. |
| 42 | `` ...current, `` | path, meta, error ve mevcut diğer sonuç alanlarını korur. |
| 43 | `` data: update(current.data), `` | Çağıranın güncelleyicisine mevcut veriyi verip dönen değeri data olarak saklar. |
| 44 | `` })); `` | Dönen nesneyi ve fonksiyonel state güncellemesi çağrısını kapatır. |
| 45 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 55 | `` updateData, `` | Yeni yerel güncelleme fonksiyonunu useApi dönüş nesnesine ekler. |

## 4. src/utils

Kategori durumu, form değerleri ve Türkçe slug dönüşümü React’ten bağımsız yardımcılar olarak ayrıldı.

### category-status.js

**Dosya:** [src/utils/category-status.js](../src/utils/category-status.js)

**Değişiklik:** Yeni dosya.

Silinen kategori aynı zamanda is_active: 0 olabildiği için deleted_at önce kontrol edilir. Beklenen API kaydında deleted_at silinmemiş kayıtlar için null’dır; undefined değer de !== null koşulunu sağlar.

**Fonksiyonların görevleri**

- `getCategoryStatus`: Önce deleted_at, sonra sayısal is_active değerine bakarak stil anahtarı ve Türkçe etiket döndürür.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` export function getCategoryStatus(category) { `` | Önce deleted_at, sonra sayısal is_active değerine bakarak stil anahtarı ve Türkçe etiket döndürür. Bu satır fonksiyon tanımıdır. |
| 2 | `` if (category.deleted_at !== null) { `` | Silinme zamanının bulunmasını aktiflikten önce kontrol eder. |
| 3 | `` return { key: "deleted", label: "Silindi" }; `` | Silinmiş kaydın CSS anahtarını ve Türkçe etiketini döndürür. |
| 4 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 6 | `` if (category.is_active === 1) { `` | Silinmemiş kaydın sayısal aktiflik değerini kontrol eder. |
| 7 | `` return { key: "active", label: "Aktif" }; `` | Aktif kaydın CSS anahtarını ve Türkçe etiketini döndürür. |
| 8 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 10 | `` return { key: "inactive", label: "Pasif" }; `` | Silinmemiş ve aktif olmayan kayıt için pasif etiketini döndürür. |
| 11 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### slugify.js

**Dosya:** [src/utils/slugify.js](../src/utils/slugify.js)

**Değişiklik:** Yeni dosya.

API ile aynı dönüşüm kuralının ES module biçimidir. Varsayılan sınır 200, kategori formundaki sınır 120’dir. Örneğin Çığ & Işık → cig-isik. Bu fonksiyon slug benzersizliğini veya sunucu kaydını kontrol etmez.

**Fonksiyonların görevleri**

- `slugify`: Türkçe harfleri haritalar, Unicode aksanlarını ayırıp temizler, küçük harf ve tek tireli ASCII slug üretir; uzunluğu sınırlar ve sondaki tireyi temizler.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` const TURKISH_CHARACTERS = { `` | Türkçe harfleri açık ASCII karşılıklarına dönüştüren haritayı açar. |
| 2 | `` ç: "c", `` | ç karakterini c ASCII harfine eşler. |
| 3 | `` Ç: "c", `` | Ç karakterini c ASCII harfine eşler. |
| 4 | `` ğ: "g", `` | ğ karakterini g ASCII harfine eşler. |
| 5 | `` Ğ: "g", `` | Ğ karakterini g ASCII harfine eşler. |
| 6 | `` ı: "i", `` | ı karakterini i ASCII harfine eşler. |
| 7 | `` I: "i", `` | I karakterini i ASCII harfine eşler. |
| 8 | `` İ: "i", `` | İ karakterini i ASCII harfine eşler. |
| 9 | `` ö: "o", `` | ö karakterini o ASCII harfine eşler. |
| 10 | `` Ö: "o", `` | Ö karakterini o ASCII harfine eşler. |
| 11 | `` ş: "s", `` | ş karakterini s ASCII harfine eşler. |
| 12 | `` Ş: "s", `` | Ş karakterini s ASCII harfine eşler. |
| 13 | `` ü: "u", `` | ü karakterini u ASCII harfine eşler. |
| 14 | `` Ü: "u", `` | Ü karakterini u ASCII harfine eşler. |
| 15 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 17 | `` export function slugify(value, { maxLength = 200 } = {}) { `` | Türkçe harfleri haritalar, Unicode aksanlarını ayırıp temizler, küçük harf ve tek tireli ASCII slug üretir; uzunluğu sınırlar ve sondaki tireyi temizler. Bu satır fonksiyon tanımıdır. |
| 18 | `` const replaced = Array.from(value) `` | Metni Unicode kod noktalarından oluşan diziye ayırır; dönüşüm zincirini başlatır. |
| 19 | `` .map((character) => TURKISH_CHARACTERS[character] ?? character) `` | Her karakteri haritada varsa karşılığına çevirir; yoksa aynen korur. |
| 20 | `` .join(""); `` | Dönüştürülen karakterleri araya ayraç koymadan tek metin yapar. |
| 22 | `` return replaced `` | Dönüşüm zincirinin sonucunu döndürmeye başlar. |
| 23 | `` .normalize("NFKD") `` | Unicode uyumluluk ayrıştırması yapar; aksanlı karakterlerin taban ve birleşen işaretlerini ayırır. |
| 24 | `` .replace(/[̀-ͯ]/g, "") `` | U+0300–U+036F aralığındaki birleşen aksan işaretlerini kaldırır. |
| 25 | `` .toLowerCase() `` | Metni küçük harfe çevirir. |
| 26 | `` .replace(/[^a-z0-9]+/g, "-") `` | ASCII küçük harf ve rakam dışındaki ardışık karakterleri tek tireye indirir. |
| 27 | `` .replace(/^-+\|-+$/g, "") `` | Metnin başında ve sonunda kalan tireleri kaldırır. |
| 28 | `` .slice(0, maxLength) `` | Slug’ı en fazla maxLength karakterle sınırlar. |
| 29 | `` .replace(/-+$/g, ""); `` | Kesme sonrasında sonda kalabilecek tireleri kaldırıp sonucu döndürür. |
| 30 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### category-form.js

**Dosya:** [src/utils/category-form.js](../src/utils/category-form.js)

**Değişiklik:** Yeni dosya.

EMPTY_CATEGORY yeni formun başlangıcıdır. Açıklamanın null gelmesi kontrollü textarea için boş metne çevrilir; is_active, id gibi alanlar forma alınmaz.

**Fonksiyonların görevleri**

- `toCategoryFormValues`: API kaydından name/slug/description form nesnesi çıkarır; null veya undefined açıklamayı kontrollü alan için boş metne çevirir.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` export const EMPTY_CATEGORY = { `` | Yeni kategori formu için ortak boş başlangıç nesnesini dışa açar. |
| 2 | `` name: "", `` | Başlangıçta kategori adını boş metin yapar. |
| 3 | `` slug: "", `` | Başlangıçta slug’ı boş tutar; CategoryForm böylece otomatik öneriyle başlar. |
| 4 | `` description: "", `` | Başlangıç açıklamasını kontrollü alan için boş metin yapar. |
| 5 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 7 | `` export function toCategoryFormValues(category) { `` | API kaydından name/slug/description form nesnesi çıkarır; null veya undefined açıklamayı kontrollü alan için boş metne çevirir. Bu satır fonksiyon tanımıdır. |
| 8 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 9 | `` name: category.name, `` | API kaydındaki adı form değerine aktarır. |
| 10 | `` slug: category.slug, `` | API kaydındaki mevcut slug’ı form değerine aktarır. |
| 11 | `` description: category.description ?? "", `` | Açıklama null/undefined ise boş metin, değilse mevcut açıklamayı kullanır. |
| 12 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 13 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

## 5. src/components/admin

Yönetim tablolarına özel başlık, satır ve form bileşenleri eklendi; sayfalar API isteklerini, bunlar görünüm ve etkileşimi taşır.

### SortableHeader.jsx

**Dosya:** [src/components/admin/SortableHeader.jsx](../src/components/admin/SortableHeader.jsx)

**Değişiklik:** Yeni dosya.

Sıralamayı doğrudan değiştirmez; onSort(field) çağırır. Asıl state sayfadadır. th üstündeki aria-sort erişilebilirlik bilgisidir; button klavyeyle de kullanılabilir.

**Fonksiyonların görevleri**

- `SortableHeader`: Sütunun seçili olup olmadığını bulur, aria-sort ve ok işaretini üretir; tıklamada alan adını üst bileşene iletir.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` export default function SortableHeader({ `` | Sütunun seçili olup olmadığını bulur, aria-sort ve ok işaretini üretir; tıklamada alan adını üst bileşene iletir. Bu satır fonksiyon tanımıdır. |
| 2 | `` label, `` | Başlıkta gösterilecek metni alır. |
| 3 | `` field, `` | Bu başlığın API sıralama alanı adını alır. |
| 4 | `` sort, `` | Sıralama sütunu ve yönünü taşıyan nesneyi alır. |
| 5 | `` onSort, `` | Sütun seçimini üst sayfaya bildiren callback’i alır. |
| 6 | `` }) { `` | Destructure edilmiş parametre listesini kapatır ve fonksiyon gövdesini açar. |
| 7 | `` const active = sort.by === field; `` | Bu başlığın mevcut sıralama sütunu olup olmadığını hesaplar. |
| 8 | `` let ariaSort = "none"; `` | Sütun seçili değilken ekran okuyucuya sıralanmadığını bildirecek değeri başlatır. |
| 10 | `` if (active) { `` | Bu sütun seçiliyse sıralama yönünü erişilebilir metne dönüştürür. |
| 11 | `` ariaSort = sort.order === "asc" ? "ascending" : "descending"; `` | asc için ascending, aksi için descending ARIA değerini seçer. |
| 12 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 14 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 15 | `` <th aria-sort={ariaSort}> `` | Sütun başlığını erişilebilir sıralama yönüyle açar. |
| 16 | `` <button `` | Eylem düğmesini açar. |
| 17 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 18 | `` className="sort-button" `` | Görünümü belirleyen CSS sınıfını “sort-button” olarak belirler. |
| 19 | `` onClick={() => onSort(field)} `` | Tıklanan başlığın alan adını üst sayfanın sıralama callback’ine iletir. |
| 20 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 21 | `` {label} `` | SortableHeader’a verilen görünür başlık metnini basar. |
| 22 | `` {active && (sort.order === "asc" ? " ↑" : " ↓")} `` | Yalnız seçili sütunda sıralama yönüne göre yukarı/aşağı ok gösterir. |
| 23 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 24 | `` </th> `` | th elementinin/bileşeninin içeriğini kapatır. |
| 25 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 26 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### CategoryRow.jsx

**Dosya:** [src/components/admin/CategoryRow.jsx](../src/components/admin/CategoryRow.jsx)

**Değişiklik:** Yeni dosya.

Veri akışı category → useOptimistic → rozet ve düğme şeklindedir. Geçici aktiflik yalnız geçiş sürerken yaşar. Silinen kayıtta düzenle/aktiflik/sil gizlenir, yalnız geri getir görünür. isPending yalnız aktiflik düğmesini kilitler; diğer işlemler için genel satır kilidi yoktur.

**Fonksiyonların görevleri**

- `CategoryRow`: Kategori kaydını tablo satırına çevirir; iyimser aktiflik rozetini ve silinme durumuna göre işlem düğmelerini gösterir.
- `handleToggle`: Görünen aktiflik değerinin tersini hesaplar; async geçiş içinde geçici değeri yazar ve üst bileşenin PATCH işlemini bekler.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useOptimistic, useTransition } from "react"; `` | İçeri alır: useOptimistic — geçiş sürerken geçici değer; useTransition — geçiş başlatma ve isPending takibi. |
| 2 | `` import { getCategoryStatus } from "../../utils/category-status.js"; `` | İçeri alır: getCategoryStatus — kategori durum etiketi üretimi. |
| 3 | `` import { formatDate } from "../../utils/format-date.js"; `` | İçeri alır: formatDate — Türkçe tarih biçimi. |
| 5 | `` export default function CategoryRow({ `` | Kategori kaydını tablo satırına çevirir; iyimser aktiflik rozetini ve silinme durumuna göre işlem düğmelerini gösterir. Bu satır fonksiyon tanımıdır. |
| 6 | `` category, `` | İşlem yapılacak kategori kaydını alır. |
| 7 | `` onEdit, `` | Düzenleme formunu açan callback’i alır. |
| 8 | `` onToggleActive, `` | Aktiflik değişikliğini kaydeden async callback’i alır. |
| 9 | `` onDelete, `` | Silme onayını açan callback’i alır. |
| 10 | `` onRestore, `` | Geri getirme işlemini başlatan callback’i alır. |
| 11 | `` }) { `` | Destructure edilmiş parametre listesini kapatır ve fonksiyon gövdesini açar. |
| 12 | `` const [optimisticActive, setOptimisticActive] = useOptimistic( `` | Gerçek aktiflik değerini temel alan geçici görünüm değerini ve setter’ını kurmaya başlar. |
| 13 | `` category.is_active `` | İyimser state’in temel/kalıcı değeri olarak API kaydındaki aktifliği verir. |
| 14 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 15 | `` const [isPending, startTransition] = useTransition(); `` | Async geçişin sürüp sürmediğini ve onu başlatacak fonksiyonu alır. |
| 17 | `` const isDeleted = category.deleted_at !== null; `` | Kategori silinme zamanının null olmamasını silinmiş olma ölçütü yapar. |
| 18 | `` const status = getCategoryStatus({ `` | Durum etiketini üretecek yardımcıya geçici aktifliği içeren kaydı hazırlamaya başlar. |
| 19 | `` ...category, `` | Kategori kaydının bütün alanlarını yeni nesneye kopyalar. |
| 20 | `` is_active: optimisticActive, `` | Kopyadaki aktiflik alanını geçici değerle değiştirir; rozet hemen yeni durumu gösterir. |
| 21 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 23 | `` function handleToggle() { `` | Görünen aktiflik değerinin tersini hesaplar; async geçiş içinde geçici değeri yazar ve üst bileşenin PATCH işlemini bekler. Bu satır fonksiyon tanımıdır. |
| 24 | `` const nextActive = optimisticActive === 1 ? 0 : 1; `` | Görünen aktifliğin tersini sayısal 0 veya 1 olarak hesaplar. |
| 26 | `` startTransition(async () => { `` | Async işi geçiş olarak başlatır; await edilen üst işlem bitene kadar iyimser görünüm sürer. |
| 27 | `` setOptimisticActive(nextActive); `` | Geçiş içindeki geçici aktifliği yazar; category nesnesini doğrudan değiştirmez. |
| 28 | `` await onToggleActive(category, nextActive); `` | Hedef kategori ve yeni aktiflikle üst sayfanın işlemini çağırır; tamamlanmasını bekler. |
| 29 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 30 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 32 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 33 | `` <tr data-deleted={isDeleted}> `` | Satıra true/false silinme verisini yazar; CSS silinen satırların rengini buradan seçer. |
| 34 | `` <td>{category.name}</td> `` | category.name alanını tablo hücresinde gösterir. |
| 35 | `` <td> `` | Veri hücresini açar. |
| 36 | `` <code>{category.slug}</code> `` | Kategori slug’ını kod tipografisiyle gösterir. |
| 37 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 38 | `` <td> `` | Veri hücresini açar. |
| 39 | `` <span className={`badge badge--${status.key}`}> `` | Kategori durum anahtarını active/inactive/deleted CSS sınıfına dönüştürür. |
| 40 | `` {status.label} `` | Kategori için hesaplanan Aktif/Pasif/Silindi metnini gösterir. |
| 41 | `` </span> `` | span elementinin/bileşeninin içeriğini kapatır. |
| 42 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 43 | `` <td>{formatDate(category.created_at)}</td> `` | Kaydın oluşturulma/güncellenme tarihini formatDate ile Türkçe biçimde hücreye yazar. |
| 44 | `` <td> `` | Veri hücresini açar. |
| 45 | `` <div className="post-table__actions"> `` | Satıra ait düzenleme, durum, silme veya geri getirme kontrollerini ortak işlem hücresinde gruplar. |
| 46 | `` {!isDeleted && ( `` | Silinmemiş kategori için düzenleme, aktiflik ve silme işlemlerini gösterir. |
| 47 | `` <> `` | Ek DOM elementi üretmeden birden fazla JSX öğesini gruplayan Fragment açar. |
| 48 | `` <button `` | Eylem düğmesini açar. |
| 49 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 50 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 51 | `` onClick={() => onEdit(category)} `` | Seçilen kategori kaydıyla düzenleme formunun açılmasını ister. |
| 52 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 53 | `` Düzenle `` | Bağlantı/düğme/seçim kutusunda görünen “Düzenle” metnidir. |
| 54 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 55 | `` <button `` | Eylem düğmesini açar. |
| 56 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 57 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 58 | `` disabled={isPending} `` | İyimser aktiflik geçişi bitene kadar yeniden tıklamayı engeller. |
| 59 | `` onClick={handleToggle} `` | Aktiflik düğmesini iyimser geçişi başlatan fonksiyona bağlar. |
| 60 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 61 | `` {optimisticActive === 1 ? "Pasifleştir" : "Aktifleştir"} `` | Düğme metnini gerçek kayıt yerine iyimser aktifliğe göre seçer. |
| 62 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 63 | `` <button `` | Eylem düğmesini açar. |
| 64 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 65 | `` className="link-button link-button--danger" `` | Görünümü belirleyen CSS sınıfını “link-button link-button--danger” olarak belirler. |
| 66 | `` onClick={() => onDelete(category)} `` | Seçilen kategori için silme onayını açar; burada istek atılmaz. |
| 67 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 68 | `` Sil `` | Bağlantı/düğme/seçim kutusunda görünen “Sil” metnidir. |
| 69 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 70 | `` </> `` | Fragment grubunu kapatır. |
| 71 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 72 | `` {isDeleted && ( `` | Silinmiş kategori için geri getirme düğmesini gösterir. |
| 73 | `` <button `` | Eylem düğmesini açar. |
| 74 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 75 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 76 | `` onClick={() => onRestore(category)} `` | Seçilen kategori için geri getirme işlemini doğrudan başlatır. |
| 77 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 78 | `` Geri getir `` | Bağlantı/düğme/seçim kutusunda görünen “Geri getir” metnidir. |
| 79 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 80 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 81 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 82 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 83 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 84 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 85 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### CategoryForm.jsx

**Dosya:** [src/components/admin/CategoryForm.jsx](../src/components/admin/CategoryForm.jsx)

**Değişiklik:** Yeni dosya.

values ve changes her render’da hesaplanır; ayrı state değildir. form.slug, kullanıcı elle yazdıktan sonra kaynak olur. initialValues sadece ilk state kurulurken okunur; kayıt değişirken ebeveynin key değiştirmesi gerekir. İstek sayfada gönderilir. HTML required/minLength/maxLength/pattern denetimleri API doğrulamasının yerine geçmez.

**Fonksiyonların görevleri**

- `CategoryForm`: Ad, slug ve açıklamayı kontrollü alanlarla yönetir; slug önerisini ve değişen alanları türetir, API hatalarını uygun alanda gösterir.
- `handleChange`: Olayın name/value değerleriyle yalnız ilgili form alanını değiştirir; slug alanına yazıldıysa otomatik öneriyi kapatır.
- `handleSubmit`: Yerel form gönderimini önler; önceki hataları temizler, onSubmit(values, changes) çağrısını bekler, hatayı alan veya form düzeyine ayırır ve beklemeyi bitirir.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useState } from "react"; `` | İçeri alır: useState — bileşene ait state. |
| 2 | `` import { slugify } from "../../utils/slugify.js"; `` | İçeri alır: slugify — addan slug üretimi. |
| 3 | `` import FormField from "../FormField.jsx"; `` | İçeri alır: FormField — label, input/textarea, ipucu ve hata görünümü. |
| 4 | `` import StatusMessage from "../StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 6 | `` const FIELDS = ["name", "slug", "description"]; `` | Değişiklik hesabına alınacak üç form alanını belirler. |
| 7 | `` const SLUG_PATTERN = "[a-z0-9]+(-[a-z0-9]+)*"; `` | Küçük ASCII harf/rakam grupları arasında tek tire isteyen HTML pattern ifadesini tanımlar. |
| 9 | `` const FIELD_ERRORS = { `` | API hata kodlarını alan adı ve Türkçe mesaja eşleyen tabloyu açar. |
| 10 | `` INVALID_CATEGORY_NAME: { `` | Kategori adı doğrulama hatası için eşlemeyi başlatır. |
| 11 | `` field: "name", `` | Doğrulama hatasının hangi form alanının altında gösterileceğini belirler. |
| 12 | `` message: "Ad 2 ile 100 karakter arasında olmalı.", `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 13 | `` }, `` | Nesne ya da callback bloğunu kapatır; sonraki öğe için virgül bırakır. |
| 14 | `` INVALID_CATEGORY_SLUG: { `` | Slug biçim hatası için eşlemeyi başlatır. |
| 15 | `` field: "slug", `` | Doğrulama hatasının hangi form alanının altında gösterileceğini belirler. |
| 16 | `` message: "Slug küçük harf, rakam ve tek tirelerden oluşmalı.", `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 17 | `` }, `` | Nesne ya da callback bloğunu kapatır; sonraki öğe için virgül bırakır. |
| 18 | `` CATEGORY_SLUG_ALREADY_EXISTS: { `` | Slug benzersizliği hatası için eşlemeyi başlatır. |
| 19 | `` field: "slug", `` | Doğrulama hatasının hangi form alanının altında gösterileceğini belirler. |
| 20 | `` message: `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 21 | `` "Bu slug kullanılıyor. Silinmiş bir kategoriye ait olabilir.", `` | Slug çakışmasının silinmiş bir kayıttan da kaynaklanabileceğini anlatan alan hatası metnidir. |
| 22 | `` }, `` | Nesne ya da callback bloğunu kapatır; sonraki öğe için virgül bırakır. |
| 23 | `` INVALID_CATEGORY_DESCRIPTION: { `` | Açıklama uzunluğu hatası için eşlemeyi başlatır. |
| 24 | `` field: "description", `` | Doğrulama hatasının hangi form alanının altında gösterileceğini belirler. |
| 25 | `` message: "Açıklama en fazla 2000 karakter olabilir.", `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 26 | `` }, `` | Nesne ya da callback bloğunu kapatır; sonraki öğe için virgül bırakır. |
| 27 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 29 | `` export default function CategoryForm({ `` | Ad, slug ve açıklamayı kontrollü alanlarla yönetir; slug önerisini ve değişen alanları türetir, API hatalarını uygun alanda gösterir. Bu satır fonksiyon tanımıdır. |
| 30 | `` initialValues, `` | Formun ilk kurulumunda kullanılacak değerleri alır. |
| 31 | `` submitLabel, `` | Gönder düğmesinde kullanılacak Oluştur/Kaydet metnini alır. |
| 32 | `` onSubmit, `` | Tam değerler ve değişiklik nesnesini alan async callback’i alır. |
| 33 | `` onCancel, `` | Formu kapatacak ebeveyn callback’ini alır. |
| 34 | `` }) { `` | Destructure edilmiş parametre listesini kapatır ve fonksiyon gövdesini açar. |
| 35 | `` const [form, setForm] = useState(initialValues); `` | Form state’ini ilk kurulumda initialValues ile başlatır; sonraki prop değişimi state’i otomatik sıfırlamaz. |
| 36 | `` const [slugEdited, setSlugEdited] = useState( `` | Slug’ın elle yönetilip yönetilmediğini tutacak state’i başlatır. |
| 37 | `` initialValues.slug !== "" `` | Başlangıç slug’ı doluysa otomatik öneriyi kapatır; kayıtlı slug korunur. |
| 38 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 39 | `` const [fieldErrors, setFieldErrors] = useState({}); `` | fieldErrors state’ini ve setFieldErrors setter’ını kurar: form alanlarına göre hata mesajları; boş nesneyle başlar. Başlangıç ifadesi: {}. |
| 40 | `` const [formError, setFormError] = useState(null); `` | formError state’ini ve setFormError setter’ını kurar: eşleştirilemeyen genel form hatası. Başlangıç ifadesi: null. |
| 41 | `` const [submitting, setSubmitting] = useState(false); `` | submitting state’ini ve setSubmitting setter’ını kurar: kategori formunun gönderim durumu. Başlangıç ifadesi: false. |
| 43 | `` const values = { `` | State’ten türetilmiş, gösterilecek ve gönderilecek form değerlerini oluşturmaya başlar. |
| 44 | `` ...form, `` | Mevcut name, slug ve description alanlarını türetilmiş değer nesnesine kopyalar. |
| 45 | `` slug: slugEdited `` | Slug alanının kaynağını elle değiştirilme durumuna göre seçmeye başlar. |
| 46 | `` ? form.slug `` | Slug’a elle müdahale edilmişse form state’indeki değeri kullanır. |
| 47 | `` : slugify(form.name, { maxLength: 120 }), `` | Elle müdahale yoksa addan en fazla 120 karakterlik slug türetir. |
| 48 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 50 | `` const changes = {}; `` | Başlangıç değerlerinden farklı alanları toplayacak boş nesneyi her render’da kurar. |
| 52 | `` for (const field of FIELDS) { `` | Ad, slug ve açıklama alanlarını tek tek karşılaştırır. |
| 53 | `` if (values[field] !== initialValues[field]) { `` | Alan değeri başlangıç değerinden farklıysa PATCH değişikliklerine dahil eder. |
| 54 | `` changes[field] = values[field]; `` | Farklı alanı adıyla ve yeni değeriyle changes nesnesine yazar. |
| 55 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 56 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 58 | `` const isDirty = Object.keys(changes).length > 0; `` | En az bir değişmiş alan varsa formu gönderilebilir/değişmiş sayar. |
| 60 | `` function handleChange(event) { `` | Olayın name/value değerleriyle yalnız ilgili form alanını değiştirir; slug alanına yazıldıysa otomatik öneriyi kapatır. Bu satır fonksiyon tanımıdır. |
| 61 | `` const { name, value } = event.target; `` | Değişen input veya textarea’nın name ve value özelliklerini alır. |
| 63 | `` if (name === "slug") { `` | Değiştirilen alan slug ise otomatik üretimi durduracak kola girer. |
| 64 | `` setSlugEdited(true); `` | Bu form kurulumu boyunca slug önerisini kapatır; alan boşaltılsa da otomatik moda dönmez. |
| 65 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 67 | `` setForm((current) => ({ ...current, [name]: value })); `` | En güncel formu kopyalayıp yalnız olayın name alanını yeni value ile değiştirir. |
| 68 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 70 | `` async function handleSubmit(event) { `` | Yerel form gönderimini önler; önceki hataları temizler, onSubmit(values, changes) çağrısını bekler, hatayı alan veya form düzeyine ayırır ve beklemeyi bitirir. Bu satır fonksiyon tanımıdır. |
| 71 | `` event.preventDefault(); `` | Tarayıcının klasik form gönderimiyle sayfayı yenilemesini önler. |
| 72 | `` setFieldErrors({}); `` | Önceki alan hatalarını temizler. |
| 73 | `` setFormError(null); `` | Önceki genel form hatasını temizler. |
| 74 | `` setSubmitting(true); `` | Form gönderme bekleme durumunu başlatır; ilgili düğmeler kapanır. |
| 76 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 77 | `` await onSubmit(values, changes); `` | Üst sayfaya tam değerleri ve yalnız değişen alanları birlikte verir; isteğin bitmesini bekler. |
| 78 | `` } catch (submitError) { `` | İşlemden fırlatılan hatayı submitError adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 79 | `` const known = FIELD_ERRORS[submitError.code]; `` | Yakalanan API hata kodunun alan eşlemesi olup olmadığını araştırır. |
| 81 | `` if (known) { `` | Tanımlı alan hatası varsa mesajı genel form yerine ilgili alana yerleştirir. |
| 82 | `` setFieldErrors({ [known.field]: known.message }); `` | Yalnız ilgili alan için hata metni oluşturur. |
| 83 | `` } else { `` | Önceki koşul sağlanmadığında çalışacak alternatif bloğu açar. |
| 84 | `` setFormError(submitError); `` | Yakalanan submitError nesnesini formun genel hata alanına yazar. |
| 85 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 86 | `` } finally { `` | Başarı veya hatadan bağımsız olarak bekleme state’ini temizleyecek bloğu başlatır. |
| 87 | `` setSubmitting(false); `` | Form gönderme bekleme durumunu bitirir; düğmeler tekrar kullanılabilir olur. |
| 88 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 89 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 91 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 92 | `` <form className="form" onSubmit={handleSubmit}> `` | Ortak form stilini ve submit işleyicisini bağlar. |
| 93 | `` <FormField `` | Label, kontrol ve mesajı birleştiren alanı bu konuma yerleştirir. |
| 94 | `` label="Ad" `` | Görünür alan/sütun etiketini “Ad” olarak belirler. |
| 95 | `` name="name" `` | handleChange’in ayırt edeceği form alanı adını “name” olarak belirler. |
| 96 | `` required `` | Boş alanla native form gönderimini engeller. |
| 97 | `` minLength={2} `` | Native alan uzunluğunun alt sınırını 2 karakter yapar. |
| 98 | `` maxLength={100} `` | Native alan uzunluğunun üst sınırını 100 karakter yapar. |
| 99 | `` value={values.name} `` | name alanının görünen değerini türetilmiş values nesnesine bağlar. |
| 100 | `` onChange={handleChange} `` | Form alanındaki name/value olayını ortak alan güncelleyicisine verir. |
| 101 | `` error={fieldErrors.name} `` | name alanının hata metnini FormField’a iletir. |
| 102 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 104 | `` <FormField `` | Label, kontrol ve mesajı birleştiren alanı bu konuma yerleştirir. |
| 105 | `` label="Slug" `` | Görünür alan/sütun etiketini “Slug” olarak belirler. |
| 106 | `` name="slug" `` | handleChange’in ayırt edeceği form alanı adını “slug” olarak belirler. |
| 107 | `` required `` | Boş alanla native form gönderimini engeller. |
| 108 | `` maxLength={120} `` | Native alan uzunluğunun üst sınırını 120 karakter yapar. |
| 109 | `` pattern={SLUG_PATTERN} `` | Slug için native tarayıcı biçim doğrulamasını etkinleştirir. |
| 110 | `` hint={ `` | Slug alanının yardım metnini elle/otomatik moda göre seçmeye başlar. |
| 111 | `` slugEdited `` | İpucunun seçiminde slug’ın elle düzenlenmiş olup olmadığını kullanır. |
| 112 | `` ? "Küçük harf, rakam ve tire." `` | Elle düzenlenen slug için geçerli karakterleri açıklayan ipucunu seçer. |
| 113 | `` : "Addan otomatik üretiliyor; elle de yazabilirsin." `` | Otomatik slug önerisinin kaynağını ve elle değiştirilebileceğini açıklayan ipucunu seçer. |
| 114 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 115 | `` value={values.slug} `` | slug alanının görünen değerini türetilmiş values nesnesine bağlar. |
| 116 | `` onChange={handleChange} `` | Form alanındaki name/value olayını ortak alan güncelleyicisine verir. |
| 117 | `` error={fieldErrors.slug} `` | slug alanının hata metnini FormField’a iletir. |
| 118 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 120 | `` <FormField `` | Label, kontrol ve mesajı birleştiren alanı bu konuma yerleştirir. |
| 121 | `` as="textarea" `` | FormField’ın input yerine çok satırlı textarea üretmesini ister. |
| 122 | `` label="Açıklama" `` | Görünür alan/sütun etiketini “Açıklama” olarak belirler. |
| 123 | `` name="description" `` | handleChange’in ayırt edeceği form alanı adını “description” olarak belirler. |
| 124 | `` rows={3} `` | Açıklama textarea’sına üç satırlık başlangıç yüksekliği verir. |
| 125 | `` maxLength={2000} `` | Native alan uzunluğunun üst sınırını 2000 karakter yapar. |
| 126 | `` hint="İsteğe bağlı." `` | Alan altındaki yardım metnini “İsteğe bağlı.” olarak belirler. |
| 127 | `` value={values.description} `` | description alanının görünen değerini türetilmiş values nesnesine bağlar. |
| 128 | `` onChange={handleChange} `` | Form alanındaki name/value olayını ortak alan güncelleyicisine verir. |
| 129 | `` error={fieldErrors.description} `` | description alanının hata metnini FormField’a iletir. |
| 130 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 132 | `` {formError && ( `` | formError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 133 | `` <StatusMessage type="error">{formError.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 134 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 136 | `` <div className="form__actions"> `` | Formun gönderme ve Vazgeç düğmelerini ortak işlem satırında gruplar. |
| 137 | `` <button `` | Eylem düğmesini açar. |
| 138 | `` type="submit" `` | Düğmeyi form submit tetikleyicisi yapar. |
| 139 | `` className="button" `` | Görünümü belirleyen CSS sınıfını “button” olarak belirler. |
| 140 | `` disabled={!isDirty \|\| submitting} `` | Değişiklik yoksa veya istek sürüyorsa form gönderimini kilitler. |
| 141 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 142 | `` {submitting ? "Kaydediliyor..." : submitLabel} `` | Form gönderilirken bekleme metni, değilse Oluştur/Kaydet gösterir. |
| 143 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 144 | `` <button `` | Eylem düğmesini açar. |
| 145 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 146 | `` className="button button--secondary" `` | Görünümü belirleyen CSS sınıfını “button button--secondary” olarak belirler. |
| 147 | `` onClick={onCancel} `` | Vazgeç düğmesini ebeveynin form kapatma callback’ine bağlar. |
| 148 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 149 | `` Vazgeç `` | Bağlantı/düğme/seçim kutusunda görünen “Vazgeç” metnidir. |
| 150 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 151 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 152 | `` </form> `` | form elementinin/bileşeninin içeriğini kapatır. |
| 153 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 154 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### AdminPostRow.jsx

**Dosya:** [src/components/admin/AdminPostRow.jsx](../src/components/admin/AdminPostRow.jsx)

**Değişiklik:** Yeni dosya.

Düzenle, mevcut /dashboard/posts/:id/edit sayfasına gider. Silinme durumu draft/published rozetine göre önceliklidir. API’nin author ve category nesnelerini sağlaması beklenir; burada null koruması yoktur.

**Fonksiyonların görevleri**

- `AdminPostRow`: Yazının başlık, yazar, kategori, durum ve tarihini gösterir; silinmemiş yazı için düzenle/sil, silinmiş yazı için geri getir sunar.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { Link } from "react-router"; `` | İçeri alır: Link — istemci tarafında sayfa bağlantısı. |
| 2 | `` import { formatDate } from "../../utils/format-date.js"; `` | İçeri alır: formatDate — Türkçe tarih biçimi. |
| 3 | `` import { STATUS_LABELS } from "../../utils/post-status.js"; `` | İçeri alır: STATUS_LABELS — draft/published Türkçe etiketleri. |
| 5 | `` export default function AdminPostRow({ post, onDelete, onRestore }) { `` | Yazının başlık, yazar, kategori, durum ve tarihini gösterir; silinmemiş yazı için düzenle/sil, silinmiş yazı için geri getir sunar. Bu satır fonksiyon tanımıdır. |
| 6 | `` const isDeleted = post.deleted_at !== null; `` | Yazı silinme zamanının null olmamasını silinmiş olma ölçütü yapar. |
| 8 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 9 | `` <tr data-deleted={isDeleted}> `` | Satıra true/false silinme verisini yazar; CSS silinen satırların rengini buradan seçer. |
| 10 | `` <td>{post.title}</td> `` | post.title alanını tablo hücresinde gösterir. |
| 11 | `` <td>{post.author.name}</td> `` | post.author.name alanını tablo hücresinde gösterir. |
| 12 | `` <td>{post.category.name}</td> `` | post.category.name alanını tablo hücresinde gösterir. |
| 13 | `` <td> `` | Veri hücresini açar. |
| 14 | `` {isDeleted ? ( `` | Yazı silinmişse ilk JSX kolunu, değilse ikinci kolunu seçer. |
| 15 | `` <span className="badge badge--deleted">Silindi</span> `` | Silinmiş yazı için özel renk ve Silindi etiketini gösterir. |
| 16 | `` ) : ( `` | Üçlü koşulun ilk JSX kolunu bitirip aksi durumu açar. |
| 17 | `` <span className={`badge badge--${post.status}`}> `` | Yazının draft/published durumuna göre rozet CSS sınıfını seçer. |
| 18 | `` {STATUS_LABELS[post.status]} `` | Yazı durumunun Türkçe Taslak/Yayında karşılığını gösterir. |
| 19 | `` </span> `` | span elementinin/bileşeninin içeriğini kapatır. |
| 20 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 21 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 22 | `` <td>{formatDate(post.updated_at)}</td> `` | Kaydın oluşturulma/güncellenme tarihini formatDate ile Türkçe biçimde hücreye yazar. |
| 23 | `` <td> `` | Veri hücresini açar. |
| 24 | `` <div className="post-table__actions"> `` | Satıra ait düzenleme, durum, silme veya geri getirme kontrollerini ortak işlem hücresinde gruplar. |
| 25 | `` {isDeleted ? ( `` | Yazı silinmişse ilk JSX kolunu, değilse ikinci kolunu seçer. |
| 26 | `` <button `` | Eylem düğmesini açar. |
| 27 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 28 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 29 | `` onClick={() => onRestore(post)} `` | Seçilen yazı için geri getirme işlemini doğrudan başlatır. |
| 30 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 31 | `` Geri getir `` | Bağlantı/düğme/seçim kutusunda görünen “Geri getir” metnidir. |
| 32 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 33 | `` ) : ( `` | Üçlü koşulun ilk JSX kolunu bitirip aksi durumu açar. |
| 34 | `` <> `` | Ek DOM elementi üretmeden birden fazla JSX öğesini gruplayan Fragment açar. |
| 35 | `` <Link to={`/dashboard/posts/${post.id}/edit`}>Düzenle</Link> `` | Yazı kimliğiyle mevcut yazar paneli düzenleme sayfasına bağlantı kurar. |
| 36 | `` <button `` | Eylem düğmesini açar. |
| 37 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 38 | `` className="link-button link-button--danger" `` | Görünümü belirleyen CSS sınıfını “link-button link-button--danger” olarak belirler. |
| 39 | `` onClick={() => onDelete(post)} `` | Seçilen yazı için silme onayını açar; burada istek atılmaz. |
| 40 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 41 | `` Sil `` | Bağlantı/düğme/seçim kutusunda görünen “Sil” metnidir. |
| 42 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 43 | `` </> `` | Fragment grubunu kapatır. |
| 44 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 45 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 46 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 47 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 48 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 49 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### UserRow.jsx

**Dosya:** [src/components/admin/UserRow.jsx](../src/components/admin/UserRow.jsx)

**Değişiklik:** Yeni dosya.

Rol ve aktiflik için aynı onChange callback’i, { user, field, value } önerisini taşır. Satır istek atmaz. isSelf ise iki düğme de disabled olur; bu istemci kontrolü sunucu güvenliği sağlamaz. Sayısal 1 aktif, diğer değerler pasif sayılır.

**Fonksiyonların görevleri**

- `UserRow`: Kullanıcının rol ve aktiflik etiketlerini gösterir; işlem düğmeleriyle değişiklik önerisini üst sayfaya iletir, kendi hesap satırını kilitler.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { formatDate } from "../../utils/format-date.js"; `` | İçeri alır: formatDate — Türkçe tarih biçimi. |
| 3 | `` const SELF_HINT = "Kendi hesabında bu işlemi yapamazsın."; `` | Kendi hesap satırında kapalı düğmelerin title açıklamasını tanımlar. |
| 5 | `` export default function UserRow({ user, isSelf, onChange }) { `` | Kullanıcının rol ve aktiflik etiketlerini gösterir; işlem düğmeleriyle değişiklik önerisini üst sayfaya iletir, kendi hesap satırını kilitler. Bu satır fonksiyon tanımıdır. |
| 6 | `` const isAdmin = user.role === "admin"; `` | Rol etiketini ve önerilecek ters rolü seçmek için admin durumunu hesaplar. |
| 7 | `` const isActive = user.is_active === 1; `` | Sayısal 1 değerini aktif kabul ederek rozet/düğme metnini seçer. |
| 9 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 10 | `` <tr> `` | Tablo satırını açar. |
| 11 | `` <td> `` | Veri hücresini açar. |
| 12 | `` {user.name} `` | Satırın kullanıcı adını gösterir. |
| 13 | `` {isSelf && <span className="form__hint"> (sen)</span>} `` | Kendi hesap satırında adın yanına (sen) işaretini koyar. |
| 14 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 15 | `` <td>{user.email}</td> `` | user.email alanını tablo hücresinde gösterir. |
| 16 | `` <td> `` | Veri hücresini açar. |
| 17 | `` <span className={isAdmin ? "badge badge--admin" : "badge"}> `` | Admin kullanıcıya özel rozet, diğer kullanıcıya temel rozet stilini seçer. |
| 18 | `` {isAdmin ? "Yönetici" : "Kullanıcı"} `` | API rolünü Türkçe kullanıcı etiketine çevirir. |
| 19 | `` </span> `` | span elementinin/bileşeninin içeriğini kapatır. |
| 20 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 21 | `` <td> `` | Veri hücresini açar. |
| 22 | `` <span `` | Satır içi metin veya rozet kapsayıcısını açar. |
| 23 | `` className={ `` | Rozetin CSS sınıfını koşullu ifadeyle seçmeye başlar. |
| 24 | `` isActive ? "badge badge--active" : "badge badge--inactive" `` | Aktif kullanıcıya yeşil, pasif kullanıcıya pasif rozet sınıfını seçer. |
| 25 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 26 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 27 | `` {isActive ? "Aktif" : "Pasif"} `` | Kullanıcının mevcut aktiflik etiketini gösterir. |
| 28 | `` </span> `` | span elementinin/bileşeninin içeriğini kapatır. |
| 29 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 30 | `` <td>{formatDate(user.created_at)}</td> `` | Kaydın oluşturulma/güncellenme tarihini formatDate ile Türkçe biçimde hücreye yazar. |
| 31 | `` <td> `` | Veri hücresini açar. |
| 32 | `` <div className="post-table__actions"> `` | Satıra ait düzenleme, durum, silme veya geri getirme kontrollerini ortak işlem hücresinde gruplar. |
| 33 | `` <button `` | Eylem düğmesini açar. |
| 34 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 35 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 36 | `` disabled={isSelf} `` | Kendi hesabında rol/aktiflik işlemi yapılmasını arayüzde engeller. |
| 37 | `` title={isSelf ? SELF_HINT : undefined} `` | Kendi satırında kapalı düğmenin nedenini title ile açıklar; diğerlerinde title eklemez. |
| 38 | `` onClick={() => `` | Tıklama anında çalışacak, sonraki satırlarda tanımlanan callback’i başlatır. |
| 39 | `` onChange({ `` | Üst sayfaya gönderilecek kullanıcı değişikliği önerisi nesnesini açar. |
| 40 | `` user, `` | Değişiklik önerisinin hangi kullanıcıya ait olduğunu taşır. |
| 41 | `` field: "role", `` | Önerilen işlemin rol alanını değiştireceğini bildirir. |
| 42 | `` value: isAdmin ? "user" : "admin", `` | Admin için user, normal kullanıcı için admin hedef rolünü seçer. |
| 43 | `` }) `` | Nesneyi ve çağrıyı kapatır; dış ifade sonraki satırlarda tamamlanır. |
| 44 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 45 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 46 | `` {isAdmin ? "Kullanıcı yap" : "Yönetici yap"} `` | Mevcut role göre ters rol işleminin adını gösterir. |
| 47 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 48 | `` <button `` | Eylem düğmesini açar. |
| 49 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 50 | `` className="link-button" `` | Görünümü belirleyen CSS sınıfını “link-button” olarak belirler. |
| 51 | `` disabled={isSelf} `` | Kendi hesabında rol/aktiflik işlemi yapılmasını arayüzde engeller. |
| 52 | `` title={isSelf ? SELF_HINT : undefined} `` | Kendi satırında kapalı düğmenin nedenini title ile açıklar; diğerlerinde title eklemez. |
| 53 | `` onClick={() => `` | Tıklama anında çalışacak, sonraki satırlarda tanımlanan callback’i başlatır. |
| 54 | `` onChange({ `` | Üst sayfaya gönderilecek kullanıcı değişikliği önerisi nesnesini açar. |
| 55 | `` user, `` | Değişiklik önerisinin hangi kullanıcıya ait olduğunu taşır. |
| 56 | `` field: "is_active", `` | Önerilen işlemin aktiflik alanını değiştireceğini bildirir. |
| 57 | `` value: isActive ? 0 : 1, `` | Aktif kullanıcı için 0, pasif kullanıcı için 1 hedef değerini seçer. |
| 58 | `` }) `` | Nesneyi ve çağrıyı kapatır; dış ifade sonraki satırlarda tamamlanır. |
| 59 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 60 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 61 | `` {isActive ? "Pasifleştir" : "Aktifleştir"} `` | Kullanıcının mevcut aktifliğinin tersini yapacak düğme metnini seçer. |
| 62 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 63 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 64 | `` </td> `` | td elementinin/bileşeninin içeriğini kapatır. |
| 65 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 66 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 67 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

## 6. src/pages/admin

Kategori CRUD, bütün yazılar ve kullanıcı yönetimi üç ayrı sayfada toplandı; filtreler, onaylar ve API istekleri burada yönetilir.

### AdminCategoriesPage.jsx

**Dosya:** [src/pages/admin/AdminCategoriesPage.jsx](../src/pages/admin/AdminCategoriesPage.jsx)

**Değişiklik:** Yeni dosya; önceki adımlardaki eklemelerin birleşmiş son hâli.

Kategori GET/POST/PATCH/DELETE/restore akışları burada toplanır. editing: null kapalı, new yeni form, nesne düzenleme anlamına gelir. Yeni/düzenleme blokları ayrıdır; düzenleme formunda key={editing.id} kategori değişince state’i sıfırlar. Aktiflikte updateData, diğer mutasyonlarda reload kullanılır. Filtreler URL’de tutulmaz; liste ilk 50 kayıtla sınırlıdır. Hata nesnesinde CATEGORY_HAS_POSTS için details.active_posts beklenir.

**Fonksiyonların görevleri**

- `describeDeleteError`: CATEGORY_HAS_POSTS için details.active_posts sayısıyla açıklama üretir; diğer hatalarda error.message kullanır.
- `buildCategoriesPath`: Sıralama, 50 kayıt sınırı, isteğe bağlı arama ve include_deleted ile kategori GET adresini üretir; kendisi istek atmaz.
- `AdminCategoriesPage`: Kategori listesini ve filtrelerini, oluşturma/düzenleme formunu, aktiflik işlemini, silme modalını ve geri getirmeyi birleştirir.
- `openNewForm`: Önceki başarı mesajını temizleyip editing değerini new yaparak boş formu açar.
- `openEditForm`: Önceki başarı mesajını temizleyip seçilen kategori nesnesini editing state’ine yazar.
- `handleCreate`: Bütün form değerlerini kategori POST isteğine gönderir; başarıda formu kapatır, mesaj gösterir ve listeyi reload ile yeniden ister.
- `handleUpdate`: Düzenlenen kategori kimliğine yalnız changes nesnesini PATCH eder; başarıda formu kapatır, mesaj gösterir ve listeyi yeniler. values parametresi ortak form imzası için vardır, gövdede kullanılmaz.
- `handleToggleActive`: Aktiflik PATCH isteğini gönderir; dönen kaydı startTransition içindeki updateData ile listeye koyar. Hatayı yakalayıp actionError’a yazar; ayrı liste GET’i göndermez.
- `askDelete`: Seçilen kaydı deleteTarget yapar; eski başarı ve silme hatasını temizleyerek onay penceresini açar. Henüz DELETE göndermez.
- `closeDeleteDialog`: Silme hedefini ve silme hatasını null yaparak pencereyi kapatır.
- `handleDelete`: Hedef kayda DELETE gönderir; başarıda mesaj ve liste yenileme, hatada pencere içi hata üretir. finally bloğu bekleme durumunu kapatır.
- `handleRestore`: Seçilen kaydın restore ucuna PATCH gönderir; başarıda mesajı ve listeyi, hatada actionError’ı günceller.
- `handleSort`: Yeni sütunu asc ile seçer; aynı sütunun yönünü asc/desc arasında çevirir. Kullanıcı sayfasında ayrıca sayfa numarasını 1 yapar.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { startTransition, useState } from "react"; `` | İçeri alır: startTransition — state güncellemesini geçiş olarak işaretleme; useState — bileşene ait state. |
| 2 | `` import useAuth from "../../auth/useAuth.js"; `` | İçeri alır: useAuth — AuthContext kullanıcı ve istek fonksiyonları. |
| 3 | `` import CategoryForm from "../../components/admin/CategoryForm.jsx"; `` | İçeri alır: CategoryForm — kategori oluşturma/düzenleme formu. |
| 4 | `` import CategoryRow from "../../components/admin/CategoryRow.jsx"; `` | İçeri alır: CategoryRow — kategori tablo satırı. |
| 5 | `` import SortableHeader from "../../components/admin/SortableHeader.jsx"; `` | İçeri alır: SortableHeader — sıralanabilir tablo başlığı. |
| 6 | `` import ConfirmDialog from "../../components/ConfirmDialog.jsx"; `` | İçeri alır: ConfirmDialog — ortak modal onay penceresi. |
| 7 | `` import StatusMessage from "../../components/StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 8 | `` import useApi from "../../hooks/useApi.js"; `` | İçeri alır: useApi — veri/hata/yüklenme ve yenileme yönetimi. |
| 9 | `` import useDebouncedValue from "../../hooks/useDebouncedValue.js"; `` | İçeri alır: useDebouncedValue — gecikmeli arama değeri. |
| 10 | `` import { `` | Birden çok adlı dışa aktarımı alacak import listesini açar. |
| 11 | `` EMPTY_CATEGORY, `` | Boş kategori formu yardımcısını import listesine ekler. |
| 12 | `` toCategoryFormValues, `` | Api kategorisinden form değerleri yardımcısını import listesine ekler. |
| 13 | `` } from "../../utils/category-form.js"; `` | Çok satırlı import listesini kapatır; kategori form yardımcılarının kaynak modülünü belirtir. |
| 15 | `` const PAGE_SIZE = 50; `` | Bu listenin her isteğinde en fazla 50 kayıt istenmesini belirler. |
| 16 | `` const SEARCH_DELAY = 400; `` | Arama metninin yerleşmesi için bekleme süresini 400 milisaniye yapar. |
| 18 | `` function describeDeleteError(error) { `` | CATEGORY_HAS_POSTS için details.active_posts sayısıyla açıklama üretir; diğer hatalarda error.message kullanır. Bu satır fonksiyon tanımıdır. |
| 19 | `` if (error.code === "CATEGORY_HAS_POSTS") { `` | Kategoride yazı bulunduğu için silinememe hatasını özel olarak ele alır. |
| 20 | `` return `Bu kategoride ${error.details.active_posts} yazı var. Önce yazıları başka bir kategoriye taşı veya sil.`; `` | API’nin bildirdiği yazı sayısını ve yapılması gereken işlemi kullanıcı mesajına yerleştirir. |
| 21 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 23 | `` return error.message; `` | Özel eşlemesi olmayan hata için gelen mesajı korur. |
| 24 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 26 | `` function buildCategoriesPath(search, showDeleted, sort) { `` | Sıralama, 50 kayıt sınırı, isteğe bağlı arama ve include_deleted ile kategori GET adresini üretir; kendisi istek atmaz. Bu satır fonksiyon tanımıdır. |
| 27 | `` const params = new URLSearchParams({ `` | Sorgu parametrelerini URL kodlamasıyla oluşturacak nesneyi başlatır. |
| 28 | `` sort_by: sort.by, `` | Seçili sütun adını API’nin sort_by parametresine yazar. |
| 29 | `` sort_order: sort.order, `` | asc/desc yönünü sort_order parametresine yazar. |
| 30 | `` limit: String(PAGE_SIZE), `` | Sayfa boyutunu sorgu parametresi için metne çevirir. |
| 31 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 33 | `` if (search !== "") { `` | Boş aramada search parametresini eklememek için koşulu denetler. |
| 34 | `` params.set("search", search); `` | Yerleşmiş arama metnini search parametresine ekler; URLSearchParams kodlamayı yapar. |
| 35 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 37 | `` if (showDeleted) { `` | Silinenleri göster seçiliyse ilgili sorgu parametresini ekler. |
| 38 | `` params.set("include_deleted", "1"); `` | Silinenleri diğer kayıtların yanına dahil etmek için include_deleted=1 gönderir. |
| 39 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 41 | `` return `/api/v1/categories?${params}`; `` | Kodlanmış sorgu parametrelerini /api/v1/categories yoluna ekleyerek GET adresini döndürür. |
| 42 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 44 | `` export default function AdminCategoriesPage() { `` | Kategori listesini ve filtrelerini, oluşturma/düzenleme formunu, aktiflik işlemini, silme modalını ve geri getirmeyi birleştirir. Bu satır fonksiyon tanımıdır. |
| 45 | `` const auth = useAuth(); `` | Oturum Context’inden kullanıcı bilgisini ve authRequest dahil yardımcıları alır. |
| 46 | `` const [search, setSearch] = useState(""); `` | search state’ini ve setSearch setter’ını kurar: anlık arama metni; boş metinle başlar. Başlangıç ifadesi: "". |
| 47 | `` const [showDeleted, setShowDeleted] = useState(false); `` | showDeleted state’ini ve setShowDeleted setter’ını kurar: silinenleri dahil etme seçimi; false ile başlar. Başlangıç ifadesi: false. |
| 48 | `` const [sort, setSort] = useState({ by: "name", order: "asc" }); `` | sort state’ini ve setSort setter’ını kurar: sıralama sütunu ve yönü. Başlangıç ifadesi: { by: "name", order: "asc" }. |
| 49 | `` const [editing, setEditing] = useState(null); `` | editing state’ini ve setEditing setter’ını kurar: kapalı/yeni/düzenlenen kategori bilgisi. Başlangıç ifadesi: null. |
| 50 | `` const [notice, setNotice] = useState(null); `` | notice state’ini ve setNotice setter’ını kurar: başarı veya bilgi mesajı; başlangıçta null. Başlangıç ifadesi: null. |
| 51 | `` const [actionError, setActionError] = useState(null); `` | actionError state’ini ve setActionError setter’ını kurar: satır işlemi hatası; başlangıçta null. Başlangıç ifadesi: null. |
| 52 | `` const [deleteTarget, setDeleteTarget] = useState(null); `` | deleteTarget state’ini ve setDeleteTarget setter’ını kurar: silme için seçilen kayıt; null iken modal kapalı. Başlangıç ifadesi: null. |
| 53 | `` const [deleteError, setDeleteError] = useState(null); `` | deleteError state’ini ve setDeleteError setter’ını kurar: modal içinde gösterilen silme hatası. Başlangıç ifadesi: null. |
| 54 | `` const [deleting, setDeleting] = useState(false); `` | deleting state’ini ve setDeleting setter’ını kurar: silme isteğinin sürüp sürmediği. Başlangıç ifadesi: false. |
| 56 | `` const debouncedSearch = useDebouncedValue( `` | Arama kutusundan ayrı, gecikmeli sorgu değerini elde etmeye başlar. |
| 57 | `` search.trim(), `` | Aramanın başındaki/sonundaki boşlukları temizleyip debounce girdisi yapar. |
| 58 | `` SEARCH_DELAY `` | Hook’a 400 ms gecikmeyi geçirir. |
| 59 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 61 | `` const categories = useApi( `` | categories listesi için veri, metadata, loading, error ve yenileme yardımcılarını elde etmeye başlar. |
| 62 | `` buildCategoriesPath(debouncedSearch, showDeleted, sort), `` | Kategori GET adresini yerleşmiş arama, silinme filtresi ve sıralamadan üretir. |
| 63 | `` auth.authRequest `` | GET’i token ve merkezi oturum hatası yönetimi olan istek fonksiyonuyla yaptırır. |
| 64 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 66 | `` function openNewForm() { `` | Önceki başarı mesajını temizleyip editing değerini new yaparak boş formu açar. Bu satır fonksiyon tanımıdır. |
| 67 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 68 | `` setEditing("new"); `` | Yeni kategori formunu açacak new işaretini saklar. |
| 69 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 71 | `` function openEditForm(category) { `` | Önceki başarı mesajını temizleyip seçilen kategori nesnesini editing state’ine yazar. Bu satır fonksiyon tanımıdır. |
| 72 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 73 | `` setEditing(category); `` | Düzenlenecek kategori nesnesini saklar ve düzenleme formunu açar. |
| 74 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 76 | `` async function handleCreate(values) { `` | Bütün form değerlerini kategori POST isteğine gönderir; başarıda formu kapatır, mesaj gösterir ve listeyi reload ile yeniden ister. Bu satır fonksiyon tanımıdır. |
| 77 | `` const { data } = await auth.authRequest("/api/v1/categories", { `` | Kategori oluşturma isteğini başlatır ve başarılı yanıtın data alanını almayı bekler. |
| 78 | `` method: "POST", `` | HTTP yöntemini yeni kayıt oluşturmak için POST seçer. |
| 79 | `` body: values, `` | Oluşturmada üç form alanının tamamını API istemcisine gövde olarak verir. |
| 80 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 82 | `` setEditing(null); `` | Kategori formunu kapatır. |
| 83 | `` setNotice(`"${data.name}" oluşturuldu.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 84 | `` categories.reload(); `` | categories hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 85 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 87 | `` async function handleUpdate(values, changes) { `` | Düzenlenen kategori kimliğine yalnız changes nesnesini PATCH eder; başarıda formu kapatır, mesaj gösterir ve listeyi yeniler. values parametresi ortak form imzası için vardır, gövdede kullanılmaz. Bu satır fonksiyon tanımıdır. |
| 88 | `` const { data } = await auth.authRequest( `` | Kimliği sonraki satırda verilen kategori isteğini bekler ve güncel kaydı data olarak alır. |
| 89 | `` `/api/v1/categories/${editing.id}`, `` | İşlem yapılacak kategori kimliğini endpoint yoluna yerleştirir. |
| 90 | `` { method: "PATCH", body: changes } `` | Düzenlemede yalnız değişen alanları PATCH gövdesine koyar. |
| 91 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 93 | `` setEditing(null); `` | Kategori formunu kapatır. |
| 94 | `` setNotice(`"${data.name}" güncellendi.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 95 | `` categories.reload(); `` | categories hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 96 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 98 | `` async function handleToggleActive(category, nextActive) { `` | Aktiflik PATCH isteğini gönderir; dönen kaydı startTransition içindeki updateData ile listeye koyar. Hatayı yakalayıp actionError’a yazar; ayrı liste GET’i göndermez. Bu satır fonksiyon tanımıdır. |
| 99 | `` setActionError(null); `` | Önceki satır işlemi hatasını temizler. |
| 101 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 102 | `` const { data } = await auth.authRequest( `` | Kimliği sonraki satırda verilen kategori isteğini bekler ve güncel kaydı data olarak alır. |
| 103 | `` `/api/v1/categories/${category.id}`, `` | İşlem yapılacak kategori kimliğini endpoint yoluna yerleştirir. |
| 104 | `` { method: "PATCH", body: { is_active: nextActive } } `` | Aktiflik değişikliğinde yalnız is_active alanını PATCH eder. |
| 105 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 107 | `` startTransition(() => { `` | Başarılı async yanıt sonrası kalıcı liste güncellemesini yeniden geçiş olarak işaretler. |
| 108 | `` categories.updateData((list) => `` | Mevcut kategori listesini HTTP isteği atmadan değiştirecek güncelleyiciyi verir. |
| 109 | `` list.map((item) => (item.id === data.id ? data : item)) `` | Yalnız yanıtla aynı kimlikteki kaydı sunucunun döndürdüğü kayıtla değiştirir; diğerlerini korur. |
| 110 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 111 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 112 | `` } catch (toggleError) { `` | İşlemden fırlatılan hatayı toggleError adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 113 | `` setActionError(toggleError); `` | Yakalanan toggleError nesnesini sayfanın işlem hata alanına yazar. |
| 114 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 115 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 117 | `` function askDelete(category) { `` | Seçilen kaydı deleteTarget yapar; eski başarı ve silme hatasını temizleyerek onay penceresini açar. Henüz DELETE göndermez. Bu satır fonksiyon tanımıdır. |
| 118 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 119 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 120 | `` setDeleteTarget(category); `` | Seçilen kategoriyi silme hedefi yapar; modal açılır. |
| 121 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 123 | `` function closeDeleteDialog() { `` | Silme hedefini ve silme hatasını null yaparak pencereyi kapatır. Bu satır fonksiyon tanımıdır. |
| 124 | `` setDeleteTarget(null); `` | Silme hedefini kaldırır; modal kapanır. |
| 125 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 126 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 128 | `` async function handleDelete() { `` | Hedef kayda DELETE gönderir; başarıda mesaj ve liste yenileme, hatada pencere içi hata üretir. finally bloğu bekleme durumunu kapatır. Bu satır fonksiyon tanımıdır. |
| 129 | `` setDeleting(true); `` | Silme bekleme durumunu başlatır; ilgili düğmeler kapanır. |
| 130 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 132 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 133 | `` await auth.authRequest( `` | Sonraki satırlarda verilen yetkili HTTP işlemini başlatır ve bitmesini bekler. |
| 134 | `` `/api/v1/categories/${deleteTarget.id}`, `` | İşlem yapılacak kategori kimliğini endpoint yoluna yerleştirir. |
| 135 | `` { method: "DELETE" } `` | Silme yöntemini seçer; gövde göndermez. |
| 136 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 138 | `` setNotice(`"${deleteTarget.name}" silindi.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 139 | `` setDeleteTarget(null); `` | Silme hedefini kaldırır; modal kapanır. |
| 140 | `` categories.reload(); `` | categories hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 141 | `` } catch (deleteFailure) { `` | İşlemden fırlatılan hatayı deleteFailure adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 142 | `` setDeleteError(deleteFailure); `` | Yakalanan deleteFailure nesnesini silme modalının hata alanına yazar. |
| 143 | `` } finally { `` | Başarı veya hatadan bağımsız olarak bekleme state’ini temizleyecek bloğu başlatır. |
| 144 | `` setDeleting(false); `` | Silme bekleme durumunu bitirir; düğmeler tekrar kullanılabilir olur. |
| 145 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 146 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 148 | `` async function handleRestore(category) { `` | Seçilen kaydın restore ucuna PATCH gönderir; başarıda mesajı ve listeyi, hatada actionError’ı günceller. Bu satır fonksiyon tanımıdır. |
| 149 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 150 | `` setActionError(null); `` | Önceki satır işlemi hatasını temizler. |
| 152 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 153 | `` await auth.authRequest( `` | Sonraki satırlarda verilen yetkili HTTP işlemini başlatır ve bitmesini bekler. |
| 154 | `` `/api/v1/categories/${category.id}/restore`, `` | İşlem yapılacak kategori kimliğini endpoint yoluna yerleştirir; restore alt ucunu seçer. |
| 155 | `` { method: "PATCH" } `` | Geri getirme için gövdesiz PATCH yöntemini seçer. |
| 156 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 158 | `` setNotice(`"${category.name}" geri getirildi.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 159 | `` categories.reload(); `` | categories hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 160 | `` } catch (restoreError) { `` | İşlemden fırlatılan hatayı restoreError adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 161 | `` setActionError(restoreError); `` | Yakalanan restoreError nesnesini sayfanın işlem hata alanına yazar. |
| 162 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 163 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 165 | `` function handleSort(field) { `` | Yeni sütunu asc ile seçer; aynı sütunun yönünü asc/desc arasında çevirir. Kullanıcı sayfasında ayrıca sayfa numarasını 1 yapar. Bu satır fonksiyon tanımıdır. |
| 166 | `` setSort((current) => { `` | Yeni sıralamayı en güncel önceki state üzerinden hesaplayan setter’ı başlatır. |
| 167 | `` if (current.by !== field) { `` | Başka sütuna geçiliyorsa önceki yönü kullanmamak için ayırır. |
| 168 | `` return { by: field, order: "asc" }; `` | Yeni sütunu artan sıralamayla seçer. |
| 169 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 171 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 172 | `` by: field, `` | Yeni sıralama nesnesinde tıklanan sütunu korur. |
| 173 | `` order: current.order === "asc" ? "desc" : "asc", `` | Aynı sütunun yönünü artandan azalana veya tersine çevirir. |
| 174 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 175 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 176 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 178 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 179 | `` <section> `` | Sayfa/bölüm kapsayıcısını açar. |
| 180 | `` <title>Kategoriler · Yönetim · Node Blog</title> `` | React’in belge başlığı olarak işleyeceği sayfa başlığını üretir. |
| 181 | `` <div className="dashboard__header"> `` | Sayfa başlığı ve Yeni kategori düğmesini ortak başlık yerleşiminde yan yana gruplar. |
| 182 | `` <h1 className="page-title">Kategoriler</h1> `` | Sayfanın görünür ana başlığını ortak page-title stiliyle gösterir. |
| 184 | `` <button type="button" className="button" onClick={openNewForm}> `` | Form göndermeyen Yeni kategori düğmesini form açma fonksiyonuna bağlar. |
| 185 | `` Yeni kategori `` | Bağlantı/düğme/seçim kutusunda görünen “Yeni kategori” metnidir. |
| 186 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 187 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 189 | `` {editing === "new" && ( `` | editing new ise oluşturma formu bloğunu render eder. |
| 190 | `` <div className="admin-panel"> `` | Yeni/düzenleme formunu kenarlık ve arka planı olan yönetim paneli alanına yerleştirir. |
| 191 | `` <h2>Yeni kategori</h2> `` | Kategori formunun yeni/düzenleme başlığını gösterir; düzenlemede seçilen ad yer alır. |
| 192 | `` <CategoryForm `` | Ortak kategori formunu bu konuma yerleştirir. |
| 193 | `` initialValues={EMPTY_CATEGORY} `` | Oluşturma formunu ortak boş değerlerle başlatır. |
| 194 | `` submitLabel="Oluştur" `` | Form gönderme düğmesinin normal metnini “Oluştur” olarak belirler. |
| 195 | `` onSubmit={handleCreate} `` | Form gönderimini tam değerlerle kategori oluşturmaya bağlar. |
| 196 | `` onCancel={() => setEditing(null)} `` | Vazgeç’te düzenleme state’ini temizleyip formu kapatır. |
| 197 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 198 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 199 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 201 | `` {editing !== null && editing !== "new" && ( `` | editing bir kategori nesnesiyse ayrı düzenleme formu bloğunu render eder. |
| 202 | `` <div className="admin-panel"> `` | Yeni/düzenleme formunu kenarlık ve arka planı olan yönetim paneli alanına yerleştirir. |
| 203 | `` <h2>Düzenle: {editing.name}</h2> `` | Kategori formunun yeni/düzenleme başlığını gösterir; düzenlemede seçilen ad yer alır. |
| 204 | `` <CategoryForm `` | Ortak kategori formunu bu konuma yerleştirir. |
| 205 | `` key={editing.id} `` | Düzenlenen kategori değişince formu unmount/mount ederek bütün yerel form state’ini sıfırlar. |
| 206 | `` initialValues={toCategoryFormValues(editing)} `` | Düzenlenen API kaydını kontrollü alanlara uygun başlangıç değerlerine çevirir. |
| 207 | `` submitLabel="Kaydet" `` | Form gönderme düğmesinin normal metnini “Kaydet” olarak belirler. |
| 208 | `` onSubmit={handleUpdate} `` | Form gönderimini yalnız değişikliklerle kategori düzenlemeye bağlar. |
| 209 | `` onCancel={() => setEditing(null)} `` | Vazgeç’te düzenleme state’ini temizleyip formu kapatır. |
| 210 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 211 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 212 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 214 | `` {notice && <StatusMessage>{notice}</StatusMessage>} `` | Başarı/bilgi mesajı varsa ortak bilgi görünümünde gösterir. |
| 216 | `` {actionError && ( `` | actionError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 217 | `` <StatusMessage type="error">{actionError.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 218 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 220 | `` <div className="toolbar"> `` | Arama, filtre ve kayıt sayısı kontrollerini ortak esnek araç çubuğuna yerleştirir. |
| 221 | `` <input `` | Kullanıcı girişi kontrolünü açar. |
| 222 | `` type="search" `` | Arama amaçlı kontrollü input türünü seçer. |
| 223 | `` aria-label="Kategori ara" `` | Kontrolün erişilebilir adını “Kategori ara” olarak belirler. |
| 224 | `` placeholder="Ad, slug veya açıklama" `` | Alan boşken gösterilecek örnek/ipucu metnini “Ad, slug veya açıklama” olarak belirler. |
| 225 | `` value={search} `` | Arama input’unu anlık search state’ine bağlar. |
| 226 | `` onChange={(event) => setSearch(event.target.value)} `` | Kategori arama metnini anında state’e yazar; sorgu debounce sonrasında değişir. |
| 227 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 229 | `` <label className="checkbox-field"> `` | Checkbox ile Silinenleri göster metnini tek label içinde ilişkilendirir; metne tıklamak da seçimi değiştirir. |
| 230 | `` <input `` | Kullanıcı girişi kontrolünü açar. |
| 231 | `` type="checkbox" `` | Boolean seçim kutusu türünü seçer. |
| 232 | `` checked={showDeleted} `` | Checkbox’ı showDeleted state’iyle kontrollü yapar. |
| 233 | `` onChange={(event) => setShowDeleted(event.target.checked)} `` | Kategori checkbox değişimini showDeleted state’ine yazar. |
| 234 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 235 | `` Silinenleri göster `` | Bağlantı/düğme/seçim kutusunda görünen “Silinenleri göster” metnidir. |
| 236 | `` </label> `` | label elementinin/bileşeninin içeriğini kapatır. |
| 238 | `` {categories.meta && ( `` | API metadata’sı varsa toplam kayıt bilgisini koşullu gösterir. |
| 239 | `` <span className="form__hint"> `` | Satır içi metin veya rozet kapsayıcısını açar. |
| 240 | `` {categories.meta.total} kategori `` | API’nin kategori toplamını ipucu alanında gösterir. |
| 241 | `` </span> `` | span elementinin/bileşeninin içeriğini kapatır. |
| 242 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 243 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 245 | `` {categories.loading && ( `` | Liste yüklenirken bekleme mesajını koşullu gösterir. |
| 246 | `` <StatusMessage>Kategoriler yükleniyor...</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 247 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 249 | `` {categories.error && ( `` | Liste isteği başarısızsa hata mesajını koşullu gösterir. |
| 250 | `` <StatusMessage type="error"> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar. |
| 251 | `` {categories.error.message} `` | Kategori GET isteğinin hata mesajını gösterir. |
| 252 | `` </StatusMessage> `` | StatusMessage elementinin/bileşeninin içeriğini kapatır. |
| 253 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 255 | `` {categories.data?.length === 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; boş dizi geldiyse boş sonuç mesajını gösterir. |
| 256 | `` <StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 257 | `` {debouncedSearch === "" `` | Boş liste mesajını yerleşmiş aramanın boş olup olmamasına göre seçmeye başlar. |
| 258 | `` ? "Bu listede kategori yok." `` | Arama yokken genel boş liste mesajını seçer. |
| 259 | `` : `"${debouncedSearch}" ile eşleşen kategori yok.`} `` | Arama varken aranan metni içeren eşleşme yok mesajını seçer. |
| 260 | `` </StatusMessage> `` | StatusMessage elementinin/bileşeninin içeriğini kapatır. |
| 261 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 263 | `` {categories.data?.length > 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; en az bir kayıt varsa tabloyu gösterir. |
| 264 | `` <table className="post-table"> `` | Ortak post-table görünümündeki tabloyu açar. |
| 265 | `` <thead> `` | Tablonun başlık bölümünü açar. |
| 266 | `` <tr> `` | Tablo satırını açar. |
| 267 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 268 | `` label="Ad" `` | Görünür alan/sütun etiketini “Ad” olarak belirler. |
| 269 | `` field="name" `` | Sıralamada API’ye gönderilecek sütun adını “name” olarak belirler. |
| 270 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 271 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 272 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 273 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 274 | `` label="Slug" `` | Görünür alan/sütun etiketini “Slug” olarak belirler. |
| 275 | `` field="slug" `` | Sıralamada API’ye gönderilecek sütun adını “slug” olarak belirler. |
| 276 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 277 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 278 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 279 | `` <th>Durum</th> `` | Tabloda Durum sütununun sabit başlığını gösterir. |
| 280 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 281 | `` label="Oluşturma" `` | Görünür alan/sütun etiketini “Oluşturma” olarak belirler. |
| 282 | `` field="created_at" `` | Sıralamada API’ye gönderilecek sütun adını “created_at” olarak belirler. |
| 283 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 284 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 285 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 286 | `` <th>İşlem</th> `` | Tabloda İşlem sütununun sabit başlığını gösterir. |
| 287 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 288 | `` </thead> `` | thead elementinin/bileşeninin içeriğini kapatır. |
| 290 | `` <tbody> `` | Tablonun kayıtlar bölümünü açar. |
| 291 | `` {categories.data.map((category) => ( `` | categories listesindeki her kaydı category adıyla alıp ilgili satır bileşenine dönüştürür. |
| 292 | `` <CategoryRow `` | Kategori tablo satırını bu konuma yerleştirir. |
| 293 | `` key={category.id} `` | Kategori satırını id ile tanımlar; sıra değişse de aynı satırın React kimliğini korur. |
| 294 | `` category={category} `` | Satıra bu kategorinin API kaydını geçirir. |
| 295 | `` onEdit={openEditForm} `` | Kategori satırına seçilen kayıtla düzenleme formunu açacak callback’i verir. |
| 296 | `` onToggleActive={handleToggleActive} `` | Kategori satırına aktiflik PATCH ve yerel liste güncelleme callback’ini verir. |
| 297 | `` onDelete={askDelete} `` | Satıra silme isteği yerine önce onay penceresini açacak callback’i verir. |
| 298 | `` onRestore={handleRestore} `` | Satıra restore isteğini gönderen callback’i verir. |
| 299 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 300 | `` ))} `` | map callback’inin JSX’ini, map çağrısını ve JSX ifadesini kapatır. |
| 301 | `` </tbody> `` | tbody elementinin/bileşeninin içeriğini kapatır. |
| 302 | `` </table> `` | table elementinin/bileşeninin içeriğini kapatır. |
| 303 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 305 | `` <ConfirmDialog `` | Onay penceresini bu konuma yerleştirir. |
| 306 | `` open={deleteTarget !== null} `` | Silme hedefi varken modalın açılmasını ister. |
| 307 | `` title="Kategoriyi sil" `` | Modal başlığını “Kategoriyi sil” olarak belirler. |
| 308 | `` confirmLabel="Sil" `` | Normal onay düğmesi metnini “Sil” olarak belirler. |
| 309 | `` danger `` | ConfirmDialog’un tehlikeli işlem stilini true yapar. |
| 310 | `` busy={deleting} `` | Silme isteği süresini modal bekleme görünümüne bağlar. |
| 311 | `` onConfirm={handleDelete} `` | Modal onayını seçilen kaydın DELETE isteğine bağlar. |
| 312 | `` onClose={closeDeleteDialog} `` | Modal kapanışını silme hedefi ve hata temizliğiyle eşler. |
| 313 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 314 | `` <p> `` | Açıklama paragrafını açar. |
| 315 | `` "{deleteTarget?.name}" silinecek. Listede "Silindi" olarak `` | Silme onayında kategori adını, geri getirilebilirliği ve slug’ın yeniden kullanılamamasını anlatan açıklamanın parçasıdır; optional chaining boş hedefi güvenle karşılar. |
| 316 | `` kalır ve geri getirilebilir; slug'ı yeni bir kategoride `` | Silme onayında kategori adını, geri getirilebilirliği ve slug’ın yeniden kullanılamamasını anlatan açıklamanın parçasıdır; optional chaining boş hedefi güvenle karşılar. |
| 317 | `` kullanılamaz. `` | Silme onayında kategori adını, geri getirilebilirliği ve slug’ın yeniden kullanılamamasını anlatan açıklamanın parçasıdır; optional chaining boş hedefi güvenle karşılar. |
| 318 | `` </p> `` | p elementinin/bileşeninin içeriğini kapatır. |
| 320 | `` {deleteError && ( `` | deleteError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 321 | `` <StatusMessage type="error"> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar. |
| 322 | `` {describeDeleteError(deleteError)} `` | Silme hatasını yazı sayısını da anlatabilen özel mesaj fonksiyonuyla biçimler. |
| 323 | `` </StatusMessage> `` | StatusMessage elementinin/bileşeninin içeriğini kapatır. |
| 324 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 325 | `` </ConfirmDialog> `` | ConfirmDialog elementinin/bileşeninin içeriğini kapatır. |
| 326 | `` </section> `` | section elementinin/bileşeninin içeriğini kapatır. |
| 327 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 328 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### AdminPostsPage.jsx

**Dosya:** [src/pages/admin/AdminPostsPage.jsx](../src/pages/admin/AdminPostsPage.jsx)

**Değişiklik:** Yeni dosya.

Kullanıcı kimliğiyle kısıtlamadan /posts listesini ister; admin görünürlüğünü API belirler. include_deleted=1 silinenleri ekler, yalnız silinenleri seçmez. 10 kayıtlık Pagination, API meta.total_pages alanını kullanır. sort_order gönderilmediğinden sıralama yönü API varsayımına kalır. Modal metnindeki yazarın Silinenleri göster ile geri getirebileceği ifadesi, README’deki yalnız admin’in silinenleri listeleyebilmesiyle çelişir; bu belgede mevcut kod açıklanıyor, metin değiştirilmedi.

**Fonksiyonların görevleri**

- `buildPostsPath`: updated_at sıralaması, sayfa, 10 kayıt sınırı ve seçilmiş arama/durum/silinme filtrelerinden yazı GET adresini üretir. user_id kısıtı göndermez.
- `AdminPostsPage`: Bütün yazıları arama, durum, silinenleri dahil etme ve 10 kayıtlık sayfalarla listeler; silme/geri getirme işlemlerini yönetir.
- `handleSearchChange`: Arama input’unu hemen günceller ve sayfayı 1’e alır; arama metninin API adresine geçişi debounce ile gecikir.
- `handleStatusChange`: Yazı durum filtresini değiştirir ve sayfa numarasını 1 yapar.
- `handleShowDeletedChange`: Checkbox’ın boolean checked değerini saklar ve sayfayı 1’e döndürür.
- `askDelete`: Seçilen kaydı deleteTarget yapar; eski başarı ve silme hatasını temizleyerek onay penceresini açar. Henüz DELETE göndermez.
- `closeDeleteDialog`: Silme hedefini ve silme hatasını null yaparak pencereyi kapatır.
- `handleDelete`: Hedef kayda DELETE gönderir; başarıda mesaj ve liste yenileme, hatada pencere içi hata üretir. finally bloğu bekleme durumunu kapatır.
- `handleRestore`: Seçilen kaydın restore ucuna PATCH gönderir; başarıda mesajı ve listeyi, hatada actionError’ı günceller.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useState } from "react"; `` | İçeri alır: useState — bileşene ait state. |
| 2 | `` import useAuth from "../../auth/useAuth.js"; `` | İçeri alır: useAuth — AuthContext kullanıcı ve istek fonksiyonları. |
| 3 | `` import AdminPostRow from "../../components/admin/AdminPostRow.jsx"; `` | İçeri alır: AdminPostRow — yazı tablo satırı. |
| 4 | `` import ConfirmDialog from "../../components/ConfirmDialog.jsx"; `` | İçeri alır: ConfirmDialog — ortak modal onay penceresi. |
| 5 | `` import Pagination from "../../components/Pagination.jsx"; `` | İçeri alır: Pagination — önceki/sonraki sayfa kontrolü. |
| 6 | `` import StatusMessage from "../../components/StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 7 | `` import useApi from "../../hooks/useApi.js"; `` | İçeri alır: useApi — veri/hata/yüklenme ve yenileme yönetimi. |
| 8 | `` import useDebouncedValue from "../../hooks/useDebouncedValue.js"; `` | İçeri alır: useDebouncedValue — gecikmeli arama değeri. |
| 10 | `` const PAGE_SIZE = 10; `` | Bu listenin her isteğinde en fazla 10 kayıt istenmesini belirler. |
| 11 | `` const SEARCH_DELAY = 400; `` | Arama metninin yerleşmesi için bekleme süresini 400 milisaniye yapar. |
| 13 | `` const STATUS_FILTERS = [ `` | Yazı durumu çiplerinin değer/etiket listesini açar. |
| 14 | `` { value: null, label: "Tümü" }, `` | Filtre parametresini kaldıran Tümü seçeneğini tanımlar. |
| 15 | `` { value: "draft", label: "Taslaklar" }, `` | status=draft gönderecek Taslaklar seçeneğini tanımlar. |
| 16 | `` { value: "published", label: "Yayında" }, `` | status=published gönderecek Yayında seçeneğini tanımlar. |
| 17 | `` ]; `` | Sabit seçenek dizisini kapatır. |
| 19 | `` function buildPostsPath({ search, status, showDeleted, page }) { `` | updated_at sıralaması, sayfa, 10 kayıt sınırı ve seçilmiş arama/durum/silinme filtrelerinden yazı GET adresini üretir. user_id kısıtı göndermez. Bu satır fonksiyon tanımıdır. |
| 20 | `` const params = new URLSearchParams({ `` | Sorgu parametrelerini URL kodlamasıyla oluşturacak nesneyi başlatır. |
| 21 | `` sort_by: "updated_at", `` | Yazıları güncellenme alanına göre sıralamayı ister; yön bu kodda gönderilmez. |
| 22 | `` page: String(page), `` | Sayfa numarasını sorguya uygun metne çevirir. |
| 23 | `` limit: String(PAGE_SIZE), `` | Sayfa boyutunu sorgu parametresi için metne çevirir. |
| 24 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 26 | `` if (search !== "") { `` | Boş aramada search parametresini eklememek için koşulu denetler. |
| 27 | `` params.set("search", search); `` | Yerleşmiş arama metnini search parametresine ekler; URLSearchParams kodlamayı yapar. |
| 28 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 30 | `` if (status !== null) { `` | Tümü dışında bir yazı durumu seçilmişse filtreyi ekler. |
| 31 | `` params.set("status", status); `` | Seçili draft/published durumunu sorguya ekler. |
| 32 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 34 | `` if (showDeleted) { `` | Silinenleri göster seçiliyse ilgili sorgu parametresini ekler. |
| 35 | `` params.set("include_deleted", "1"); `` | Silinenleri diğer kayıtların yanına dahil etmek için include_deleted=1 gönderir. |
| 36 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 38 | `` return `/api/v1/posts?${params}`; `` | Kodlanmış sorgu parametrelerini /api/v1/posts yoluna ekleyerek GET adresini döndürür. |
| 39 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 41 | `` export default function AdminPostsPage() { `` | Bütün yazıları arama, durum, silinenleri dahil etme ve 10 kayıtlık sayfalarla listeler; silme/geri getirme işlemlerini yönetir. Bu satır fonksiyon tanımıdır. |
| 42 | `` const auth = useAuth(); `` | Oturum Context’inden kullanıcı bilgisini ve authRequest dahil yardımcıları alır. |
| 43 | `` const [search, setSearch] = useState(""); `` | search state’ini ve setSearch setter’ını kurar: anlık arama metni; boş metinle başlar. Başlangıç ifadesi: "". |
| 44 | `` const [status, setStatus] = useState(null); `` | status state’ini ve setStatus setter’ını kurar: yazı durum filtresi; null tüm durumları seçer. Başlangıç ifadesi: null. |
| 45 | `` const [showDeleted, setShowDeleted] = useState(false); `` | showDeleted state’ini ve setShowDeleted setter’ını kurar: silinenleri dahil etme seçimi; false ile başlar. Başlangıç ifadesi: false. |
| 46 | `` const [page, setPage] = useState(1); `` | page state’ini ve setPage setter’ını kurar: sayfa numarası; 1’den başlar. Başlangıç ifadesi: 1. |
| 47 | `` const [notice, setNotice] = useState(null); `` | notice state’ini ve setNotice setter’ını kurar: başarı veya bilgi mesajı; başlangıçta null. Başlangıç ifadesi: null. |
| 48 | `` const [actionError, setActionError] = useState(null); `` | actionError state’ini ve setActionError setter’ını kurar: satır işlemi hatası; başlangıçta null. Başlangıç ifadesi: null. |
| 49 | `` const [deleteTarget, setDeleteTarget] = useState(null); `` | deleteTarget state’ini ve setDeleteTarget setter’ını kurar: silme için seçilen kayıt; null iken modal kapalı. Başlangıç ifadesi: null. |
| 50 | `` const [deleteError, setDeleteError] = useState(null); `` | deleteError state’ini ve setDeleteError setter’ını kurar: modal içinde gösterilen silme hatası. Başlangıç ifadesi: null. |
| 51 | `` const [deleting, setDeleting] = useState(false); `` | deleting state’ini ve setDeleting setter’ını kurar: silme isteğinin sürüp sürmediği. Başlangıç ifadesi: false. |
| 53 | `` const debouncedSearch = useDebouncedValue( `` | Arama kutusundan ayrı, gecikmeli sorgu değerini elde etmeye başlar. |
| 54 | `` search.trim(), `` | Aramanın başındaki/sonundaki boşlukları temizleyip debounce girdisi yapar. |
| 55 | `` SEARCH_DELAY `` | Hook’a 400 ms gecikmeyi geçirir. |
| 56 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 58 | `` const posts = useApi( `` | posts listesi için veri, metadata, loading, error ve yenileme yardımcılarını elde etmeye başlar. |
| 59 | `` buildPostsPath({ `` | Yazı GET adresi için arama/filtre/sayfa nesnesini hazırlamaya başlar. |
| 60 | `` search: debouncedSearch, `` | API sorgusuna anlık input yerine yerleşmiş arama değerini verir. |
| 61 | `` status, `` | Adres oluşturucuya seçili yazı durumunu taşır. |
| 62 | `` showDeleted, `` | Adres oluşturucuya silinenleri dahil etme seçimini taşır. |
| 63 | `` page, `` | Adres oluşturucuya geçerli sayfa numarasını taşır. |
| 64 | `` }), `` | Nesneli iç çağrıyı bitirir; dış çağrının sonraki argümanına geçer. |
| 65 | `` auth.authRequest `` | GET’i token ve merkezi oturum hatası yönetimi olan istek fonksiyonuyla yaptırır. |
| 66 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 68 | `` function handleSearchChange(event) { `` | Arama input’unu hemen günceller ve sayfayı 1’e alır; arama metninin API adresine geçişi debounce ile gecikir. Bu satır fonksiyon tanımıdır. |
| 69 | `` setSearch(event.target.value); `` | Input’taki yeni arama metnini hemen state’e yazar. |
| 70 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 71 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 73 | `` function handleStatusChange(nextStatus) { `` | Yazı durum filtresini değiştirir ve sayfa numarasını 1 yapar. Bu satır fonksiyon tanımıdır. |
| 74 | `` setStatus(nextStatus); `` | Seçilen yazı durumunu veya Tümü için null değerini saklar. |
| 75 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 76 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 78 | `` function handleShowDeletedChange(event) { `` | Checkbox’ın boolean checked değerini saklar ve sayfayı 1’e döndürür. Bu satır fonksiyon tanımıdır. |
| 79 | `` setShowDeleted(event.target.checked); `` | Checkbox’ın checked boolean değerini silinenleri göster state’ine yazar. |
| 80 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 81 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 83 | `` function askDelete(post) { `` | Seçilen kaydı deleteTarget yapar; eski başarı ve silme hatasını temizleyerek onay penceresini açar. Henüz DELETE göndermez. Bu satır fonksiyon tanımıdır. |
| 84 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 85 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 86 | `` setDeleteTarget(post); `` | Seçilen yazıyı silme hedefi yapar; modal açılır. |
| 87 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 89 | `` function closeDeleteDialog() { `` | Silme hedefini ve silme hatasını null yaparak pencereyi kapatır. Bu satır fonksiyon tanımıdır. |
| 90 | `` setDeleteTarget(null); `` | Silme hedefini kaldırır; modal kapanır. |
| 91 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 92 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 94 | `` async function handleDelete() { `` | Hedef kayda DELETE gönderir; başarıda mesaj ve liste yenileme, hatada pencere içi hata üretir. finally bloğu bekleme durumunu kapatır. Bu satır fonksiyon tanımıdır. |
| 95 | `` setDeleting(true); `` | Silme bekleme durumunu başlatır; ilgili düğmeler kapanır. |
| 96 | `` setDeleteError(null); `` | Önceki silme hatasını temizler. |
| 98 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 99 | `` await auth.authRequest(`/api/v1/posts/${deleteTarget.id}`, { `` | Seçilen yazının id’sine yetkili silme isteğini hazırlayıp bekler. |
| 100 | `` method: "DELETE", `` | HTTP yöntemini silme için DELETE seçer. |
| 101 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 103 | `` setNotice(`"${deleteTarget.title}" silindi.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 104 | `` setDeleteTarget(null); `` | Silme hedefini kaldırır; modal kapanır. |
| 105 | `` posts.reload(); `` | posts hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 106 | `` } catch (deleteFailure) { `` | İşlemden fırlatılan hatayı deleteFailure adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 107 | `` setDeleteError(deleteFailure); `` | Yakalanan deleteFailure nesnesini silme modalının hata alanına yazar. |
| 108 | `` } finally { `` | Başarı veya hatadan bağımsız olarak bekleme state’ini temizleyecek bloğu başlatır. |
| 109 | `` setDeleting(false); `` | Silme bekleme durumunu bitirir; düğmeler tekrar kullanılabilir olur. |
| 110 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 111 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 113 | `` async function handleRestore(post) { `` | Seçilen kaydın restore ucuna PATCH gönderir; başarıda mesajı ve listeyi, hatada actionError’ı günceller. Bu satır fonksiyon tanımıdır. |
| 114 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 115 | `` setActionError(null); `` | Önceki satır işlemi hatasını temizler. |
| 117 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 118 | `` await auth.authRequest(`/api/v1/posts/${post.id}/restore`, { `` | Yazının restore ucuna yetkili geri getirme isteğini hazırlayıp bekler. |
| 119 | `` method: "PATCH", `` | HTTP yöntemini kısmi güncelleme için PATCH seçer. |
| 120 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 122 | `` setNotice(`"${post.title}" geri getirildi.`); `` | İşlem gören kaydın adını/başlığını içeren başarı mesajını state’e yazar. |
| 123 | `` posts.reload(); `` | posts hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 124 | `` } catch (restoreError) { `` | İşlemden fırlatılan hatayı restoreError adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 125 | `` setActionError(restoreError); `` | Yakalanan restoreError nesnesini sayfanın işlem hata alanına yazar. |
| 126 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 127 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 129 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 130 | `` <section> `` | Sayfa/bölüm kapsayıcısını açar. |
| 131 | `` <title>Yazılar · Yönetim · Node Blog</title> `` | React’in belge başlığı olarak işleyeceği sayfa başlığını üretir. |
| 132 | `` <h1 className="page-title">Bütün yazılar</h1> `` | Sayfanın görünür ana başlığını ortak page-title stiliyle gösterir. |
| 134 | `` <div className="toolbar"> `` | Arama, filtre ve kayıt sayısı kontrollerini ortak esnek araç çubuğuna yerleştirir. |
| 135 | `` <input `` | Kullanıcı girişi kontrolünü açar. |
| 136 | `` type="search" `` | Arama amaçlı kontrollü input türünü seçer. |
| 137 | `` aria-label="Yazı ara" `` | Kontrolün erişilebilir adını “Yazı ara” olarak belirler. |
| 138 | `` placeholder="Başlık veya özet" `` | Alan boşken gösterilecek örnek/ipucu metnini “Başlık veya özet” olarak belirler. |
| 139 | `` value={search} `` | Arama input’unu anlık search state’ine bağlar. |
| 140 | `` onChange={handleSearchChange} `` | Arama değişimini metin güncelleme ve sayfa sıfırlama işleyicisine verir. |
| 141 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 143 | `` <label className="checkbox-field"> `` | Checkbox ile Silinenleri göster metnini tek label içinde ilişkilendirir; metne tıklamak da seçimi değiştirir. |
| 144 | `` <input `` | Kullanıcı girişi kontrolünü açar. |
| 145 | `` type="checkbox" `` | Boolean seçim kutusu türünü seçer. |
| 146 | `` checked={showDeleted} `` | Checkbox’ı showDeleted state’iyle kontrollü yapar. |
| 147 | `` onChange={handleShowDeletedChange} `` | Silinenler filtresini ve sayfa numarasını birlikte güncelleyen işleyiciyi bağlar. |
| 148 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 149 | `` Silinenleri göster `` | Bağlantı/düğme/seçim kutusunda görünen “Silinenleri göster” metnidir. |
| 150 | `` </label> `` | label elementinin/bileşeninin içeriğini kapatır. |
| 151 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 153 | `` <nav className="category-filter" aria-label="Durum"> `` | Durum filtresi düğmelerini ortak filtre stili ve Durum erişilebilir adıyla gruplar. |
| 154 | `` {STATUS_FILTERS.map((filter) => ( `` | Sabit filtre seçeneklerini tek tek gezerek seçili durumu izlenen chip düğmeleri oluşturur. |
| 155 | `` <button `` | Eylem düğmesini açar. |
| 156 | `` key={filter.label} `` | Filtre düğmelerini sabit etiketleriyle anahtarlar. |
| 157 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 158 | `` className="chip" `` | Görünümü belirleyen CSS sınıfını “chip” olarak belirler. |
| 159 | `` aria-pressed={status === filter.value} `` | Yazı durum çipinin seçili durumunu bildirir. |
| 160 | `` onClick={() => handleStatusChange(filter.value)} `` | Tıklanan durum seçeneğini uygular ve yazı sayfasını 1’e döndürür. |
| 161 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 162 | `` {filter.label} `` | Filtre seçeneğinin kullanıcıya görünen etiketini basar. |
| 163 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 164 | `` ))} `` | map callback’inin JSX’ini, map çağrısını ve JSX ifadesini kapatır. |
| 165 | `` </nav> `` | nav elementinin/bileşeninin içeriğini kapatır. |
| 167 | `` {notice && <StatusMessage>{notice}</StatusMessage>} `` | Başarı/bilgi mesajı varsa ortak bilgi görünümünde gösterir. |
| 169 | `` {actionError && ( `` | actionError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 170 | `` <StatusMessage type="error">{actionError.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 171 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 173 | `` {posts.loading && ( `` | Liste yüklenirken bekleme mesajını koşullu gösterir. |
| 174 | `` <StatusMessage>Yazılar yükleniyor...</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 175 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 177 | `` {posts.error && ( `` | Liste isteği başarısızsa hata mesajını koşullu gösterir. |
| 178 | `` <StatusMessage type="error">{posts.error.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 179 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 181 | `` {posts.data?.length === 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; boş dizi geldiyse boş sonuç mesajını gösterir. |
| 182 | `` <StatusMessage>Bu listede yazı yok.</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 183 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 185 | `` {posts.data?.length > 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; en az bir kayıt varsa tabloyu gösterir. |
| 186 | `` <> `` | Ek DOM elementi üretmeden birden fazla JSX öğesini gruplayan Fragment açar. |
| 187 | `` <table className="post-table"> `` | Ortak post-table görünümündeki tabloyu açar. |
| 188 | `` <thead> `` | Tablonun başlık bölümünü açar. |
| 189 | `` <tr> `` | Tablo satırını açar. |
| 190 | `` <th>Başlık</th> `` | Tabloda Başlık sütununun sabit başlığını gösterir. |
| 191 | `` <th>Yazar</th> `` | Tabloda Yazar sütununun sabit başlığını gösterir. |
| 192 | `` <th>Kategori</th> `` | Tabloda Kategori sütununun sabit başlığını gösterir. |
| 193 | `` <th>Durum</th> `` | Tabloda Durum sütununun sabit başlığını gösterir. |
| 194 | `` <th>Güncelleme</th> `` | Tabloda Güncelleme sütununun sabit başlığını gösterir. |
| 195 | `` <th>İşlem</th> `` | Tabloda İşlem sütununun sabit başlığını gösterir. |
| 196 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 197 | `` </thead> `` | thead elementinin/bileşeninin içeriğini kapatır. |
| 199 | `` <tbody> `` | Tablonun kayıtlar bölümünü açar. |
| 200 | `` {posts.data.map((post) => ( `` | posts listesindeki her kaydı post adıyla alıp ilgili satır bileşenine dönüştürür. |
| 201 | `` <AdminPostRow `` | Yazı tablo satırını bu konuma yerleştirir. |
| 202 | `` key={post.id} `` | Yazı satırının React kimliğini yazı id’siyle sabitler. |
| 203 | `` post={post} `` | Satıra bu yazının API kaydını geçirir. |
| 204 | `` onDelete={askDelete} `` | Satıra silme isteği yerine önce onay penceresini açacak callback’i verir. |
| 205 | `` onRestore={handleRestore} `` | Satıra restore isteğini gönderen callback’i verir. |
| 206 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 207 | `` ))} `` | map callback’inin JSX’ini, map çağrısını ve JSX ifadesini kapatır. |
| 208 | `` </tbody> `` | tbody elementinin/bileşeninin içeriğini kapatır. |
| 209 | `` </table> `` | table elementinin/bileşeninin içeriğini kapatır. |
| 211 | `` <Pagination `` | Sayfalama kontrolünü bu konuma yerleştirir. |
| 212 | `` page={page} `` | Pagination’a geçerli sayfa numarasını verir. |
| 213 | `` totalPages={posts.meta.total_pages} `` | Yazı API metadata’sındaki toplam sayfa sayısını Pagination’a verir. |
| 214 | `` onPageChange={setPage} `` | Pagination’ın seçtiği numarayı sayfa state’ine doğrudan yazar. |
| 215 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 216 | `` </> `` | Fragment grubunu kapatır. |
| 217 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 219 | `` <ConfirmDialog `` | Onay penceresini bu konuma yerleştirir. |
| 220 | `` open={deleteTarget !== null} `` | Silme hedefi varken modalın açılmasını ister. |
| 221 | `` title="Yazıyı sil" `` | Modal başlığını “Yazıyı sil” olarak belirler. |
| 222 | `` confirmLabel="Sil" `` | Normal onay düğmesi metnini “Sil” olarak belirler. |
| 223 | `` danger `` | ConfirmDialog’un tehlikeli işlem stilini true yapar. |
| 224 | `` busy={deleting} `` | Silme isteği süresini modal bekleme görünümüne bağlar. |
| 225 | `` onConfirm={handleDelete} `` | Modal onayını seçilen kaydın DELETE isteğine bağlar. |
| 226 | `` onClose={closeDeleteDialog} `` | Modal kapanışını silme hedefi ve hata temizliğiyle eşler. |
| 227 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 228 | `` <p> `` | Açıklama paragrafını açar. |
| 229 | `` "{deleteTarget?.title}" silinecek. Yazarı da sen de `` | Yazı silme onayının açıklama metnidir; yazarın silinenleri listeleyebileceği iddiası mevcut yetki kuralıyla çelişir (dosya notuna bak). |
| 230 | `` "Silinenleri göster" ile geri getirebilirsiniz. `` | Yazı silme onayının açıklama metnidir; yazarın silinenleri listeleyebileceği iddiası mevcut yetki kuralıyla çelişir (dosya notuna bak). |
| 231 | `` </p> `` | p elementinin/bileşeninin içeriğini kapatır. |
| 233 | `` {deleteError && ( `` | deleteError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 234 | `` <StatusMessage type="error">{deleteError.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 235 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 236 | `` </ConfirmDialog> `` | ConfirmDialog elementinin/bileşeninin içeriğini kapatır. |
| 237 | `` </section> `` | section elementinin/bileşeninin içeriğini kapatır. |
| 238 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 239 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |

### AdminUsersPage.jsx

**Dosya:** [src/pages/admin/AdminUsersPage.jsx](../src/pages/admin/AdminUsersPage.jsx)

**Değişiklik:** Yeni dosya.

Başlangıç sırası created_at desc, sayfa boyutu 20’dir. Rol ve aktiflik değişiklikleri aynı modalda onaylanır. pendingChange veri, dialog ise ondan türetilen görünüm bilgisidir. Başarı message alanından gelir. Bu sayfa kullanıcı silme/geri getirme içermez; oturumdaki auth.user kopyasını da yenilemez.

**Fonksiyonların görevleri**

- `buildUsersPath`: Arama, aktiflik, sıralama ve sayfalamayı kullanıcı liste adresine ekler; rol sorgu parametresi üretmez.
- `describeChange`: Bekleyen kullanıcı/alan/değer nesnesinden dört işlem için uygun onay başlığını ve açıklamasını üretir; HTTP isteği göndermez.
- `buildChangeRequest`: Rol için /users/:id/role ve role gövdesini, aktiflik için /users/:id ve is_active gövdesini seçer.
- `AdminUsersPage`: 20 kayıtlık kullanıcı listesi, arama, aktiflik filtresi, sıralama ve modal onaylı rol/aktiflik değişikliklerini birleştirir.
- `handleSearchChange`: Arama input’unu hemen günceller ve sayfayı 1’e alır; arama metninin API adresine geçişi debounce ile gecikir.
- `handleActiveChange`: Kullanıcı aktiflik filtresini null, 1 veya 0 olarak değiştirir ve sayfayı 1’e döndürür.
- `handleSort`: Yeni sütunu asc ile seçer; aynı sütunun yönünü asc/desc arasında çevirir. Kullanıcı sayfasında ayrıca sayfa numarasını 1 yapar.
- `askChange`: Eski mesaj ve hatayı temizler; kullanıcı, alan ve hedef değeri pendingChange olarak tutarak modalı açar.
- `closeDialog`: Bekleyen kullanıcı değişikliğini ve hatasını temizleyerek onay penceresini kapatır.
- `handleConfirm`: pendingChange’den hedef adres ve gövdeyi türetir; PATCH başarılıysa API mesajını kullanıcı adıyla gösterir ve listeyi yeniler, başarısızsa modal içinde hata tutar.

**Satır satır açıklama**

| Satır | Kod | Açıklama |
| --- | --- | --- |
| 1 | `` import { useState } from "react"; `` | İçeri alır: useState — bileşene ait state. |
| 2 | `` import useAuth from "../../auth/useAuth.js"; `` | İçeri alır: useAuth — AuthContext kullanıcı ve istek fonksiyonları. |
| 3 | `` import SortableHeader from "../../components/admin/SortableHeader.jsx"; `` | İçeri alır: SortableHeader — sıralanabilir tablo başlığı. |
| 4 | `` import UserRow from "../../components/admin/UserRow.jsx"; `` | İçeri alır: UserRow — kullanıcı tablo satırı. |
| 5 | `` import ConfirmDialog from "../../components/ConfirmDialog.jsx"; `` | İçeri alır: ConfirmDialog — ortak modal onay penceresi. |
| 6 | `` import Pagination from "../../components/Pagination.jsx"; `` | İçeri alır: Pagination — önceki/sonraki sayfa kontrolü. |
| 7 | `` import StatusMessage from "../../components/StatusMessage.jsx"; `` | İçeri alır: StatusMessage — ortak bilgi/hata görünümü. |
| 8 | `` import useApi from "../../hooks/useApi.js"; `` | İçeri alır: useApi — veri/hata/yüklenme ve yenileme yönetimi. |
| 9 | `` import useDebouncedValue from "../../hooks/useDebouncedValue.js"; `` | İçeri alır: useDebouncedValue — gecikmeli arama değeri. |
| 11 | `` const PAGE_SIZE = 20; `` | Bu listenin her isteğinde en fazla 20 kayıt istenmesini belirler. |
| 12 | `` const SEARCH_DELAY = 400; `` | Arama metninin yerleşmesi için bekleme süresini 400 milisaniye yapar. |
| 14 | `` const ACTIVE_FILTERS = [ `` | Kullanıcı aktiflik çiplerinin değer/etiket listesini açar. |
| 15 | `` { value: null, label: "Tümü" }, `` | Filtre parametresini kaldıran Tümü seçeneğini tanımlar. |
| 16 | `` { value: 1, label: "Aktif" }, `` | is_active=1 gönderecek Aktif seçeneğini tanımlar. |
| 17 | `` { value: 0, label: "Pasif" }, `` | is_active=0 gönderecek Pasif seçeneğini tanımlar. |
| 18 | `` ]; `` | Sabit seçenek dizisini kapatır. |
| 20 | `` function buildUsersPath({ search, active, sort, page }) { `` | Arama, aktiflik, sıralama ve sayfalamayı kullanıcı liste adresine ekler; rol sorgu parametresi üretmez. Bu satır fonksiyon tanımıdır. |
| 21 | `` const params = new URLSearchParams({ `` | Sorgu parametrelerini URL kodlamasıyla oluşturacak nesneyi başlatır. |
| 22 | `` sort_by: sort.by, `` | Seçili sütun adını API’nin sort_by parametresine yazar. |
| 23 | `` sort_order: sort.order, `` | asc/desc yönünü sort_order parametresine yazar. |
| 24 | `` page: String(page), `` | Sayfa numarasını sorguya uygun metne çevirir. |
| 25 | `` limit: String(PAGE_SIZE), `` | Sayfa boyutunu sorgu parametresi için metne çevirir. |
| 26 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 28 | `` if (search !== "") { `` | Boş aramada search parametresini eklememek için koşulu denetler. |
| 29 | `` params.set("search", search); `` | Yerleşmiş arama metnini search parametresine ekler; URLSearchParams kodlamayı yapar. |
| 30 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 32 | `` if (active !== null) { `` | Aktiflik seçimini açık null karşılaştırmasıyla kontrol eder; 0/Pasif de geçerli filtredir. |
| 33 | `` params.set("is_active", String(active)); `` | Aktiflik değerini 0 veya 1 metni olarak sorguya yazar. |
| 34 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 36 | `` return `/api/v1/users?${params}`; `` | Kodlanmış sorgu parametrelerini /api/v1/users yoluna ekleyerek GET adresini döndürür. |
| 37 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 39 | `` function describeChange({ user, field, value }) { `` | Bekleyen kullanıcı/alan/değer nesnesinden dört işlem için uygun onay başlığını ve açıklamasını üretir; HTTP isteği göndermez. Bu satır fonksiyon tanımıdır. |
| 40 | `` if (field === "role" && value === "admin") { `` | İşlem bir kullanıcıyı admin yapacaksa bu özel açıklama kolunu seçer. |
| 41 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 42 | `` title: "Yönetici yap", `` | Bu kullanıcı işleminin modal başlığını belirler. |
| 43 | `` text: `${user.name} kategorileri, bütün yazıları ve kullanıcıları yönetebilecek.`, `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 44 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 45 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 47 | `` if (field === "role") { `` | İşlem rol değişikliği ise ilgili rol kolunu seçer. |
| 48 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 49 | `` title: "Yöneticilikten çıkar", `` | Bu kullanıcı işleminin modal başlığını belirler. |
| 50 | `` text: `${user.name} yönetim paneline erişemeyecek.`, `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 51 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 52 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 54 | `` if (value === 0) { `` | Rol dışındaki işlemde hedef değer 0 ise pasifleştirme açıklamasını seçer. |
| 55 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 56 | `` title: "Hesabı pasifleştir", `` | Bu kullanıcı işleminin modal başlığını belirler. |
| 57 | `` text: `${user.name} giriş yapamayacak; açık oturumları bir sonraki istekte kapanacak.`, `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 58 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 59 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 61 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 62 | `` title: "Hesabı aktifleştir", `` | Bu kullanıcı işleminin modal başlığını belirler. |
| 63 | `` text: `${user.name} yeniden giriş yapabilecek.`, `` | Bu hata/işlem koluna ait kullanıcıya gösterilecek açıklama metnini tanımlar. |
| 64 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 65 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 67 | `` function buildChangeRequest({ user, field, value }) { `` | Rol için /users/:id/role ve role gövdesini, aktiflik için /users/:id ve is_active gövdesini seçer. Bu satır fonksiyon tanımıdır. |
| 68 | `` if (field === "role") { `` | İşlem rol değişikliği ise ilgili rol kolunu seçer. |
| 69 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 70 | `` path: `/api/v1/users/${user.id}/role`, `` | Rol değişikliğini kullanıcı kimliğinin role alt ucuna yönlendirir. |
| 71 | `` body: { role: value }, `` | Yeni rolü tek alanlı istek gövdesine koyar. |
| 72 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 73 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 75 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 76 | `` path: `/api/v1/users/${user.id}`, `` | Aktiflik değişikliğini normal kullanıcı güncelleme ucuna yönlendirir. |
| 77 | `` body: { is_active: value }, `` | Yeni sayısal aktifliği tek alanlı istek gövdesine koyar. |
| 78 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 79 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 81 | `` export default function AdminUsersPage() { `` | 20 kayıtlık kullanıcı listesi, arama, aktiflik filtresi, sıralama ve modal onaylı rol/aktiflik değişikliklerini birleştirir. Bu satır fonksiyon tanımıdır. |
| 82 | `` const auth = useAuth(); `` | Oturum Context’inden kullanıcı bilgisini ve authRequest dahil yardımcıları alır. |
| 83 | `` const [search, setSearch] = useState(""); `` | search state’ini ve setSearch setter’ını kurar: anlık arama metni; boş metinle başlar. Başlangıç ifadesi: "". |
| 84 | `` const [active, setActive] = useState(null); `` | active state’ini ve setActive setter’ını kurar: kullanıcı aktiflik filtresi; null tümünü seçer. Başlangıç ifadesi: null. |
| 85 | `` const [sort, setSort] = useState({ by: "created_at", order: "desc" }); `` | sort state’ini ve setSort setter’ını kurar: sıralama sütunu ve yönü. Başlangıç ifadesi: { by: "created_at", order: "desc" }. |
| 86 | `` const [page, setPage] = useState(1); `` | page state’ini ve setPage setter’ını kurar: sayfa numarası; 1’den başlar. Başlangıç ifadesi: 1. |
| 87 | `` const [notice, setNotice] = useState(null); `` | notice state’ini ve setNotice setter’ını kurar: başarı veya bilgi mesajı; başlangıçta null. Başlangıç ifadesi: null. |
| 88 | `` const [pendingChange, setPendingChange] = useState(null); `` | pendingChange state’ini ve setPendingChange setter’ını kurar: { user, field, value } onay önerisi; null iken modal kapalı. Başlangıç ifadesi: null. |
| 89 | `` const [changeError, setChangeError] = useState(null); `` | changeError state’ini ve setChangeError setter’ını kurar: rol/aktiflik onay penceresinin hatası. Başlangıç ifadesi: null. |
| 90 | `` const [saving, setSaving] = useState(false); `` | saving state’ini ve setSaving setter’ını kurar: kullanıcı PATCH isteğinin sürüp sürmediği. Başlangıç ifadesi: false. |
| 92 | `` const debouncedSearch = useDebouncedValue( `` | Arama kutusundan ayrı, gecikmeli sorgu değerini elde etmeye başlar. |
| 93 | `` search.trim(), `` | Aramanın başındaki/sonundaki boşlukları temizleyip debounce girdisi yapar. |
| 94 | `` SEARCH_DELAY `` | Hook’a 400 ms gecikmeyi geçirir. |
| 95 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 97 | `` const users = useApi( `` | users listesi için veri, metadata, loading, error ve yenileme yardımcılarını elde etmeye başlar. |
| 98 | `` buildUsersPath({ search: debouncedSearch, active, sort, page }), `` | Kullanıcı GET adresini gecikmeli arama, aktiflik, sıralama ve sayfadan üretir. |
| 99 | `` auth.authRequest `` | GET’i token ve merkezi oturum hatası yönetimi olan istek fonksiyonuyla yaptırır. |
| 100 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 102 | `` function handleSearchChange(event) { `` | Arama input’unu hemen günceller ve sayfayı 1’e alır; arama metninin API adresine geçişi debounce ile gecikir. Bu satır fonksiyon tanımıdır. |
| 103 | `` setSearch(event.target.value); `` | Input’taki yeni arama metnini hemen state’e yazar. |
| 104 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 105 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 107 | `` function handleActiveChange(nextActive) { `` | Kullanıcı aktiflik filtresini null, 1 veya 0 olarak değiştirir ve sayfayı 1’e döndürür. Bu satır fonksiyon tanımıdır. |
| 108 | `` setActive(nextActive); `` | Seçilen kullanıcı aktiflik filtresini 1, 0 veya null olarak saklar. |
| 109 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 110 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 112 | `` function handleSort(field) { `` | Yeni sütunu asc ile seçer; aynı sütunun yönünü asc/desc arasında çevirir. Kullanıcı sayfasında ayrıca sayfa numarasını 1 yapar. Bu satır fonksiyon tanımıdır. |
| 113 | `` setPage(1); `` | Filtre/sıralama değişince mevcut olay içinde ilk sayfaya döner; ayrı effect beklemez. |
| 114 | `` setSort((current) => { `` | Yeni sıralamayı en güncel önceki state üzerinden hesaplayan setter’ı başlatır. |
| 115 | `` if (current.by !== field) { `` | Başka sütuna geçiliyorsa önceki yönü kullanmamak için ayırır. |
| 116 | `` return { by: field, order: "asc" }; `` | Yeni sütunu artan sıralamayla seçer. |
| 117 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 119 | `` return { `` | Fonksiyon sonucunu taşıyan nesneyi oluşturmaya başlar. |
| 120 | `` by: field, `` | Yeni sıralama nesnesinde tıklanan sütunu korur. |
| 121 | `` order: current.order === "asc" ? "desc" : "asc", `` | Aynı sütunun yönünü artandan azalana veya tersine çevirir. |
| 122 | `` }; `` | Nesne ifadesini/return nesnesini kapatıp deyimi bitirir. |
| 123 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 124 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 126 | `` function askChange(change) { `` | Eski mesaj ve hatayı temizler; kullanıcı, alan ve hedef değeri pendingChange olarak tutarak modalı açar. Bu satır fonksiyon tanımıdır. |
| 127 | `` setNotice(null); `` | Önceki başarı/bilgi mesajını temizler. |
| 128 | `` setChangeError(null); `` | Önceki kullanıcı değişikliği hatasını temizler. |
| 129 | `` setPendingChange(change); `` | Kullanıcı/alan/değer önerisini saklayarak onay modalını açar. |
| 130 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 132 | `` function closeDialog() { `` | Bekleyen kullanıcı değişikliğini ve hatasını temizleyerek onay penceresini kapatır. Bu satır fonksiyon tanımıdır. |
| 133 | `` setPendingChange(null); `` | Bekleyen kullanıcı değişikliğini kaldırır; modal kapanır. |
| 134 | `` setChangeError(null); `` | Önceki kullanıcı değişikliği hatasını temizler. |
| 135 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 137 | `` async function handleConfirm() { `` | pendingChange’den hedef adres ve gövdeyi türetir; PATCH başarılıysa API mesajını kullanıcı adıyla gösterir ve listeyi yeniler, başarısızsa modal içinde hata tutar. Bu satır fonksiyon tanımıdır. |
| 138 | `` const { user } = pendingChange; `` | Onaylanan işlem nesnesinden hedef kullanıcıyı alır. |
| 139 | `` const { path, body } = buildChangeRequest(pendingChange); `` | İşlem türünden doğru endpoint ve tek alanlı gövdeyi türetir. |
| 141 | `` setSaving(true); `` | Kullanıcı güncelleme bekleme durumunu başlatır; ilgili düğmeler kapanır. |
| 142 | `` setChangeError(null); `` | Önceki kullanıcı değişikliği hatasını temizler. |
| 144 | `` try { `` | Başarısız olabilecek async işlemler için hata yakalanacak bloğu açar. |
| 145 | `` const { message } = await auth.authRequest(path, { `` | Yetkili PATCH isteğini bekleyip API’nin başarı mesajını alır. |
| 146 | `` method: "PATCH", `` | HTTP yöntemini kısmi güncelleme için PATCH seçer. |
| 147 | `` body, `` | Önceden türetilen role veya is_active nesnesini istek gövdesi olarak verir. |
| 148 | `` }); `` | Callback/nesne tanımını ve onu alan fonksiyon çağrısını kapatır. |
| 150 | `` setNotice(`${user.name}: ${message}`); `` | Başarı mesajını hedef kullanıcının adı ve API mesajıyla oluşturur. |
| 151 | `` setPendingChange(null); `` | Bekleyen kullanıcı değişikliğini kaldırır; modal kapanır. |
| 152 | `` users.reload(); `` | users hook’unun version değerini artırarak mevcut filtrelerle yeni liste isteğini tetikler. |
| 153 | `` } catch (saveError) { `` | İşlemden fırlatılan hatayı saveError adıyla yakalar; sonraki satırda uygun hata state’ine yazılır. |
| 154 | `` setChangeError(saveError); `` | Yakalanan saveError nesnesini kullanıcı değişikliği modalının hata alanına yazar. |
| 155 | `` } finally { `` | Başarı veya hatadan bağımsız olarak bekleme state’ini temizleyecek bloğu başlatır. |
| 156 | `` setSaving(false); `` | Kullanıcı güncelleme bekleme durumunu bitirir; düğmeler tekrar kullanılabilir olur. |
| 157 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 158 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |
| 160 | `` const dialog = pendingChange ? describeChange(pendingChange) : null; `` | Bekleyen işlem varsa başlık/metin türetir, yoksa null kullanır; ek state oluşturmaz. |
| 162 | `` return ( `` | Bileşenin döndüreceği JSX ağacını başlatır. |
| 163 | `` <section> `` | Sayfa/bölüm kapsayıcısını açar. |
| 164 | `` <title>Kullanıcılar · Yönetim · Node Blog</title> `` | React’in belge başlığı olarak işleyeceği sayfa başlığını üretir. |
| 165 | `` <h1 className="page-title">Kullanıcılar</h1> `` | Sayfanın görünür ana başlığını ortak page-title stiliyle gösterir. |
| 167 | `` <div className="toolbar"> `` | Arama, filtre ve kayıt sayısı kontrollerini ortak esnek araç çubuğuna yerleştirir. |
| 168 | `` <input `` | Kullanıcı girişi kontrolünü açar. |
| 169 | `` type="search" `` | Arama amaçlı kontrollü input türünü seçer. |
| 170 | `` aria-label="Kullanıcı ara" `` | Kontrolün erişilebilir adını “Kullanıcı ara” olarak belirler. |
| 171 | `` placeholder="Ad veya e-posta" `` | Alan boşken gösterilecek örnek/ipucu metnini “Ad veya e-posta” olarak belirler. |
| 172 | `` value={search} `` | Arama input’unu anlık search state’ine bağlar. |
| 173 | `` onChange={handleSearchChange} `` | Arama değişimini metin güncelleme ve sayfa sıfırlama işleyicisine verir. |
| 174 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 176 | `` {users.meta && ( `` | API metadata’sı varsa toplam kayıt bilgisini koşullu gösterir. |
| 177 | `` <span className="form__hint">{users.meta.total} kullanıcı</span> `` | API’nin filtrelenmiş toplam kullanıcı sayısını gösterir; yalnız bu sayfadaki satır sayısı değildir. |
| 178 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 179 | `` </div> `` | div elementinin/bileşeninin içeriğini kapatır. |
| 181 | `` <nav className="category-filter" aria-label="Durum"> `` | Durum filtresi düğmelerini ortak filtre stili ve Durum erişilebilir adıyla gruplar. |
| 182 | `` {ACTIVE_FILTERS.map((filter) => ( `` | Sabit filtre seçeneklerini tek tek gezerek seçili durumu izlenen chip düğmeleri oluşturur. |
| 183 | `` <button `` | Eylem düğmesini açar. |
| 184 | `` key={filter.label} `` | Filtre düğmelerini sabit etiketleriyle anahtarlar. |
| 185 | `` type="button" `` | Düğmenin formu göndermesini önler; yalnız click callback’i çalışır. |
| 186 | `` className="chip" `` | Görünümü belirleyen CSS sınıfını “chip” olarak belirler. |
| 187 | `` aria-pressed={active === filter.value} `` | Kullanıcı aktiflik çipinin seçili durumunu yardımcı teknolojilere bildirir. |
| 188 | `` onClick={() => handleActiveChange(filter.value)} `` | Tıklanan aktiflik seçeneğini uygular ve kullanıcı sayfasını 1’e döndürür. |
| 189 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 190 | `` {filter.label} `` | Filtre seçeneğinin kullanıcıya görünen etiketini basar. |
| 191 | `` </button> `` | button elementinin/bileşeninin içeriğini kapatır. |
| 192 | `` ))} `` | map callback’inin JSX’ini, map çağrısını ve JSX ifadesini kapatır. |
| 193 | `` </nav> `` | nav elementinin/bileşeninin içeriğini kapatır. |
| 195 | `` {notice && <StatusMessage>{notice}</StatusMessage>} `` | Başarı/bilgi mesajı varsa ortak bilgi görünümünde gösterir. |
| 197 | `` {users.loading && ( `` | Liste yüklenirken bekleme mesajını koşullu gösterir. |
| 198 | `` <StatusMessage>Kullanıcılar yükleniyor...</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 199 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 201 | `` {users.error && ( `` | Liste isteği başarısızsa hata mesajını koşullu gösterir. |
| 202 | `` <StatusMessage type="error">{users.error.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 203 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 205 | `` {users.data?.length === 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; boş dizi geldiyse boş sonuç mesajını gösterir. |
| 206 | `` <StatusMessage>Bu listede kullanıcı yok.</StatusMessage> `` | Ortak bilgi/yüklenme/boş sonuç görünümünü kullanır; StatusMessage varsayılan olarak role=status üretir. |
| 207 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 209 | `` {users.data?.length > 0 && ( `` | Veri null olsa da optional chaining ile güvenle bakar; en az bir kayıt varsa tabloyu gösterir. |
| 210 | `` <> `` | Ek DOM elementi üretmeden birden fazla JSX öğesini gruplayan Fragment açar. |
| 211 | `` <table className="post-table"> `` | Ortak post-table görünümündeki tabloyu açar. |
| 212 | `` <thead> `` | Tablonun başlık bölümünü açar. |
| 213 | `` <tr> `` | Tablo satırını açar. |
| 214 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 215 | `` label="Ad" `` | Görünür alan/sütun etiketini “Ad” olarak belirler. |
| 216 | `` field="name" `` | Sıralamada API’ye gönderilecek sütun adını “name” olarak belirler. |
| 217 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 218 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 219 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 220 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 221 | `` label="E-posta" `` | Görünür alan/sütun etiketini “E-posta” olarak belirler. |
| 222 | `` field="email" `` | Sıralamada API’ye gönderilecek sütun adını “email” olarak belirler. |
| 223 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 224 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 225 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 226 | `` <th>Rol</th> `` | Tabloda Rol sütununun sabit başlığını gösterir. |
| 227 | `` <th>Durum</th> `` | Tabloda Durum sütununun sabit başlığını gösterir. |
| 228 | `` <SortableHeader `` | Sıralanabilir sütun başlığını bu konuma yerleştirir. |
| 229 | `` label="Kayıt" `` | Görünür alan/sütun etiketini “Kayıt” olarak belirler. |
| 230 | `` field="created_at" `` | Sıralamada API’ye gönderilecek sütun adını “created_at” olarak belirler. |
| 231 | `` sort={sort} `` | Başlığa mevcut sıralama sütununu ve yönünü geçirir. |
| 232 | `` onSort={handleSort} `` | Başlık düğmesini sayfanın sıralama state’ine bağlar. |
| 233 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 234 | `` <th>İşlem</th> `` | Tabloda İşlem sütununun sabit başlığını gösterir. |
| 235 | `` </tr> `` | tr elementinin/bileşeninin içeriğini kapatır. |
| 236 | `` </thead> `` | thead elementinin/bileşeninin içeriğini kapatır. |
| 238 | `` <tbody> `` | Tablonun kayıtlar bölümünü açar. |
| 239 | `` {users.data.map((user) => ( `` | users listesindeki her kaydı user adıyla alıp ilgili satır bileşenine dönüştürür. |
| 240 | `` <UserRow `` | Kullanıcı tablo satırını bu konuma yerleştirir. |
| 241 | `` key={user.id} `` | Kullanıcı satırının React kimliğini kullanıcı id’siyle sabitler. |
| 242 | `` user={user} `` | Satıra bu kullanıcının API kaydını geçirir. |
| 243 | `` isSelf={user.id === auth.user.id} `` | Satır kimliğini oturum kullanıcısıyla karşılaştırıp kendi hesap korumasını geçirir. |
| 244 | `` onChange={askChange} `` | Satırdan gelen kullanıcı değişikliği önerisini onay penceresine bağlar. |
| 245 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 246 | `` ))} `` | map callback’inin JSX’ini, map çağrısını ve JSX ifadesini kapatır. |
| 247 | `` </tbody> `` | tbody elementinin/bileşeninin içeriğini kapatır. |
| 248 | `` </table> `` | table elementinin/bileşeninin içeriğini kapatır. |
| 250 | `` <Pagination `` | Sayfalama kontrolünü bu konuma yerleştirir. |
| 251 | `` page={page} `` | Pagination’a geçerli sayfa numarasını verir. |
| 252 | `` totalPages={users.meta.total_pages} `` | Kullanıcı API metadata’sındaki toplam sayfa sayısını Pagination’a verir. |
| 253 | `` onPageChange={setPage} `` | Pagination’ın seçtiği numarayı sayfa state’ine doğrudan yazar. |
| 254 | `` /> `` | Props verilen JSX elementini iç içe içerik olmadan kapatır. |
| 255 | `` </> `` | Fragment grubunu kapatır. |
| 256 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 258 | `` <ConfirmDialog `` | Onay penceresini bu konuma yerleştirir. |
| 259 | `` open={pendingChange !== null} `` | Bekleyen kullanıcı değişikliği varken modalın açılmasını ister. |
| 260 | `` title={dialog?.title} `` | Türetilen kullanıcı işlemi başlığını verir; işlem yokken undefined olur. |
| 261 | `` confirmLabel="Onayla" `` | Normal onay düğmesi metnini “Onayla” olarak belirler. |
| 262 | `` busy={saving} `` | Kullanıcı güncelleme isteği süresini modal bekleme görünümüne bağlar. |
| 263 | `` onConfirm={handleConfirm} `` | Modal onayını rol/aktiflik için uygun PATCH isteğine bağlar. |
| 264 | `` onClose={closeDialog} `` | Modal kapanışını pendingChange ve changeError temizliğiyle eşler. |
| 265 | `` > `` | Çok satırlı açılış etiketini bitirip element içeriğine geçer. |
| 266 | `` <p>{dialog?.text}</p> `` | Bekleyen kullanıcı işleminin açıklamasını gösterir; dialog null ise metin üretmez. |
| 268 | `` {changeError && ( `` | changeError varsa ilgili hata mesajını render eder; null ise alan gösterilmez. |
| 269 | `` <StatusMessage type="error">{changeError.message}</StatusMessage> `` | Ortak hata mesajı bileşenini kullanır; role=alert ile hatayı erişilebilir kılar; içindeki hata mesajını gösterir. |
| 270 | `` )} `` | Koşullu JSX ifadesinin parantezini ve süslü parantezini kapatır. |
| 271 | `` </ConfirmDialog> `` | ConfirmDialog elementinin/bileşeninin içeriğini kapatır. |
| 272 | `` </section> `` | section elementinin/bileşeninin içeriğini kapatır. |
| 273 | `` ); `` | Çok satırlı fonksiyon çağrısını veya parantezli return ifadesini tamamlar. |
| 274 | `` } `` | İçinde bulunulan JavaScript bloğunu veya JSX içindeki ifade bloğunu kapatır. |


## 7. Proje kökü

README yeni yönetim akışlarının kullanımını ve sınırlarını belgeledi. Yeni paket veya backend kodu eklenmedi; `package.json` ve kilit dosyası son committen bu yana değişmedi.

### README.md

**Dosya:** [README.md](../README.md)

**Değişiklik:** Mevcut belge güncellendi. JavaScript fonksiyonu içermez; aşağıdaki satırlar yeni uygulama davranışlarını açıklar.

| Güncel satır | Bölüm / içerik | Değişikliğin açıklaması |
| --- | --- | --- |
| 46 | RequireAdmin | Oturum kontrolünden sonraki rol kapısının dosyasını ve görevini tanıtır. |
| 47 | AdminLayout | Sekmeler, Outlet ve Suspense yerleşiminin ortak dosyasını tanıtır. |
| 48 | ConfirmDialog | Modal açılan ortak onay penceresini tanıtır. |
| 49 | components/admin | Sıralanabilir başlık, kategori formu ve üç tablo satırının yönetim alanına özel olduğunu açıklar. |
| 51 | useDebouncedValue | Gecikmeli arama ve timeout cleanup görevini açıklar. |
| 53 | pages/admin | Üç yönetim sayfasının lazy yüklendiğini belirtir. |
| 55 | slugify | Türkçe karakter dönüşümü ve slug uzunluğu kuralını kaydeder. |
| 56 | category-form | Boş form ve API → form dönüşümünü kaydeder. |
| 57 | category-status | Silinme durumunun aktifliğe göre önceliğini açıklar. |
| 76 | /admin | Kategori GET, POST, PATCH, DELETE ve restore uçlarını; admin kapısını ve lazy yüklemeyi tabloya ekler. |
| 77 | /admin/posts | Yazı listeleme, silinenleri dahil etme, silme ve restore uçlarını tabloya ekler. include_deleted yalnız kutu seçiliyken gönderilir. |
| 78 | /admin/users | Kullanıcı listesi, ayrı role ucu ve aktiflik PATCH ucunu tabloya ekler. |
| 79 | * | Mevcut NotFoundPage satırı kısaltılmış biçimlendirmeyle korunur; yeni bir route davranışı değildir. |
| 109 | Yönetim Paneli başlığı | Üç yeni açıklama paragrafına bölüm açar. |
| 111 | Arayüz/API kapısı | RequireAdmin’in kullanıcı deneyimi olduğunu, gerçek yetkinin API’de bulunduğunu ve rol kopyasının bayatlayabileceğini açıklar. |
| 113 | Kod bölme | Üç yönetim sayfasının ayrı dosyalara ayrıldığını; nav görünürken içeriğin Suspense ile beklediğini açıklar. |
| 115 | İyimser aktiflik | Geçici rozet, başarıda updateData/startTransition ve hatada geri dönüş davranışını anlatır. |
| 119 | Yerel filtreler | Yönetim filtreleri URL’de olmadığı için yenilemede sıfırlandığını belirtir. |
| 120 | Kategori sınırı | İlk 50 kayıt gösterilir, kategori sayfalaması yoktur. |
| 121 | Eksik yönetim araçları | Kullanıcı silme/geri getirme yoktur; yorum moderasyonu yazar panelindedir. |
| 122 | Bayat rol | Başka bir oturumdaki rol değişikliğinin sayfa yenilenene kadar arayüze yansımayabileceğini belirtir. |
| 150 | Restore kategori kontrolü | Silinmiş kategorinin yazısını geri getirmede beklenen 409 kontrolünün eksikliğini kaydeder. |
| 151 | Admin’in kendini kilitlemesi | Rol korumasına rağmen kendini pasifleştirme/silme için API koruması bulunmadığını ve bu işlemin denenmemesi gerektiğini kaydeder. |
| 152 | Kullanıcı sorgu doğrulaması | Bilinmeyen parametrelerin yok sayılmasını, rol filtresi bulunmamasını ve kategori API’siyle farkı kaydeder. |
| 153 | include_deleted | Silinenlerin listeye eklendiğini, yalnız silinenler parametresi bulunmadığını kaydeder. |
| 154 | LIKE jokerleri | Aramadaki yüzde ve alt çizginin literal karakter olarak kaçırılmamasını kaydeder. URL kodlaması SQL LIKE kaçırması değildir. |
| 162 | API öncelikleri | Restore kategori kontrolü, admin koruması, katı kullanıcı sorgusu ve rol filtresini ilk sıraya alır. |
| 163 | Eksik arayüzler | Kullanıcı silme/geri getirme ve admin yorum moderasyonunu sonraki iş olarak ekler. |
| 164 | İşlem kaydı | Kim, neyi, ne zaman değiştirdi bilgisinin tutulmasını planlar. |
| 166 | Diğer API işleri | Eski “dört sorun” sayısını kaldırıp diğer bulgular, refresh token ve httpOnly cookie işlerini korur. |

**Kaldırılan/değiştirilen metin:** Sonraki Adımlar’ın önceki “Admin paneli: kategori yönetimi, silinmiş yazılar ve geri getirme, kullanıcı rolleri” maddesi artık genel olarak yapılacak iş değildir; yerine kalan somut işler geldi. Önceki dört API bulgusu korunmuştur. Buradaki yeni API maddeleri kullanıcı tarafından aktarılan ders bulgularıdır; README düzenlenmesi sunucuda bu sorunların düzeltildiği veya bu oturumda yeniden üretildiği anlamına gelmez.

## 8. notes

Bu klasör çalıştırılan uygulama kodunu içermez; değişikliklerin, ölçümlerin ve öğrenme notlarının kaydını tutar. Bu başlıktaki Markdown belgelerinde fonksiyon bulunmaz.

### daily-summary-04-10-2026.md

**Dosya:** [notes/daily-summary-04-10-2026.md](daily-summary-04-10-2026.md)

**Değişiklik:** Yeni günlük belge.

| Satırlar | Başlık / içerik | Amacı |
| --- | --- | --- |
| 1 | Gün başlığı | Notun 04.10.2026 tarihine ait olduğunu belirtir. |
| 3–23 | Eklediğim Dosyalar | 15 yeni kaynak dosyasını, düzenlenen dosyaları ve yapılmış kontrolleri sıralar. Gün özeti CSS’i de kapsar; bu raporun HEAD farkında CSS yoktur çünkü son commit CSS’i zaten içerir. |
| 25–29 | Arayüz Kapısı ile API Kapısı | Koruma sırasını, render kontrolünü, bayat rol kopyasını ve iki pencereyle canlı test yapılmadığını açıklar. |
| 31–47 | Kod Bölme ve gzip | Build’in dosya boyutlarını kaydeder; ölçümü ağ süresiyle veya birebir önce/sonra kazançla karıştırmaz. |
| 49–53 | Debounce | Cleanup ile eski timeout’un iptalini ve 400 ms beklemeyi anlatır. Sayfa 1’e sıfırlanırken eski aramayla ek istek oluşabileceğini belirtir. |
| 55–59 | key | key kaldırma deneyi yapılmadığını belirtir; farklı JSX konumu ile aynı konumda key değişiminin state etkisini açıklar. |
| 61–65 | İyimser Arayüz | Geçici aktiflik, kalıcı liste güncellemesi ve reload kullanılırsa olası geri titremeyi anlatır; gecikme deneyinin yapılmadığını açıklar. |
| 67–77 | API Sorunları | Kullanıcının bildirdiği beş API bulgusunu canlı deney sonucu olarak sunmadan kaydeder. Mock 409 kontrolünün neyi doğruladığını ayırır. |
| 79–84 | İki Tahmin | Kişisel tahmin/sonuç kaydı kullanıcıdan gelmediği için doldurulacak alan bırakır. |
| 86–88 | Zorlanılan Konu | Kullanıcının gerçek değerlendirmesi için alan ve tekrar başlıkları sunar. |

### last-commit-changes-explained-03-10-2026.md

**Dosya:** [notes/last-commit-changes-explained-03-10-2026.md](last-commit-changes-explained-03-10-2026.md)

**Git durumu:** Bu rapor hazırlanırken dosya izlenmiyordu; dolayısıyla HEAD’den sonraki dosya envanterinde yer alır. Mevcut içeriği bu görevde değiştirilmedi.

Bu belge `18d8ec9` commitini temel alan önceki günün açıklamasıdır. Geri sayım, parola/e-posta akışları, ortak kod alanı, hesap yerleşimi ve oturum güncellemelerini açıklar. İçindeki eski kaynak satır numaraları dünkü anlık görüntüye aittir; bugünkü admin kodunun satır numaraları olarak kullanılmamalıdır. 1–24 satırları kapsam ve özet, 26–1189 kod dosyalarının açıklamaları, 1190–1207 README açıklaması, 1208–1233 günlük not ve birlikte çalışma özetidir. Kendi içindeki geçmiş kod tablolarını burada yeniden kopyalamak yerine dosya bağlantısı korunmuştur.

## Akışlar birlikte nasıl çalışıyor?

1. **Panele giriş:** Header rolü admin ise Yönetim bağlantısını gösterir. App önce RequireAuth, sonra RequireAdmin çalıştırır. İzin verilirse AdminLayout ve eşleşen lazy sayfa render edilir; modül beklerken yalnız içerik alanında yükleme mesajı görünür.
2. **Listeleme:** Sayfa state’inden URLSearchParams ile adres çıkarılır. useApi, auth.authRequest üzerinden isteği yapar. Input anlık search değerini gösterir; sorgudaki search değeri 400 ms gecikmeyle değişir. Sıralama ve checkbox değişimleri gecikmesizdir.
3. **Kategori oluşturma/düzenleme:** CategoryForm values ve changes hesaplar. Yeni kayıtta bütün values POST edilir; düzenlemede changes PATCH edilir. Düzenlenen id değişince key form state’ini yeniden kurar. Başarıda form kapanır ve liste yeniden istenir.
4. **Aktiflik:** CategoryRow geçişte iyimser değeri gösterir. Sayfa PATCH sonrası dönen kaydı aynı geçişte updateData ile listeye koyar. Hata yakalanırsa liste değişmez; geçici state bittiğinde eski rozet geri gelir.
5. **Silme/geri getirme:** Satırdaki Sil yalnız hedefi seçip dialog açar. Onaydan sonra DELETE gider; hatalar pencerenin içinde kalır. Geri getir doğrudan restore PATCH isteği gönderir. Başarıda aynı filtrelerle liste yenilenir.
6. **Kullanıcı işlemi:** UserRow bir değişiklik önerisi üretir. AdminUsersPage bu öneriden hem onay metnini hem endpoint/gövdeyi türetir. PATCH başarı mesajı API’den alınır; listesi yenilenir. Oturumdaki auth.user kopyası bu liste yenilemesiyle değişmez.

## Okurken dikkat edilecek davranış ayrıntıları

- `lazy` normal gezinmede ihtiyaç olmayan admin sayfa kodunu yükletmez; dağıtılan JavaScript dosyasını gizli hale getirmez. Yetki API’de denetlenmelidir.
- Arama sırasında page 2’den 1’e dönülmesi hemen adresi değiştirebilir; ardından debounce dolunca yeni arama ikinci adres değişimini üretir. “Her zaman yalnız bir istek” sonucu bütün etkileşimler için geçerli değildir.
- `reload()` aynı path için version’ı artırır; bu useApi sürümünde loading yalnız result.path ile path karşılaştırmasına bağlıdır. Aynı adres yeniden istenirken eski veri ekranda kalabilir; path değişirse sonuç gelene kadar gizlenir.
- `updateData` meta alanını veya sıralamayı yeniden hesaplamaz; mevcut listede id eşleşmesini değiştirmek, yeni bir kayıt eklemek ya da toplam sayıyı artırmakla aynı işlem değildir. Aktiflik PATCH’i sırasında filtre değişip istek başarısız olursa data null olabilir; mevcut `list.map` çağrısında bu durum için koruma yoktur.
- Silme modalı busy iken düğmeler kapalıdır ama Escape engellenmez. Kapanış state’inin temizlenmesi sürmekte olan HTTP isteğini iptal etmez.
- Son sayfadaki son kayıt silinirse sayfa otomatik azaltılmaz. Boş liste görünürken Pagination da veri koşulunun içinde kaldığı için görünmez; filtre değiştirmek veya yeniden sayfaya girmek gerekebilir.
- Kategori API’si için deleted_at alanının null/tarih, is_active alanının sayısal 0/1 olması beklenir. Yazı satırı author/category nesneleri, sayfalama bileşenleri meta.total_pages bekler.
- Yazı silme onayındaki yazarın “Silinenleri göster” kullanabildiği metin, mevcut yetki açıklamasıyla tutarlı değildir. Bu rapor mevcut kodu belgeledi; kaynak metni bu görevde değiştirmedi.

## Ölçümler ve doğrulama kapsamı

Son uygulama derlemesinin kayıtlı gzip değerleri: ana JS 93.82 kB; Kategoriler 3.09 kB; Yazılar 1.61 kB; Kullanıcılar 1.87 kB. Ortak yönetim parçaları ayrıca dosyalara ayrıldı. Gün özeti tam dosya isimlerini ve sıkıştırılmamış değerleri içerir; kod değiştikçe hash ve boyutlar değişir.

Önceki uygulama adımlarında build/lint, kategori durum ve slug yardımcıları kontrolleri, admin kapısının render kontrolü ve mock API ile kategori modal/silme/geri getirme tarayıcı kontrolü yapıldı. Bu rapor hazırlanırken yeni canlı API deneyi yapılmadı; kaynak dosyalar, HEAD farkı, bağlantılar ve tablolardaki kaynak satırlarının kapsamı denetlendi. Kişisel yanlış tahminler, iki pencereli rol/aktiflik deneyi ve key kaldırma deneyi uydurulmadı.

**Belgenin kapsam sonucu:** 18 kaynak dosyasında 1.259 yeni/değişen boş olmayan kod satırı ayrı ayrı açıklanır. README, günlük özet ve önceki açıklama belgesi kendi klasörleri altında ele alınır. Bu dosya, açıklamak için kaynak kodu değiştirmez ve kendi kendisini değişiklik envanterine eklemez.
