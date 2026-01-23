import { prisma } from "@/lib/prisma"
import { Product, ProductVariant, Category } from "@prisma/client"

export type ProductWithVariants = Product & {
  variants: ProductVariant[]
  categories: (ProductCategory & { category: Category })[]
  inventory: Inventory | null
  _count: {
    reviews: number
  }
}

export async function getProducts({
  page = 1,
  limit = 12,
  category,
  search,
  sort = "createdAt",
  order = "desc",
  featured = false,
}: {
  page?: number
  limit?: number
  category?: string
  search?: string
  sort?: string
  order?: "asc" | "desc"
  featured?: boolean
} = {}): Promise<{
  products: ProductWithVariants[]
  total: number
  pages: number
}> {
  const skip = (page - 1) * limit

  const where: any = {
    status: "ACTIVE",
  }

  if (featured) {
    where.featured = true
  }

  if (category) {
    where.categories = {
      some: {
        category: {
          slug: category,
        },
      },
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { hasSome: [search] } },
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        variants: true,
        categories: {
          include: {
            category: true,
          },
        },
        inventory: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        [sort]: order,
      },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  return prisma.product.findUnique({
    where: {
      slug,
      status: "ACTIVE",
    },
    include: {
      variants: {
        include: {
          inventory: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      inventory: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
  })
}

export async function getFeaturedProducts(limit = 8): Promise<ProductWithVariants[]> {
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      featured: true,
    },
    include: {
      variants: true,
      categories: {
        include: {
          category: true,
        },
      },
      inventory: true,
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: {
          products: {
            where: {
              status: "ACTIVE",
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function getRelatedProducts(productId: string, limit = 4) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      categories: true,
    },
  })

  if (!product) return []

  const categoryIds = product.categories.map(pc => pc.categoryId)

  return prisma.product.findMany({
    where: {
      id: { not: productId },
      status: "ACTIVE",
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    },
    include: {
      variants: true,
      categories: {
        include: {
          category: true,
        },
      },
      inventory: true,
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })
}