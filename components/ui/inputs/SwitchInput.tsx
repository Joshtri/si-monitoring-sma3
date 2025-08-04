"use client";

import { Switch, type SwitchThumbIconProps } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { ReactNode } from "react";

interface SwitchInputProps {
  name: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  thumbIcon?: ReactNode | ((props: SwitchThumbIconProps) => ReactNode);
  startContent?: ReactNode;
  endContent?: ReactNode;
  classNames?: {
    base?: string;
    wrapper?: string;
    label?: string;
    thumb?: string;
    thumbIcon?: string;
    hiddenInput?: string;
    startContent?: string;
    endContent?: string;
  };
}

export const SwitchInput = ({
  name,
  label,
  description,
  isRequired = false,
  disabled = false,
  size = "md",
  color = "default",
  thumbIcon,
  startContent,
  endContent,
  classNames,
}: SwitchInputProps) => {
  const {
    control,
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
      <Controller
        control={control}
        name={name}
        defaultValue={false}
        render={({ field }) => (
          <Switch
            isSelected={field.value}
            onValueChange={field.onChange}
            isDisabled={disabled}
            color={color}
            size={size}
            classNames={classNames}
            thumbIcon={thumbIcon}
            startContent={startContent}
            endContent={endContent}
          >
            {description}
          </Switch>
        )}
      />
    </FormFieldWrapper>
  );
};
