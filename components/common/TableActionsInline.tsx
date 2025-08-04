// components/common/TableActionsInline.tsx
"use client";

import { Button, Tooltip } from "@heroui/react";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState, ComponentType, SVGProps } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface CustomAction {
  key: string;
  label: string;
  show?: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void | Promise<void>;
  color?: "default" | "primary" | "danger" | "success" | "warning";
  render?: React.ReactNode;
}

interface TableActionsInlineProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    loadingText?: string;
    onConfirm: () => Promise<void> | void;
  };
  customActions?: CustomAction[];
}

export function TableActionsInline({
  onView,
  onEdit,
  onDelete,
  customActions = [],
}: TableActionsInlineProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderButton = (
    label: string,
    icon: React.ReactNode,
    color: string,
    onClick: () => void,
    tooltip?: string
  ) => {
    const btn = (
      <Button
        size="sm"
        isIconOnly={isMobile}
        variant="flat"
        color={color as any}
        onPress={onClick}
        startContent={icon}
      >
        {!isMobile && label}
      </Button>
    );

    return isMobile ? (
      <Tooltip content={tooltip || label} placement="top">
        {btn}
      </Tooltip>
    ) : (
      btn
    );
  };

  return (
    <div
      className={`flex gap-2 items-center ${
        isMobile ? "justify-start" : "justify-center"
      }`}
    >
      {onView && (
        <div key="view-action">
          {renderButton(
            "Lihat",
            <EyeIcon className="w-4 h-4" />,
            "primary",
            onView
          )}
        </div>
      )}

      {onEdit && (
        <div key="edit-action">
          {renderButton(
            "Edit",
            <PencilSquareIcon className="w-4 h-4" />,
            "warning",
            onEdit
          )}
        </div>
      )}

      {onDelete && (
        <div key="delete-action">
          {renderButton(
            "Hapus",
            <TrashIcon className="w-4 h-4" />,
            "danger",
            () => setShowDeleteDialog(true)
          )}
          <ConfirmationDialog
            isOpen={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            confirmColor="danger"
            confirmLabel={onDelete.confirmLabel ?? "Hapus"}
            loadingText={onDelete.loadingText ?? "Menghapus..."}
            title={onDelete.title ?? "Konfirmasi Hapus"}
            message={
              onDelete.message ?? "Apakah Anda yakin ingin menghapus item ini?"
            }
            icon={<TrashIcon className="h-5 w-5 text-red-600" />}
            onConfirm={async () => {
              await onDelete.onConfirm();
              setShowDeleteDialog(false);
            }}
          />
        </div>
      )}

      {customActions
        .filter((action) => action.show !== false)
        .map((action) =>
          action.render ? (
            <div key={action.key}>{action.render}</div>
          ) : (
            <div key={action.key}>
              {renderButton(
                action.label,
                <action.icon className="w-4 h-4" />,
                action.color ?? "default",
                action.onClick ?? (() => {}),
                action.label
              )}
            </div>
          )
        )}
    </div>
  );
}