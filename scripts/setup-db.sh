#!/bin/bash

echo "🔧 Setup database..."
cd /var/www/usasport_ru_usr/data/www/usasport.ru

# 1. Создаём БД если нет
if [ ! -f prisma/prod.db ]; then
  echo "Creating database..."
  touch prisma/prod.db
  chmod 666 prisma/prod.db
fi

# 2. Применяем миграции
echo "Applying migrations..."
npx prisma migrate deploy --schema prisma/schema.prisma

# 3. Заполняем данными если пусто
echo "Checking data..."
curl -s https://usasport.ru/api/admin/stats | grep -q "error" && {
  echo "Seeding database..."
  curl -X POST https://usasport.ru/api/admin/seed
}

# 4. Перезапускаем PM2
echo "Restarting server..."
pm2 restart usasport --update-env

echo "✅ Done! Database ready."
pm2 logs usasport --lines 5
