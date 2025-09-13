"use client";

import { Heart } from "lucide-react";

interface ProductGroupData {
  total_products: { count: number; image: string | null };
  featured_products: { count: number; image: string | null };
  recent_products: { count: number; image: string | null };
  storename: string;
}

interface ItemsGroupProps {
  initialData: ProductGroupData | null;
}

const ItemsGroup = ({ initialData }: ItemsGroupProps) => {
  // Use a fallback if initialData is null or the product count is zero
  if (!initialData || initialData.total_products.count === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 text-center text-gray-500 text-lg">
        No products found {initialData?.storename}
      </div>
    );
  }

  // Use the data directly from the API response
  const allItems = {
    title: "All Items",
    count: `${initialData.total_products.count} Items Available`,
    image: initialData.total_products.image,
  };

  const otherItems = [
    {
      title: "Featured",
      count: `${initialData.featured_products.count} Items Available`,
      image: initialData.featured_products.image,
    },
    {
      title: "Recent",
      count: `${initialData.recent_products.count} Items Available`,
      image: initialData.recent_products.image,
    },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="mb-4">
          <Card item={allItems} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card item={otherItems[0]} isSmall />
          <Card item={otherItems[1]} isSmall />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 h-[500px]">
        <Card item={allItems} isLarge />
        <div className="flex flex-col gap-6">
          <Card item={otherItems[0]} isMedium />
          <Card item={otherItems[1]} isMedium />
        </div>
      </div>
    </div>
  );
};

// ... (Card component remains the same)
const Card = ({
  item,
  isSmall,
  isMedium,
  isLarge,
}: {
  item: { title: string; count: string; image: string | null };
  isSmall?: boolean;
  isMedium?: boolean;
  isLarge?: boolean;
}) => {
  let sizeClasses: any = {};

  if (isSmall) {
    sizeClasses = {
      cardWrapper: "h-40 sm:h-52 md:h-60 max-h-[400px]",
      iconSize: "w-10 h-10 top-3 right-3",
      iconSvg: "w-5 h-5",
      contentPadding: "p-4",
      titleSize: "text-lg",
      countSize: "text-sm",
    };
  } else if (isMedium) {
    sizeClasses = {
      cardWrapper: "h-[238px]",
      iconSize: "w-12 h-12 top-4 right-4",
      iconSvg: "w-6 h-6",
      contentPadding: "p-6",
      titleSize: "text-2xl",
      countSize: "",
    };
  } else if (isLarge) {
    sizeClasses = {
      cardWrapper: "h-full",
      iconSize: "w-14 h-14 top-6 right-6",
      iconSvg: "w-7 h-7",
      contentPadding: "p-8",
      titleSize: "text-4xl",
      countSize: "text-xl",
    };
  } else {
    sizeClasses = {
      cardWrapper: "h-48 sm:h-60 md:h-72 max-h-[400px]",
      iconSize: "w-12 h-12 top-4 right-4",
      iconSvg: "w-6 h-6",
      contentPadding: "p-6",
      titleSize: "text-2xl",
      countSize: "",
    };
  }

  const imageUrl =
    item.image ||
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop&crop=center";

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-xl cursor-pointer">
      <div className={`relative ${sizeClasses.cardWrapper}`}>
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500" />

        <div
          className={`absolute bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:scale-110 ${sizeClasses.iconSize}`}
        >
          <Heart
            className={`text-gray-700 transition-colors duration-300 group-hover:text-red-500 ${sizeClasses.iconSvg}`}
          />
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 ${sizeClasses.contentPadding}`}
        >
          <h3
            className={`font-bold text-white mb-2 transform transition-transform duration-500 group-hover:translate-y-[-4px] ${sizeClasses.titleSize}`}
          >
            {item.title}
          </h3>
          <p
            className={`text-white/80 font-medium transform transition-all duration-500 group-hover:translate-y-[-4px] group-hover:text-white ${sizeClasses.countSize}`}
          >
            {item.count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemsGroup;
