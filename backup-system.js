// System Backup Script
// This script creates a comprehensive backup of the 1PoundBid system

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
const sourceDir = '/home/project';
const backupDir = '/home/project/system_backup';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFileName = `1poundbid_system_backup_${timestamp}.json`;

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip node_modules, .git, and the backup directory itself
    if (
      file === 'node_modules' || 
      file === '.git' || 
      file === 'dist' ||
      filePath.startsWith(backupDir)
    ) {
      return;
    }
    
    if (stat.isDirectory()) {
      fileList = getAllFiles(filePath, fileList);
    } else {
      fileList.push({
        path: filePath.replace(sourceDir + '/', ''),
        content: fs.readFileSync(filePath, 'utf8')
      });
    }
  });
  
  return fileList;
}

// Get package.json content
let packageJson = {};
try {
  const packageJsonContent = fs.readFileSync(path.join(sourceDir, 'package.json'), 'utf8');
  packageJson = JSON.parse(packageJsonContent);
} catch (error) {
  console.error('Error reading package.json:', error);
}

// Get all files
console.log('Collecting files for backup...');
const allFiles = getAllFiles(sourceDir);
console.log(`Found ${allFiles.length} files to backup.`);

// Create backup object
const backup = {
  timestamp: new Date().toISOString(),
  system: '1PoundBid',
  version: packageJson.version || '1.0.0',
  dependencies: packageJson.dependencies || {},
  devDependencies: packageJson.devDependencies || {},
  files: allFiles
};

// Write backup to file
console.log(`Writing backup to ${path.join(backupDir, backupFileName)}...`);
fs.writeFileSync(
  path.join(backupDir, backupFileName),
  JSON.stringify(backup, null, 2)
);

// Create a summary file
const summaryFilePath = path.join(backupDir, 'BACKUP_SUMMARY.md');
const summary = `# 1PoundBid System Backup
Generated: ${new Date().toLocaleString()}

## Backup Information
- Timestamp: ${backup.timestamp}
- System: ${backup.system}
- Version: ${backup.version}
- Total Files: ${allFiles.length}

## File Categories
- Source Files: ${allFiles.filter(f => f.path.startsWith('src/')).length}
- Database Migrations: ${allFiles.filter(f => f.path.startsWith('supabase/migrations/')).length}
- Configuration Files: ${allFiles.filter(f => f.path.endsWith('.json') || f.path.endsWith('.js') || f.path.endsWith('.ts')).length}

## Dependencies
\`\`\`json
${JSON.stringify(backup.dependencies, null, 2)}
\`\`\`

## Dev Dependencies
\`\`\`json
${JSON.stringify(backup.devDependencies, null, 2)}
\`\`\`

## Restore Instructions
1. Create a new project directory
2. Extract all files from the backup
3. Run \`npm install\` to install dependencies
4. Set up Supabase environment variables
5. Run \`npm run dev\` to start the development server

## Important Notes
- This backup contains all source code and configuration
- Database content is NOT included, only schema migrations
- Environment variables are NOT included for security reasons
`;

fs.writeFileSync(summaryFilePath, summary);

// Create a restore script
const restoreScriptPath = path.join(backupDir, 'restore.js');
const restoreScript = `
// Restore Script for 1PoundBid System
import fs from 'fs';
import path from 'path';

const backupFile = './system_backup/${backupFileName}';
const destDir = '.';

console.log('Starting system restore...');

// Read backup file
console.log(\`Reading backup file \${backupFile}...\`);
const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

// Restore files
console.log(\`Restoring \${backup.files.length} files...\`);
backup.files.forEach(file => {
  const filePath = path.join(destDir, file.path);
  const fileDir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(filePath, file.content);
  console.log(\`Restored \${file.path}\`);
});

console.log('Restore completed successfully!');
console.log('Run "npm install" to install dependencies.');
`;

fs.writeFileSync(restoreScriptPath, restoreScript);

// Create a text file with database schema
const schemaFilePath = path.join(backupDir, 'DATABASE_SCHEMA.md');
const schemaContent = `# 1PoundBid Database Schema

## Tables

### customers
- id (uuid, primary key)
- bidder_number (text, unique)
- first_name (text)
- last_name (text)
- email (text)
- balance (decimal)
- created_at (timestamptz)
- updated_at (timestamptz)

### orders
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- recorded_at (timestamptz)
- item_code (text)
- item_name (text)
- quantity (integer)
- debit (decimal)
- credit (decimal)
- status (enum: unprocessed, in_tray, in_box, shipped)
- processed_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)

### storage_items
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- type (text: bag_cage, box_shelf)
- created_at (timestamptz)

### shipped_boxes
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- type (text: single, small, big)
- weight (decimal)
- archived (boolean)
- created_at (timestamptz)

### shipped_box_items
- id (uuid, primary key)
- box_id (uuid, foreign key)
- order_id (uuid, foreign key)
- created_at (timestamptz)

### box_orders
- id (uuid, primary key)
- customer_name (text)
- email (text)
- box_type (text)
- status (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### customer_inquiries
- id (uuid, primary key)
- customer_name (text)
- email (text)
- phone (text)
- question (text)
- priority (text)
- status (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### twilio_config
- id (uuid, primary key)
- account_sid (text)
- auth_token (text)
- phone_number (text)
- created_at (timestamptz)
- updated_at (timestamptz)

### sms_replies
- id (uuid, primary key)
- from_number (text)
- to_number (text)
- message (text)
- created_at (timestamptz)
- read (boolean)
`;

fs.writeFileSync(schemaFilePath, schemaContent);

console.log(`
Backup completed successfully!

Files created:
- ${path.join(backupDir, backupFileName)} - Full system backup in JSON format
- ${summaryFilePath} - Backup summary in Markdown format
- ${restoreScriptPath} - Restore script
- ${schemaFilePath} - Database schema documentation

To create future backups, run:
  node backup-system.js
`);