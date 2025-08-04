"use client";

import { Button } from "@heroui/react";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { InboxIcon } from "@heroicons/react/24/outline";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: () => void;
  actionLabel?: string;
  className?: string;
}

export function EmptyState({
  title = "Data tidak ditemukan",
  description = "Belum ada data yang tersedia saat ini.",
  icon,
  action,
  actionLabel = "Tambah Data",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm animate-in fade-in-50",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon ?? <InboxIcon className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>
      {action && (
        <div className="mt-6">
          <Button onClick={action} color="primary">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
