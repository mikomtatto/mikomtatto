# MikomTattoo - Production Deployment Guide

## Prerequisites
- Ubuntu 20.04+ server
- Domain name (e.g., mikomtatto.com)
- Python 3.12+
- Node.js 18+
- PostgreSQL (optional, can use SQLite for small sites)
- Nginx
- SSL Certificate (Let's Encrypt)

## Backend Deployment

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv nginx postgresql postgresql-contrib -y

# Create project directory
sudo mkdir -p /var/www/mikomtatto
sudo chown $USER:$USER /var/www/mikomtatto
```

### 2. Clone Repository
```bash
cd /var/www/mikomtatto
git clone <your-repo-url> .
```

### 3. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser
```

### 4. Configure Gunicorn Service
```bash
sudo cp mikomtatto.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mikomtatto
sudo systemctl start mikomtatto
```

## Frontend Deployment

### 1. Build React App
```bash
cd frontend
npm install
npm run build
```

### 2. Copy Build Files
```bash
sudo mkdir -p /var/www/mikomtatto/frontend
sudo cp -r build/* /var/www/mikomtatto/frontend/
sudo chown -R www-data:www-data /var/www/mikomtatto
```

## Nginx Configuration

### 1. Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/mikomtatto
sudo ln -s /etc/nginx/sites-available/mikomtatto /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### 2. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
```

## Database Setup (PostgreSQL - Optional)

### 1. Create Database
```bash
sudo -u postgres psql
CREATE DATABASE mikomtatto;
CREATE USER mikomtatto_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mikomtatto TO mikomtatto_user;
\q
```

### 2. Update .env file
```bash
DB_NAME=mikomtatto
DB_USER=mikomtatto_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 3. Update settings.py
Uncomment PostgreSQL configuration in settings.py and comment out SQLite.

## Environment Variables (.env)
```bash
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@mikomtatto.com

# PostgreSQL (if using)
DB_NAME=mikomtatto
DB_USER=mikomtatto_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Maintenance

### Restart Services
```bash
sudo systemctl restart mikomtatto
sudo systemctl restart nginx
```

### View Logs
```bash
sudo journalctl -u mikomtatto -f
sudo tail -f /var/log/nginx/error.log
```

### Update Application
```bash
cd /var/www/mikomtatto
git pull

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart mikomtatto

# Frontend
cd frontend
npm install
npm run build
sudo cp -r build/* /var/www/mikomtatto/frontend/
sudo chown -R www-data:www-data /var/www/mikomtatto
```

## Security Checklist
- [ ] DEBUG=False in production
- [ ] Strong SECRET_KEY
- [ ] ALLOWED_HOSTS configured
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured (ufw)
- [ ] Regular backups
- [ ] Email notifications working
- [ ] CORS properly configured

## Backup Strategy
```bash
# Database backup
pg_dump mikomtatto > backup_$(date +%Y%m%d).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d).tar.gz /var/www/mikomtatto/backend/media/

# Automated backup script in crontab
0 2 * * * /path/to/backup-script.sh
```
