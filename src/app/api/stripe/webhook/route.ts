import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Create order in database
        await createOrderFromSession(session)
        break
      }
      
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment succeeded:", paymentIntent.id)
        break
      }
      
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", paymentIntent.id)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId
    const itemsData = session.metadata?.items
    
    if (!itemsData) {
      throw new Error("No items data found in session metadata")
    }

    const items = JSON.parse(itemsData)
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`
    
    // Calculate totals
    const subtotal = session.amount_total ? session.amount_total / 100 : 0
    const tax = session.total_details?.amount_tax 
      ? session.total_details.amount_tax / 100 
      : subtotal * 0.08 // Default 8% tax
    const shipping = session.shipping_cost?.amount_total 
      ? session.shipping_cost.amount_total / 100 
      : 0
    const total = subtotal + tax + shipping

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        email: session.customer_email || session.customer_details?.email || "",
        status: "CONFIRMED",
        paymentStatus: "COMPLETED",
        paymentIntentId: session.payment_intent as string,
        subtotal,
        tax,
        shipping,
        total,
        currency: session.currency || "usd",
        shippingAddress: {
          name: session.customer_details?.name || "",
          address: session.customer_details?.address || {},
        },
        billingAddress: session.customer_details?.address ? {
          name: session.customer_details?.name || "",
          address: session.customer_details?.address,
        } : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productVariantId: item.productVariantId || null,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Update inventory
    for (const item of items) {
      await prisma.inventory.updateMany({
        where: {
          OR: [
            { productId: item.productId },
            { productVariantId: item.productVariantId },
          ],
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    console.log("Order created successfully:", order.orderNumber)
    return order
  } catch (error) {
    console.error("Failed to create order from session:", error)
    throw error
  }
}