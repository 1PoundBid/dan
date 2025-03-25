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

# Create database schema dump
echo "# Database Schema" > system_backup/DATABASE_SCHEMA.md
echo "" >> system_backup/DATABASE_SCHEMA.md

# Extract table definitions from migration files
echo "Extracting database schema from migrations..."
for file in supabase/migrations/*.sql; do
  echo "## From $(basename "$file")" >> system_backup/DATABASE_SCHEMA.md
  echo '```sql' >> system_backup/DATABASE_SCHEMA.md
  grep -E "CREATE TABLE|CREATE TYPE|ALTER TABLE" "$file" >> system_backup/DATABASE_SCHEMA.md
  echo '```' >> system_backup/DATABASE_SCHEMA.md
  echo "" >> system_backup/DATABASE_SCHEMA.md
done

# Create a comprehensive backup file with all important information
echo "# 1PoundBid System Backup" > 1poundbid_backup.txt
echo "# Generated: $(date +%Y-%m-%d)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Project Structure
echo "# Project Structure" >> 1poundbid_backup.txt
find src -type f | sort >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Environment Variables Template
echo "# Environment Variables Template" >> 1poundbid_backup.txt
cat system_backup/config/.env.example >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Package Dependencies
echo "# Package Dependencies" >> 1poundbid_backup.txt
cat package.json >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Database Schema
echo "# Database Schema" >> 1poundbid_backup.txt
echo "1. customers" >> 1poundbid_backup.txt
echo "   - id (uuid, primary key)" >> 1poundbid_backup.txt
echo "   - bidder_number (text, unique)" >> 1poundbid_backup.txt
echo "   - first_name (text)" >> 1poundbid_backup.txt
echo "   - last_name (text)" >> 1poundbid_backup.txt
echo "   - email (text)" >> 1poundbid_backup.txt
echo "   - balance (decimal)" >> 1poundbid_backup.txt
echo "   - created_at (timestamptz)" >> 1poundbid_backup.txt
echo "   - updated_at (timestamptz)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "2. orders" >> 1poundbid_backup.txt
echo "   - id (uuid, primary key)" >> 1poundbid_backup.txt
echo "   - customer_id (uuid, foreign key)" >> 1poundbid_backup.txt
echo "   - recorded_at (timestamptz)" >> 1poundbid_backup.txt
echo "   - item_code (text)" >> 1poundbid_backup.txt
echo "   - item_name (text)" >> 1poundbid_backup.txt
echo "   - quantity (integer)" >> 1poundbid_backup.txt
echo "   - debit (decimal)" >> 1poundbid_backup.txt
echo "   - credit (decimal)" >> 1poundbid_backup.txt
echo "   - status (enum: unprocessed, in_tray, in_box, shipped)" >> 1poundbid_backup.txt
echo "   - processed_at (timestamptz)" >> 1poundbid_backup.txt
echo "   - created_at (timestamptz)" >> 1poundbid_backup.txt
echo "   - updated_at (timestamptz)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "3. storage_items" >> 1poundbid_backup.txt
echo "   - id (uuid, primary key)" >> 1poundbid_backup.txt
echo "   - customer_id (uuid, foreign key)" >> 1poundbid_backup.txt
echo "   - type (text: bag_cage, box_shelf)" >> 1poundbid_backup.txt
echo "   - created_at (timestamptz)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "4. shipped_boxes" >> 1poundbid_backup.txt
echo "   - id (uuid, primary key)" >> 1poundbid_backup.txt
echo "   - customer_id (uuid, foreign key)" >> 1poundbid_backup.txt
echo "   - type (text: single, small, big)" >> 1poundbid_backup.txt
echo "   - weight (decimal)" >> 1poundbid_backup.txt
echo "   - created_at (timestamptz)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "5. shipped_box_items" >> 1poundbid_backup.txt
echo "   - id (uuid, primary key)" >> 1poundbid_backup.txt
echo "   - box_id (uuid, foreign key)" >> 1poundbid_backup.txt
echo "   - order_id (uuid, foreign key)" >> 1poundbid_backup.txt
echo "   - created_at (timestamptz)" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Features
echo "# Features" >> 1poundbid_backup.txt
echo "1. Customer Management" >> 1poundbid_backup.txt
echo "   - Profile management" >> 1poundbid_backup.txt
echo "   - Order history" >> 1poundbid_backup.txt
echo "   - Balance tracking" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "2. Order Processing" >> 1poundbid_backup.txt
echo "   - Barcode scanning" >> 1poundbid_backup.txt
echo "   - Tray management" >> 1poundbid_backup.txt
echo "   - Box packing" >> 1poundbid_backup.txt
echo "   - Shipping preparation" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "3. Storage Management" >> 1poundbid_backup.txt
echo "   - Bag cage tracking" >> 1poundbid_backup.txt
echo "   - Box shelf organization" >> 1poundbid_backup.txt
echo "   - Archive system" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "4. Real-time Updates" >> 1poundbid_backup.txt
echo "   - Live order status" >> 1poundbid_backup.txt
echo "   - Voice feedback" >> 1poundbid_backup.txt
echo "   - Instant notifications" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

# Restore Instructions
echo "# Restore Instructions" >> 1poundbid_backup.txt
echo "1. Create new project:" >> 1poundbid_backup.txt
echo "   \`\`\`bash" >> 1poundbid_backup.txt
echo "   npm create vite@latest my-project -- --template react-ts" >> 1poundbid_backup.txt
echo "   cd my-project" >> 1poundbid_backup.txt
echo "   \`\`\`" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "2. Install dependencies:" >> 1poundbid_backup.txt
echo "   \`\`\`bash" >> 1poundbid_backup.txt
echo "   npm install" >> 1poundbid_backup.txt
echo "   \`\`\`" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "3. Copy source files from backup" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "4. Set up Supabase:" >> 1poundbid_backup.txt
echo "   - Create new project" >> 1poundbid_backup.txt
echo "   - Run migrations" >> 1poundbid_backup.txt
echo "   - Configure environment variables" >> 1poundbid_backup.txt
echo "" >> 1poundbid_backup.txt

echo "5. Start development server:" >> 1poundbid_backup.txt
echo "   \`\`\`bash" >> 1poundbid_backup.txt
echo "   npm run dev" >> 1poundbid_backup.txt
echo "   \`\`\`" >> 1poundbid_backup.txt

echo "Backup completed successfully!"