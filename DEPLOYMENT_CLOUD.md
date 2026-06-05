# MikomTattoo - Cloud Deployment Guide

## Tech Stack
- **Backend**: Django + Gunicorn on Render
- **Frontend**: React + Vite on Vercel
- **Database**: Supabase (PostgreSQL)
- **Email**: Brevo (formerly Sendinblue)

## Prerequisites
- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- Supabase account (free tier available)
- Brevo account (free tier available)

## Step 1: Supabase Setup

### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to be ready
4. Go to Settings > Database
5. Copy the connection string

### 2. Get Connection Details
- Project URL: `https://your-project.supabase.co`
- Database password: (from Supabase dashboard)
- Connection string format: `postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres`

## Step 2: Brevo Setup

### 1. Create Account
1. Go to [brevo.com](https://www.brevo.com)
2. Sign up for free account
3. Go to SMTP & API > SMTP
4. Enable SMTP relay
5. Get SMTP credentials:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: Your email
   - Password: API key

## Step 3: Backend Deployment (Render)

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Create Render Web Service
1. Go to [render.com](https://render.com)
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: mikomtatto-backend
   - **Region**: Frankfurt (or nearest to you)
   - **Branch**: main
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

### 3. Add Environment Variables
Add these environment variables in Render dashboard:
```
DJANGO_SECRET_KEY=<generate a strong secret key>
DEBUG=False
ALLOWED_HOSTS=mikomtatto-backend.onrender.com
DATABASE_URL=<your Supabase connection string>
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your Brevo email>
EMAIL_HOST_PASSWORD=<your Brevo API key>
DEFAULT_FROM_EMAIL=<your email>
ADMIN_EMAIL=<your admin email>
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### 4. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy your Render URL (e.g., `https://mikomtatto-backend.onrender.com`)

### 5. Run Migrations
After first deployment, you may need to run migrations:
1. Go to Render dashboard
2. Click on your service
3. Scroll to "Shell" section
4. Click "Connect"
5. Run: `python manage.py migrate`
6. Run: `python manage.py createsuperuser`

## Step 4: Frontend Deployment (Vercel)

### 1. Push to GitHub
Make sure your frontend code is in the same repository or a separate one.

### 2. Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Add Environment Variable
Add this environment variable in Vercel dashboard:
```
VITE_API_URL=https://your-render-app.onrender.com
```

### 4. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

### 5. Update CORS in Render
Go back to Render and update:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

## Step 5: Final Configuration

### Update Backend ALLOWED_HOSTS
In Render, update:
```
ALLOWED_HOSTS=mikomtatto-backend.onrender.com
```

### Test the Application
1. Visit your Vercel URL
2. Test all features:
   - Gallery
   - Styles
   - Booking
   - Comments
   - Admin panel

## Cost Summary (Free Tiers)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Render | $0/month | 750 hours/month, 512MB RAM |
| Vercel | $0/month | 100GB bandwidth/month |
| Supabase | $0/month | 500MB database, 2GB bandwidth |
| Brevo | $0/month | 300 emails/day |

**Total**: $0/month for basic usage

## Maintenance

### Update Application
```bash
git pull
# Backend will auto-deploy on Render
# Frontend will auto-deploy on Vercel
```

### Database Backups
Supabase automatically backs up your database daily.

### Monitor Logs
- **Render**: Dashboard > Logs
- **Vercel**: Dashboard > Logs
- **Supabase**: Dashboard > Logs

## Troubleshooting

### CORS Errors
Make sure `CORS_ALLOWED_ORIGINS` in Render matches your Vercel URL exactly.

### Database Connection
Verify `DATABASE_URL` in Render matches your Supabase connection string.

### Email Not Sending
Check Brevo SMTP credentials and make sure SMTP relay is enabled.

### Static Files Not Loading
Run `python manage.py collectstatic --noinput` in Render shell.

## Security Checklist
- [ ] DJANGO_SECRET_KEY is strong and unique
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured correctly
- [ ] Database password is strong
- [ ] Email API key is secure
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Render/Vercel)
