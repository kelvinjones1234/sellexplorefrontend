"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  ExternalLink,
  Calendar,
  CreditCard,
  User,
  Phone,
  MapPin,
  Package,
  ChevronDown,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "../../api";
import { toast } from "react-toastify";

interface OrderDetails {
  id: string;
  orderId: string;
  status: "processing" | "pending" | "fulfilled" | "cancelled" | "abandoned";
  date: string;
  items: Array<{
    name: string;
    image: string;
    price: string;
    originalPrice?: string | null;
    quantity: number;
    option: string;
    optionPrice: string;
    itemTotal: string;
  }>;
  totalAmount: string;
  deliveryFee: string; // Added delivery fee
  paymentStatus: "UNPAID" | "PAID";
  customer: {
    name: string;
    phone: string;
  };
  delivery: {
    contactName: string;
    phone: string;
    address: string;
    location: string;
    price: string;
  };
  sourceChannel: string;
  orderLink: string;
}

const statusColors: Record<string, string> = {
  processing: "bg-orange-100 text-orange-700",
  pending: "bg-yellow-100 text-yellow-700",
  fulfilled: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  abandoned: "bg-gray-100 text-gray-700",
};

const Main: React.FC = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order_id) return;
      try {
        setLoading(true);
        const response = await apiClient.getOrderDetails(order_id as string);

        // Calculate item totals and overall total
        const items = response.items.map((item: any) => {
          // Parse the option to extract name and price (e.g., "option 2:22" -> name: "option 2", price: "22")
          const [optionName, optionPrice] = item.option.includes(":")
            ? item.option.split(":")
            : [item.option, "0"];
          const optPrice = parseFloat(optionPrice || "0");
          // Use option price as main price if option exists, otherwise use discount_price or price
          const mainPrice =
            optionName !== "default"
              ? optPrice
              : parseFloat(item.discount_price || item.price);
          const itemTotal = mainPrice * item.quantity;

          return {
            name: item.product.name,
            image:
              item.product.images[0]?.image ||
              "https://via.placeholder.com/100",
            price: `NGN ${mainPrice.toFixed(2)}`,
            originalPrice:
              item.discount_price && optionName !== "default"
                ? `NGN ${parseFloat(item.price).toFixed(2)}`
                : null,
            quantity: item.quantity,
            option: optionName,
            optionPrice: `NGN ${optPrice.toFixed(2)}`,
            itemTotal: `NGN ${itemTotal.toFixed(2)}`,
          };
        });

        // Calculate overall total: sum of item totals + delivery fee
        const deliveryFee = parseFloat(
          response.delivery_area.delivery_fee || "0"
        );
        const itemsTotal = items.reduce(
          (sum: number, item: any) =>
            sum + parseFloat(item.itemTotal.replace("NGN ", "")),
          0
        );
        const overallTotal = itemsTotal + deliveryFee;

        const formattedOrder: OrderDetails = {
          id: response.o_id,
          orderId: response.o_id,
          status: response.status,
          date: new Date(response.created_at).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          items,
          totalAmount: `NGN ${overallTotal.toFixed(2)}`,
          deliveryFee: `NGN ${deliveryFee.toFixed(2)}`, // Added delivery fee
          paymentStatus: response.status === "abandoned" ? "UNPAID" : "PAID",
          customer: {
            name: response.customer.name,
            phone: response.customer.phone,
          },
          delivery: {
            contactName:
              response.recipient_type === "myself"
                ? response.customer.name
                : response.customer.name,
            phone: response.customer.phone,
            address: response.customer.address,
            location: response.delivery_area.location,
            price: `NGN ${deliveryFee.toFixed(2)}`,
          },
          sourceChannel: "STORE FRONT",
          orderLink: `catlog.shop/orders/${response.o_id}`,
        };
        setOrder(formattedOrder);
      } catch (err: any) {
        setError(err.message || "Failed to fetch order details");
        toast.error(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const updateOrderStatus = async (newStatus: "cancelled" | "fulfilled") => {
    if (!order) return;
    if (
      newStatus === "cancelled" &&
      !window.confirm("Are you sure you want to cancel this order?")
    ) {
      return;
    }
    try {
      setLoading(true);
      await apiClient.updateOrderStatus(order.orderId, newStatus);
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      toast.success(`Order status updated to ${newStatus}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || `Failed to update order status to ${newStatus}`);
      toast.error(
        err.message || `Failed to update order status to ${newStatus}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No order found
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3 z-10">
        <div className="flex justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <span className="font-medium hover:text-[var(--color-brand-hover)] text-[var(--color-text-primary)] transition-colors cursor-pointer">
              Orders
            </span>
            <span>›</span>
            <span className="truncate">Order {order.orderId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">⚡</span>
            <span className="text-sm font-medium">Quick Actions</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </header>

      <div className="pb-6">
        {/* Order Header Card */}
        <div className="border-b border-[var(--color-border-default)]">
          <div className="px-4 py-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {order.customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-md sm:text-lg font-semibold text-[var(--color-text-primary)]">
                      Order {order.orderId}
                    </h1>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
              {order.status === "processing" && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => updateOrderStatus("cancelled")}
                    className="px-5 py-2.5 text-sm font-medium text-red-600 rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => updateOrderStatus("fulfilled")}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    Mark as Fulfilled
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 pt-6">
          {/* Customer Details Card - First on Mobile */}
          <div className="lg:hidden rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden">
            <div className="px-4 py-4 border-b border-[var(--color-border-default)]">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Customer Details
              </h2>
            </div>

            <div className="px-4 py-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                  {order.customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {order.customer.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {order.customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Source Channel</span>
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {order.sourceChannel}
                </span>
              </div>

              <button className="text-sm font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] flex items-center gap-1">
                View Profile
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Delivery Details Card - Second on Mobile */}
          <div className="lg:hidden rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden">
            <div className="px-4 py-4 border-b border-[var(--color-border-default)]">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Delivery Details
              </h2>
            </div>

            <div className="px-4 py-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Contact Name</span>
                </div>
                <span className="text-sm font-medium text-[var(--color-text-secondary)] text-right">
                  {order.delivery.contactName}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.delivery.phone}
                  </span>
                  <button
                    onClick={() => copyToClipboard(order.delivery.phone)}
                    className="text-[var(--color-text-secondary)]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Delivery Address</span>
                </div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] pl-6">
                  {order.delivery.address}
                </p>
              </div>
            </div>
          </div>

          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <div className="rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden">
              <div className="px-4 py-2.5 flex sm:flex-row items-center justify-between gap-3 border-b border-[var(--color-border-default)]">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Order Details
                </h2>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-[var(--color-brand-primary)] rounded-lg">
                    <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-4 space-y-4">
                {/* Payment Status */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Payment Status</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-start justify-between py-3 gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] text-right">
                    {order.date}
                  </span>
                </div>

                {/* Items */}
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 py-3 border-t border-[var(--color-border-default)] text-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-[var(--color-border-default)] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-[var(--color-text-primary)]">
                        {item.name}
                      </h3>
                      {item.option !== "default" && (
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                          {item.option}: {item.optionPrice}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-[var(--color-text-secondary)] line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-[var(--color-text-secondary)] mt-1">
                        Total: {item.itemTotal}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-[var(--color-text-secondary)] flex-shrink-0">
                      {item.quantity} UNIT
                    </div>
                  </div>
                ))}

                {/* Delivery Fee */}
                {order.deliveryFee !== "NGN 0.00" && (
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-default)]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        Delivery Fee
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {order.deliveryFee}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-default)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">N</span>
                    </div>
                    <span className="text-sm sm:text-sm font-medium text-[var(--color-text-secondary)]">
                      Total Amount
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[var(--color-text-primary)]">
                    {order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice and Receipt Card */}
            <div className="rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden text-sm">
              <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Invoice and Receipt
                </h2>
                <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>

              <div className="px-4 py-6 space-y-3 text-xs">
                {/* Invoice Link */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Invoice Link</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(order.orderLink)}
                    className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] flex items-center gap-1 self-start sm:self-auto"
                  >
                    Copy Link
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* View & Manage Invoice */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">View & Manage Invoice</span>
                  </div>
                  <button className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] flex items-center gap-1 self-start sm:self-auto">
                    View Invoice
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                {/* Receipt Link */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Receipt Link</span>
                  </div>
                  <button className="font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] flex items-center gap-1 self-start sm:self-auto">
                    Generate Receipt
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            {/* Customer Details Card */}
            <div className="rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden">
              <div className="px-4 py-4 border-b border-[var(--color-border-default)]">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Customer Details
                </h2>
              </div>

              <div className="px-4 py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                    {order.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                      {order.customer.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {order.customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Source Channel</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.sourceChannel}
                  </span>
                </div>

                <button className="text-sm font-medium text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] flex items-center gap-1">
                  View Profile
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Delivery Details Card */}
            <div className="rounded-lg shadow-xs border border-[var(--color-border-default)] overflow-hidden text-sm">
              <div className="px-4 py-4 border-b border-[var(--color-border-default)]">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Delivery Details
                </h2>
              </div>

              <div className="px-4 py-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Contact Name</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.delivery.contactName}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {order.delivery.phone}
                    </span>
                    <button
                      onClick={() => copyToClipboard(order.delivery.phone)}
                      className="text-[var(--color-text-secondary)]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.delivery.location}
                  </span>
                </div>

                <div className="space-y-2 pl-6">
                  <div className="flex items-center gap-2 text-[var(--color-text-primary)]">
                    <span className="text-sm">Delivery Address</span>
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {order.delivery.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
