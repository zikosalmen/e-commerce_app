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
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'
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
      description: 'Tablettes tactiles',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    },
    {
      name: 'Audio',
      slug: 'audio',
      description: 'Casques et enceintes',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
    },
    {
      name: 'Caméras',
      slug: 'cameras',
      description: 'Appareils photo et caméras',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'
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
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Laptop puissant avec puce M3 Pro, 16GB RAM, 512GB SSD. Parfait pour le développement et la création.',
      price: 2499.99,
      comparePrice: 2799.99,
      stock: 15,
      categoryName: 'Électronique',
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800']),
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
      images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800']),
    },
    {
      name: 'AirPods Pro',
      slug: 'airpods-pro',
      description: 'Écouteurs sans fil avec réduction de bruit active et audio spatial.',
      price: 249.99,
      stock: 50,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),
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
      images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800']),
    },
    {
      name: 'iPad Air',
      slug: 'ipad-air',
      description: 'Tablette légère et puissante avec puce M1, écran Liquid Retina 10.9".',
      price: 649.99,
      stock: 25,
      categoryName: 'Tablettes',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800']),
    },
    {
      name: 'Magic Keyboard',
      slug: 'magic-keyboard',
      description: 'Clavier sans fil rechargeable avec touches optimisées.',
      price: 99.99,
      stock: 60,
      categoryName: 'Accessoires',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800']),
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
      images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800']),
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-s24-ultra',
      description: 'Smartphone Android haut de gamme avec stylet S-Pen intégré.',
      price: 1299.99,
      stock: 22,
      categoryName: 'Électronique',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800']),
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
      images: JSON.stringify(['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800']),
    },
    {
      name: 'GoPro HERO 12',
      slug: 'gopro-hero-12',
      description: 'Caméra d\'action 5.3K, stabilisation HyperSmooth, étanche.',
      price: 449.99,
      stock: 28,
      categoryName: 'Caméras',
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800']),
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
