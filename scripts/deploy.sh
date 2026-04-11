#!/bin/bash

echo "🚀 Deploy script - pulls, builds and sets up database"
cd /var/www/usasport_ru_usr/data/www/usasport.ru

# 1. Pull код
echo "📥 Pulling latest code..."
git pull

# 2. Install deps если нужно
if [ -f package-lock.json ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# 3. Build
echo "🔨 Building..."
npm run build

# 4. Setup database
echo "🔧 Setting up database..."
./scripts/setup-db.sh

echo "✅ Deploy complete!"
