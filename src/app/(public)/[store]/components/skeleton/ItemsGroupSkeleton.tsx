export default function ItemsGroupSkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-4">
      {/* Mobile Layout Skeleton */}
      <div className="block lg:hidden">
        <div className="mb-4">
          <CardSkeleton isDefault />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CardSkeleton isSmall />
          <CardSkeleton isSmall />
        </div>
      </div>

      {/* Desktop Layout Skeleton */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 h-[500px]">
        <CardSkeleton isLarge />
        <div className="flex flex-col gap-6">
          <CardSkeleton isMedium />
          <CardSkeleton isMedium />
        </div>
      </div>
    </div>
  );
}

const CardSkeleton = ({
  isSmall,
  isMedium,
  isLarge,
  isDefault,
}: {
  isSmall?: boolean;
  isMedium?: boolean;
  isLarge?: boolean;
  isDefault?: boolean;
}) => {
  let sizeClasses: any = {};

  if (isSmall) {
    sizeClasses = {
      cardWrapper: "h-40 sm:h-52 md:h-60 max-h-[400px]",
      iconSize: "w-10 h-10 top-3 right-3",
      contentPadding: "p-4",
      titleSize: "h-5 w-3/4",
      countSize: "h-4 w-1/2",
    };
  } else if (isMedium) {
    sizeClasses = {
      cardWrapper: "h-[238px]",
      iconSize: "w-12 h-12 top-4 right-4",
      contentPadding: "p-6",
      titleSize: "h-7 w-2/3",
      countSize: "h-5 w-1/2",
    };
  } else if (isLarge) {
    sizeClasses = {
      cardWrapper: "h-full",
      iconSize: "w-14 h-14 top-6 right-6",
      contentPadding: "p-8",
      titleSize: "h-10 w-3/4",
      countSize: "h-6 w-1/2",
    };
  } else {
    sizeClasses = {
      cardWrapper: "h-48 sm:h-60 md:h-72 max-h-[400px]",
      iconSize: "w-12 h-12 top-4 right-4",
      contentPadding: "p-6",
      titleSize: "h-7 w-2/3",
      countSize: "h-5 w-1/2",
    };
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-xl">
      <div className={`relative ${sizeClasses.cardWrapper}`}>
        <div className="w-full h-full bg-gray-200 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div
          className={`absolute bg-gray-200 rounded-full animate-pulse ${sizeClasses.iconSize}`}
        />

        <div
          className={`absolute bottom-0 left-0 right-0 ${sizeClasses.contentPadding}`}
        >
          <div
            className={`bg-gray-200 rounded mb-2 animate-pulse ${sizeClasses.titleSize}`}
          />
          <div
            className={`bg-gray-200 rounded animate-pulse ${sizeClasses.countSize}`}
          />
        </div>
      </div>
    </div>
  );
};