import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу с данными продуктов
const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.js');

// Функция для чтения продуктов из файла
function readProducts() {
  try {
    // Читаем содержимое файла
    const fileContent = fs.readFileSync(productsFilePath, 'utf8');
    
    // Извлекаем массив продуктов из экспорта
    const match = fileContent.match(/const products = (\[[\s\S]*?\]);/s);
    if (match) {
      return JSON.parse(match[1]);
    }
    
    // Альтернативный способ - ищем массив после "const products ="
    const altMatch = fileContent.match(/export default (\[[\s\S]*?\]);/s);
    if (altMatch) {
      return JSON.parse(altMatch[1]);
    }
    
    console.error('Не удалось извлечь данные продуктов из файла');
    return [];
  } catch (error) {
    console.error('Ошибка чтения продуктов:', error);
    return [];
  }
}

// Функция для записи продуктов в файл
function writeProducts(products) {
  try {
    const fileContent = `// Данные о продуктах
const products = ${JSON.stringify(products, null, 2)};

export default products;`;
    
    fs.writeFileSync(productsFilePath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Ошибка записи продуктов:', error);
    return false;
  }
}

// GET - получение всех продуктов
export async function GET() {
  try {
    const products = readProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при получении продуктов' },
      { status: 500 }
    );
  }
}

// POST - добавление нового продукта
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Валидация данных
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Название и цена обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, что цена является числом
    const price = parseInt(body.price);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json(
        { error: 'Цена должна быть положительным числом' },
        { status: 400 }
      );
    }

    // Читаем существующие продукты
    const products = readProducts();
    
    // Создаем новый продукт
    const newProduct = {
      id: body.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: body.name.trim(),
      subtitle: body.subtitle ? body.subtitle.trim() : '',
      longDescription: body.longDescription ? body.longDescription.trim() : '',
      price: price,
      quantity: body.quantity ? body.quantity.trim() : '',
      image: body.image ? body.image.trim() : '/img/default-product.png',
      badge: body.badge || null,
      isTopProduct: Boolean(body.isTopProduct),
      isMainTop: Boolean(body.isMainTop),
      highlights: Array.isArray(body.highlights) ? body.highlights.filter(h => h.text && h.text.trim()) : []
    };

    // Если новый продукт - главный топ, убираем этот статус у других
    if (newProduct.isMainTop) {
      products.forEach(product => {
        product.isMainTop = false;
      });
    }

    // Если новый продукт - топ продукт, проверяем лимит (максимум 3)
    if (newProduct.isTopProduct) {
      const topProductsCount = products.filter(p => p.isTopProduct).length;
      if (topProductsCount >= 3) {
        return NextResponse.json(
          { error: 'Максимум 3 топ-продукта. Снимите статус "Топ продукт" с одного из существующих.' },
          { status: 400 }
        );
      }
    }

    // Добавляем продукт в массив
    products.push(newProduct);
    
    // Сохраняем в файл
    const success = writeProducts(products);
    
    if (!success) {
      console.error('Ошибка при записи файла products.js');
      return NextResponse.json(
        { error: 'Ошибка при сохранении продукта в файл' },
        { status: 500 }
      );
    }

    console.log('Продукт успешно добавлен:', newProduct.name);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Ошибка при добавлении продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при добавлении продукта' },
      { status: 500 }
    );
  }
}
