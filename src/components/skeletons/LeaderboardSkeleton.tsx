import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-12 flex-1 rounded-lg" />
          <Skeleton className="h-12 w-48 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 grid grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
              <div
                key={index}
                className="p-4 grid grid-cols-7 gap-4 items-center"
              >
                <Skeleton className="h-6 w-8" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
