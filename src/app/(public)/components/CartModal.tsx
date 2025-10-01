// CartModal.tsx

"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { X, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import { apiClient } from "../api";

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
  orderItemId?: number; // Add to track backend OrderItem ID
}

const CartModal = ({ isOpen = true, onClose = () => {} }: CartModalProps) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  if (!isOpen) return null;

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
  const [deliveryFee, setDeliveryFee] = useState<number>(4000);
  const [deliveryAreaOptions, setDeliveryAreaOptions] = useState<
    { value: string; label: string; disabled?: boolean; deliveryFee?: number }[]
  >([{ value: "", label: "Select Delivery Area", disabled: true }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, number>>({}); // Map cartItemId to orderItemId

  // Fetch delivery area options
  useEffect(() => {
    if (!isOpen) return;

    const fetchDeliveryAreas = async () => {
      setIsLoading(true);
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

        const firstValidOption = options.find((opt) => !opt.disabled);
        if (firstValidOption) {
          setFormData((prev) => ({
            ...prev,
            deliveryArea: firstValidOption.value,
          }));
          setDeliveryFee(firstValidOption.deliveryFee || 4000);
        }
      } catch (err) {
        console.error("Failed to fetch delivery areas:", err);
        setError("Failed to load delivery areas. Please try again.");
      } finally {
        setIsLoading(false);
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
      setDeliveryFee(selectedOption.deliveryFee || 4000);
    }
  }, [formData.deliveryArea, deliveryAreaOptions]);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setCouponError(null);
    setCouponMessage(null);
    try {
      const response = await apiClient.applyCoupon(couponCode);
      setAppliedCoupon(response);

      const applicableItems = cart.filter((item) =>
        response.products.some((p) => p.id === item.id)
      );
      if (applicableItems.length === 0) {
        setCouponMessage(
          `Coupon "${response.code}" is valid but does not apply to any items in your cart.`
        );
      }

      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon");
      setAppliedCoupon(null);
      setCouponMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals with coupon discount
  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;

    const updatedCart: CartItem[] = cart.map((item) => {
      let itemPrice = item.discount_price ?? item.price;
      let itemDiscount = 0;

      if (
        appliedCoupon &&
        appliedCoupon.products.some((p) => p.id === item.id)
      ) {
        if (appliedCoupon.discount_type === "fixed") {
          itemDiscount = appliedCoupon.discount_value / item.quantity;
          itemPrice = Math.max(0, itemPrice - itemDiscount);
          discount += appliedCoupon.discount_value;
        } else if (appliedCoupon.discount_type === "percentage") {
          itemDiscount = (itemPrice * appliedCoupon.discount_value) / 100;
          itemPrice = itemPrice - itemDiscount;
          discount += itemDiscount * item.quantity;
        }
      }

      subtotal += itemPrice * item.quantity;
      return { ...item, effectivePrice: itemPrice, itemDiscount };
    });

    const total = subtotal + deliveryFee;
    return { subtotal, discount, total, updatedCart };
  };

  const { subtotal, discount, total, updatedCart } = calculateTotals();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        orderItemId: orderItems[item.cartItemId], // Map to backend OrderItem ID
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
      // Validate Purchase Information
      if (
        !formData.fullName ||
        !formData.phoneNumber ||
        !formData.deliveryArea ||
        !formData.deliveryAddress
      ) {
        setError("Please fill in all required fields.");
        return;
      }
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

  const handleCreateOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate cart items
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
        setIsLoading(false);
        return;
      }

      const orderData = {
        customer_name: formData.fullName,
        customer_phone: formData.phoneNumber,
        customer_email: formData.email,
        customer_address: formData.deliveryAddress,
        delivery_area_id: parseInt(formData.deliveryArea),
        recipient_type:
          formData.recipient.toLowerCase() === "myself"
            ? "myself"
            : "someone_else",
        order_notes: formData.orderNotes,
        coupon_code: appliedCoupon?.code || "",
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

      const response = await apiClient.createOrder(orderData);
      setOrderId(response.id);
      // Map cartItemId to orderItemId from response
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
      setIsLoading(false);
    }
  };
  const handleUpdateQuantity = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    if (!orderId || !orderItems[cartItemId]) return;

    setIsLoading(true);
    setError(null);
    try {
      const orderItemId = orderItems[cartItemId];
      const cartItem = cart.find((item) => item.cartItemId === cartItemId);
      if (!cartItem) return;

      await apiClient.updateOrderItem(orderId, orderItemId, {
        quantity: newQuantity,
        discount_price:
          cartItem.effectivePrice ?? cartItem.discount_price ?? null,
      });
      updateQuantity(cartItemId, newQuantity);
    } catch (err: any) {
      setError(err.message || "Failed to update item quantity");
      console.error("Failed to update item quantity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!orderId || !orderItems[cartItemId]) {
      removeFromCart(cartItemId);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const orderItemId = orderItems[cartItemId];
      await apiClient.updateOrderItem(orderId, orderItemId, { quantity: 0 });
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
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);
    try {
      await apiClient.updateOrderStatus(orderId, "confirmed"); // Changed to "confirmed" for clarity
      alert("Order confirmed successfully!");
      clearCart();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to confirm order");
      console.error("Failed to confirm order:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCartStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">
          {Object.keys(groupedCart).length}{" "}
          {Object.keys(groupedCart).length === 1 ? "Product" : "Products"} •{" "}
          {cart.length} {cart.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-sm text-gray-500 mb-4">
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
              className="py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Applying..." : "Apply"}
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
          <p className="text-sm text-gray-500 text-center py-8">
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
                  className="border border-[var(--color-border-secondary)] rounded-2xl overflow-hidden"
                >
                  <div className="flex items-start justify-between p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={productData.productInfo.image}
                        alt={productData.productInfo.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-sm font-medium text-[var(--color-text)] leading-tight">
                          {productData.productInfo.name}
                          {hasCoupon && (
                            <span className="ml-2 text-xs text-green-500">
                              (Coupon Applied)
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full mr-1"></span>
                          {productData.totalQuantity}{" "}
                          {productData.totalQuantity === 1 ? "item" : "items"} •
                          NGN {productData.totalPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleItemDetails(productId)}
                      className="text-gray-500 hover:text-[var(--color-primary)] transition"
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
                    <div className="border-t border-[var(--color-border-secondary)]">
                      {productData.options.map((option, optionIndex) => (
                        <div
                          key={`${option.cartItemId}-${optionIndex}`}
                          className="flex items-center justify-between p-4 border-b border-[var(--color-border-secondary)] last:border-b-0"
                        >
                          <div className="flex flex-col gap-y-4">
                            <span className="text-sm text-[var(--color-text)] font-medium">
                              Option: {option.name}
                            </span>
                            <div className="text-sm text-[var(--color-text)] font-medium">
                              {option.itemDiscount > 0 ? (
                                <>
                                  <span className="line-through text-gray-500 mr-2">
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
                              className="text-red-500 hover:text-red-700 transition p-1"
                              aria-label="Remove option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex items-center border border-[var(--color-primary)] rounded-full">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    option.cartItemId,
                                    Math.max(0, option.quantity - 1)
                                  )
                                }
                                className="w-8 h-6 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-l-full transition"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="px-3 py- text-sm text-[var(--color-primary)] min-w-[2rem] text-center">
                                {option.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    option.cartItemId,
                                    option.quantity + 1
                                  )
                                }
                                className="w-8 h-6 flex items-center justify-center text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-r-full transition"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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
            <div className="border-t border-[var(--color-border)] my-4"></div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-base font-semibold text-[var(--color-text)]">
                  Subtotal
                </p>
                <p className="text-base font-semibold text-[var(--color-text)]">
                  NGN {subtotal.toLocaleString()}
                </p>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <p className="text-base font-semibold text-green-500">
                    Coupon Discount
                  </p>
                  <p className="text-base font-semibold text-green-500">
                    - NGN {discount.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <p className="text-base font-semibold text-[var(--color-text)]">
                  Delivery Fee
                </p>
                <p className="text-base font-semibold text-[var(--color-text)]">
                  NGN {deliveryFee.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
                <p className="text-base font-semibold text-[var(--color-text)]">
                  Total
                </p>
                <p className="text-base font-semibold text-[var(--color-text)]">
                  NGN {total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {}} // Placeholder for enquiry action
                className="flex-1 py-3 text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition"
              >
                Make an Enquiry
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition"
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
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Purchase Information
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-primary)] h-1 rounded-full"
            style={{ width: "33%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading delivery areas...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              You're almost there! Kindly fill in the following information
              before proceeding to checkout
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-2">
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
                <h3 className="font-medium text-[var(--color-text)] mb-4">
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
                  />
                  <div className="flex">
                    <div className="flex items-center px-3 bg-[var(--color-bg)] border border-r-0 border-[var(--color-border)] rounded-l-2xl h-[3rem]">
                      <span className="text-sm text-gray-500">🇳🇬 +234</span>
                    </div>
                    <FloatingLabelInput
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Your Whatsapp Number"
                      type="tel"
                      className="rounded-l-none"
                      required
                    />
                  </div>
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
                <h3 className="font-medium text-[var(--color-text)] mb-4">
                  Delivery Details
                </h3>
                <div className="space-y-4">
                  <FloatingLabelSelect
                    id="deliveryArea"
                    name="deliveryArea"
                    value={formData.deliveryArea}
                    onChange={(value) =>
                      handleInputChange("deliveryArea", value as string)
                    }
                    placeholder="Select Delivery Area"
                    options={deliveryAreaOptions}
                    required
                  />
                  <FloatingLabelTextarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) =>
                      handleInputChange("deliveryAddress", e.target.value)
                    }
                    placeholder="Delivery Address"
                    rows={4}
                    required
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
            className="flex-1 py-3 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition"
          >
            Go Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition"
            disabled={isLoading}
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );

  const renderExtraInfoStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Extra Information
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-primary)] h-1 rounded-full"
            style={{ width: "66%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-[var(--color-text)] mb-2 font-medium">
              Do you have any notes or special instructions?
            </label>
            <label className="block text-xs text-gray-500 mb-2">
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
            className="flex-1 py-3 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition"
          >
            Go Back
          </button>
          <button
            onClick={handleCreateOrder}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </>
  );

  const renderOrderSummaryStep = () => (
    <>
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Order Summary
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="w-full bg-[var(--color-border)] h-1 rounded-full mb-4">
          <div
            className="bg-[var(--color-primary)] h-1 rounded-full"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-sm text-gray-500 mb-6">
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
              <p className="font-medium text-[var(--color-text)]">
                {cart[0]?.name.split(" (")[0] || "Asymmetric Swan Dress"} and{" "}
                {Object.keys(groupedCart).length - 1} other{" "}
                {Object.keys(groupedCart).length - 1 === 1 ? "Item" : "Items"}
              </p>
              <p className="text-sm text-gray-500">
                NGN {subtotal.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setShowItemDetails((prev) => ({
                ...prev,
                summary: !prev.summary,
              }))
            }
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline"
          >
            View All Items
          </button>

          {showItemDetails.summary && (
            <div className="space-y-4">
              {Object.entries(groupedCart).map(([productId, productData]) => {
                const hasCoupon = appliedCoupon?.products.some(
                  (p) => p.id === productData.productInfo.id
                );
                return (
                  <div
                    key={productId}
                    className="border border-[var(--color-border-secondary)] rounded-2xl p-4"
                  >
                    <div className="flex items-start space-x-4 mb-2">
                      <img
                        src={productData.productInfo.image}
                        alt={productData.productInfo.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text)] text-sm">
                          {productData.productInfo.name}
                          {hasCoupon && (
                            <span className="ml-2 text-xs text-green-500">
                              (Coupon Applied)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
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
                          className="flex justify-between text-xs text-gray-500"
                        >
                          <span>Option: {option.name}</span>
                          <div>
                            {option.itemDiscount > 0 ? (
                              <>
                                <span className="line-through text-gray-500 mr-2">
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
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-secondary)]">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">👤</span>
                <span className="font-medium text-[var(--color-text)]">
                  Purchase Information
                </span>
              </div>
              <span className="text-gray-500">›</span>
            </div>
            <div className="ml-6 text-xs text-gray-500">
              <p>{formData.fullName || "Adedayo Ojo"}</p>
              <p>{formData.phoneNumber || "+234814562772"}</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-secondary)]">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">📍</span>
                <span className="font-medium text-[var(--color-text)]">
                  Delivery Location
                </span>
              </div>
              <span className="text-gray-500">›</span>
            </div>
            <div className="ml-6 text-xs text-gray-500">
              <p>{formData.deliveryAddress || "Abuja"}</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-secondary)]">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🚚</span>
                <span className="font-medium text-[var(--color-text)]">
                  Delivery Area
                </span>
              </div>
              <span className="text-gray-500">›</span>
            </div>
            <div className="ml-6 text-xs text-gray-500">
              <p>
                {deliveryAreaOptions
                  .find((opt) => opt.value === formData.deliveryArea)
                  ?.label.replace(/ \(₦.*\)/, "") ||
                  formData.deliveryArea ||
                  "Festac Town"}
              </p>
              <p>NGN {deliveryFee.toLocaleString()}</p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border-secondary)]">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">📝</span>
                <span className="font-medium text-[var(--color-text)]">
                  Extra Information
                </span>
              </div>
              <span className="text-gray-500">›</span>
            </div>
            <div className="ml-6 text-xs text-gray-500">
              <p>{formData.orderNotes || "No notes provided"}</p>
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
                className="py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Applying..." : "Apply"}
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

          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-4">
            <h3 className="font-medium text-[var(--color-text)] mb-3">
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
              <div className="flex justify-between font-medium text-base pt-2 border-t border-[var(--color-border)]">
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
            className="flex-1 py-3 text-[var(--color-text)] border border-[var(--color-border)] rounded-lg text-sm font-semibold hover:bg-[var(--color-border)] transition"
          >
            Go Back
          </button>
          <button
            onClick={handleCompleteOrder}
            className="flex-1 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition"
            disabled={isLoading || !orderId || cart.length === 0}
          >
            {isLoading ? "Confirming..." : "Confirm Order"}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-bg)] rounded-2xl w-full max-w-lg mx-auto shadow-xl max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        {steps[currentStep]()}
      </div>
    </div>
  );
};

export default CartModal;
