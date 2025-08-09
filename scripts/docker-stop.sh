#!/bin/bash

# ERP Docker Stop Script
echo "🛑 Stopping ERP application..."

# Stop and remove containers
echo "📦 Stopping containers..."
docker compose down

# Optional: Remove volumes (uncomment if you want to reset data)
# echo "🗑️  Removing volumes..."
# docker compose down -v

echo ""
echo "✅ ERP Application stopped successfully!"
echo ""
echo "💡 Tips:"
echo "   - To restart: ./scripts/docker-start.sh"
echo "   - To remove all data: docker compose down -v"
echo "   - To view stopped containers: docker compose ps -a"