'use client';

import Skeleton from '@ui/skeleton';

export const FilterSkeleton = () => (
  <div className="flex gap-4 items-center lg:w-1/2">
    <Skeleton shape="control" width="40%" />
    <Skeleton shape="control" width="20%" />
    <Skeleton shape="control" width="20%" />
    <Skeleton shape="control" width="30%" />
  </div>
);

export const SprintSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-line bg-surface">
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-5">
      <div className="flex items-center gap-3">
        <Skeleton shape="heading" width={144} />
        <Skeleton shape="pill" width={64} />
        <Skeleton width={112} />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton shape="bar" width={224} />
        <Skeleton shape="control" size="sm" width={144} />
      </div>
    </div>
    <div className="divide-y divide-line">
      {[76, 60, 83, 53].map((width) => (
        <div
          key={width}
          className="grid grid-cols-[1.5rem_6rem_1fr_6rem_3rem_3rem_2.25rem] items-center gap-3 py-4 pr-4 pl-11"
        >
          <Skeleton shape="icon" />
          <Skeleton width={72} />
          <Skeleton width={`${width}%`} />
          <Skeleton shape="pill" />
          <span className="justify-self-end">
            <Skeleton width={20} />
          </span>
          <span className="justify-self-end">
            <Skeleton shape="circle" width={28} />
          </span>
          <span className="justify-self-end">
            <Skeleton shape="circle" width={28} />
          </span>
        </div>
      ))}
    </div>
  </div>
);
