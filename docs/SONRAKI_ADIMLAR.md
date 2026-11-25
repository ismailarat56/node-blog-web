[← README'ye dön](../README.tr.md)

# Sonraki Adımlar

- API: yöneticinin e-posta değişikliğine doğrulama eklemek.
- API: sorun listesindeki maddeler; kendini kilitleme koruması, restore kontrolleri, katı kullanıcı sorgusu ve rol filtresi.
- Yönetici işlemleri için kayıt: kim, neyi, ne zaman değiştirdi. Mevcut kullanıcı silme kaydını bütün yönetici işlemlerini ve işlemi yapan kişiyi kapsayacak şekilde genişletmek.
- Kayıt sayfasını ve `POST /api/v1/auth/register` bağlantısını tamamlamak; API kapsamı özetini fiilî çağrı akışlarıyla eşleştirmek.
- Bütün yorumlar için merkezi yönetim listesi: önce API listeleme ucu, ardından arayüz.
- Hesap ayarları: 03.10'da eklenen kodla parola değiştirme, şifremi unuttum ve e-posta değiştirme akışlarını canlı API ile doğrulamak (11.09 ve 15.09 API'leri).
- Kalan `useApi` sayfalarını TanStack Query'ye taşımak; yeni kullanıcı oluşturma ve yönetim dışındaki yazı değişikliklerinde ilgili yönetim önbelleklerini yenilemek.
- `dist/` klasörünü compose'taki nginx ile servis etmek.
- TypeScript.
- Açık oturumlar sayfası (API'de oturum listesi gerekir).
