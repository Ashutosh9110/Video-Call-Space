import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export async function createStripeCheckoutSession(
  items: Array<{
    productId: string
    productVariantId?: string
    quantity: number
    price: number
  }>,
  customerEmail: string,
  metadata?: Record<string, string>
) {
  // Fetch product details
  const productIds = items.map(item => item.productId)
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: "ACTIVE",
    },
    include: {
      variants: true,
    },
  })

  // Create line items for Stripe
  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.productId)
    if (!product) throw new Error(`Product ${item.productId} not found`)

    const variant = item.productVariantId 
      ? product.variants.find(v => v.id === item.productVariantId)
      : null

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: variant?.name || product.description?.slice(0, 100),
          images: [product.images[0] || "/placeholder.jpg"],
          metadata: {
            productId: product.id,
            productVariantId: item.productVariantId || "",
          },
        },
        unit_amount: Math.round((variant?.price || product.price) * 100),
      },
      quantity: item.quantity,
    }
  })

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL"],
    },
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    metadata: {
      ...metadata,
      items: JSON.stringify(items.map(item => ({
        productId: item.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.price,
      }))),
    },
    allow_promotion_codes: true,
    automatic_tax: {
      enabled: true,
    },
  })

  return session
}

export async function getStripeSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer"],
  })
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.confirm(paymentIntentId)
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.cancel(paymentIntentId)
}

export async function refundPaymentIntent(
  paymentIntentId: string,
  amount?: number,
  reason?: "duplicate" | "fraudulent" | "requested_by_customer"
) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason,
  })
}