import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ModelComparisonSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-80 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl mb-6" />

          <div className="flex gap-3 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-7 w-48 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>

              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-96 w-full rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonSkeleton;
