import { NumberInput as HeroNumberInput } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

export const NumberInput = ({
  name,
  label,
  min,
  max,
  disabled = false,
  required = true,
}: {
  name: string;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  required?: boolean;
}) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormFieldWrapper label={label} name={name} required={required} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <HeroNumberInput
            value={field.value}
            onValueChange={field.onChange}
            isDisabled={disabled}
            isRequired={required}
            minValue={min}
            maxValue={max}
            isInvalid={!!error}
            errorMessage={error}
          />
        )}
      />
    </FormFieldWrapper>
  );
};
