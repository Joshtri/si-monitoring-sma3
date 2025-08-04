"use client";

import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface FilterOption {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface SearchBarProps {
  value?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onFilterChange?: (key: string) => void;
  filters?: FilterOption[];
  selectedFilter?: string;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  debounceMs?: number;
}

export default function SearchBar({
  value,
  onSearch,
  onChange,
  onClear,
  onFilterChange,
  filters = [],
  selectedFilter,
  placeholder = "Cari...",
  isLoading = false,
  className = "",
  debounceMs = 300,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const searchValue = value ?? internalValue;

  const handleChange = (val: string) => {
    if (value === undefined) setInternalValue(val);
    onChange?.(val);
  };

  const handleSearch = () => onSearch?.(searchValue);
  const handleClear = () => {
    if (value === undefined) setInternalValue("");
    onClear?.();
    onChange?.("");
  };

  // Debounced automatic search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearch]);

  return (
    <div className={`flex items-center gap-2 w-full ${className}`}>
      {filters.length > 0 && (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered">
              <FunnelIcon className="w-5 h-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filter"
            selectedKeys={selectedFilter ? [selectedFilter] : []}
            selectionMode="single"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              onFilterChange?.(selected);
            }}
          >
            {filters.map((f) => (
              <DropdownItem key={f.key} startContent={f.icon}>
                {f.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}

      <Input
        className="w-full"
        endContent={
          <>
            {searchValue && (
              <Button
                isIconOnly
                radius="full"
                size="sm"
                variant="light"
                onClick={handleClear}
              >
                <XMarkIcon className="w-4 h-4" />
              </Button>
            )}
          </>
        }
        placeholder={placeholder}
        startContent={
          <MagnifyingGlassIcon className="w-5 h-5 text-default-400" />
        }
        value={searchValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
          if (e.key === "Escape") handleClear();
        }}
        onValueChange={handleChange}
      />

      <Button
        color="primary"
        isLoading={isLoading}
        size="md"
        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
        onClick={handleSearch}
      >
        Cari
      </Button>
    </div>
  );
}
