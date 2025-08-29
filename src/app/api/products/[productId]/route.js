import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Путь к файлу с данными продуктов
const productsFilePath = path.join(process.cwd(), 'src', 'data', 'products.js');

// Функция для чтения продуктов из файла
function readProducts() {
  try {
    const fileContent = fs.readFileSync(productsFilePath, 'utf8');
    const match = fileContent.match(/const products = (\[[\s\S]*?\]);/);
    if (match) {
      return JSON.parse(match[1]);
    }
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

// PUT - обновление продукта
export async function PUT(request, { params }) {
  try {
    const { productId } = params;
    const body = await request.json();
    
    // Валидация данных
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Название и цена обязательны' },
        { status: 400 }
      );
    }

    // Читаем существующие продукты
    const products = readProducts();
    
    // Находим продукт для обновления
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }

    // Обновляем продукт
    const updatedProduct = {
      ...products[productIndex],
      name: body.name,
      subtitle: body.subtitle || '',
      longDescription: body.longDescription || '',
      price: parseInt(body.price),
      quantity: body.quantity || '',
      image: body.image || '/img/default-product.png',
      badge: body.badge || null,
      isTopProduct: body.isTopProduct || false,
      isMainTop: body.isMainTop || false,
      highlights: body.highlights || []
    };

    // Если обновляемый продукт - главный топ, убираем этот статус у других
    if (updatedProduct.isMainTop) {
      products.forEach((product, index) => {
        if (index !== productIndex) {
          product.isMainTop = false;
        }
      });
    }

    // Если обновляемый продукт - топ продукт, проверяем лимит (максимум 3)
    if (updatedProduct.isTopProduct) {
      const topProductsCount = products.filter((p, index) => 
        index !== productIndex && p.isTopProduct
      ).length;
      if (topProductsCount >= 3) {
        return NextResponse.json(
          { error: 'Максимум 3 топ-продукта. Снимите статус "Топ продукт" с одного из существующих.' },
          { status: 400 }
        );
      }
    }

    // Обновляем продукт в массиве
    products[productIndex] = updatedProduct;
    
    // Сохраняем в файл
    const success = writeProducts(products);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Ошибка при сохранении продукта' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении продукта' },
      { status: 500 }
    );
  }
}

// DELETE - удаление продукта
export async function DELETE(request, { params }) {
  try {
    const { productId } = params;
    
    // Читаем существующие продукты
    const products = readProducts();
    
    // Находим продукт для удаления
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }

    // Удаляем продукт из массива
    products.splice(productIndex, 1);
    
    // Сохраняем в файл
    const success = writeProducts(products);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Ошибка при удалении продукта' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Продукт успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    return NextResponse.json(
      { error: 'Ошибка при удалении продукта' },
      { status: 500 }
    );
  }
}

