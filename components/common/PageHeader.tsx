"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onOptionsClick?: () => void;
  backHref?: string;
}

export function PageHeader({
  title,
  description,
  actions,  
  breadcrumbs,
  onOptionsClick,
  backHref,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
          {breadcrumbs.map((item, index) => (
            <span key={index} className="flex items-center gap-1">
              {item.href ? (
                <Link
                  className="hover:underline text-primary font-medium"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700">{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title, Back Button, Actions, Options */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {backHref && (
            <>
              <Link
                href={backHref}
                className="flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Kembali
              </Link>
              <div className="h-6 w-px bg-gray-300" />
            </>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex gap-2 items-center ml-auto">
          {onOptionsClick && (
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              title="Opsi"
              onClick={onOptionsClick}
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
}