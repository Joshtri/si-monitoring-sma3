import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div className={`relative flex min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}