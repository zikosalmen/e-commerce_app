import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ecommerce.com' },
    update: {},
    create: {
      email: 'admin@ecommerce.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categoriesData = [
    {
      name: 'Électronique',
      slug: 'electronique',
      description: 'Laptops, ordinateurs et plus',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800'
    },
    {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Derniers modèles de téléphones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800'
    },
    {
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Accessoires indispensables',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800'
    },
    {
      name: 'Tablettes',
      slug: 'tablettes',
      description: 'Tablettes tactiles performantes',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800'
    },
    {
      name: 'Audio',
      slug: 'audio',
      description: 'Casques et enceintes premium',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800'
    },
    {
      name: 'Téléviseurs',
      slug: 'televiseurs',
      description: 'Écrans 4K, QLED et OLED',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800'
    }
  ];

  console.log('🌱 Seeding categories...');
  
  // Map to store category IDs
  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.name, category.id);
  }

  // Create sample products
  const products = [
    // --- Laptops (Électronique) ---
    {
      name: 'MacBook Pro 16" M3 Pro',
      slug: 'macbook-pro-16-m3',
      description: 'Laptop surpuissant pour les professionnels.',
      price: 12599.900,
      comparePrice: 13200.000,
      stock: 5,
      categoryName: 'Électronique',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800']),
    },
    {
      name: 'Asus ROG Strix G16',
      slug: 'asus-rog-strix-g16',
      description: 'PC Gaming avec RTX 4060, i7 13ème gén, 16GB RAM.',
      price: 4899.000,
      comparePrice: 5200.000,
      stock: 8,
      categoryName: 'Électronique',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800']),
    },
    {
      name: 'HP Pavilion 15',
      slug: 'hp-pavilion-15',
      description: 'PC portable polyvalent pour étudiants et bureautique.',
      price: 1850.000,
      comparePrice: 2100.000,
      stock: 12,
      categoryName: 'Électronique',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800']),
    },
    {
      name: 'Dell XPS 13 Plus',
      slug: 'dell-xps-13-plus',
      description: 'Le summum de l\'ultrabook, compact et puissant.',
      price: 6200.000,
      stock: 4,
      categoryName: 'Électronique',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800']),
    },

    // --- Smartphones ---
    {
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max',
      description: 'Le fleuron d\'Apple avec titane et zoom optique 5x.',
      price: 6499.000,
      comparePrice: 6800.000,
      stock: 15,
      categoryName: 'Smartphones',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=800']),
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-s24-ultra',
      description: 'L\'expérience ultime Android avec Galaxy AI.',
      price: 5899.000,
      comparePrice: 6100.000,
      stock: 20,
      categoryName: 'Smartphones',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800']),
    },
    {
      name: 'Xiaomi Redmi Note 13 Pro+',
      slug: 'redmi-note-13-pro-plus',
      description: 'Performance incroyable et charge rapide 120W.',
      price: 1850.000,
      stock: 25,
      categoryName: 'Smartphones',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800']),
    },

    // --- Téléviseurs ---
    {
      name: 'Samsung QLED 65" 4K',
      slug: 'samsung-qled-65-4k',
      description: 'Couleurs éclatantes et noirs profonds pour votre salon.',
      price: 3499.000,
      comparePrice: 3800.000,
      stock: 10,
      categoryName: 'Téléviseurs',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800']),
    },
    {
      name: 'LG OLED 55" C3',
      slug: 'lg-oled-55-c3',
      description: 'Contraste infini, parfait pour le gaming et le cinéma.',
      price: 4200.000,
      stock: 6,
      categoryName: 'Téléviseurs',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800']),
    },

    // --- Accessoires & Audio ---
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Meilleure réduction de bruit au monde.',
      price: 1450.000,
      stock: 20,
      categoryName: 'Audio',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800']),
    },
    {
      name: 'AirPods Pro 2',
      slug: 'airpods-pro-2',
      description: 'Audio spatial et réduction de bruit active améliorée.',
      price: 890.000,
      comparePrice: 950.000,
      stock: 30,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800']),
    },
    {
      name: 'Logitech MX Master 3S',
      slug: 'logitech-mx-master-3s',
      description: 'Souris ergonomique pour la productivité.',
      price: 380.000,
      stock: 15,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800']),
    }
  ];

  for (const product of products) {
    const categoryId = categoryMap.get(product.categoryName);
    if (!categoryId) {
      console.warn(`⚠️ Category ${product.categoryName} not found for product ${product.name}`);
      continue;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryName, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        categoryId,
      },
      create: {
        ...productData,
        categoryId,
      },
    });
    console.log(`✅ Upserted product: ${product.name} with image ${JSON.parse(product.images)[0]}`);
  }

  console.log(`✅ Created/Updated ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
