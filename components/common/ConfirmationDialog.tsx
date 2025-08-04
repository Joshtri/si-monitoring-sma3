"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  ReactNode,
  useState,
  cloneElement,
  isValidElement,
  MouseEvent,
} from "react";

interface ConfirmationDialogProps {
  trigger?: ReactNode;
  title?: string;
  message?: string;
  icon?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  loadingText?: string;
  confirmColor?: "primary" | "danger" | "default" | "success" | "warning";
  placement?:
    | "auto"
    | "top"
    | "bottom"
    | "center"
    | "top-center"
    | "bottom-center";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmationDialog({
  trigger,
  title = "Konfirmasi Aksi",
  message = "Apakah kamu yakin ingin melanjutkan aksi ini?",
  icon,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  loadingText = "Memproses...",
  confirmColor = "primary",
  placement = "center",
  isOpen: externalOpen,
  onOpenChange: externalSetOpen,
}: ConfirmationDialogProps) {
  const internalDisclosure = useDisclosure();
  const isControlled = typeof externalOpen === "boolean" && !!externalSetOpen;

  const isOpen = isControlled ? externalOpen : internalDisclosure.isOpen;
  const setOpen = isControlled
    ? externalSetOpen
    : internalDisclosure.onOpenChange;
  const onOpen = internalDisclosure.onOpen;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Error during confirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clone trigger element jika valid
  const triggerWithHandler = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        },
      })
    : null;

  // Fallback trigger jika bukan element valid
  const fallbackTrigger =
    !isValidElement(trigger) && trigger ? (
      <button
        type="button"
        className="inline-block bg-transparent border-none p-0 m-0 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpen();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        tabIndex={0}
        aria-label="Open confirmation dialog"
      >
        {trigger}
      </button>
    ) : null;

  return (
    <>
      {triggerWithHandler}
      {fallbackTrigger}

      <Modal isOpen={isOpen} placement={placement} onOpenChange={setOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                {icon && <span className="text-xl">{icon}</span>}
                <span>{title}</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-600">{message}</p>
              </ModalBody>
              <ModalFooter>
                <Button isDisabled={loading} variant="light" onPress={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  color={confirmColor}
                  isLoading={loading}
                  onPress={handleConfirm}
                >
                  {loading ? loadingText : confirmLabel}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
