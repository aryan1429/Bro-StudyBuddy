#!/bin/bash
# Deploy script to run ON EC2 after pulling latest code

echo "🚀 Deploying Study Buddy..."

# Navigate to project directory
cd ~/Bro-StudyBuddy || exit

# Pull latest changes
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Check if .env exists, if not create from production template
if [ ! -f backend/.env ]; then
    echo "📝 Creating .env file from template..."
    cp backend/.env.production backend/.env
    echo "⚠️  Please edit backend/.env with your actual configuration!"
    echo "Run: nano backend/.env"
    exit 1
fi

# Stop and remove containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Rebuild and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Show status
echo "✅ Deployment complete!"
echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "📝 View logs with: docker-compose logs -f"
echo "🌐 Access your site at: http://$(curl -s ifconfig.me)"
