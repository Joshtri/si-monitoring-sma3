"use client";

import React from "react";

interface SkeletonBlockProps {
  width?: string;
  height?: string;
  className?: string;
  rounded?: string;
}

export function SkeletonBlock({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  className = "",
}: SkeletonBlockProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${width} ${height} ${rounded} ${className}`}
    />
  );
}
