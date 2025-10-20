"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import { apiClient } from "../api";
import { cartApi } from "../cartApi";

interface CartModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface CouponData {
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  products: {
    id: number;
    name: string;
    price: number;
    discount_price: number | null;
  }[];
}

interface CartItem {
  id: number;
  cartItemId: string;
  name: string;
  image: string;
  price: number;
  discount_price: number | null;
  selectedOption: string;
  quantity: number;
  effectivePrice?: number;
  itemDiscount?: number;
  orderItemId?: number;
}

const CartModal = ({ isOpen = true, onClose = () => {} }: CartModalProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState(0);
  const [showItemDetails, setShowItemDetails] = useState<{
    [key: string]: boolean;
  }>({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipient: "Myself",
    fullName: "",
    phoneNumber: "",
    email: "",
    deliveryArea: "",
    deliveryAddress: "",
    orderNotes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryAreaOptions, setDeliveryAreaOptions] = useState<
    { value: string; label: string; disabled?: boolean; deliveryFee?: number }[]
  >([{ value: "", label: "Select Delivery Area", disabled: true }]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, number>>({});
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);

  // Fetch delivery area options
  useEffect(() => {
    if (!isOpen) return;

    const fetchDeliveryAreas = async () => {
      setDeliveryLoading(true);
      setError(null);
      try {
        const response = await apiClient.getDeliveryAreaOptions();
        const options = [
          { value: "", label: "Select Delivery Area", disabled: true },
          ...response.delivery_locations.map((loc) => ({
            value: loc.id.toString(),
            label: `${loc.location} (₦${parseFloat(
              loc.delivery_fee
            ).toLocaleString()})`,
            deliveryFee: parseFloat(loc.delivery_fee),
          })),
        ];
        setDeliveryAreaOptions(options);

        if (options.length > 1) {
          const firstValidOption = options.find((opt) => !opt.disabled);
          if (firstValidOption) {
            setFormData((prev) => ({
              ...prev,
              deliveryArea: firstValidOption.value,
            }));
            setDeliveryFee(firstValidOption.deliveryFee || 0);
          }
        } else {
          setDeliveryFee(0);
        }
      } catch (err) {
        console.error("Failed to fetch delivery areas:", err);
        setError("Failed to load delivery areas. Please try again.");
        setDeliveryFee(0);
      } finally {
        setDeliveryLoading(false);
      }
    };

    fetchDeliveryAreas();
  }, [isOpen]);

  // Update delivery fee when deliveryArea changes
  useEffect(() => {
    const selectedOption = deliveryAreaOptions.find(
      (opt) => opt.value === formData.deliveryArea
    );
    if (selectedOption && "deliveryFee" in selectedOption) {
      setDeliveryFee(selectedOption.deliveryFee || 0);
    } else {
      setDeliveryFee(0);
    }
  }, [formData.deliveryArea, deliveryAreaOptions]);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError(null);
    setCouponMessage(null);
    try {
      const response = await cartApi.applyCoupon(couponCode);
      const applicableItems = cart.filter((item) =>
        response.products.some((p) => p.id === item.id)
      );
      if (applicableItems.length === 0) {
        setCouponMessage(
          `Coupon "${response.code}" is valid but does not apply to any items in your cart.`
        );
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(response);
        setCouponMessage(null);
      }

      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon");
      setAppliedCoupon(null);
      setCouponMessage(null);
    } finally {
      setCouponLoading(false);
    }
  };

  // Calculate totals with coupon discount
  const calculateTotals = () => {
    let rawSubtotal = 0;
    let couponDiscount = 0;

    const applicableCart = cart.filter((item) =>
      appliedCoupon?.products.some((p) => p.id === item.id)
    );

    let applicableSubtotal = 0;
    applicableCart.forEach((item) => {
      const itemPrice = item.discount_price ?? item.price;
      applicableSubtotal += itemPrice * item.quantity;
    });

    if (appliedCoupon && applicableCart.length > 0 && applicableSubtotal > 0) {
      if (appliedCoupon.discount_type === "fixed") {
        couponDiscount = appliedCoupon.discount_value;
      } else if (appliedCoupon.discount_type === "percentage") {
        couponDiscount =
          (applicableSubtotal * appliedCoupon.discount_value) / 100;
      }
    }

    const updatedCart: CartItem[] = cart.map((item) => {
      let itemPrice = item.discount_price ?? item.price;
      let itemDiscount = 0;

      const isApplicable =
        appliedCoupon && appliedCoupon.products.some((p) => p.id === item.id);

      if (isApplicable && applicableSubtotal > 0) {
        const itemSubtotal = itemPrice * item.quantity;
        const itemCouponDiscount =
          (itemSubtotal / applicableSubtotal) * couponDiscount;
        itemDiscount = itemCouponDiscount / item.quantity;
        itemPrice = Math.max(0, itemPrice - itemDiscount);
      }

      rawSubtotal += (itemPrice + itemDiscount) * item.quantity;
      return { ...item, effectivePrice: itemPrice, itemDiscount };
    });

    const subtotal = rawSubtotal - couponDiscount;
    const total = subtotal + deliveryFee;
    return { subtotal, discount: couponDiscount, total, updatedCart };
  };

  const { subtotal, discount, total, updatedCart } = calculateTotals();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const toggleItemDetails = (productId: string) => {
    setShowItemDetails((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Group cart items by product ID
  const groupedCart = updatedCart.reduce(
    (
      acc: Record<
        string,
        {
          productInfo: any;
          options: any[];
          totalQuantity: number;
          totalPrice: number;
        }
      >,
      item
    ) => {
      const productKey = item.id.toString();

      if (!acc[productKey]) {
        acc[productKey] = {
          productInfo: {
            id: item.id,
            name: item.name.split(" (")[0],
            image: item.image,
            basePrice: item.price,
            discount_price: item.discount_price,
            effectivePrice: item.effectivePrice,
          },
          options: [],
          totalQuantity: 0,
          totalPrice: 0,
        };
      }

      acc[productKey].options.push({
        cartItemId: item.cartItemId,
        name: item.selectedOption,
        price: item.effectivePrice,
        originalPrice: item.discount_price ?? item.price,
        quantity: item.quantity,
        itemDiscount: item.itemDiscount,
        orderItemId: orderItems[item.cartItemId],
      });

      acc[productKey].totalQuantity += item.quantity;
      acc[productKey].totalPrice +=
        (item.effectivePrice || item.price) * item.quantity;

      return acc;
    },
    {}
  );

  const nextStep = () => {
    if (currentStep === 1) {
      const newErrors: Record<string, string | null> = {};
      if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required";
      if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = "Delivery Address is required";

      setFormErrors(newErrors);

      if (Object.values(newErrors).some((e) => e !== null)) {
        return;
      }

      handleCreateCustomer();
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const recipientOptions = [
    { value: "Myself", label: "Myself" },
    { value: "Someone else", label: "Someone else" },
  ];

  const handleCreateCustomer = async () => {
    setCustomerLoading(true);
    setError(null);
    try {
      const customerData = {
        name: formData.fullName,
        phone: formData.phoneNumber,
        email: formData.email || "",
        address: formData.deliveryAddress,
      };
      const response = await cartApi.createCustomer(customerData);
      setCustomerId(response.id);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to create customer");
      console.error("Failed to create customer:", err);
    } finally {
      setCustomerLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!customerId) {
      setError("Customer not created. Please go back and try again.");
      return;
    }
    setOrderLoading(true);
    setError(null);
    try {
      const invalidItems = cart.filter(
        (item) =>
          item.id === undefined ||
          item.price === undefined ||
          item.quantity === undefined
      );
      if (invalidItems.length > 0) {
        console.error("Invalid cart items:", invalidItems);
        setError(
          "Some cart items are missing required fields (id, price, or quantity)."
        );
        setOrderLoading(false);
        return;
      }

      const orderData = {
        customer_id: customerId,
        delivery_area_id: formData.deliveryArea
          ? parseInt(formData.deliveryArea)
          : null,
        recipient_type:
          formData.recipient.toLowerCase() === "myself"
            ? "myself"
            : "someone_else",
        order_notes: formData.orderNotes,
        items: cart.map((item) => ({
          product_id: item.id,
          option: item.selectedOption,
          quantity: item.quantity,
          price: item.price,
          discount_price: appliedCoupon?.products.some((p) => p.id === item.id)
            ? item.effectivePrice ?? item.discount_price ?? item.price
            : item.discount_price || null,
        })),
      };

      console.log("Order data being sent:", JSON.stringify(orderData, null, 2));

      const response = await cartApi.createOrder(orderData);
      setOrderId(response.id);
      const itemMapping: Record<string, number> = {};
      response.items.forEach((item: any) => {
        const cartItem = cart.find(
          (ci) => ci.id === item.product_id && ci.selectedOption === item.option
        );
        if (cartItem) {
          itemMapping[cartItem.cartItemId] = item.id;
        }
      });
      setOrderItems(itemMapping);
      nextStep();
    } catch (err: any) {
      setError(err.message || "Failed to create order");
      console.error("Failed to create order:", err);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (!orderId || !orderItems[cartItemId]) return;

    setUpdatingItems((prev) => new Set([...prev, cartItemId]));
    setError(null);
    try {
      const orderItemId = orderItems[cartItemId];
      const cartItem = cart.find((item) => item.cartItemId === cartItemId);
      if (!cartItem) return;

      await cartApi.updateOrderItem(orderId, orderItemId, {
        quantity: newQuantity,
        discount_price:
          cartItem.effectivePrice ?? cartItem.discount_price ?? null,
      });
      updateQuantity(cartItemId, newQuantity);
    } catch (err: any) {
      setError(err.message || "Failed to update item quantity");
      console.error("Failed to update item quantity:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!orderId || !orderItems[cartItemId]) {
      removeFromCart(cartItemId);
      return;
    }

    setUpdatingItems((prev) => new Set([...prev, cartItemId]));
    setError(null);
    try {
      const orderItemId = orderItems[cartItemId];
      await cartApi.updateOrderItem(orderId, orderItemId, { quantity: 0 });
      removeFromCart(cartItemId);
      setOrderItems((prev) => {
        const newItems = { ...prev };
        delete newItems[cartItemId];
        return newItems;
      });
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId) return;

    setConfirmLoading(true);
    setError(null);
    try {
      await cartApi.updateOrderStatus(orderId, "abandoned");
      alert("Order placed successfully!");
      clearCart();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to confirm order");
      console.error("Failed to confirm order:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderCartStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border-strong)] border border-[var(--color-border-default)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {Object.keys(groupedCart).length}{" "}
          {Object.keys(groupedCart).length === 1 ? "Product" : "Products"} •{" "}
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-sm text-[var(--color-brand-primary)] mb-4">
          Review your items and proceed to checkout when you're ready
        </p>

        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <FloatingLabelInput
              name="couponCode"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter Coupon Code"
            />
            <button
              onClick={handleApplyCoupon}
              className="py-2 px-4 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition disabled:opacity-50"
              disabled={couponLoading}
            >
              {couponLoading ? "Applying..." : "Apply"}
            </button>
          </div>
          {couponError && (
            <p className="text-sm text-red-500 mt-2">{couponError}</p>
          )}
          {couponMessage && (
            <p className="text-sm text-yellow-500 mt-2">{couponMessage}</p>
          )}
          {appliedCoupon && !couponMessage && (
            <p className="text-sm text-green-500 mt-2">
              Coupon "{appliedCoupon.code}" applied successfully!{" "}
              {appliedCoupon.discount_type === "fixed"
                ? `₦${appliedCoupon.discount_value.toLocaleString()} off`
                : `${appliedCoupon.discount_value}% off`}
            </p>
          )}
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)] text-center py-8">
            Your cart is empty.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedCart).map(([productId, productData]) => {
              const isExpanded = showItemDetails[productId] === true;
              const hasCoupon = appliedCoupon?.products.some(
                (p) => p.id === productData.productInfo.id
              );

              return (
                <div
                  key={productId}
                  className="border border-[var(--color-border-default)] rounded-2xl overflow-hidden"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={productData.productInfo.image}
                        alt={productData.productInfo.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                          {productData.productInfo.name}
                          {hasCoupon && (
                            <span className="ml-2 text-xs text-green-500">
                              (Coupon Applied)
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-xs text-[var(--color-text-secondary)] mt-1">
                          <span className="w-2 h-2 bg-[var(--color-brand-primary)] rounded-full mr-1"></span>
                          {productData.totalQuantity}{" "}
                          {productData.totalQuantity === 1 ? "item" : "items"} •
                          NGN {productData.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleItemDetails(productId)}
                      className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition"
                      aria-label={isExpanded ? "Hide options" : "Show options"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[var(--color-border-default)]">
                      {productData.options.map((option, optionIndex) => {
                        const isUpdating = updatingItems.has(option.cartItemId);
                        return (
                          <div
                            key={`${option.cartItemId}-${optionIndex}`}
                            className="flex items-center justify-between p-4 border-b border-[var(--color-border-default)] last:border-b-0"
                          >
                            <div className="flex flex-col gap-y-4">
                              <span className="text-sm text-[var(--color-text-primary)] font-medium">
                                Option: {option.name}
                              </span>
                              <div className="text-sm text-[var(--color-text-primary)] font-medium">
                                {option.itemDiscount > 0 ? (
                                  <>
                                    <span className="line-through text-[var(--color-text-secondary)] mr-2">
                                      NGN{" "}
                                      {(
                                        option.originalPrice * option.quantity
                                      ).toLocaleString()}
                                    </span>
                                    <span className="text-green-500">
                                      NGN{" "}
                                      {(
                                        option.price * option.quantity
                                      ).toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span>
                                    NGN{" "}
                                    {(
                                      option.price * option.quantity
                                    ).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end space-y-4">
                              <button
                                onClick={() =>
                                  handleRemoveFromCart(option.cartItemId)
                                }
                                className="text-red-500 hover:text-red-700 transition p-1 disabled:opacity-50"
                                aria-label="Remove option"
                                disabled={isUpdating}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      option.cartItemId,
                                      Math.max(0, option.quantity - 1)
                                    )
                                  }
                                  className="w-8 h-6 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition disabled:opacity-50"
                                  aria-label="Decrease quantity"
                                  disabled={isUpdating}
                                >
                                  -
                                </button>
                                <span className="px-3 py-2 text-sm text-[var(--color-brand-primary)] min-w-[2rem] text-center">
                                  {option.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      option.cartItemId,
                                      option.quantity + 1
                                    )
                                  }
                                  className="w-8 h-6 flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition disabled:opacity-50"
                                  aria-label="Increase quantity"
                                  disabled={isUpdating}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-0">
        {cart.length > 0 && (
          <>
            <div className="border-t border-[var(--color-border-strong)] my-4"></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Subtotal
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  NGN {subtotal.toLocaleString()}
                </p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-green-500">
                    Coupon Discount
                  </p>
                  <p className="text-sm font-semibold text-green-500">
                    - NGN {discount.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Delivery Fee
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  NGN {deliveryFee.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border-strong)]">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Total
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  NGN {total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {}}
                className="flex-1 py-3 text-sm font-semibold  transition bg-[var(--color-bg-secondary)]  hover:bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]  rounded-xl"
              >
                Make an Enquiry
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-xl text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition"
              >
                Proceed
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );

  const renderPurchaseInfoStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Purchase Information
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border-strong)] border border-[var(--color-border-default)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border-strong)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-brand-primary)] h-1 rounded-full"
            style={{ width: "33%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {deliveryLoading ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Loading delivery areas...
          </p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-sm text-[var(--color-brand-primary)] mb-6">
              You're almost there! Kindly fill in the following information
              before proceeding to checkout
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[var(--color-text-primary)] mb-2">
                  Who will receive this item?
                </label>
                <FloatingLabelSelect
                  name="recipient"
                  value={formData.recipient}
                  onChange={(value) =>
                    handleInputChange("recipient", value as string)
                  }
                  placeholder="Who will receive this item?"
                  options={recipientOptions}
                />
              </div>

              <div>
                <h3 className="font-xs font-semibold text-[var(--color-text-primary)] mb-4">
                  Your Details
                </h3>
                <div className="space-y-4">
                  <FloatingLabelInput
                    name="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="Full Name"
                    required
                    error={formErrors.fullName}
                  />
                  <FloatingLabelInput
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder="Your Phone Number (Preferably Whatsapp)"
                    type="text"
                    required
                    error={formErrors.phoneNumber}
                  />

                  <FloatingLabelInput
                    name="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email Address (optional)"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-xs font-semibold text-[var(--color-text-primary)] mb-4">
                  Delivery Details
                </h3>
                <div className="space-y-4">
                  {deliveryAreaOptions.length > 1 && (
                    <FloatingLabelSelect
                      id="deliveryArea"
                      name="deliveryArea"
                      value={formData.deliveryArea}
                      onChange={(value) =>
                        handleInputChange("deliveryArea", value as string)
                      }
                      placeholder="Select Delivery Area"
                      options={deliveryAreaOptions}
                    />
                  )}
                  <FloatingLabelTextarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      handleInputChange("deliveryAddress", e.target.value)
                    }
                    placeholder="Delivery Address"
                    rows={4}
                    required
                    error={formErrors.deliveryAddress}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-shrink-0 p-6 pt-0">
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="flex space-x-3">
          <button
            onClick={prevStep}
            className="flex-1 py-3 text-sm font-semibold  bg-[var(--color-bg-secondary)]  hover:bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]  rounded-xl transition"
          >
            Go Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition disabled:opacity-50"
            disabled={customerLoading}
          >
            {customerLoading ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </>
  );

  const renderExtraInfoStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Extra Information
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border-strong)] border border-[var(--color-border-default)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border-strong)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-brand-primary)] h-1 rounded-full"
            style={{ width: "66%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[var(--color-brand-primary)] mb-6 font-medium">
              Do you have any notes or special instructions?
            </label>
            <label className="block text-sm text-[var(--color-text-primary)] mb-2">
              Order Notes
            </label>
            <FloatingLabelTextarea
              name="orderNotes"
              value={formData.orderNotes}
              onChange={(e) => handleInputChange("orderNotes", e.target.value)}
              placeholder="Order Notes"
              rows={6}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-0">
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="flex space-x-3">
          <button
            onClick={prevStep}
            className="flex-1 py-3 text-sm font-semibold  bg-[var(--color-bg-secondary)]  hover:bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]  rounded-xl transition"
          >
            Go Back
          </button>
          <button
            onClick={handleCreateOrder}
            className="flex-1 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition disabled:opacity-50"
            disabled={orderLoading}
          >
            {orderLoading ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </>
  );

  const renderOrderSummaryStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Order Summary
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border-strong)] border border-[var(--color-border-default)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border-strong)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-brand-primary)] h-1 rounded-full"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-sm text-[var(--color-brand-primary)] mb-6">
          You're almost there! Kindly review the following information before
          proceeding to checkout
        </p>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={cart[0]?.image || "/api/placeholder/48/48"}
              alt="Product"
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-[var(--color-text-primary)]">
                {cart[0]?.name.split(" (")[0] || "Asymmetric Swan Dress"} and{" "}
                {Object.keys(groupedCart).length - 1} other{" "}
                {Object.keys(groupedCart).length - 1 === 1 ? "Item" : "Items"}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                NGN {subtotal.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSummaryDetails((prev) => !prev)}
            className="text-sm text-[var(--color-brand-primary)] hover:text-[var(--color-primary-hover)] underline"
          >
            {showSummaryDetails ? "Hide" : "View"} All Items
          </button>

          {showSummaryDetails && (
            <div className="space-y-4">
              {Object.entries(groupedCart).map(([productId, productData]) => {
                const hasCoupon = appliedCoupon?.products.some(
                  (p) => p.id === productData.productInfo.id
                );
                return (
                  <div
                    key={productId}
                    className="border border-[var(--color-border-default)] rounded-2xl p-4"
                  >
                    <div className="flex items-start space-x-4 mb-2">
                      <img
                        src={productData.productInfo.image}
                        alt={productData.productInfo.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text-primary)] text-sm">
                          {productData.productInfo.name}
                          {hasCoupon && (
                            <span className="ml-2 text-xs text-green-500">
                              (Coupon Applied)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {productData.totalQuantity}{" "}
                          {productData.totalQuantity === 1 ? "item" : "items"} •
                          NGN {productData.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="ml-16 space-y-2">
                      {productData.options.map((option, optionIndex) => (
                        <div
                          key={`${option.cartItemId}-${optionIndex}`}
                          className="flex justify-between text-xs text-[var(--color-text-secondary)]"
                        >
                          <span>Option: {option.name}</span>
                          <div>
                            {option.itemDiscount > 0 ? (
                              <>
                                <span className="line-through text-[var(--color-text-secondary)] mr-2">
                                  {option.quantity} x NGN{" "}
                                  {option.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-green-500">
                                  {option.quantity} x NGN{" "}
                                  {option.price.toLocaleString()} = NGN{" "}
                                  {(
                                    option.price * option.quantity
                                  ).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span>
                                {option.quantity} x NGN{" "}
                                {option.price.toLocaleString()} = NGN{" "}
                                {(
                                  option.price * option.quantity
                                ).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)]">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--color-text-secondary)]">👤</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  Purchase Information
                </span>
              </div>
            </div>
            <div className="ml-6 text-xs text-[var(--color-text-secondary)]">
              <p>
                <strong>Name:</strong> {formData.fullName}
              </p>
              <p>
                <strong>Phone Number:</strong> {formData.phoneNumber}
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)]">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--color-text-secondary)]">📍</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  Delivery Location
                </span>
              </div>
            </div>
            <div className="ml-6 text-xs text-[var(--color-text-secondary)]">
              <p>{formData.deliveryAddress}</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)]">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--color-text-secondary)]">🚚</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  Delivery Area
                </span>
              </div>
            </div>
            <div className="ml-6 text-xs text-[var(--color-text-secondary)]">
              <p>
                <strong>Delivery Area: </strong>
                {deliveryAreaOptions
                  .find((opt) => opt.value === formData.deliveryArea)
                  ?.label.replace(/ \(₦.*\)/, "") || "Not selected"}
              </p>
              <p>
                <strong>Delivery cost: </strong> NGN{" "}
                {deliveryFee.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-default)]">
              <div className="flex items-center space-x-2">
                <span className="text-[var(--color-text-secondary)]">📝</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  Extra Information
                </span>
              </div>
            </div>
            <div className="ml-6 text-xs text-[var(--color-text-secondary)]">
              <p>
                <strong>Note: </strong>
                {formData.orderNotes || "No notes provided"}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <FloatingLabelInput
                name="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter Coupon Code"
              />
              <button
                onClick={handleApplyCoupon}
                className="py-2 px-4 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition disabled:opacity-50"
                disabled={couponLoading}
              >
                {couponLoading ? "Applying..." : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-sm text-red-500 mt-2">{couponError}</p>
            )}
            {couponMessage && (
              <p className="text-sm text-yellow-500 mt-2">{couponMessage}</p>
            )}
            {appliedCoupon && !couponMessage && (
              <p className="text-sm text-green-500 mt-2">
                Coupon "{appliedCoupon.code}" applied successfully!{" "}
                {appliedCoupon.discount_type === "fixed"
                  ? `₦${appliedCoupon.discount_value.toLocaleString()} off`
                  : `${appliedCoupon.discount_value}% off`}
              </p>
            )}
          </div>

          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-2xl p-4">
            <h3 className="font-medium text-[var(--color-text-primary)] mb-3">
              SUMMARY
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Items ({cart.length})</span>
                <span>NGN {subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Coupon Discount</span>
                  <span>- NGN {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>NGN {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium text-sm pt-2 border-t border-[var(--color-border-strong)]">
                <span>Total</span>
                <span>NGN {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 p-6 pt-0">
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        <div className="flex space-x-3">
          <button
            onClick={prevStep}
            className="flex-1 py-3 text-sm font-semibold  bg-[var(--color-bg-secondary)]  hover:bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]  rounded-xl transition"
          >
            Go Back
          </button>
          <button
            onClick={handleCompleteOrder}
            className="flex-1 py-3 bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] rounded-lg text-sm font-semibold hover:bg-[var(--color-brand-hover)] transition disabled:opacity-50"
            disabled={confirmLoading || !orderId || cart.length === 0}
          >
            {confirmLoading ? "Confirming..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </>
  );

  const steps = [
    renderCartStep,
    renderPurchaseInfoStep,
    renderExtraInfoStep,
    renderOrderSummaryStep,
  ];

  // Early return AFTER all hooks have been called
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl w-full max-w-lg mx-auto shadow-xl max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        {steps[currentStep]()}
      </div>
    </div>
  );
};

export default CartModal;