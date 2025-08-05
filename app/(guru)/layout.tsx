"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import Sidebar from "@/components/partials/Sidebar";
import Header from "@/components/partials/Header";

export default function GuruLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileSidebarOpen((prev) => !prev);

  const sidebarWidth = !isMobile ? (isCollapsed ? 64 : 256) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      {(!isMobile || isMobileSidebarOpen) && (
        <>
          <Sidebar
            userRole="GURU"
            isCollapsed={!isMobile && isCollapsed}
            isMobile={isMobile}
            onToggleCollapse={toggleCollapse}
            onMobileMenuClick={() => setIsMobileSidebarOpen(false)}
            className={`fixed inset-y-0 left-0 z-50`}
          />

          {/* Overlay saat mobile */}
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Wrapper konten utama */}
      <div
        className="flex flex-col min-h-screen transition-all duration-300 ease-out"
        style={{ marginLeft: sidebarWidth }}
      >
        <Header
          userRole="guru"
          onToggleSidebar={isMobile ? toggleMobileMenu : toggleCollapse}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
