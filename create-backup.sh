#!/bin/bash

# Create backup directories
mkdir -p system_backup/src
mkdir -p system_backup/supabase/migrations
mkdir -p system_backup/supabase/functions
mkdir -p system_backup/public
mkdir -p system_backup/config

# Copy source files
echo "Copying source files..."
cp -r src/* system_backup/src/

# Copy database migrations
echo "Copying database migrations..."
cp -r supabase/migrations/* system_backup/supabase/migrations/

# Copy Supabase functions if they exist
if [ -d "supabase/functions" ]; then
  echo "Copying Supabase functions..."
  cp -r supabase/functions/* system_backup/supabase/functions/
fi

# Copy public assets
echo "Copying public assets..."
if [ -d "public" ]; then
  cp -r public/* system_backup/public/
fi

# Copy configuration files
echo "Copying configuration files..."
cp package.json system_backup/config/
cp tsconfig.json system_backup/config/
cp tsconfig.app.json system_backup/config/
cp tsconfig.node.json system_backup/config/
cp vite.config.ts system_backup/config/
cp postcss.config.js system_backup/config/
cp tailwind.config.js system_backup/config/
cp eslint.config.js system_backup/config/

# Create backup info
echo "Creating backup metadata..."
date > system_backup/BACKUP_DATE
echo "1PoundBid System" > system_backup/SYSTEM_NAME
echo "Full system backup" > system_backup/BACKUP_TYPE

# Create backup summary
echo "# 1PoundBid System Backup" > system_backup/README.md
echo "# Generated: $(date)" >> system_backup/README.md
echo "" >> system_backup/README.md
echo "## Project Structure" >> system_backup/README.md
echo "- src/ - Application source code" >> system_backup/README.md
echo "- supabase/migrations/ - Database migrations" >> system_backup/README.md
echo "- supabase/functions/ - Serverless functions" >> system_backup/README.md
echo "- public/ - Public assets" >> system_backup/README.md
echo "- config/ - Configuration files" >> system_backup/README.md
echo "" >> system_backup/README.md

# Create environment variables template
echo "Creating environment variables template..."
echo "VITE_SUPABASE_URL=your_supabase_url" > system_backup/config/.env.example
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> system_backup/config/.env.example

# Create archive
echo "Creating archive..."
tar -czf 1poundbid_system_backup_$(date +%Y%m%d).tar.gz system_backup/

echo "Backup completed successfully!"
