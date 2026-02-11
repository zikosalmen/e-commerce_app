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
      description: 'Tout pour la maison',
      image: '/images/categories/electronics.jpg'
    },
    {
      name: 'Accessoires',
      slug: 'accessoires',
      description: 'Accessoires indispensables',
      image: '/images/categories/accessories.jpg'
    },
    {
      name: 'Tablettes',
      slug: 'tablettes',
      description: 'Tablettes tactiles',
      image: '/images/categories/tablets.jpg'
    },
    {
      name: 'Audio',
      slug: 'audio',
      description: 'Casques et enceintes',
      image: '/images/categories/audio.jpg'
    },
    {
      name: 'Caméras',
      slug: 'cameras',
      description: 'Appareils photo et caméras',
      image: '/images/categories/cameras.jpg'
    }
  ];

  console.log('🌱 Seeding categories...');
  
  // Map to store category IDs
  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.name, category.id);
  }

  // Create sample products
  const products = [
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Laptop puissant avec puce M3 Pro, 16GB RAM, 512GB SSD. Parfait pour le développement et la création.',
      price: 2499.99,
      comparePrice: 2799.99,
      stock: 15,
      categoryName: 'Électronique',
      featured: true,
      images: JSON.stringify(['/images/macbook-1.jpg', '/images/macbook-2.jpg']),
    },
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Le dernier iPhone avec puce A17 Pro, caméra 48MP, écran ProMotion 120Hz.',
      price: 1199.99,
      comparePrice: 1299.99,
      stock: 30,
      categoryName: 'Électronique',
      featured: true,
      images: JSON.stringify(['/images/iphone-1.jpg']),
    },
    {
      name: 'AirPods Pro',
      slug: 'airpods-pro',
      description: 'Écouteurs sans fil avec réduction de bruit active et audio spatial.',
      price: 249.99,
      stock: 50,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['/images/airpods-1.jpg']),
    },
    {
      name: 'Apple Watch Ultra',
      slug: 'apple-watch-ultra',
      description: 'Montre connectée robuste avec GPS précis, résistance extrême.',
      price: 849.99,
      comparePrice: 899.99,
      stock: 20,
      categoryName: 'Accessoires',
      featured: true,
      images: JSON.stringify(['/images/watch-1.jpg', '/images/watch-2.jpg']),
    },
    {
      name: 'iPad Air',
      slug: 'ipad-air',
      description: 'Tablette légère et puissante avec puce M1, écran Liquid Retina 10.9".',
      price: 649.99,
      stock: 25,
      categoryName: 'Tablettes',
      featured: false,
      images: JSON.stringify(['/images/ipad-1.jpg']),
    },
    {
      name: 'Magic Keyboard',
      slug: 'magic-keyboard',
      description: 'Clavier sans fil rechargeable avec touches optimisées.',
      price: 99.99,
      stock: 60,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['/images/keyboard-1.jpg']),
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Casque audio premium avec réduction de bruit exceptionnelle.',
      price: 399.99,
      comparePrice: 449.99,
      stock: 18,
      categoryName: 'Audio',
      featured: true,
      images: JSON.stringify(['/images/sony-headphones-1.jpg']),
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-s24-ultra',
      description: 'Smartphone Android haut de gamme avec stylet S-Pen intégré.',
      price: 1299.99,
      stock: 22,
      categoryName: 'Électronique',
      featured: false,
      images: JSON.stringify(['/images/samsung-1.jpg']),
    },
    {
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Ultrabook compact et élégant, Intel Core i7, 16GB RAM.',
      price: 1299.99,
      comparePrice: 1499.99,
      stock: 12,
      categoryName: 'Électronique',
      featured: false,
      images: JSON.stringify(['/images/dell-1.jpg']),
    },
    {
      name: 'GoPro HERO 12',
      slug: 'gopro-hero-12',
      description: 'Caméra d\'action 5.3K, stabilisation HyperSmooth, étanche.',
      price: 449.99,
      stock: 28,
      categoryName: 'Caméras',
      featured: false,
      images: JSON.stringify(['/images/gopro-1.jpg']),
    },
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
      update: {},
      create: {
        ...productData,
        categoryId,
      },
    });
  }

  console.log(`✅ Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
