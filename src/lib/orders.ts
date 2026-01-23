import { prisma } from "@/lib/prisma"
import { OrderStatus, PaymentStatus } from "@prisma/client"

export async function getOrders({
  page = 1,
  limit = 10,
  status,
  userId,
  search,
}: {
  page?: number
  limit?: number
  status?: OrderStatus
  userId?: string
  search?: string
} = {}) {
  const skip = (page - 1) * limit

  const where: any = {}

  if (userId) {
    where.userId = userId
  }

  if (status) {
    where.status = status
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
            productVariant: {
              select: {
                id: true,
                name: true,
                options: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        fulfillment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    total,
    pages: Math.ceil(total / limit),
  }
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
          productVariant: {
            select: {
              id: true,
              name: true,
              options: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      fulfillment: true,
    },
  })
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
) {
  const updateData: any = {
    status,
    updatedAt: new Date(),
  }

  if (paymentStatus) {
    updateData.paymentStatus = paymentStatus
  }

  // If status is being updated to SHIPPED, create/update fulfillment
  if (status === "SHIPPED") {
    updateData.fulfillment = {
      upsert: {
        create: {
          status: "SHIPPED",
          shippedAt: new Date(),
        },
        update: {
          status: "SHIPPED",
          shippedAt: new Date(),
        },
      },
    }
  }

  // If status is being updated to DELIVERED, update fulfillment
  if (status === "DELIVERED") {
    updateData.fulfillment = {
      update: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
    }
  }

  return prisma.order.update({
    where: { id },
    data: updateData,
    include: {
      items: true,
      fulfillment: true,
    },
  })
}

export async function cancelOrder(id: string, reason?: string) {
  return prisma.order.update({
    where: { id },
    data: {
      status: "CANCELLED",
      notes: reason,
      updatedAt: new Date(),
    },
  })
}

export async function refundOrder(id: string, amount?: number) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  })

  if (!order) {
    throw new Error("Order not found")
  }

  const refundAmount = amount || order.total

  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      status: "REFUNDED",
      paymentStatus: refundAmount === order.total ? "REFUNDED" : "PARTIALLY_REFUNDED",
      updatedAt: new Date(),
    },
  })

  // Restore inventory
  for (const item of order.items) {
    await prisma.inventory.updateMany({
      where: {
        OR: [
          { productId: item.productId },
          { productVariantId: item.productVariantId },
        ],
      },
      data: {
        quantity: {
          increment: item.quantity,
        },
      },
    })
  }

  return updatedOrder
}

export async function getOrderStats() {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.aggregate({
      where: {
        status: { in: ["DELIVERED", "SHIPPED"] },
        paymentStatus: "COMPLETED",
      },
      _sum: {
        total: true,
      },
    }),
  ])

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue: totalRevenue._sum.total || 0,
  }
}