"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface AutocompleteInputProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  // loading?: boolean;
  onChange?: (value: string | number | boolean) => void;
  isLoading?: boolean;
  isClearable?: boolean;
}

export const AutocompleteInput = ({
  name,
  label,
  options,
  placeholder = "Ketik atau pilih...",
  disabled = false,
  required = true,
  // loading = false,
  onChange,
  isLoading = false,
  isClearable = false,
}: AutocompleteInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      label={label}
      name={name}
      required={required}
      error={error}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Autocomplete
            aria-label={label ?? name}
            placeholder={placeholder}
            isDisabled={disabled}
            isInvalid={!!error}
            isLoading={isLoading}
            selectedKey={String(field.value)}
            onSelectionChange={(key) => {
              const selected = key as string;
              let newValue: any = selected;
              if (selected === "true") newValue = true;
              else if (selected === "false") newValue = false;

              field.onChange(newValue);
              onChange?.(newValue);
            }}
            isClearable={isClearable}
          >
            {options.map((opt) => (
              <AutocompleteItem key={String(opt.value)}>
                {opt.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        )}
      />
    </FormFieldWrapper>
  );
};
