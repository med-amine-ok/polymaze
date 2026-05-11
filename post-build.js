import fs from 'fs';
import path from 'path';

const clientDir = path.join(process.cwd(), 'dist', 'client');
const distDir = path.join(process.cwd(), 'dist');

if (fs.existsSync(clientDir)) {
  console.log('Moving client assets to root of dist for Vercel...');
  const files = fs.readdirSync(clientDir);
  for (const file of files) {
    fs.renameSync(path.join(clientDir, file), path.join(distDir, file));
  }
  fs.rmdirSync(clientDir);
  console.log('Moved client assets successfully.');
}
