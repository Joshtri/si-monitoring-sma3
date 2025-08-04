"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@heroui/react";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface FileInputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  accept?: string;
  helperText?: string;
  disabled?: boolean;
}

export const FileInput = ({
  name,
  label,
  isRequired = true,
  accept,
  helperText,
  disabled = false,
}: FileInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={isRequired}
      error={error}
      helperText={helperText}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            type="file"
            accept={accept}
            isInvalid={!!error}
            isRequired={isRequired}
            isDisabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              field.onChange(file);
            }}
          />
        )}
      />
    </FormFieldWrapper>
  );
};
