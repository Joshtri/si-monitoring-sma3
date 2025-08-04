"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useMemo } from "react";

interface YearSelectProps {
  name: string;
  label?: string;
  startYear?: number; // default: current year - 2
  endYear?: number;   // default: current year + 4
  placeholder?: string;
}

export function YearSelect({
  name,
  label = "Tahun Ajaran",
  startYear,
  endYear,
  placeholder = "Pilih tahun ajaran",
}: YearSelectProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const options = useMemo(() => {
    const now = new Date().getFullYear();
    const start = startYear ?? now - 2;
    const end = endYear ?? now + 4;

    const tahunList: { id: string; label: string }[] = [];
    for (let year = end; year >= start; year--) {
      const label = `${year}/${year + 1}`;
      tahunList.push({ id: label, label });
    }
    return tahunList;
  }, [startYear, endYear]);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            selectedKey={field.value}
            onSelectionChange={(val) => field.onChange(val)}
            defaultItems={options}
            placeholder={placeholder}
            variant="flat"
            isInvalid={!!error}
            errorMessage={error}
          >
            {(item) => (
              <AutocompleteItem key={item.id} textValue={item.id}>
                {item.label}
              </AutocompleteItem>
            )}
          </Autocomplete>
        )}
      />
    </div>
  );
}
