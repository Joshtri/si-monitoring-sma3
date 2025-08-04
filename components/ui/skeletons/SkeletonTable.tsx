// components/ui/skeleton/SkeletonTable.tsx
export function SkeletonTable({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={colIdx} className="h-6 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
