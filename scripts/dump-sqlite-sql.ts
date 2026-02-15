/*
import fs from 'fs';
// @ts-ignore
import { PrismaClient } from '../node_modules/@prisma/client-sqlite';

const prisma = new PrismaClient();

const escape = (val: any): string => {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
};

const generateInserts = async (tableName: string, modelName: string) => {
  // @ts-ignore
  const data = await prisma[modelName].findMany();
  if (data.length === 0) return [];

  const columns = Object.keys(data[0]).join(', ');
  
  return data.map((row: any) => {
    const values = Object.values(row).map(escape).join(', ');
    return `INSERT INTO "${tableName}" (${columns}) VALUES (${values});`;
  });
};

async function main() {
  const stream = fs.createWriteStream('dump.sql', { flags: 'a' });
  
  try {
    console.log('Dumping User...');
    const users = await generateInserts('User', 'user');
    users.forEach(line => stream.write(line + '\n'));

    console.log('Dumping Account...');
    const accounts = await generateInserts('Account', 'account');
    accounts.forEach(line => stream.write(line + '\n'));

    console.log('Dumping Session...');
    const sessions = await generateInserts('Session', 'session');
    sessions.forEach(line => stream.write(line + '\n'));

    console.log('Dumping VerificationToken...');
    const tokens = await generateInserts('VerificationToken', 'verificationToken');
    tokens.forEach(line => stream.write(line + '\n'));

    console.log('Dumping Category...');
    const categories = await generateInserts('Category', 'category');
    categories.forEach(line => stream.write(line + '\n'));

    console.log('Dumping Product...');
    const products = await generateInserts('Product', 'product');
    products.forEach(line => stream.write(line + '\n'));

    console.log('Dumping CartItem...');
    const cartItems = await generateInserts('CartItem', 'cartItem');
    cartItems.forEach(line => stream.write(line + '\n'));

    console.log('Dumping Order...');
    const orders = await generateInserts('Order', 'order');
    orders.forEach(line => stream.write(line + '\n'));

    console.log('Dumping OrderItem...');
    const orderItems = await generateInserts('OrderItem', 'orderItem');
    orderItems.forEach(line => stream.write(line + '\n'));

    console.log('Done.');
  } catch (e) {
    console.error(e);
  } finally {
    stream.end();
    await prisma.$disconnect();
  }
}

main();

hh */