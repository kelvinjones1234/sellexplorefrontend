"use client";

import React from "react";
import { Package, Trash2 } from "lucide-react";

import { Product, ProductImage } from "../types";
import ProductActions from "./ProductActions";

// ProductsTab Component
const ProductsTab: React.FC<{
  products: Product[];
  selectedProducts: number[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<number[]>>;
  productPage: number;
  setProductPage: React.Dispatch<React.SetStateAction<number>>;
  productTotal: number;
  itemsPerPage: number;
  isDeleting: boolean;
  handleDelete: (input: Product | number[]) => Promise<void>;
  setProductToDelete: React.Dispatch<React.SetStateAction<Product | null>>;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  formatPrice: (price: number, currency: string) => string;
  getThumbnail: (images: ProductImage[]) => string | null;
}> = ({
  products,
  selectedProducts,
  setSelectedProducts,
  productPage,
  setProductPage,
  productTotal,
  itemsPerPage,
  isDeleting,
  handleDelete,
  setProductToDelete,
  setIsDeleteModalOpen,
  setProductToEdit,
  setIsEditModalOpen,
  loading,
  error,
  fetchProducts,
  formatPrice,
  getThumbnail,
}) => {
  const toggleCheckAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
    }
  };

  const totalPages = Math.ceil(productTotal / itemsPerPage);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="md:hidden divide-y divide-[var(--color-border-default)] px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedProducts.length === products.length}
              onChange={toggleCheckAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Select All</span>
          </div>
          {selectedProducts.length > 0 && (
            <button
              onClick={() => handleDelete(selectedProducts)}
              disabled={isDeleting}
              className="flex items-center gap-2 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedProducts.length})
            </button>
          )}
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => {
                  setSelectedProducts((prev) =>
                    e.target.checked
                      ? [...prev, product.id]
                      : prev.filter((id) => id !== product.id)
                  );
                }}
                className="rounded border-gray-300"
              />
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                {getThumbnail(product.images) ? (
                  <img
                    src={getThumbnail(product.images)!}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-6 h-6 text-[var(--color-text-secondary)]" />
                )}
              </div>
              <div className="text-xs">
                <p className="font-medium">{product.name}</p>
                <p className="text-[var(--color-text-secondary)]">
                  {formatPrice(parseFloat(product.price), "NGN")}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <ProductActions
                product={product}
                variant="mobile"
                onDelete={handleDelete}
                onOpenDeleteModal={(product) => {
                  setProductToDelete(product);
                  setIsDeleteModalOpen(true);
                }}
                onOpenEditModal={(product) => {
                  setProductToEdit(product);
                  setIsEditModalOpen(true);
                }}
              />
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1">
                {product.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleCheckAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Item
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Quantity
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Price
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Options
              </th>
              <th className="py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-right">
                {selectedProducts.length > 0 ? (
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDelete(selectedProducts)}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected ({selectedProducts.length})
                    </button>
                  </div>
                ) : (
                  "Actions"
                )}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] text-[var(--color-text-secondary)]">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[var(--color-bg-surface)] transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      setSelectedProducts((prev) =>
                        e.target.checked
                          ? [...prev, product.id]
                          : prev.filter((id) => id !== product.id)
                      );
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {getThumbnail(product.images) ? (
                        <img
                          src={getThumbnail(product.images)!}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      )}
                    </div>
                    <span className=" text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs">
                    {product.quantity}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm">
                    {formatPrice(parseFloat(product.price), "NGN")}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm">
                    {product.options && product.options.length > 0
                      ? product.options
                          .map((opt) => opt.options.join(", "))
                          .join("; ")
                      : "-"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <ProductActions
                    product={product}
                    variant="desktop"
                    onDelete={handleDelete}
                    onOpenDeleteModal={(product) => {
                      setProductToDelete(product);
                      setIsDeleteModalOpen(true);
                    }}
                    onOpenEditModal={(product) => {
                      setProductToEdit(product);
                      setIsEditModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[var(--color-border-strong)] gap-4">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Items per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setItemsPerPage(newSize);
              setProductPage(1);
            }}
            className="border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] rounded-md px-2 py-1 text-sm text-[var(--color-text-primary)]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setProductPage((prev) => Math.max(prev - 1, 1))}
            disabled={productPage === 1}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-[var(--color-text-secondary)]">
            Page {productPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setProductPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={productPage === totalPages}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
