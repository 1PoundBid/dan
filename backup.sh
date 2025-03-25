#!/bin/bash

# Create backup directories
mkdir -p backup/src
mkdir -p backup/supabase/migrations
mkdir -p backup/config
mkdir -p backup/public

# Copy source files
echo "Copying source files..."
cp -r src/* backup/src/

# Copy database migrations
echo "Copying database migrations..."
cp -r supabase/migrations/* backup/supabase/migrations/

# Copy configuration files
echo "Copying configuration files..."
cp package.json backup/config/
cp tsconfig.json backup/config/
cp tsconfig.app.json backup/config/
cp tsconfig.node.json backup/config/
cp vite.config.ts backup/config/
cp postcss.config.js backup/config/
cp tailwind.config.js backup/config/
cp eslint.config.js backup/config/

# Copy environment file structure (without sensitive data)
echo "VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key" > backup/config/.env.example

# Create backup info
date > backup/BACKUP_DATE
git rev-parse HEAD > backup/GIT_COMMIT

# Create archive
tar -czf 1poundbid_backup_$(date +%Y%m%d).tar.gz backup/

echo "Backup completed successfully!"