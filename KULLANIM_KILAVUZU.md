# MikomTattoo - Kullanım Kılavuzu

## 📋 İçindekiler
1. [Hesap Bilgileri](#hesap-bilgileri)
2. [Django Admin Kullanımı](#django-admin-kullanımı)
3. [Site Yönetimi](#site-yönetimi)
4. [Deployment Bilgileri](#deployment-bilgileri)
5. [Sorun Giderme](#sorun-giderme)

---

## 🔐 Hesap Bilgileri

### Ana Hesap
- **Email:** mikomtatto0@gmail.com
- **Şifre:** Test12345!
- **GitHub:** mikomtatto (aynı email ile bağlı)

### Hizmetler

#### 1. GitHub
- **URL:** https://github.com/mikomtatto
- **Repository:** mikomtatto
- **Kullanım:** Kod deposu, versiyon kontrolü

#### 2. Render (Backend)
- **URL:** https://dashboard.render.com
- **Service:** mikomtatto-backend
- **URL:** https://mikomtatto-backend.onrender.com
- **Kullanım:** Django backend hosting
- **Environment Variables:**
  - `DATABASE_URL`: Supabase veritabanı URL
  - `SECRET_KEY`: Django secret key
  - `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
  - `CLOUDINARY_API_KEY`: Cloudinary API key
  - `CLOUDINARY_API_SECRET`: Cloudinary API secret
  - `BREVO_API_KEY`: Brevo API key
  - `DEFAULT_FROM_EMAIL`: iletisim@mikomtatto.com
  - `ADMIN_EMAIL`: admin@mikomtatto.com

#### 3. Vercel (Frontend)
- **URL:** https://vercel.com
- **Project:** mikomtatto
- **URL:** https://www.mikomtatto.com
- **Kullanım:** React frontend hosting
- **Environment Variables:**
  - `VITE_API_URL`: https://mikomtatto-backend.onrender.com

#### 4. Supabase (Veritabanı)
- **URL:** https://supabase.com
- **Project:** mikomtatto
- **Kullanım:** PostgreSQL veritabanı
- **Not:** Render environment variable olarak ayarlı

#### 5. Cloudinary (Resim Depolama)
- **URL:** https://cloudinary.com
- **Cloud Name:** mikomtatto
- **Kullanım:** Galeri, stiller, hakkımızda resimleri
- **Not:** Django settings'te yapılandırılmış

#### 6. Natro (Domain)
- **URL:** https://natro.com
- **Domain:** mikomtatto.com
- **DNS Ayarları:**
  - A Record: @ → Vercel IP adresleri
  - CNAME: www → cname.vercel-dns.com

#### 7. Cloudflare (DNS & Email)
- **URL:** https://dash.cloudflare.com
- **Domain:** mikomtatto.com
- **Kullanım:** DNS yönetimi, Email Routing
- **Email Routing:**
  - iletisim@mikomtatto.com → mikomtatto0@gmail.com

#### 8. Brevo (Email Gönderimi)
- **URL:** https://app.brevo.com
- **Kullanım:** Randevu email gönderimi
- **API Key:** Render environment variable olarak ayarlı

---

## 🎨 Django Admin Kullanımı

### Admin Panel Erişim
- **URL:** https://mikomtatto-backend.onrender.com/admin
- **Kullanıcı Adı:** admin
- **Şifre:** (Django admin şifresi - create_superuser.py ile oluşturuldu)

### İçerik Yönetimi

#### 1. Site Content (Site İçeriği)

##### Hakkımızda (About)
- **Yol:** Site Content > Hakkımızda
- **Düzenlenebilir Alanlar:**
  - Başlık
  - İçerik
  - Görsel (Cloudinary'ye yüklenir)
- **Not:** Resim yüklerken Cloudinary kullanılır

##### İletişim Bilgileri (Contact Info)
- **Yol:** Site Content > İletişim Bilgileri
- **Düzenlenebilir Alanlar:**
  - Adres
  - Telefon
  - E-posta
  - Çalışma Saatleri
  - Facebook
  - Instagram
  - Twitter
- **Not:** Frontend'te İletişim sayfasında gösterilir

##### Hero Arka Planları (Hero Background)
- **Yol:** Site Content > Hero Arka Planları
- **Düzenlenebilir Alanlar:**
  - Arka Plan Adı
  - Arka Plan Görseli
  - Aktif (Sadece bir tane aktif olabilir)
  - Hazır Arka Plan
- **Not:** Ana sayfa hero bölümünde gösterilir

#### 2. Galeri (Gallery)

##### Galeri Resimleri
- **Yol:** Galeri > Gallery
- **Düzenlenebilir Alanlar:**
  - Başlık
  - Açıklama
  - Görsel (Cloudinary'ye yüklenir)
  - Oluşturma Tarihi
- **Not:** Ana sayfa ve galeri sayfasında gösterilir

##### Yorumlar (Comments)
- **Yol:** Galeri > Comments
- **Düzenlenebilir Alanlar:**
  - Galeri Resmi
  - İsim
  - Email
  - Yorum
  - Puan (1-5)
  - Onaylandı (Admin onayı gerekli)
- **Not:** Kullanıcı yorumları, admin onayı gerekli

#### 3. Stiller (Styles)

##### Dövme Stilleri
- **Yol:** Stiller > Styles
- **Düzenlenebilir Alanlar:**
  - İsim
  - Açıklama
  - Görsel (Cloudinary'ye yüklenir)
  - Oluşturma Tarihi
- **Not:** Ana sayfa ve stiller sayfasında gösterilir

##### Yorumlar (Comments)
- **Yol:** Stiller > Comments
- **Düzenlenebilir Alanlar:**
  - Stil
  - İsim
  - Email
  - Yorum
  - Puan (1-5)
  - Onaylandı (Admin onayı gerekli)
- **Not:** Kullanıcı yorumları, admin onayı gerekli

#### 4. Randevular (Appointments)

##### Randevu Talepleri
- **Yol:** Randevular > Appointments
- **Düzenlenebilir Alanlar:**
  - Ad Soyad
  - Telefon
  - Email
  - Tarih
  - Saat
  - Dövme Stili
  - Açıklama
  - Durum (Beklemede, Onaylandı, Reddedildi, Tamamlandı)
- **Not:** Kullanıcı randevu talepleri, email bildirimi gönderilir

---

## 🚀 Site Yönetimi

### İçerik Güncelleme Adımları

#### 1. Galeri Resmi Ekleme
1. Django Admin'e gir
2. Galeri > Gallery > Add
3. Başlık ve açıklama gir
4. Görsel yükle (Cloudinary'ye yüklenir)
5. Kaydet

#### 2. Dövme Stili Ekleme
1. Django Admin'e gir
2. Stiller > Styles > Add
3. İsim ve açıklama gir
4. Görsel yükle (Cloudinary'ye yüklenir)
5. Kaydet

#### 3. Hakkımızda Güncelleme
1. Django Admin'e gir
2. Site Content > Hakkımızda
3. Mevcut kaydı düzenle
4. Başlık, içerik ve görseli güncelle
5. Kaydet

#### 4. İletişim Bilgileri Güncelleme
1. Django Admin'e gir
2. Site Content > İletişim Bilgileri
3. Mevcut kaydı düzenle
4. Bilgileri güncelle
5. Kaydet

#### 5. Hero Arka Planı Değiştirme
1. Django Admin'e gir
2. Site Content > Hero Arka Planları
3. Yeni arka plan ekle veya mevcut düzenle
4. "Aktif" işaretleyerek yeni arka planı aktif yap
5. Kaydet (Otomatik olarak diğerlerini deaktif eder)

#### 6. Randevu Yönetimi
1. Django Admin'e gir
2. Randevular > Appointments
3. Randevu durumunu güncelle
4. Email bildirimi otomatik gönderilir

#### 7. Yorum Onayı
1. Django Admin'e gir
2. Galeri > Comments veya Stiller > Comments
3. "Onaylandı" işaretleyerek yorumu yayınla
4. Kaydet

---

## 📦 Deployment Bilgileri

### Kod Güncelleme

#### Backend (Render)
1. Kod değişikliklerini yap
2. Git commit ve push
3. Render otomatik redeploy yapar
4. Migration gerekiyorsa manuel çalıştır

#### Frontend (Vercel)
1. Kod değişikliklerini yap
2. Git commit ve push
3. Vercel otomatik redeploy yapar

### Environment Variables

#### Render Environment Variables
```
DATABASE_URL=postgresql://...
SECRET_KEY=...
CLOUDINARY_CLOUD_NAME=mikomtatto
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
BREVO_API_KEY=...
DEFAULT_FROM_EMAIL=iletisim@mikomtatto.com
ADMIN_EMAIL=admin@mikomtatto.com
```

#### Vercel Environment Variables
```
VITE_API_URL=https://mikomtatto-backend.onrender.com
```

---

## 🔧 Sorun Giderme

### Yaygın Sorunlar

#### 1. Resimler Yüklenmiyor
- **Sorun:** Cloudinary yapılandırması
- **Çözüm:** Cloudinary credentials kontrol et, settings.py'de ayarları doğrula

#### 2. Email Gitmiyor
- **Sorun:** Brevo API key veya yapılandırma
- **Çözüm:** Brevo API key kontrol et, DEFAULT_FROM_EMAIL doğrula

#### 3. Django Admin Görsel Bozuk
- **Sorun:** Static files
- **Çözüm:** `python manage.py collectstatic` çalıştır

#### 4. CORS Hatası
- **Sorun:** Frontend-backend bağlantısı
- **Çözüm:** CORS_ALLOWED_ORIGINS settings'te kontrol et

#### 5. Migration Hatası
- **Sorun:** Veritabanı şeması uyuşmazlığı
- **Çözüm:** Migrationları manuel çalıştır veya veritabanını sıfırla

### Destek
- **Email:** mikomtatto0@gmail.com
- **GitHub:** https://github.com/mikomtatto/mikomtatto/issues

---

## 📝 Notlar

### Güvenlik
- Şifreleri güvenli tut
- API keys'i paylaşma
- Regular backup al

### Bakım
- Düzenli içerik güncellemesi
- Yorumları onayla
- Randevuları yönet
- Logları kontrol et

### Geliştirme
- Git kullanarak versiyon kontrolü
- Feature branch'ler kullan
- Test etmeden production'a push etme

---

**Son Güncelleme:** 2026-06-11
**Versiyon:** 1.0
