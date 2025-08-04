import { Input } from "@heroui/react";
import { useFormContext } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface TextInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "text" | "password" | "email" | "number"; // tambah di sini
}

export const TextInput = ({
  name,
  label,
  placeholder,
  disabled = false,
  required = true,
  type = "text", // default tetap text
}: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <FormFieldWrapper
      label={label}
      name={name}
      required={required}
      error={error}
    >
      <Input
        {...register(name)}
        id={name}
        type={type}
        placeholder={placeholder}
        isDisabled={disabled}
        isRequired={required}
        isInvalid={!!error}
        errorMessage={error}
      />
    </FormFieldWrapper>
  );
};
