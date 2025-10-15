const { execSync } = require('child_process');

console.log('Starting Next.js build...');

try {
  // Запускаем сборку Next.js
  execSync('npx next build', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}

