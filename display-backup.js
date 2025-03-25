import { readFileSync } from 'fs';

// Read and display the backup content
const backupContent = readFileSync('1poundbid_backup.txt', 'utf8');
console.log('\n=== START OF BACKUP CONTENT ===\n');
console.log(backupContent);
console.log('\n=== END OF BACKUP CONTENT ===\n');