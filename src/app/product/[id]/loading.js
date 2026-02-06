import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Gallery Skeleton */}
        <div className="space-y-6">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
            <Skeleton className="w-20 h-20 rounded-xl" />
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="py-8">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-8 w-1/4 mb-10" />
          <div className="space-y-4 mb-10">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-4 w-24 mb-4" />
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="w-12 h-12 rounded-lg" />
              <Skeleton className="w-12 h-12 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-14 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}
