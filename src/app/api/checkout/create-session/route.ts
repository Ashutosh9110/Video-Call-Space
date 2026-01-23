import { NextRequest, NextResponse } from "next/server"
import { createStripeCheckoutSession } from "@/lib/stripe"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      )
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: "Invalid item format" },
          { status: 400 }
        )
      }
    }

    const stripeSession = await createStripeCheckoutSession(
      items,
      session.user.email!,
      {
        userId: session.user.id,
      }
    )

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error("Checkout session creation failed:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}