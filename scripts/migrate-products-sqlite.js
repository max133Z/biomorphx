import medusaClient from "../src/lib/medusa.js";

// Импортируем существующие товары
const existingProducts = [
  {
    id: 'l-threonine',
    name: 'L-Threonine (L-Треонин)',
    subtitle: 'Незаменимая аминокислота для здоровья кожи, суставов и иммунной системы',
    longDescription: 'Треонин — это незаменимая аминокислота, которая участвует в синтезе важных белков, таких как коллаген и эластин, что делает её важной для поддержания здоровья костей, суставов и кожи.',
    price: 650,
    quantity: '300 мг | 60 капсул',
    image: '/img/L-Threonine.png',
    badge: 'Новинка',
    isTopProduct: true,
    isMainTop: false,
  },
  {
    id: 'l-proline',
    name: 'L-Proline (L-Пролин)',
    subtitle: 'Кирпичик для молодости вашей кожи, гибкости суставов и крепких сосудов',
    longDescription: 'Пролин — это фундаментальный строительный материал для коллагена, белка молодости, который отвечает за прочность и эластичность всех наших тканей.',
    price: 800,
    quantity: '400 мг | 60 таблеток',
    image: '/img/L-Proline.png',
    badge: 'Популярный',
    isTopProduct: true,
    isMainTop: true,
  },
  {
    id: 'l-phenylalanine',
    name: 'L-Phenylalanine (L-Фенилаланин)',
    subtitle: 'Натуральная поддержка бодрого настроения, ясного ума и стрессоустойчивости',
    longDescription: 'Эта аминокислота — первоисточник для производства «гормонов счастья» и энергии (дофамина, норадреналина).',
    price: 900,
    quantity: '400 мг | 60 таблеток',
    image: '/img/L-Phenilalanine.png',
    badge: 'Новинка',
    isTopProduct: true,
    isMainTop: true,
  },
  {
    id: 'l-valine',
    name: 'L-Valine (L-Валин)',
    subtitle: 'Источник энергии для мышц и надежная защита от разрушения при нагрузках',
    longDescription: 'Валин — одна из трех незаменимых аминокислот (BCAA), которая не производится организмом и должна поступать с пищей или добавками.',
    price: 750,
    quantity: '250 мг | 60 капсул',
    image: '/img/L-valine.png',
    badge: 'Популярный',
    isTopProduct: true,
    isMainTop: false,
  },
  {
    id: 'l-leucine',
    name: 'L-Leucine (L-Лейцин)',
    subtitle: 'Главный активатор мышечного роста и восстановления. Запускает синтез белка!',
    longDescription: 'Лейцин — это самый важный и мощный компонент из группы BCAA. Именно он подает прямой сигнал мышцам о необходимости роста и восстановления.',
    price: 600,
    quantity: '400 мг | 60 капсул',
    image: '/img/L-Leucine.png',
    badge: 'Хит продаж',
    isTopProduct: true,
    isMainTop: true,
  },
  {
    id: 'l-isoleucine',
    name: 'L-Isoleucine (L-Изолейцин)',
    subtitle: 'Регулятор энергии и выносливости. Стабилизирует уровень сахара и поддерживает иммунитет!',
    longDescription: 'Изолейцин, как и его собратья BCAA, работает в мышцах, но его уникальная роль — регулировать энергообмен и уровень глюкозы в крови.',
    price: 800,
    quantity: '250 мг | 60 капсул',
    image: '/img/L-Isoleucine.png',
    badge: 'Популярный',
    isTopProduct: true,
    isMainTop: true,
  },
  {
    id: 'l-cysteine',
    name: 'L-Cysteine (L-Цистеин)',
    subtitle: 'Мощный детокс и антиоксидантная защита изнутри для здоровья кожи, волос и ногтей',
    longDescription: 'Цистеин — это не просто аминокислота, а фундамент для создания глутатиона, мощнейшего антиоксиданта, который наш организм производит сам.',
    price: 760,
    quantity: '400 мг | 60 таблеток',
    image: '/img/L-Cysteine.png',
    badge: 'Хит продаж',
    isTopProduct: true,
    isMainTop: true,
  },
  {
    id: 'calcium-d-gluconate',
    name: 'Calcium D-Gluconate (Кальция Глюконат)',
    subtitle: 'Прочность костей, здоровье нервной системы и спокойствие без судорог',
    longDescription: 'Кальций — это макроэлемент, который нужен не только костям. Он жизненно важен для передачи нервных импульсов, работы мышц.',
    price: 550,
    quantity: '300 мг | 60 таблеток',
    image: '/img/Сalcium D-Gluconate.png',
    badge: null,
    isTopProduct: false,
    isMainTop: false,
  },
  {
    id: 'potassium-citrate',
    name: 'Potassium Citrate (Калия Цитрат)',
    subtitle: 'Баланс жидкости, здоровое сердце и защита от судорог и отеков',
    longDescription: 'Калий — главный электролит, который работает в паре с натрием. Он отвечает за правильный водно-солевой баланс в клетках.',
    price: 500,
    quantity: '300 мг | 60 таблеток',
    image: '/img/Postassium Citrate.png',
    badge: null,
    isTopProduct: false,
    isMainTop: false,
  },
  {
    id: 'zinc-picolinate',
    name: 'Zinc Picolinate (Цинк Пиколинат)',
    subtitle: 'Сильный иммунитет, чистая кожа и здоровый гормональный фон с легкоусвояемым цинком',
    longDescription: 'Цинк участвует в сотнях процессов в организме. Пиколинатная форма — одна из самых биодоступных.',
    price: 1200,
    quantity: '250 мг | 60 таблеток',
    image: '/img/Zinc.png',
    badge: 'Премиум',
    isTopProduct: true,
    isMainTop: false,
  },
  {
    id: 'sodium-alginate',
    name: 'Sodium Alginate (Альгинат Натрия)',
    subtitle: 'Поддерживает устойчивость к резким колебаниям уровня глюкозы, снижая нагрузку на поджелудочную железу.',
    longDescription: 'Замедляет всасывание сахаров и снижает гликемический отклик. Поддерживает устойчивость к резким колебаниям уровня глюкозы.',
    price: 700,
    quantity: '250 мг | 60 таблеток',
    image: '/img/Sodium Alginate.png',
    badge: null,
    isTopProduct: false,
    isMainTop: false,
  }
];

async function migrateProducts() {
  console.log('🚀 Начинаем миграцию товаров в Medusa SQLite...');
  
  for (const product of existingProducts) {
    try {
      console.log(`📦 Создаем товар: ${product.name}`);
      
      const medusaProduct = await medusaClient.admin.products.create({
        title: product.name,
        description: product.longDescription,
        handle: product.id,
        status: "published",
        variants: [{
          title: "Default",
          prices: [{
            amount: product.price * 100, // Medusa использует копейки
            currency_code: "rub"
          }],
          inventory_quantity: 100,
          manage_inventory: true,
          options: [{
            value: product.quantity
          }]
        }],
        images: [{
          url: product.image
        }],
        options: [{
          title: "Размер",
          values: [product.quantity]
        }],
        metadata: {
          subtitle: product.subtitle,
          badge: product.badge,
          isTopProduct: product.isTopProduct,
          isMainTop: product.isMainTop
        }
      });
      
      console.log(`✅ Товар ${product.name} успешно создан (ID: ${medusaProduct.product.id})`);
    } catch (error) {
      console.error(`❌ Ошибка создания ${product.name}:`, error.message);
    }
  }
  
  console.log('🎉 Миграция завершена!');
  console.log('📊 Всего товаров: ' + existingProducts.length);
}

// Запускаем миграцию
migrateProducts().catch(console.error);

