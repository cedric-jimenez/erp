#!/bin/bash

# ERP Docker Start Script
echo "🚀 Starting ERP application with Docker Compose..."

# Load environment variables
if [ -f .env.docker ]; then
    echo "📋 Loading environment variables from .env.docker"
    export $(cat .env.docker | xargs)
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker compose --env-file .env.docker up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "✅ Checking service status..."
docker compose ps

echo ""
echo "🎉 ERP Application is starting!"
echo "📊 Backend API: http://localhost:3001"
echo "📚 API Documentation: http://localhost:3001/api"
echo "🗄️  pgAdmin: http://localhost:5050"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "📋 To view logs: docker compose logs -f"
echo "🛑 To stop: ./scripts/docker-stop.sh"