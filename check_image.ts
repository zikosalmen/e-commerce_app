import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDellImage() {
  const product = await prisma.product.findUnique({
    where: { slug: 'dell-xps-13-plus' },
    select: { name: true, images: true },
  });

  if (product) {
    console.log(`Product: ${product.name}`);
    console.log(`Images: ${product.images}`);
  } else {
    console.log('Product not found');
  }
}

checkDellImage()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
