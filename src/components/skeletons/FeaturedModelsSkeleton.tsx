import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedModelsSkeleton = () => {
  return (
    <section className="bg-white dark:bg-black py-16 px-6 md:px-20 lg:px-36 pb-20">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-20 w-full mb-6" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="flex gap-3">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelsSkeleton;
