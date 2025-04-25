const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  'public/icons/android',
  'public/icons/ios',
  'public/icons/web',
  'assets/icons'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Source icon path (your master icon)
const sourceIcon = 'assets/master-icon.png';

// Web icons
execSync(`sharp -i ${sourceIcon} -o public/favicon.ico resize 32 32`);
execSync(`sharp -i ${sourceIcon} -o public/icons/web/icon-192.png resize 192 192`);
execSync(`sharp -i ${sourceIcon} -o public/icons/web/icon-512.png resize 512 512`);

// iOS icons
execSync(`sharp -i ${sourceIcon} -o public/icons/ios/apple-touch-icon.png resize 180 180`);

// Android icons
execSync(`sharp -i ${sourceIcon} -o public/icons/android/icon-192.png resize 192 192`);
execSync(`sharp -i ${sourceIcon} -o public/icons/android/icon-512.png resize 512 512`);
execSync(`sharp -i ${sourceIcon} -o public/icons/android/adaptive-icon-foreground.png resize 432 432`);

console.log('All icons generated successfully!');