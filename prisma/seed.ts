import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample brands
  const brand1 = await prisma.brand.create({
    data: { name: 'TechGear' },
  })
  const brand2 = await prisma.brand.create({
    data: { name: 'FashionFwd' },
  })

  // Create sample categories
  const category1 = await prisma.category.create({
    data: { name: 'Electronics' },
  })
  const category2 = await prisma.category.create({
    data: { name: 'Clothing' },
  })

  // Create sample origins
  const origin1 = await prisma.origin.create({
    data: { name: 'USA' },
  })
  const origin2 = await prisma.origin.create({
    data: { name: 'China' },
  })

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'Smart Watch',
        description: 'A high-tech smartwatch',
        price: 199.99,
        stock: 50,
        brandId: brand1.id,
        categoryId: category1.id,
        originId: origin1.id,
      },
      {
        name: 'Designer T-Shirt',
        description: 'A stylish designer t-shirt',
        price: 49.99,
        stock: 100,
        brandId: brand2.id,
        categoryId: category2.id,
        originId: origin2.id,
      },
    ],
  })

  console.log('Database has been seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })