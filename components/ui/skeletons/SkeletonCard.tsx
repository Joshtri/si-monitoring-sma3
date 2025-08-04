// components/states/SkeletonCard.tsx
import React from "react";

interface SkeletonCardProps {
  rows?: number; // jumlah field/baris skeleton
}

export function SkeletonCard({ rows = 4 }: SkeletonCardProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
