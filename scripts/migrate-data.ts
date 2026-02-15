
import { PrismaClient as PostgresClient } from '@prisma/client';
// @ts-ignore
import { PrismaClient as SqliteClient } from '../node_modules/@prisma/client-sqlite';

const sqlite = new SqliteClient();
const postgres = new PostgresClient();

async function main() {
  console.log('Starting migration from SQLite to PostgreSQL...');

  // 1. Migrate Users
  console.log('Migrating Users...');
  const users = await sqlite.user.findMany();
  for (const user of users) {
    // Check if user exists to avoid duplicates if running multiple times
    const existing = await postgres.user.findUnique({ where: { id: user.id } });
    if (!existing) {
      await postgres.user.create({
        data: {
          ...user,
          role: user.role === 'ADMIN' ? 'ADMIN' : 'USER', // Convert string back to enum if needed, or if schema matches
        },
      });
    }
  }
  console.log(`Migrated ${users.length} users.`);

  // 2. Migrate Categories
  console.log('Migrating Categories...');
  const categories = await sqlite.category.findMany();
  for (const category of categories) {
    const existing = await postgres.category.findUnique({ where: { id: category.id } });
    if (!existing) {
      await postgres.category.create({ data: category });
    }
  }
  console.log(`Migrated ${categories.length} categories.`);

  // 3. Migrate Products
  console.log('Migrating Products...');
  const products = await sqlite.product.findMany();
  for (const product of products) {
    const existing = await postgres.product.findUnique({ where: { id: product.id } });
    if (!existing) {
      await postgres.product.create({ data: product });
    }
  }
  console.log(`Migrated ${products.length} products.`);

  // 4. Migrate Orders
  console.log('Migrating Orders...');
  const orders = await sqlite.order.findMany();
  for (const order of orders) {
    const existing = await postgres.order.findUnique({ where: { id: order.id } });
    if (!existing) {
      await postgres.order.create({
        data: {
          ...order,
          status: order.status as any, // Cast string to enum
        },
      });
    }
  }
  console.log(`Migrated ${orders.length} orders.`);

  // 5. Migrate OrderItems
  console.log('Migrating OrderItems...');
  const orderItems = await sqlite.orderItem.findMany();
  for (const item of orderItems) {
    const existing = await postgres.orderItem.findUnique({ where: { id: item.id } });
    if (!existing) {
      await postgres.orderItem.create({ data: item });
    }
  }
  console.log(`Migrated ${orderItems.length} order items.`);

    // 6. Migrate CartItems
  console.log('Migrating CartItems...');
  const cartItems = await sqlite.cartItem.findMany();
  for (const item of cartItems) {
    const existing = await postgres.cartItem.findUnique({ where: { id: item.id } });
    if (!existing) {
      await postgres.cartItem.create({ data: item });
    }
  }
  console.log(`Migrated ${cartItems.length} cart items.`);


  console.log('Migration completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  });
