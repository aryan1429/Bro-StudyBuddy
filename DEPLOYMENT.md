# Deployment Guide - AWS EC2

## Prerequisites
- EC2 instance running (Ubuntu recommended)
- Docker and Docker Compose installed on EC2
- Security group with ports 80, 22 open
- PEM key file for SSH access

## Step 1: Push Code to GitHub

```bash
# From your local machine
cd "C:\Users\aryan\Desktop\Bro-StudyBuddy"

# Add all changes
git add .

# Commit changes
git commit -m "Add nginx reverse proxy and production config"

# Push to GitHub
git push origin main
```

## Step 2: SSH into EC2

```bash
# From PowerShell (Windows)
ssh -i "C:\Users\aryan\Downloads\studybuddy-key.pem" ubuntu@YOUR_EC2_IP

# If permission error on Windows, run:
# icacls "C:\Users\aryan\Downloads\studybuddy-key.pem" /inheritance:r /grant:r "%username%:R"
```

## Step 3: Pull Latest Code on EC2

```bash
# Navigate to project directory
cd ~/Bro-StudyBuddy

# Pull latest changes
git pull origin main

# Copy production env file
cp backend/.env.production backend/.env

# Edit .env with your actual domain
nano backend/.env
# Update CORS_ORIGINS to include your domain
# Update JWT_SECRET_KEY to a random 32+ character string
```

## Step 4: Update Backend .env

Make sure your `backend/.env` has:
```
CORS_ORIGINS=https://brostudybuddy.live,http://brostudybuddy.live,http://frontend:3000
JWT_SECRET_KEY=<generate-a-strong-random-key-here>
```

## Step 5: Restart Docker Containers

```bash
# Stop existing containers
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Check logs
docker-compose logs -f
```

## Step 6: Verify Deployment

1. Visit `http://YOUR_EC2_IP` or `http://brostudybuddy.live`
2. Try registering an account
3. Check if Google sign-in works (if configured)

## Troubleshooting

### Check container status
```bash
docker-compose ps
```

### View logs
```bash
docker-compose logs nginx
docker-compose logs frontend
docker-compose logs backend
```

### Restart specific service
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Check nginx configuration
```bash
docker-compose exec nginx nginx -t
```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://brostudybuddy.live/auth/google/callback`
6. Copy Client ID and Secret to backend/.env
7. Restart backend: `docker-compose restart backend`

## Security Checklist

- [ ] Changed JWT_SECRET_KEY from default
- [ ] Updated CORS_ORIGINS with production domain
- [ ] Configured HTTPS (use Certbot for Let's Encrypt)
- [ ] Restricted EC2 security group (only ports 80, 443, 22)
- [ ] Set strong PostgreSQL password in docker-compose.yml
- [ ] Keep .env file private (not in git)
