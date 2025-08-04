"use client";

import { RadioGroup, Radio } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface Option {
  label: string;
  value: string | number | boolean;
  description?: string;
}

interface RadioInputProps {
  name: string;
  label?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  defaultValue?: string | number | boolean;
}

export const RadioInput = ({
  name,
  label,
  options,
  required = true,
  disabled = false,
  color = "default",
  defaultValue,
}: RadioInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      name={name}
      label={label}
      required={required}
      error={error}
    >
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => (
          <RadioGroup
            value={String(field.value)}
            onValueChange={field.onChange}
            isDisabled={disabled}
            color={color}
            isInvalid={!!error}
            errorMessage={error}
          >
            {options.map((opt) => (
              <Radio
                key={String(opt.value)}
                value={String(opt.value)}
                description={opt.description}
              >
                {opt.label}
              </Radio>
            ))}
          </RadioGroup>
        )}
      />
    </FormFieldWrapper>
  );
};
