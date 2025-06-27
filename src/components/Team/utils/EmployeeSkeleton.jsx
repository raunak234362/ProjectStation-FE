/* eslint-disable react/prop-types */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

const SkeletonCard = () => (
  <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-1" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div>
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4 mb-1" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  </div>
);

const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg p-4 shadow border border-gray-200 animate-pulse"
      >
        <Skeleton className="h-5 w-1/4 mb-2" />
        <Skeleton className="h-8 w-1/3 mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

const SkeletonTasks = () => (
  <div className="bg-white rounded-lg p-4 shadow border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-4 w-1/6" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex justify-between">
          <div>
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-4 w-1/4 mb-1" />
            <Skeleton className="h-4 w-1/3 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonProjects = () => (
  <div className="bg-white rounded-lg p-4 shadow border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-4 w-1/6" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-1" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonTaskDistribution = () => (
  <div className="bg-white rounded-lg p-4 shadow border border-gray-200 animate-pulse">
    <div className="flex items-center mb-4">
      <Skeleton className="h-5 w-1/4" />
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export {
  Skeleton,
  SkeletonCard,
  SkeletonStats,
  SkeletonTasks,
  SkeletonProjects,
  SkeletonTaskDistribution,
};
