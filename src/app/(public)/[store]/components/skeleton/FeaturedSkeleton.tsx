export default function FeaturedSkeleton() {
  const skeletonItems = Array(8).fill(null); // Adjust number of skeleton items as needed

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header with category filter skeleton */}
      <div className="flex justify-between items-center my-4">
        <div className="h-6 w-32 bg-[var(--color-bg-surface)] rounded animate-pulse" />
        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <div className="h-10 bg-[var(--color-bg-surface)] rounded animate-pulse" />
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-default)] overflow-hidden"
          >
            <div className="relative">
              <div className="w-full h-[12rem] sm:h-[15rem] bg-[var(--color-bg-surface)] animate-pulse" />
              <div className="absolute top-2 left-2 h-6 w-16 bg-pink-200 rounded animate-pulse" />
            </div>

            <div className="py-4 px-2">
              <div className="h-4 w-3/4 bg-[var(--color-bg-surface)] rounded animate-pulse mb-2" />
              <div className="flex flex-col mt-2 gap-1">
                <div className="h-4 w-1/3 bg-[var(--color-bg-surface)] rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-[var(--color-bg-surface)] rounded animate-pulse" />
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="h-3 w-1/3 bg-[var(--color-bg-surface)] rounded animate-pulse" />
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 bg-[var(--color-bg-surface)] rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
