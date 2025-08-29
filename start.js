const { execSync } = require('child_process');

console.log('Starting Next.js server...');

try {
  // Запускаем Next.js сервер
  execSync('npx next start', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
} catch (error) {
  console.error('Server failed:', error.message);
  process.exit(1);
}
