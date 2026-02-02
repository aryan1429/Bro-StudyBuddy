# 🚀 Quick Deployment Commands

## From Windows (Your Local Machine)

### 1. Connect to EC2
```powershell
# Edit connect-ec2.ps1 and add your EC2 IP first
# Then run:
.\connect-ec2.ps1
```

Or manually:
```powershell
ssh -i "C:\Users\aryan\Downloads\studybuddy-key.pem" ubuntu@YOUR_EC2_IP
```

### 2. Push Changes to GitHub
```powershell
cd "C:\Users\aryan\Desktop\Bro-StudyBuddy"
git add .
git commit -m "Your commit message"
git push origin main
```

---

## On EC2 (After SSH)

### First Time Setup
```bash
# Clone repo (if not already done)
git clone https://github.com/aryan1429/Bro-StudyBuddy.git
cd Bro-StudyBuddy

# Copy and configure .env
cp backend/.env.production backend/.env
nano backend/.env

# IMPORTANT: Update these in backend/.env:
# - CORS_ORIGINS=https://brostudybuddy.live,http://brostudybuddy.live
# - JWT_SECRET_KEY=<random-32-character-string>
# - Add Google OAuth credentials if needed
```

### Update and Deploy
```bash
cd ~/Bro-StudyBuddy

# Pull latest code
git pull origin main

# Deploy (stops old containers, builds, starts new ones)
docker-compose down
docker-compose up --build -d

# Or use the deployment script
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

### Monitor and Debug
```bash
# Check container status
docker-compose ps

# View all logs (live)
docker-compose logs -f

# View specific service logs
docker-compose logs -f nginx
docker-compose logs -f frontend
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Check nginx config
docker-compose exec nginx nginx -t
```

---

## 🔧 Fixes Applied

1. ✅ Added **nginx reverse proxy** on port 80
2. ✅ Fixed **CORS** for production domain
3. ✅ Backend now accessible via `/api` through nginx
4. ✅ Frontend and backend communicate internally
5. ✅ Created production config templates

---

## ⚠️ IMPORTANT: Before Deploying on EC2

Edit `backend/.env` on EC2 and update:

```bash
nano ~/Bro-StudyBuddy/backend/.env
```

Update these lines:
```
CORS_ORIGINS=https://brostudybuddy.live,http://brostudybuddy.live,http://frontend:3000
JWT_SECRET_KEY=<CHANGE-THIS-TO-RANDOM-STRING>
```

Generate a secure JWT secret:
```bash
openssl rand -hex 32
```

---

## 🌐 Access Your Site

After deployment:
- **Website**: http://YOUR_EC2_IP or http://brostudybuddy.live
- **Direct Backend** (for testing): http://YOUR_EC2_IP:8000/docs

---

## 🔒 Security Group Settings (AWS Console)

Open these ports in your EC2 security group:
- **Port 80** (HTTP) - for website access
- **Port 22** (SSH) - for terminal access
- **Port 443** (HTTPS) - for SSL (recommended)

You can **close** ports 3000 and 8000 (no longer needed).
