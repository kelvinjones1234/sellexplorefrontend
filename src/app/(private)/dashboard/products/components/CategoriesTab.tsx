"use client";

import { ExternalLink, MoreHorizontal, Package } from "lucide-react";
import { Category } from "../types";

// CategoriesTab Component
const CategoriesTab: React.FC<{
  categories: Category[];
  categoryPage: number;
  setCategoryPage: React.Dispatch<React.SetStateAction<number>>;
  categoryTotal: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}> = ({
  categories,
  categoryPage,
  setCategoryPage,
  categoryTotal,
  itemsPerPage,
  loading,
  error,
  fetchCategories,
}) => {
  const totalPages = Math.ceil(categoryTotal / itemsPerPage);

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
          onClick={fetchCategories}
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
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                {category.image ? (
                  <img
                    src={`${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="w-6 h-6 text-[var(--color-text-secondary)]" />
                )}
              </div>
              <div className="text-xs">
                <p className="font-medium">{category.name}</p>
                <p className="text-[var(--color-text-secondary)]">
                  {category.product_count} items
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <a
                  href={`/categories/${category.slug}`}
                  className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </a>
                <button className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Image
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Category
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Items
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] text-[var(--color-text-secondary)]">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="hover:bg-[var(--color-bg-surface)] transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={`${category.image}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm">{category.name}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm">{category.product_count}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/categories/${category.slug}`}
                      className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </a>
                    <button className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    </button>
                  </div>
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
              setCategoryPage(1);
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
            onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
            disabled={categoryPage === 1}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-[var(--color-text-secondary)]">
            Page {categoryPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCategoryPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={categoryPage === totalPages}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
