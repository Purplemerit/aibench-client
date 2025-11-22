import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardPreviewSkeleton = () => {
  return (
    <section className="bg-white dark:bg-black py-16 px-6 md:px-20 lg:px-36 pb-20">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 grid grid-cols-5 gap-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderboardPreviewSkeleton;
