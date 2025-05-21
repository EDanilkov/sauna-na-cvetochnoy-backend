import dotenv from 'dotenv';

dotenv.config();

// Проверка обязательных переменных окружения
const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Отсутствуют обязательные переменные окружения:', missingEnvVars);
  console.error('Пожалуйста, создайте файл .env с необходимыми переменными');
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sauna',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'https://sauna-na-cvetochnoy.vercel.app',
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || ''
  }
};

// Логирование конфигурации при запуске
console.log('📋 Конфигурация приложения:');
console.log('Port:', config.port);
console.log('CORS Origin:', config.corsOrigin);
console.log('Telegram Bot Token:', config.telegram.botToken ? '✓ Установлен' : '✗ Не установлен');
console.log('Telegram Chat ID:', config.telegram.chatId ? '✓ Установлен' : '✗ Не установлен'); 