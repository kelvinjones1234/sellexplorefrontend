// import React, { useEffect, useState } from "react";
// import { X, Image as ImagePlus, Trash2 } from "lucide-react";
// import FloatingLabelInput from "@/app/component/fields/Input";
// import { useAuth } from "@/context/AuthContext";
// import {
//   getCatForManger,
//   addCategory,
//   updateCategory,
//   deleteCategory,
// } from "../api";

// interface CategoryManagerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export interface Category {
//   id: number | string;
//   name: string;
//   image: File | null;
//   preview: string | null;
//   isNew: boolean;
//   hasChanged?: boolean;
// }

// export default function CategoryManager({
//   isOpen,
//   onClose,
// }: CategoryManagerProps) {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const { accessToken } = useAuth();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         if (!accessToken) return;
//         setIsLoading(true);
//         const result = await getCatForManger(accessToken);

//         setCategories(
//           result.map((cat) => ({
//             ...cat,
//             image: null,
//             preview: cat.image,
//             isNew: false,
//             hasChanged: false,
//           }))
//         );
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isOpen) {
//       fetchCategories();
//     }
//   }, [accessToken, isOpen]);

//   const handleAddCategory = () => {
//     setCategories((prevCategories) => [
//       ...prevCategories,
//       {
//         id: `new-${Date.now()}`, // Using a string ID for new categories
//         name: "",
//         image: null,
//         preview: null,
//         isNew: true,
//         hasChanged: true,
//       },
//     ]);
//   };

//   const handleNameChange = (id: string | number, value: string) => {
//     setCategories((prevCategories) =>
//       prevCategories.map((c) =>
//         c.id === id ? { ...c, name: value, hasChanged: true } : c
//       )
//     );
//   };

//   const handleImageChange = (id: string | number, file: File | null) => {
//     setCategories((prevCategories) =>
//       prevCategories.map((c) => {
//         if (c.id === id) {
//           if (c.preview && c.preview.startsWith("blob:")) {
//             URL.revokeObjectURL(c.preview);
//           }
//           return {
//             ...c,
//             image: file,
//             preview: file ? URL.createObjectURL(file) : null,
//             hasChanged: true,
//           };
//         }
//         return c;
//       })
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!accessToken) return;

//     try {
//       setIsLoading(true);

//       const categoriesToAdd = categories.filter(
//         (c) => c.isNew && c.name.trim() // Remove the image requirement
//       );
//       const categoriesToUpdate = categories.filter(
//         (c) => !c.isNew && c.hasChanged
//       );

//       const addPromises = categoriesToAdd.map((cat) =>
//         addCategory(accessToken, cat.name, cat.image)
//       );

//       const updatePromises = categoriesToUpdate.map((cat) =>
//         updateCategory(accessToken, Number(cat.id), cat.name, cat.image)
//       );

//       await Promise.all([...addPromises, ...updatePromises]);

//       onClose();
//     } catch (err) {
//       console.error("Failed to update categories", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDeleteCategory = async (id: number | string) => {
//     if (!accessToken) return;
//     try {
//       // If it's a new category (string id), just remove from UI
//       if (typeof id === "string") {
//         setCategories(categories.filter((c) => c.id !== id));
//         return;
//       }
//       // If it's an existing category (number id), delete from backend
//       setIsLoading(true);
//       await deleteCategory(accessToken, id);
//       setCategories(categories.filter((c) => c.id !== id));
//     } catch (err) {
//       console.error("Failed to delete category", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md p-6 animate-in fade-in-0 zoom-in-95 flex flex-col max-h-[70vh]">
//         <div className="flex-shrink-0 flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-800">
//             Manage Categories
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex flex-col flex-grow min-h-0"
//         >
//           <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
//             {isLoading ? (
//               <p className="text-center text-gray-500">Loading...</p>
//             ) : categories.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 No categories found. Click "Add new category" to begin.
//               </p>
//             ) : (
//               categories.map((cat) => (
//                 <div
//                   key={cat.id}
//                   className="flex items-center justify-between gap-3 border border-[var(--color-border-secondary)] rounded-xl p-3 shadow-xs hover:shadow-sm transition"
//                 >
//                   <label className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-border-secondary)] overflow-hidden cursor-pointer hover:border-[var(--color-primary)]">
//                     {cat.preview ? (
//                       <img
//                         src={cat.preview}
//                         alt="preview"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <ImagePlus className="w-5 h-5 text-gray-500" />
//                     )}
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) =>
//                         handleImageChange(cat.id, e.target.files?.[0] || null)
//                       }
//                     />
//                   </label>

//                   <FloatingLabelInput
//                     type="text"
//                     name={`category-${cat.id}`}
//                     placeholder="Enter category name"
//                     value={cat.name}
//                     onChange={(e) => handleNameChange(cat.id, e.target.value)}
//                   />

//                   <button
//                     type="button"
//                     onClick={() => handleDeleteCategory(cat.id)}
//                     className="flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-border-secondary)] transition"
//                   >
//                     <Trash2 className="w-4 h-4 text-gray-500" />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="flex-shrink-0 pt-4">
//             <div className="flex w-full justify-end">
//               <button
//                 type="button"
//                 onClick={handleAddCategory}
//                 className="text-[var(--color-primary)] float-right text-sm font-medium hover:underline"
//               >
//                 Add new category +
//               </button>
//             </div>

//             <div className="mt-6 flex justify-center w-full gap-2">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-4 w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
//               >
//                 {isLoading ? "Updating..." : "Update product categories"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState, useCallback } from "react";
import { X, Image as ImagePlus, Trash2 } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "../api";
import { CategoryResponse } from "../api";

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: number | string;
  name: string;
  image: File | null;
  preview: string | null;
  isNew: boolean;
  hasChanged?: boolean;
}

export default function CategoryManager({
  isOpen,
  onClose,
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isAuthenticated } = useAuth();

  // Set access token in API client
  useEffect(() => {
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

  // Fetch categories when modal opens
  const fetchCategories = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await apiClient.getCatForManager();

      setCategories(
        result.map((cat) => ({
          id: cat.id,
          name: cat.name,
          image: null,
          preview: cat.image || null,
          isNew: false,
          hasChanged: false,
        }))
      );
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchCategories();
    }
  }, [isOpen, isAuthenticated, fetchCategories]);

  // Cleanup preview URLs when component unmounts or categories change
  useEffect(() => {
    return () => {
      categories.forEach((cat) => {
        if (cat.preview && cat.preview.startsWith("blob:")) {
          URL.revokeObjectURL(cat.preview);
        }
      });
    };
  }, [categories]);

  const handleAddCategory = () => {
    setCategories((prevCategories) => [
      ...prevCategories,
      {
        id: `new-${Date.now()}`,
        name: "",
        image: null,
        preview: null,
        isNew: true,
        hasChanged: true,
      },
    ]);
  };

  const handleNameChange = (id: string | number, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((c) =>
        c.id === id ? { ...c, name: value, hasChanged: true } : c
      )
    );
  };

  const handleImageChange = (id: string | number, file: File | null) => {
    setCategories((prevCategories) =>
      prevCategories.map((c) => {
        if (c.id === id) {
          if (c.preview && c.preview.startsWith("blob:")) {
            URL.revokeObjectURL(c.preview);
          }
          return {
            ...c,
            image: file,
            preview: file ? URL.createObjectURL(file) : c.preview,
            hasChanged: true,
          };
        }
        return c;
      })
    );
  };

  const handleDeleteCategory = async (id: number | string) => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof id === "string") {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        await apiClient.deleteCategory(id);
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError(err.message || "Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const validateCategories = () => {
    return categories.every((cat) => {
      if (cat.hasChanged || cat.isNew) {
        return cat.name.trim().length > 0;
      }
      return true;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCategories()) {
      setError("All categories must have a name");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const categoriesToAdd = categories.filter(
        (c) => c.isNew && c.name.trim()
      );
      const categoriesToUpdate = categories.filter(
        (c) => !c.isNew && c.hasChanged
      );

      const addPromises = categoriesToAdd.map((cat) =>
        apiClient.addCategory(cat.name, cat.image)
      );
      const updatePromises = categoriesToUpdate.map((cat) =>
        apiClient.updateCategory(Number(cat.id), cat.name, cat.image)
      );

      await Promise.all([...addPromises, ...updatePromises]);

      // Clean up blob URLs
      categories.forEach((cat) => {
        if (cat.preview && cat.preview.startsWith("blob:")) {
          URL.revokeObjectURL(cat.preview);
        }
      });

      // Refresh categories after successful submission
      await fetchCategories();
      onClose();
    } catch (err: any) {
      console.error("Failed to update categories:", err);
      setError(err.message || "Failed to update categories");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md p-6 animate-in fade-in-0 zoom-in-95 flex flex-col max-h-[70vh]">
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Categories
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow min-h-0"
        >
          <div className="flex-grow overflow-y-auto space-y-4 -mr-2 pr-2">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            {isLoading && !error && (
              <p className="text-center text-gray-500">Loading...</p>
            )}
            {!isLoading && categories.length === 0 && !error && (
              <p className="text-center text-gray-500">
                No categories found. Click "Add new category" to begin.
              </p>
            )}
            {!isLoading &&
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-3 border border-[var(--color-border-secondary)] rounded-xl p-3 shadow-xs hover:shadow-sm transition"
                >
                  <label className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-border-secondary)] overflow-hidden cursor-pointer hover:border-[var(--color-primary)]">
                    {cat.preview ? (
                      <img
                        src={cat.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="w-5 h-5 text-gray-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(cat.id, e.target.files?.[0] || null)
                      }
                      disabled={isLoading}
                    />
                  </label>

                  <FloatingLabelInput
                    type="text"
                    name={`category-${cat.id}`}
                    placeholder="Enter category name"
                    value={cat.name}
                    onChange={(e) => handleNameChange(cat.id, e.target.value)}
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-border-secondary)] transition"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
          </div>

          <div className="flex-shrink-0 pt-4">
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-[var(--color-primary)] float-right text-sm font-medium hover:underline disabled:opacity-50"
                disabled={isLoading}
              >
                Add new category +
              </button>
            </div>

            <div className="mt-6 flex justify-center w-full gap-2">
              <button
                type="submit"
                disabled={isLoading || !categories.some((c) => c.hasChanged)}
                className="px-4 w-full py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update product categories"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
