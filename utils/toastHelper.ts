import { addToast } from "@heroui/toast";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ShowToastOptions {
  title?: string;
  description?: string;
  color?: ToastVariant;
  timeout?: number;
}

/**
 * Wrapper untuk menampilkan toast dengan default value dan style.
 */
export function showToast({
  title = "Notifikasi",
  description,
  color = "success",
  timeout = 3000,
}: ShowToastOptions) {
  // Map custom ToastVariant to accepted color values
  const colorMap: Record<
    ToastVariant,
    "success" | "warning" | "danger" | "primary"
  > = {
    success: "success",
    error: "danger",
    warning: "warning",
    info: "primary",
  };

  addToast({
    title,
    description,
    color: colorMap[color],
    timeout,
    shouldShowTimeoutProgress: true,
  });
}
