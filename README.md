# MikomTattoo - Dövme Sanat Stüdyosu Websitesi

Django + React ile geliştirilmiş, siyah temalı ve mobil uyumlu dövme stüdyosu websitesi.

## Özellikler

- **Randevu Sistemi**: Müşteriler online randevu oluşturabilir
- **Galeri**: Yapılan işlerin fotoğrafları yüklenebilir ve gösterilebilir
- **Dövme Stilleri**: Farklı dövme stilleri listelenebilir
- **Gelişmiş Admin Paneli**: Django admin paneli ile tüm içerik yönetilebilir
- **Siyah Tema**: Modern ve şık karanlık tema
- **Mobil Uyumlu**: Responsive tasarım

## Teknolojiler

### Backend
- Django 6.0.6
- Django REST Framework
- Django CORS Headers
- Pillow (görsel işlemleri için)
- SQLite (veritabanı)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Kurulum

### Backend Kurulumu

1. Sanal ortam oluşturun (opsiyonel):
```bash
cd backend/config
python -m venv venv
venv\Scripts\activate
```

2. Bağımlılıkları yükleyin:
```bash
cd backend/config
pip install django djangorestframework django-cors-headers pillow
```

3. Veritabanını oluşturun:
```bash
py manage.py migrate
```

4. Admin kullanıcısı oluşturun:
```bash
py manage.py createsuperuser
```
İstendiğinde kullanıcı adı, e-posta ve şifre girin.

5. Django sunucusunu başlatın:
```bash
py manage.py runserver
```
Backend http://localhost:8000 adresinde çalışacaktır.

Admin paneline erişmek için: http://localhost:8000/admin/

### Frontend Kurulumu

1. Bağımlılıkları yükleyin:
```bash
cd frontend
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```
Frontend http://localhost:3000 adresinde çalışacaktır.

## Kullanım

### Admin Paneli

1. http://localhost:8000/admin/ adresine gidin
2. Oluşturduğunuz admin hesabıyla giriş yapın
3. **Dövme Stilleri** bölümünden stiller ekleyin
4. **Galeri Fotoğrafları** bölümünden fotoğraflar yükleyin
5. **Randevular** bölümünden gelen randevuları yönetin

### Website

- Ana sayfa: Hero, galeri, stiller, randevu formu ve iletişim bilgileri
- Galeri: Tüm fotoğrafları veya öne çıkanları görüntüleyin
- Stiller: Aktif dövme stillerini inceleyin
- Randevu: Online randevu formu

## API Endpoints

- `GET /api/styles/` - Tüm stilleri listele
- `GET /api/styles/?active=true` - Aktif stilleri listele
- `GET /api/gallery/` - Tüm galeri fotoğraflarını listele
- `GET /api/gallery/?featured=true` - Öne çıkan fotoğrafları listele
- `GET /api/appointments/` - Tüm randevuları listele
- `POST /api/appointments/` - Yeni randevu oluştur

## Proje Yapısı

```
mikomtatto/
├── backend/
│   └── config/
│       ├── appointments/    # Randevu uygulaması
│       ├── gallery/        # Galeri uygulaması
│       ├── styles/         # Dövme stilleri uygulaması
│       └── config/         # Django proje ayarları
└── frontend/
    ├── src/
    │   ├── components/     # React bileşenleri
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Özelleştirme

### Renkler

Frontend renklerini `frontend/tailwind.config.js` dosyasından değiştirebilirsiniz.

### Admin Paneli

Admin paneli özelleştirmeleri için `backend/config/*/admin.py` dosyalarını düzenleyin.

## Lisans

Tüm hakları saklıdır. © 2024 MikomTattoo
