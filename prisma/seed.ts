import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest tech gadgets and electronics',
        image: faker.image.url(),
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: faker.image.url(),
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Beautiful items for your home',
        image: faker.image.url(),
      },
    }),
  ])

  // Create products
  const products = await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
          description: faker.commerce.productDescription(),
          price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
          comparePrice: parseFloat(faker.commerce.price({ min: 600, max: 800 })),
          sku: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
          status: 'ACTIVE',
          featured: faker.datatype.boolean({ probability: 0.2 }),
          images: Array.from({ length: 3 }, () => faker.image.url()),
          tags: faker.helpers.arrayElements(['new', 'sale', 'popular', 'limited'], 2),
          categories: {
            create: [
              {
                categoryId: faker.helpers.arrayElement(categories).id,
                position: 0,
              },
            ],
          },
          inventory: {
            create: {
              quantity: faker.number.int({ min: 10, max: 100 }),
              lowStockThreshold: 10,
            },
          },
        },
      })

      // Create variants
      await Promise.all(
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, async () => {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: faker.color.human(),
              sku: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
              price: product.price,
              options: {
                size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                color: faker.color.human(),
              },
              inventory: {
                create: {
                  quantity: faker.number.int({ min: 5, max: 50 }),
                },
              },
            },
          })
        })
      )

      return product
    })
  )

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })