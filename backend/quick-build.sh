#!/bin/bash

# Quick Build Script for HandyWriterz Backend
# Fixes Docker timeout issues with optimized builds

set -e

echo "🚀 HandyWriterz Docker Build Script"
echo "=================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before running!"
    echo "   Minimum required: OPENAI_API_KEY, ANTHROPIC_API_KEY"
    exit 1
fi

# Menu for build options
echo ""
echo "Choose build option:"
echo "1) Ultra-Light (fastest ~5min, essential features only)"
echo "2) CPU-Only (moderate ~15min, includes ML libraries)"
echo "3) Full Build (slow ~30min+, all features)"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo "🏃‍♂️ Building ultra-light version..."
        docker build -f Dockerfile.light -t handywriterz-light . --no-cache
        echo "✅ Ultra-light build complete!"
        echo "Run with: docker run -p 8000:8000 --env-file .env handywriterz-light"
        ;;
    2)
        echo "⚡ Building CPU-only version with docker-compose..."
        docker-compose -f docker-compose.fast.yml build --no-cache
        echo "✅ CPU-only build complete!"
        echo "Run with: docker-compose -f docker-compose.fast.yml up"
        ;;
    3)
        echo "🐌 Building full version (this may take a while)..."
        docker-compose build --no-cache
        echo "✅ Full build complete!"
        echo "Run with: docker-compose up"
        ;;
    *)
        echo "❌ Invalid choice. Please run script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📚 Additional commands:"
echo "  View logs: docker-compose logs -f backend"
echo "  Stop services: docker-compose down"
echo "  Rebuild: docker-compose build --no-cache"
echo ""
echo "🔗 Access your application at: http://localhost:8000"