import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const PricingSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <Skeleton className="h-8 w-48 mb-6" />

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </div>

              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>

              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
          <Skeleton className="h-8 w-56 mb-6" />

          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded"
              >
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSkeleton;
