const fs = require('fs');
const path = require('path');

// Create necessary directories
const directories = [
  'data',
  'uploads',
  'uploads/products',
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

// Create .gitkeep files
const gitkeepFiles = [
  'uploads/.gitkeep',
  'uploads/products/.gitkeep',
];

gitkeepFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
    console.log(`✓ Created file: ${file}`);
  }
});

console.log('\n✅ Backend setup complete!');
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Copy .env.example to .env and update values');
console.log('3. Run: npm run dev');
