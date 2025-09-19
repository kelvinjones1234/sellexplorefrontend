// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { ChevronDown, Plus, Check, X, ImagePlus } from "lucide-react";
// import FloatingLabelInput from "@/app/component/fields/Input";
// import FloatingLabelTextarea from "@/app/component/fields/Textarea";
// import FancySelect from "../add-product/components/FancySelect";
// import OptionModal from "./OptionModal";
// import { Product, ProductOption, CategoryResponse } from "../types";

// interface EditProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   product: Product | null;
//   onSave: (updatedProduct: Product) => void;
//   categories: CategoryResponse[];
// }

// const EditProductModal: React.FC<EditProductModalProps> = ({
//   isOpen,
//   onClose,
//   product,
//   onSave,
//   categories,
// }) => {
//   const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
//   const [isPricingOpen, setIsPricingOpen] = useState(false);
//   const [isQuantityOpen, setIsQuantityOpen] = useState(false);
//   const [isOptionsOpen, setIsOptionsOpen] = useState(false);
//   const [isExtraOpen, setIsExtraOpen] = useState(false);
//   const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
//   const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   const addMoreImagesRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (product && isOpen) {
//       setCurrentProduct({
//         ...product,
//         images: product.images.map((img) => ({
//           ...img,
//           preview: img.image,
//           file: null,
//         })),
//         thumbnailIndex:
//           product.images.findIndex((img) => img.is_thumbnail) || 0,
//       });
//       setError(null);
//     }
//   }, [product, isOpen]);

//   const updateDetail = <K extends keyof Product>(key: K, value: Product[K]) => {
//     if (currentProduct) {
//       setCurrentProduct({
//         ...currentProduct,
//         [key]: value,
//       });
//     }
//   };

//   const handleSelectFiles = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     _index: number
//   ) => {
//     if (e.target.files && currentProduct) {
//       const newImages = Array.from(e.target.files).map((file, index) => ({
//         id: Date.now() + index,
//         image: URL.createObjectURL(file),
//         is_thumbnail: false,
//         preview: URL.createObjectURL(file),
//         file,
//       }));

//       setCurrentProduct({
//         ...currentProduct,
//         images: [...currentProduct.images, ...newImages],
//       });
//     }
//   };

//   const setThumbnail = (_productIndex: number, imgIndex: number) => {
//     if (currentProduct) {
//       setCurrentProduct({
//         ...currentProduct,
//         thumbnailIndex: imgIndex,
//       });
//     }
//   };

//   const deleteImage = (index: number) => {
//     if (currentProduct) {
//       const currentThumbnailIndex = currentProduct.thumbnailIndex ?? 0;
//       setCurrentProduct({
//         ...currentProduct,
//         images: currentProduct.images.filter((_, i) => i !== index),
//         thumbnailIndex:
//           currentThumbnailIndex === index
//             ? 0
//             : currentThumbnailIndex > index
//             ? currentThumbnailIndex - 1
//             : currentThumbnailIndex,
//       });
//     }
//   };

//   const addOption = (option: ProductOption) => {
//     if (currentProduct) {
//       setCurrentProduct({
//         ...currentProduct,
//         options: [
//           ...currentProduct.options,
//           { ...option, id: currentProduct.options.length + 1 },
//         ],
//       });
//     }
//   };

//   const editOption = (index: number, option: ProductOption) => {
//     if (currentProduct) {
//       const updatedOptions = [...currentProduct.options];
//       updatedOptions[index] = {
//         ...option,
//         id: currentProduct.options[index].id,
//       };
//       setCurrentProduct({
//         ...currentProduct,
//         options: updatedOptions,
//       });
//     }
//   };

//   const deleteOption = (index: number) => {
//     if (currentProduct) {
//       setCurrentProduct({
//         ...currentProduct,
//         options: currentProduct.options.filter((_, i) => i !== index),
//       });
//     }
//   };

//   const openOptionModal = (index?: number) => {
//     setEditingOptionIndex(index !== undefined ? index : null);
//     setIsOptionModalOpen(true);
//   };

//   const closeOptionModal = () => {
//     setIsOptionModalOpen(false);
//     setEditingOptionIndex(null);
//     setError(null);
//   };

//   const handleSaveOption = (option: ProductOption) => {
//     if (!option.name) {
//       setError("Option name is required");
//       return;
//     }
//     if (editingOptionIndex !== null) {
//       editOption(editingOptionIndex, option);
//     } else {
//       addOption(option);
//     }
//     closeOptionModal();
//   };

//   const validateProduct = (product: Product): string | null => {
//     if (!product.name.trim()) return "Product name is required";
//     if (!product.price || isNaN(Number(product.price)))
//       return "Valid price is required";
//     if (
//       product.discount_price &&
//       (isNaN(Number(product.discount_price)) ||
//         Number(product.discount_price) >= Number(product.price))
//     )
//       return "Discount price must be less than regular price";
//     return null;
//   };

//   const handleSaveProduct = () => {
//     if (currentProduct) {
//       const validationError = validateProduct(currentProduct);
//       if (validationError) {
//         setError(validationError);
//         return;
//       }
//       onSave(currentProduct);
//       onClose();
//     }
//   };

//   if (!isOpen || !currentProduct) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
//         {/* Header Section - Fixed */}
//         <div className="flex-shrink-0 p-6 pb-0">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Edit Product: {currentProduct.name}
//             </h2>
//             <button
//               onClick={onClose}
//               className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
//               aria-label="Close modal"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Scrollable Content Section */}
//         <div className="flex-1 overflow-y-auto px-6 py-4">
//           <div className="max-w-md mx-auto">
//             {/* Images Section */}
//             <div className="flex items-center gap-3 overflow-x-auto pb-2">
//               {currentProduct.images.length ? (
//                 currentProduct.images.map((img, idx) => (
//                   <div
//                     key={idx}
//                     className="relative flex-shrink-0"
//                     onClick={() => setThumbnail(currentProduct.id, idx)}
//                     role="button"
//                     aria-label={`Select image ${idx + 1} as thumbnail`}
//                   >
//                     <img
//                       src={img.preview || "/placeholder.png"}
//                       alt={`Product image ${idx + 1}`}
//                       className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${
//                         currentProduct.thumbnailIndex === idx
//                           ? "border-[var(--color-primary)]"
//                           : "border-transparent"
//                       }`}
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         deleteImage(idx);
//                       }}
//                       className="absolute top-1 left-1 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs"
//                       aria-label={`Delete image ${idx + 1}`}
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                     {currentProduct.thumbnailIndex === idx && (
//                       <div className="absolute top-1 right-1 bg-[var(--color-primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs">
//                         <Check className="w-3 h-3" />
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-xs text-gray-500">No images available</p>
//               )}
//               <button
//                 onClick={() => addMoreImagesRef.current?.click()}
//                 className="w-16 h-16 flex-shrink-0 border-2 border-dashed hover:border-[var(--color-primary)] border-[var(--color-border)] rounded-lg flex items-center justify-center text-gray-400"
//                 aria-label="Add more images"
//               >
//                 <Plus className="w-6 h-6" />
//               </button>
//             </div>
//             <p className="text-center text-xs text-gray-500 mt-2">
//               Click on the canvas with plus sign to add more images
//             </p>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={(e) => handleSelectFiles(e, currentProduct.id)}
//               className="hidden"
//               ref={addMoreImagesRef}
//               aria-hidden="true"
//             />

//             {/* Product Details */}
//             <div className="mt-4 flex flex-col gap-4">
//               <div className="mb-3">
//                 <FloatingLabelInput
//                   type="text"
//                   name="product-name"
//                   placeholder="Product Name"
//                   value={currentProduct.name}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     updateDetail("name", e.target.value)
//                   }
//                 />
//               </div>

//               <div className="relative">
//                 <FancySelect<number>
//                   name="category"
//                   options={categories.map((cat) => ({
//                     value: cat.id,
//                     label: cat.name,
//                   }))}
//                   value={currentProduct.category ?? null}
//                   onChange={(val) => updateDetail("category", val)}
//                   placeholder="Select category"
//                 />
//               </div>

//               <FloatingLabelTextarea
//                 placeholder="Product Description"
//                 value={currentProduct.description}
//                 onChange={(e) => updateDetail("description", e.target.value)}
//               />

//               {/* Pricing Section */}
//               <div className="py-4">
//                 <button
//                   onClick={() => setIsPricingOpen(!isPricingOpen)}
//                   className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//                   aria-expanded={isPricingOpen}
//                   aria-controls="pricing-section"
//                 >
//                   Product Pricing
//                   <ChevronDown
//                     className={`w-5 h-5 ${isPricingOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isPricingOpen && (
//                   <div id="pricing-section" className="mt-2">
//                     <div className="mb-3">
//                       <FloatingLabelInput
//                         type="text"
//                         name="price"
//                         placeholder="Product Price NGN (No commas)"
//                         value={currentProduct.price}
//                         onChange={(e) => updateDetail("price", e.target.value)}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <FloatingLabelInput
//                         type="text"
//                         name="discount-price"
//                         placeholder="Discount Price NGN (Optional)"
//                         value={currentProduct.discount_price || ""}
//                         onChange={(e) =>
//                           updateDetail("discount_price", e.target.value || null)
//                         }
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Quantity Section */}
//               <div>
//                 <button
//                   onClick={() => setIsQuantityOpen(!isQuantityOpen)}
//                   className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//                   aria-expanded={isQuantityOpen}
//                   aria-controls="quantity-section"
//                 >
//                   Product Quantity
//                   <ChevronDown
//                     className={`w-5 h-5 transition-transform ${
//                       isQuantityOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//                 {isQuantityOpen && (
//                   <div id="quantity-section" className="py-2">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-lg px-1 py-1 w-fit">
//                         <button
//                           onClick={() =>
//                             updateDetail(
//                               "quantity",
//                               Math.max(0, Number(currentProduct.quantity) - 1)
//                             )
//                           }
//                           className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
//                           aria-label="Decrease quantity"
//                         >
//                           -
//                         </button>
//                         <span className="min-w-[20px] text-xs text-center font-medium">
//                           {currentProduct.quantity}
//                         </span>
//                         <button
//                           onClick={() =>
//                             updateDetail(
//                               "quantity",
//                               Number(currentProduct.quantity) + 1
//                             )
//                           }
//                           className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
//                           aria-label="Increase quantity"
//                         >
//                           +
//                         </button>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <label className="text-xs font-medium text-[var(--color-text)]">
//                           Always available
//                         </label>
//                         <button
//                           onClick={() =>
//                             updateDetail(
//                               "availability",
//                               !currentProduct.availability
//                             )
//                           }
//                           className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                             currentProduct.availability
//                               ? "bg-[var(--color-primary)]"
//                               : "bg-gray-300"
//                           }`}
//                           aria-label={`Toggle always available: ${
//                             currentProduct.availability ? "on" : "off"
//                           }`}
//                           role="switch"
//                           aria-checked={currentProduct.availability}
//                         >
//                           <span
//                             className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                               currentProduct.availability
//                                 ? "translate-x-6"
//                                 : "translate-x-0"
//                             }`}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Options Section */}
//               <div>
//                 <button
//                   onClick={() => setIsOptionsOpen(!isOptionsOpen)}
//                   className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//                   aria-expanded={isOptionsOpen}
//                   aria-controls="options-section"
//                 >
//                   Product Options
//                   <ChevronDown
//                     className={`w-5 h-5 ${isOptionsOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isOptionsOpen && (
//                   <div id="options-section" className="py-2">
//                     {currentProduct.options.length ? (
//                       currentProduct.options.map((option, idx) => (
//                         <div
//                           key={option.id}
//                           className="flex items-center gap-2 mb-2 cursor-pointer"
//                           onClick={() => openOptionModal(idx)}
//                         >
//                           <span>{option.name}</span>
//                           {option.image && (
//                             <img
//                               src={
//                                 option.image instanceof File
//                                   ? URL.createObjectURL(option.image)
//                                   : option.image || "/placeholder.png"
//                               }
//                               alt={option.name}
//                               className="w-8 h-8 object-cover rounded"
//                             />
//                           )}
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteOption(idx);
//                             }}
//                             className="text-red-500 text-xs"
//                             aria-label={`Delete option ${option.name}`}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-xs text-gray-500">
//                         No options available
//                       </p>
//                     )}
//                     <button
//                       onClick={() => openOptionModal()}
//                       className="bg-[var(--color-border-secondary)] px-4 text-[var(--color-primary)] py-2 rounded-lg text-sm font-semibold mt-2"
//                       aria-label="Add new option"
//                     >
//                       Add Option
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Extra Info Section */}
//               <div>
//                 <button
//                   onClick={() => setIsExtraOpen(!isExtraOpen)}
//                   className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//                   aria-expanded={isExtraOpen}
//                   aria-controls="extra-info-section"
//                 >
//                   Extra Product Info
//                   <ChevronDown
//                     className={`w-5 h-5 ${isExtraOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isExtraOpen && (
//                   <div id="extra-info-section" className="py-4">
//                     <FloatingLabelTextarea
//                       placeholder="Optional Product Settings"
//                       value={currentProduct.extra_info || ""}
//                       onChange={(e) =>
//                         updateDetail("extra_info", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Section - Fixed */}
//         <div className="flex-shrink-0 p-6 pt-0">
//           {/* Option Modal */}
//           <OptionModal
//             isOpen={isOptionModalOpen}
//             onClose={closeOptionModal}
//             onSave={handleSaveOption}
//             initialOption={
//               editingOptionIndex !== null
//                 ? currentProduct.options[editingOptionIndex]
//                 : undefined
//             }
//           />

//           {/* Save Button */}
//           <div className="mt-6 flex justify-end gap-2">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-[var(--color-border)] hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition"
//               aria-label="Cancel editing"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSaveProduct}
//               className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition"
//               aria-label="Save product changes"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProductModal;






















// ADD PRODUCT MAIN



// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { X, ChevronDown, Plus, Trash2, ImagePlus, Check } from "lucide-react";
// import Link from "next/link";
// import FloatingLabelInput from "@/app/component/fields/Input";
// import FloatingLabelTextarea from "@/app/component/fields/Textarea";
// import FancySelect from "./FancySelect";
// import OptionModal from "../../components/OptionModal";
// import { useAuth } from "@/context/AuthContext";
// import { apiClient } from "../api";
// import { ImageData, Product, CategoryResponse, ProductOption } from "../types";

// const Main = () => {
//   const [step, setStep] = useState<"selection" | "details">("selection");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [categories, setCategories] = useState<CategoryResponse[]>([]);
//   const addMoreImagesRef = useRef<HTMLInputElement>(null);
//   const { accessToken } = useAuth();

//   useEffect(() => {
//     if (accessToken) {
//       apiClient.setAccessToken(accessToken);
//     }
//   }, [accessToken]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         if (!accessToken) return;
//         const result = await apiClient.getCategories();
//         setCategories(result);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     };
//     fetchCategories();
//   }, [accessToken]);

//   const handleSelectFiles = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     productIndex?: number
//   ) => {
//     if (!e.target.files) return;

//     const newFiles = Array.from(e.target.files);
//     const newImagesData: ImageData[] = newFiles.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//       progress: 0,
//     }));

//     if (productIndex !== undefined) {
//       setProducts((prev) => {
//         const updatedProducts = [...prev];
//         const product = updatedProducts[productIndex];
//         const existing = new Set(
//           product.images.map((img) => `${img.file?.name}-${img.file?.size}`)
//         );
//         const filteredNewImages = newImagesData.filter(
//           (img) => !existing.has(`${img.file?.name}-${img.file?.size}`)
//         );
//         const startingIndex = product.images.length;
//         product.images = [...product.images, ...filteredNewImages];

//         filteredNewImages.forEach((_, idx) => {
//           simulateUpload(productIndex, startingIndex + idx);
//         });

//         return updatedProducts;
//       });
//     } else {
//       const newProducts: Product[] = newFiles.map((file) => ({
//         images: [{ file, preview: URL.createObjectURL(file), progress: 0 }],
//         thumbnailIndex: 0,
//         details: {
//           name: "",
//           category: "",
//           description: "",
//           price: "",
//           quantity: "",
//           discountPrice: "",
//           availability: true,
//           hot_deal: false,
//           recent: false,
//           featured: false,
//           extraInfo: "",
//           options: [],
//         },
//       }));

//       console.log("new product", newProducts);

//       const currentProductCount = products.length;
//       setProducts((prev) => [...prev, ...newProducts]);

//       newProducts.forEach((_, idx) => {
//         simulateUpload(currentProductCount + idx, 0);
//       });
//     }

//     e.target.value = "";
//   };

//   const simulateUpload = (productIndex: number, imageIndex: number) => {
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 10;
//       setProducts((prev) => {
//         const updated = [...prev];
//         if (updated[productIndex] && updated[productIndex].images[imageIndex]) {
//           updated[productIndex].images[imageIndex].progress = Math.min(
//             progress,
//             100
//           );
//         }
//         return updated;
//       });

//       if (progress >= 100) {
//         clearInterval(interval);
//         setProducts((prev) => {
//           const updated = [...prev];
//           if (
//             updated[productIndex] &&
//             updated[productIndex].images[imageIndex]
//           ) {
//             const img = updated[productIndex].images[imageIndex];
//             img.uploadedUrl = img.preview;
//           }
//           return updated;
//         });
//       }
//     }, 200);
//   };

//   const removeProduct = (indexToRemove: number) => {
//     setProducts((prev) => prev.filter((_, i) => i !== indexToRemove));
//     if (step === "details") {
//       if (products.length <= 1) {
//         setStep("selection");
//         setCurrentIndex(0);
//       } else if (currentIndex >= indexToRemove) {
//         setCurrentIndex((prevIdx) => Math.max(0, prevIdx - 1));
//       }
//     }
//   };

//   const setThumbnail = (productIndex: number, imageIndex: number) => {
//     setProducts((prev) => {
//       const updated = [...prev];
//       updated[productIndex].thumbnailIndex = imageIndex;
//       return updated;
//     });
//   };

//   const proceedToDetails = () => {
//     if (products.every((p) => p.images.every((img) => img.progress === 100))) {
//       setStep("details");
//     } else {
//       alert("Please wait for all uploads to complete.");
//     }
//   };

//   const updateDetail = <K extends keyof Product["details"]>(
//     field: K,
//     value: Product["details"][K]
//   ) => {
//     setProducts((prev) => {
//       const updated = [...prev];
//       updated[currentIndex].details[field] = value;
//       return updated;
//     });
//   };

//   const addOption = (option: ProductOption) => {
//     setProducts((prev) => {
//       const updated = [...prev];
//       updated[currentIndex].details.options = [
//         ...updated[currentIndex].details.options,
//         option,
//       ];
//       return updated;
//     });
//   };

//   const editOption = (index: number, option: ProductOption) => {
//     setProducts((prev) => {
//       const updated = [...prev];
//       updated[currentIndex].details.options[index] = option;
//       return updated;
//     });
//   };

//   const validateProduct = (product: Product): string | null => {
//     const { details } = product;
//     if (!details.name) return "Product name is required";
//     if (!details.category) return "Category is required";
//     if (!details.price || isNaN(Number(details.price)))
//       return "Valid price is required";
//     if (!details.quantity || isNaN(Number(details.quantity)))
//       return "Valid quantity is required";
//     return null;
//   };

//   const postAllProducts = async () => {
//     if (!accessToken) {
//       alert("Authentication required. Please log in.");
//       return;
//     }

//     const validationErrors = products
//       .map((product) => validateProduct(product))
//       .filter(Boolean);
//     if (validationErrors.length > 0) {
//       alert(`Please fix the following errors:\n${validationErrors.join("\n")}`);
//       return;
//     }

//     try {
//       const postPromises = products.map((product) =>
//         apiClient.postProduct(product)
//       );
//       const results = await Promise.all(postPromises);
//       console.log("All products posted:", results);
//       alert("All products have been successfully created!");
//       setProducts([]);
//       setStep("selection");
//       setCurrentIndex(0);
//     } catch (error) {
//       console.error("Error posting products:", error);
//       alert("Failed to create one or more products. Please try again.");
//     }
//   };

//   const nextProduct = () => {
//     if (currentIndex < products.length - 1) {
//       setCurrentIndex((i) => i + 1);
//     } else {
//       postAllProducts();
//     }
//   };

//   const prevProduct = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((i) => i - 1);
//     } else {
//       goBackToSelection();
//     }
//   };

//   const goBackToSelection = () => {
//     setStep("selection");
//   };

//   const Header = () => (
//     <header className="sticky top-0 bg-[var(--color-bg)] z-20 border-b border-[var(--color-border-secondary)] px-4 py-3">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
//           <Link href="/dashboard/products">
//             <span className="font-medium text-[var(--color-heading)]">
//               Products
//             </span>
//           </Link>
//           <span>›</span>
//           <span>Add product</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-[var(--color-primary)]">⚡</span>
//           <span className="text-sm font-medium text-[var(--color-text)]">
//             Quick Actions
//           </span>
//           <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
//         </div>
//       </div>
//     </header>
//   );

//   return (
//     <div className="min-h-screen bg-[var(--color-bg)] font-sans">
//       <Header />
//       {step === "selection" ? (
//         <SelectionView
//           products={products}
//           fileInputRef={fileInputRef}
//           handleSelectFiles={handleSelectFiles}
//           removeProduct={removeProduct}
//           proceedToDetails={proceedToDetails}
//         />
//       ) : (
//         <DetailsView
//           products={products}
//           currentIndex={currentIndex}
//           setThumbnail={setThumbnail}
//           removeProduct={removeProduct}
//           updateDetail={updateDetail}
//           addOption={addOption}
//           editOption={editOption}
//           nextProduct={nextProduct}
//           prevProduct={prevProduct}
//           goBackToSelection={goBackToSelection}
//           addMoreImagesRef={addMoreImagesRef}
//           handleSelectFiles={handleSelectFiles}
//           categories={categories}
//         />
//       )}
//     </div>
//   );
// };

// // --- SelectionView remains unchanged ---
// const SelectionView = ({
//   products,
//   fileInputRef,
//   handleSelectFiles,
//   removeProduct,
//   proceedToDetails,
// }: any) => (
//   <div className="max-w-md mx-auto py-4 px-4">
//     <div className="text-center mb-6">
//       <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
//         <ImagePlus className="w-8 h-8 text-green-600" />
//       </div>
//       <h1 className="text-2xl font-bold text-gray-800">Add media,</h1>
//       <h1 className="text-2xl font-bold text-gray-800">
//         for multiple products
//       </h1>
//     </div>

//     <div className="bg-red-50 text-red-800 rounded-lg p-3 mb-6 text-xs border border-red-100">
//       <p>
//         <strong>IMPORTANT</strong>
//       </p>
//       <p>
//         Select one media file for each product you want to add. <br /> Media
//         file should not include videos. IMAGES ONLY!
//       </p>
//     </div>

//     <div className="grid grid-cols-2 gap-4">
//       {products.map((product: any, idx: number) => (
//         <div
//           key={idx}
//           className="flex items-center justify-between p-2 bg-[var(--color-border-scondary)] rounded-lg border border-[var(--color-border)]"
//         >
//           <div className="relative w-16 h-14 flex-shrink-0">
//             <img
//               src={product.images[0].preview}
//               alt={`Product ${idx + 1}`}
//               className="w-full h-full rounded-lg object-cover"
//             />
//             {product.images[0].progress < 100 && (
//               <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-lg overflow-hidden">
//                 <div
//                   className="h-1 bg-[var(--color-success)] transition-all duration-200"
//                   style={{ width: `${product.images[0].progress}%` }}
//                 />
//               </div>
//             )}
//           </div>
//           <div className="flex flex-col items-end gap-2 items-cente">
//             <button
//               onClick={() => removeProduct(idx)}
//               className="text-gray-400 hover:text-red-500 p-1 rounded-full"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <span className="text-[var(--color-text)] text-xs font-medium">
//               Product {idx + 1}
//             </span>
//           </div>
//         </div>
//       ))}
//       <button
//         onClick={() => fileInputRef.current?.click()}
//         className="flex items-center justify-center gap-2 text-[var(--color-body)] py-4 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-lg transition-colors"
//       >
//         <Plus className="w-5 h-5" />
//         <span className="text-[.7rem] font-medium">
//           {products.length > 0 ? "Add More Products" : "Add Products"}
//         </span>
//       </button>
//     </div>

//     <input
//       type="file"
//       multiple
//       accept="image/*,video/mp4"
//       onChange={(e) => handleSelectFiles(e)}
//       className="hidden"
//       ref={fileInputRef}
//     />

//     {products.length > 0 && (
//       <div className="mt-8">
//         <button
//           onClick={proceedToDetails}
//           className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-semibold text-sm shadow-sm hover:bg-opacity-90 transition-all"
//         >
//           Proceed to add details
//         </button>
//       </div>
//     )}
//   </div>
// );

// // --- DetailsView ---
// const DetailsView = ({
//   products,
//   currentIndex,
//   setThumbnail,
//   removeProduct,
//   updateDetail,
//   addOption,
//   editOption,
//   nextProduct,
//   prevProduct,
//   goBackToSelection,
//   addMoreImagesRef,
//   handleSelectFiles,
//   categories,
// }: any) => {
//   const currentProduct = products[currentIndex];
//   if (!currentProduct) return null;
//   const thumbnailPreview =
//     currentProduct.images[currentProduct.thumbnailIndex]?.preview;
//   const quantityImage = currentProduct.images[0]?.preview;
//   const [isPricingOpen, setIsPricingOpen] = useState(true);
//   const [isQuantityOpen, setIsQuantityOpen] = useState(true);
//   const [isOptionsOpen, setIsOptionsOpen] = useState(true);
//   const [isExtraOpen, setIsExtraOpen] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
//     null
//   );

//   const openModal = (index?: number) => {
//     setEditingOptionIndex(index !== undefined ? index : null);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setEditingOptionIndex(null);
//   };

//   const handleSaveOption = (option: ProductOption) => {
//     if (editingOptionIndex !== null) {
//       editOption(editingOptionIndex, option);
//     } else {
//       addOption(option);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto py-4 px-4">
//       <div className="text-center mt-6 mb-4">
//         <div className="flex justify-center mb-2">
//           <img
//             src={thumbnailPreview}
//             alt="Product thumbnail"
//             className="w-24 h-24 object-cover rounded-xl shadow-md"
//           />
//         </div>
//         <h2 className="font-semibold text-[var(--color-heading)] mt-2">
//           Add Details - Product {currentIndex + 1}
//         </h2>
//         <button
//           onClick={() => removeProduct(currentIndex)}
//           className="text-red-600 flex items-center gap-1.5 text-sm mt-2 mx-auto hover:underline"
//         >
//           Remove item <Trash2 className="w-4 h-4" />
//         </button>
//       </div>

//       <div className="flex items-center gap-3 overflow-x-auto pb-2">
//         {currentProduct.images.map((img: any, idx: number) => (
//           <div
//             key={idx}
//             className="relative flex-shrink-0"
//             onClick={() => setThumbnail(currentIndex, idx)}
//           >
//             <img
//               src={img.preview}
//               alt={`Product image ${idx + 1}`}
//               className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${
//                 currentProduct.thumbnailIndex === idx
//                   ? "border-[var(--color-primary)]"
//                   : "border-transparent"
//               }`}
//             />
//             {currentProduct.thumbnailIndex === idx && (
//               <div className="absolute top-1 right-1 bg-[var(--color-primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs">
//                 <Check className="w-3 h-3" />
//               </div>
//             )}
//           </div>
//         ))}
//         <button
//           onClick={() => addMoreImagesRef.current?.click()}
//           className="w-16 h-16 flex-shrink-0 border-2 border-dashed hover:border-[var(--color-primary)] border-[var(--color-border)] rounded-lg flex items-center justify-center text-gray-400"
//         >
//           <Plus className="w-6 h-6" />
//         </button>
//       </div>
//       <p className="text-center text-xs text-gray-500 mt-2">
//         Click on the canvas with plus sign to add more images
//       </p>
//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={(e) => handleSelectFiles(e, currentIndex)}
//         className="hidden"
//         ref={addMoreImagesRef}
//       />

//       <div className="mt-4 flex flex-col gap-4">
//         <div className="mb-3">
//           <FloatingLabelInput
//             type="text"
//             name="product name"
//             placeholder="Product Name"
//             value={currentProduct.details.name}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               updateDetail("name", e.target.value)
//             }
//           />
//         </div>

//         <div className="relative">
//           <FancySelect
//             name="category"
//             options={categories.map((cat: CategoryResponse) => ({
//               value: cat.id,
//               label: cat.name,
//             }))}
//             value={currentProduct.details.category}
//             onChange={(val) => updateDetail("category", val)}
//             onCreateCategory={() => console.log("Add new category clicked")}
//             placeholder="Select category"
//           />
//         </div>

//         <FloatingLabelTextarea
//           placeholder="Product Description"
//           value={currentProduct.details.description}
//           onChange={(e) => updateDetail("description", e.target.value)}
//         />

//         <div className="py-4">
//           <button
//             onClick={() => setIsPricingOpen(!isPricingOpen)}
//             className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//           >
//             Product Pricing
//             <ChevronDown
//               className={`w-5 h-5 ${isPricingOpen ? "rotate-180" : ""}`}
//             />
//           </button>
//           {isPricingOpen && (
//             <div className="">
//               <div className="mb-3">
//                 <FloatingLabelInput
//                   type="text"
//                   name="price"
//                   placeholder="Product Price NGN (No commas)"
//                   value={currentProduct.details.price}
//                   onChange={(e) => updateDetail("price", e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <FloatingLabelInput
//                   type="text"
//                   name="discount price"
//                   placeholder="Discount Price NGN (Optional)"
//                   value={currentProduct.details.discountPrice}
//                   onChange={(e) =>
//                     updateDetail("discountPrice", e.target.value)
//                   }
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="">
//           <button
//             onClick={() => setIsQuantityOpen(!isQuantityOpen)}
//             className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//           >
//             Product Quantity
//             <ChevronDown
//               className={`w-5 h-5 transition-transform ${
//                 isQuantityOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {isQuantityOpen && (
//             <div className="py-2">
//               <div className="flex items-center gap-3 mb-3">
//                 {quantityImage && (
//                   <img
//                     src={quantityImage}
//                     alt="Quantity indicator"
//                     className="w-12 h-12 object-cover rounded-lg"
//                   />
//                 )}

//                 <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-lg px-1 py-1 w-fit">
//                   <button
//                     onClick={() =>
//                       updateDetail(
//                         "quantity",
//                         Math.max(
//                           0,
//                           Number(currentProduct.details.quantity) - 1
//                         ).toString()
//                       )
//                     }
//                     className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
//                   >
//                     -
//                   </button>

//                   <span className="min-w-[20px] text-xs text-center font-medium">
//                     {currentProduct.details.quantity}
//                   </span>

//                   <button
//                     onClick={() =>
//                       updateDetail(
//                         "quantity",
//                         (Number(currentProduct.details.quantity) + 1).toString()
//                       )
//                     }
//                     className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-medium text-[var(--color-text)]">
//                     Always available
//                   </label>
//                   <button
//                     onClick={() =>
//                       updateDetail(
//                         "availability",
//                         !currentProduct.details.availability
//                       )
//                     }
//                     className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                       currentProduct.details.availability
//                         ? "bg-[var(--color-primary)]"
//                         : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                         currentProduct.details.availability
//                           ? "translate-x-6"
//                           : "translate-x-0"
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="">
//           <button
//             onClick={() => setIsOptionsOpen(!isOptionsOpen)}
//             className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//           >
//             Product Options
//             <ChevronDown
//               className={`w-5 h-5 ${isOptionsOpen ? "rotate-180" : ""}`}
//             />
//           </button>
//           {isOptionsOpen && (
//             <div className="py-2">
//               {currentProduct.details.options.map(
//                 (option: ProductOption, idx: number) => (
//                   <div
//                     key={idx}
//                     className="flex items-center gap-2 mb-2 cursor-pointer"
//                     onClick={() => openModal(idx)}
//                   >
//                     <span>{option.name}</span>
//                     {option.image && (
//                       <img
//                         src={
//                           option.image instanceof File
//                             ? URL.createObjectURL(option.image)
//                             : option.image
//                         }
//                         alt={option.name}
//                         className="w-8 h-8 object-cover rounded"
//                       />
//                     )}
//                   </div>
//                 )
//               )}
//               <button
//                 onClick={() => openModal()}
//                 className="bg-[var(--color-border-secondary)] px-4 text-[var(--color-primary)] py-2 rounded-lg text-sm font-semibold mt-2"
//               >
//                 Add Option
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="">
//           <button
//             onClick={() => setIsExtraOpen(!isExtraOpen)}
//             className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
//           >
//             Extra Product Info
//             <ChevronDown
//               className={`w-5 h-5 ${isExtraOpen ? "rotate-180" : ""}`}
//             />
//           </button>
//           {isExtraOpen && (
//             <div className="py-4">
//               <div className="flex justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-medium text-[var(--color-text)]">
//                     Recent
//                   </label>
//                   <button
//                     onClick={() =>
//                       updateDetail("recent", !currentProduct.details.recent)
//                     }
//                     className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                       currentProduct.details.recent
//                         ? "bg-[var(--color-primary)]"
//                         : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                         currentProduct.details.recent
//                           ? "translate-x-6"
//                           : "translate-x-0"
//                       }`}
//                     />
//                   </button>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-medium text-[var(--color-text)]">
//                     Hot deal
//                   </label>
//                   <button
//                     onClick={() =>
//                       updateDetail("hot_deal", !currentProduct.details.hot_deal)
//                     }
//                     className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                       currentProduct.details.hot_deal
//                         ? "bg-[var(--color-primary)]"
//                         : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                         currentProduct.details.hot_deal
//                           ? "translate-x-6"
//                           : "translate-x-0"
//                       }`}
//                     />
//                   </button>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-medium text-[var(--color-text)]">
//                     Featured
//                   </label>
//                   <button
//                     onClick={() =>
//                       updateDetail("featured", !currentProduct.details.featured)
//                     }
//                     className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
//                       currentProduct.details.featured
//                         ? "bg-[var(--color-primary)]"
//                         : "bg-gray-300"
//                     }`}
//                   >
//                     <span
//                       className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//                         currentProduct.details.featured
//                           ? "translate-x-6"
//                           : "translate-x-0"
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//               <FloatingLabelTextarea
//                 placeholder="Optional Product Settings"
//                 value={currentProduct.details.extraInfo}
//                 onChange={(e) => updateDetail("extraInfo", e.target.value)}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       <OptionModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onSave={handleSaveOption}
//         initialOption={
//           editingOptionIndex !== null
//             ? currentProduct.details.options[editingOptionIndex]
//             : undefined
//         }
//       />

//       <div className="mt-8 pb-4">
//         <div className="flex items-center justify-between mb-3">
//           <span className="text-sm font-medium text-[var(--color-text)]">
//             {currentIndex + 1} OF {products.length} PRODUCTS
//           </span>
//         </div>
//         <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4">
//           <div
//             className="h-1.5 bg-[var(--color-success)] rounded-full transition-all duration-300"
//             style={{
//               width: `${((currentIndex + 1) / products.length) * 100}%`,
//             }}
//           />
//         </div>
//         <div className="flex gap-3">
//           {currentIndex === 0 ? (
//             <button
//               onClick={goBackToSelection}
//               className="flex-1 px-4 py-3 bg-[var(--color-border-secondary)] text-[var(--color-primary)] rounded-lg text-sm font-semibold"
//             >
//               Back to Selection
//             </button>
//           ) : (
//             <button
//               onClick={prevProduct}
//               className="flex-1 px-4 py-3 bg-[var(--color-border-secondary)] text-[var(--color-primary)] rounded-lg text-sm font-semibold"
//             >
//               Previous Product
//             </button>
//           )}

//           <button
//             onClick={nextProduct}
//             className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold"
//           >
//             {currentIndex === products.length - 1 ? "Finish" : "Next Product"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Main;






