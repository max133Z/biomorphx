import mysql from 'mysql2/promise';

let pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 10,
      timezone: 'Z',
      multipleStatements: true,
    });
  }
  return pool;
}

export async function initSchema() {
  const pool = getDbPool();

  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      external_id VARCHAR(64) NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_name VARCHAR(255) NULL,
      customer_phone VARCHAR(64) NULL,
      shipping_address TEXT NULL,
      total_price BIGINT NOT NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id VARCHAR(64) NOT NULL,
      title VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      unit_price BIGINT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await pool.query(createOrdersTable);
  await pool.query(createOrderItemsTable);
}
