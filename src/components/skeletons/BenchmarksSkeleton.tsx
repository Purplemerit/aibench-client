import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const BenchmarksSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-80 mb-4" />
          <Skeleton className="h-6 w-full max-w-3xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 flex-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-80 w-full rounded" />
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-72 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-56 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded"
                  >
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarksSkeleton;
