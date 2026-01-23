"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { OrderStatus, PaymentStatus } from "@prisma/client"
import { updateOrderStatus, cancelOrder, refundOrder } from "@/lib/orders"

interface OrderCardProps {
  order: any
  onUpdate?: () => void
  isAdmin?: boolean
}

export function OrderCard({ order, onUpdate, isAdmin = false }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [refundAmount, setRefundAmount] = useState(order.total.toString())

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />
      case "PROCESSING":
        return <Package className="h-4 w-4" />
      case "SHIPPED":
        return <Truck className="h-4 w-4" />
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />
      case "REFUNDED":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "PROCESSING":
        return "bg-purple-100 text-purple-800"
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800"
      case "DELIVERED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "REFUNDED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "FAILED":
        return "bg-red-100 text-red-800"
      case "REFUNDED":
        return "bg-gray-100 text-gray-800"
      case "PARTIALLY_REFUNDED":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to update order status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = async () => {
    setIsUpdating(true)
    try {
      await cancelOrder(order.id, cancelReason)
      setShowCancelDialog(false)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to cancel order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRefund = async () => {
    setIsUpdating(true)
    try {
      await refundOrder(order.id, parseFloat(refundAmount))
      setShowRefundDialog(false)
      onUpdate?.()
    } catch (error) {
      console.error("Failed to refund order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
              <Badge className={getStatusColor(order.status)}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Select
                    value={order.status}
                    onValueChange={handleStatusUpdate}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{order.user?.name || order.email}</p>
              <p className="text-sm text-gray-500">{order.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {order.items.length} items
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />
                
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  <h4 className="font-medium">Order Items</h4>
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                        <img
                          src={item.product?.images[0] || "/placeholder.jpg"}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        {item.productVariant && (
                          <p className="text-xs text-gray-500">
                            {Object.values(item.productVariant.options).join(", ")}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingAddress?.name}</p>
                    <p>
                      {order.shippingAddress?.address?.line1}
                      {order.shippingAddress?.address?.line2 && 
                        `, ${order.shippingAddress.address.line2}`
                      }
                    </p>
                    <p>
                      {order.shippingAddress?.address?.city}, 
                      {order.shippingAddress?.address?.state} 
                      {order.shippingAddress?.address?.postal_code}
                    </p>
                    <p>{order.shippingAddress?.address?.country}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
                  <div className="flex gap-2 mt-4">
                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Order</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reason">Reason for cancellation</Label>
                            <Textarea
                              id="reason"
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Enter reason for cancellation..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowCancelDialog(false)}
                            >
                              Close
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleCancel}
                              disabled={isUpdating}
                            >
                              Cancel Order
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refund
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Refund Order</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amount">Refund Amount</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={refundAmount}
                              onChange={(e) => setRefundAmount(e.target.value)}
                              max={order.total}
                              step="0.01"
                            />
                            <p className="text-sm text-gray-500">
                              Maximum: {formatPrice(order.total)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setShowRefundDialog(false)}
                            >
                              Close
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleRefund}
                              disabled={isUpdating}
                            >
                              Process Refund
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}