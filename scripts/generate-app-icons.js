const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Base directories
const ANDROID_ICON_DIR = path.join(__dirname, '../android/app/src/main/res');
const IOS_ICON_DIR = path.join(__dirname, '../ios/ProjectBolt/Images.xcassets/AppIcon.appiconset');

// Ensure directories exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Android icon sizes and directories
const ANDROID_ICONS = [
  { size: 36, dir: 'mipmap-ldpi' },
  { size: 48, dir: 'mipmap-mdpi' },
  { size: 72, dir: 'mipmap-hdpi' },
  { size: 96, dir: 'mipmap-xhdpi' },
  { size: 144, dir: 'mipmap-xxhdpi' },
  { size: 192, dir: 'mipmap-xxxhdpi' }
];

// iOS icon sizes
const IOS_ICONS = [
  { size: 20, scales: [1, 2, 3] },
  { size: 29, scales: [1, 2, 3] },
  { size: 40, scales: [1, 2, 3] },
  { size: 60, scales: [2, 3] },
  { size: 76, scales: [1, 2] },
  { size: 83.5, scales: [2] },
  { size: 1024, scales: [1] } // App Store
];

async function generateAndroidIcons(sourceIcon) {
  for (const icon of ANDROID_ICONS) {
    const dirPath = path.join(ANDROID_ICON_DIR, icon.dir);
    ensureDir(dirPath);
    
    await sharp(sourceIcon)
      .resize(icon.size, icon.size)
      .toFile(path.join(dirPath, 'ic_launcher.png'));
    
    // Also create round icons for Android
    await sharp(sourceIcon)
      .resize(icon.size, icon.size)
      .toFile(path.join(dirPath, 'ic_launcher_round.png'));
  }
  
  console.log('✅ Android icons generated successfully');
}

async function generateIOSIcons(sourceIcon) {
  ensureDir(IOS_ICON_DIR);
  
  // Create Contents.json if it doesn't exist
  const contentsPath = path.join(IOS_ICON_DIR, 'Contents.json');
  const contents = { images: [], info: { version: 1, author: 'xcode' } };
  
  for (const icon of IOS_ICONS) {
    for (const scale of icon.scales) {
      const size = icon.size * scale;
      const filename = `icon-${icon.size}@${scale}x.png`;
      
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(path.join(IOS_ICON_DIR, filename));
      
      contents.images.push({
        size: `${icon.size}x${icon.size}`,
        idiom: 'iphone',
        filename,
        scale: `${scale}x`
      });
    }
  }
  
  fs.writeFileSync(contentsPath, JSON.stringify(contents, null, 2));
  console.log('✅ iOS icons generated successfully');
}

async function generateIcons() {
  try {
    const sourceIcon = path.join(__dirname, '../assets/icons/app-icon.png');
    
    if (!fs.existsSync(sourceIcon)) {
      console.error('❌ Source icon not found. Please place app-icon.png in the assets/icons directory.');
      return;
    }
    
    await generateAndroidIcons(sourceIcon);
    await generateIOSIcons(sourceIcon);
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();