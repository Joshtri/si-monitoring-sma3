"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// import { useMediaQuery } from "react-responsive";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { PageHeader } from "@/components/common/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import { SkeletonTable } from "@/components/ui/skeletons/SkeletonTable";
import { EmptyState } from "../common/EmptyState";

interface Column {
  key: string;
  label: string;
  align?: "start" | "center" | "end";
}

interface Row {
  key: string;
  [key: string]: any;
}

interface OptionsMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  onPress?: () => void;
}

interface ListGridProps {
  title?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  backHref?: string;
  actions?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  columns: Column[];
  rows: Row[];
  loading?: boolean;
  empty?: ReactNode;
  onOptionsClick?: () => void | ReactNode;
  optionsMenu?: OptionsMenuItem[];
  pageSize?: number;
  showPagination?: boolean;
  isMobile?: boolean;
}

export function ListGrid({
  title,
  description,
  breadcrumbs,
  actions,
  searchPlaceholder = "Cari...",
  onSearch,
  columns,
  rows,
  loading = false,
  empty,
  onOptionsClick,
  optionsMenu = [],
  pageSize = 10,
  showPagination = true,
  backHref = "",
  isMobile: isMobileProp,
}: ListGridProps) {
  const isMobileDevice = useMediaQuery("(max-width: 768px)");
  const isMobile = isMobileProp ?? isMobileDevice;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      filtered = filtered.filter((row) =>
        Object.values(row).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(q)
        )
      );
    }

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey]?.toString().toLowerCase() ?? "";
        const valB = b[sortKey]?.toString().toLowerCase() ?? "";

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;

        return 0;
      });
    }

    return filtered;
  }, [rows, searchQuery, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;

    return filteredRows.slice(startIndex, startIndex + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rows]);

  const renderMobileCard = (item: Row, index: number) => {
    return (
      <div
        key={item.key}
        className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
      >
        {/* Blue top border */}
        <div className="h-1 bg-blue-500" />

        <div className="p-4 space-y-3">
          {columns.map((column, columnIndex) => (
            <div
              key={`${item.key}-${column.key}`}
              className={`flex flex-col ${columnIndex !== columns.length - 1 ? "pb-3 border-b border-gray-100" : ""}`}
            >
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {column.label}
              </div>
              <div className="text-sm text-gray-900 font-medium">
                {typeof item[column.key] === "object" &&
                item[column.key] !== null
                  ? item[column.key]
                  : getKeyValue(item, column.key) || "-"}
              </div>
            </div>
          ))}

          {/* Options menu for mobile cards */}
          {optionsMenu.length > 0 && (
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm">
                    <EllipsisVerticalIcon className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Options menu"
                  onAction={(key) => {
                    const menuItem = optionsMenu.find(
                      (item) => item.key === key
                    );

                    if (menuItem && menuItem.onPress) {
                      menuItem.onPress();
                    }
                  }}
                >
                  {optionsMenu.map((item) => (
                    <DropdownItem
                      key={item.key}
                      color={item.color}
                      variant={item.variant}
                      startContent={item.icon}
                    >
                      {item.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMobileSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: pageSize }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
          <div className="h-1 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            {columns.map((_, columnIndex) => (
              <div
                key={columnIndex}
                className={`${columnIndex !== columns.length - 1 ? "pb-3 border-b border-gray-100" : ""}`}
              >
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderOptionsMenu = () => {
    if (optionsMenu.length === 0) return null;

    return (
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light" size="sm">
            <EllipsisVerticalIcon className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Options menu"
          onAction={(key) => {
            const menuItem = optionsMenu.find((item) => item.key === key);

            if (menuItem && menuItem.onPress) {
              menuItem.onPress();
            }
          }}
        >
          {optionsMenu.map((item) => (
            <DropdownItem
              key={item.key}
              color={item.color}
              variant={item.variant}
              startContent={item.icon}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <PageHeader
        actions={
          <div className="flex items-center gap-2">
            {!isMobile && renderOptionsMenu()}
            {actions}
          </div>
        }
        breadcrumbs={breadcrumbs}
        description={description}
        title={title}
        onOptionsClick={onOptionsClick}
        backHref={backHref}
      />

      <SearchBar
        placeholder={searchPlaceholder}
        onSearch={(val) => {
          setSearchQuery(val);
          onSearch?.(val); // opsional, jika user ingin handle manual
        }}
      />

      {loading ? (
        isMobile ? (
          renderMobileSkeleton()
        ) : (
          <SkeletonTable rows={pageSize} columns={columns.length} />
        )
      ) : filteredRows.length === 0 ? (
        (empty ?? (
          <div className="text-center py-12">
            <EmptyState/>
            {/* <div className="text-gray-400 text-sm">Data kosong.</div> */}
          </div>
        ))
      ) : isMobile ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            {paginatedRows.map((item, index) => renderMobileCard(item, index))}
          </div>

          {showPagination && totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                showControls
                showShadow
                classNames={{
                  wrapper: "gap-1",
                  item: "w-8 h-8 text-small",
                  cursor: "font-bold",
                }}
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={onPageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Table aria-label="Tabel">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  align={column.align ?? "start"}
                  className="cursor-pointer select-none hover:bg-gray-50"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortKey === column.key &&
                    (sortDirection === "asc" ? " ▲" : " ▼")}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={paginatedRows}>
              {(item) => (
                <TableRow key={item.key} className="hover:bg-gray-50">
                  {(columnKey) => (
                    <TableCell>
                      {typeof item[columnKey] === "object" &&
                      item[columnKey] !== null
                        ? item[columnKey]
                        : getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {showPagination && totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                showControls
                showShadow
                classNames={{
                  wrapper: "gap-2",
                  item: "w-8 h-8 text-small",
                  cursor: "font-bold",
                }}
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
