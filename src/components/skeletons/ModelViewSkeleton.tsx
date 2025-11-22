import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ModelViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-4 w-48 mb-4" />

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <Skeleton className="h-12 w-96 mb-3" />
              <Skeleton className="h-6 w-64 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
              >
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-md" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-64 w-full rounded" />
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-56 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
              <Skeleton className="h-8 w-52 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewSkeleton;
