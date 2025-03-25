// Restore Script for 1PoundBid System
import fs from 'fs';
import path from 'path';

const backupFile = './system_backup/1poundbid_system_backup_2025-03-21T12-50-22-418Z.json';
const destDir = '.';

console.log('Starting system restore...');

// Read backup file
console.log(`Reading backup file ${backupFile}...`);
const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));

// Restore files
console.log(`Restoring ${backup.files.length} files...`);
backup.files.forEach(file => {
  const filePath = path.join(destDir, file.path);
  const fileDir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }
  
  // Write file
  fs.writeFileSync(filePath, file.content);
  console.log(`Restored ${file.path}`);
});

console.log('Restore completed successfully!');