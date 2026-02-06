import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
           <Skeleton className="h-12 w-48 mb-4" />
           <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
             <Skeleton className="aspect-square w-full rounded-2xl" />
             <Skeleton className="h-4 w-3/4" />
             <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
