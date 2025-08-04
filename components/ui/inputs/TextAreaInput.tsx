"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@heroui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface TextAreaInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  rows?: number;
}

export const TextAreaInput = ({
  name,
  label,
  placeholder = "",
  isRequired = true,
  disabled = false,
  rows = 4,
}: TextAreaInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      label={label}
      name={name}
      required={isRequired}
      error={error}
    >
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        isInvalid={!!error}
        isRequired={isRequired}
        disabled={disabled}
        rows={rows}
      />
    </FormFieldWrapper>
  );
};
