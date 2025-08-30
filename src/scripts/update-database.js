import { getDbPool, initSchema } from '../lib/db.js';

async function updateDatabase() {
  try {
    console.log('🔄 Обновление базы данных...');
    
    const pool = getDbPool();
    
    // Инициализируем схему (создаст новые таблицы с полем email_sent)
    await initSchema();
    
    // Проверяем, есть ли поле email_sent в таблице orders
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'orders' 
      AND COLUMN_NAME = 'email_sent'
    `);
    
    if (columns.length === 0) {
      console.log('📝 Добавление поля email_sent к таблице orders...');
      await pool.query(`
        ALTER TABLE orders 
        ADD COLUMN email_sent BOOLEAN DEFAULT FALSE
      `);
      
      // Устанавливаем email_sent = TRUE для всех существующих заказов
      // (предполагаем, что они уже были обработаны)
      await pool.query(`
        UPDATE orders 
        SET email_sent = TRUE 
        WHERE email_sent IS NULL OR email_sent = FALSE
      `);
      
      console.log('✅ Поле email_sent добавлено и обновлено');
    } else {
      console.log('✅ Поле email_sent уже существует');
    }
    
    console.log('🎉 База данных успешно обновлена!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Ошибка обновления базы данных:', error);
    process.exit(1);
  }
}

updateDatabase();

