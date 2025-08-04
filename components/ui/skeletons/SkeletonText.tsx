// components/states/SkeletonText.tsx
import React from "react";

interface SkeletonTextProps {
  width?: string; // tailwind width (e.g., "w-1/2")
  height?: string; // tailwind height (e.g., "h-6")
  className?: string; // for extra custom
}

export function SkeletonText({
  width = "w-1/2",
  height = "h-6",
  className = "",
}: SkeletonTextProps) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
    />
  );
}
