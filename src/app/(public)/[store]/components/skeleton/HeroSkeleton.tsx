export default function HeroSkeleton() {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {/* Image skeleton */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content skeleton */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
