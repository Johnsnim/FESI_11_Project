"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/form";
import { Input } from "@/shadcn/input";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/shadcn/lib/utils";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  as?: React.ElementType;
  type?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

const defaultInputClass =
  "h-10 border-none bg-[#f9faf8] focus-visible:ring-green-300 focus-visible:outline-none md:h-12";

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  as: Component = Input,
  type = "text",
  placeholder,
  className,
  inputClassName,
  disabled = false,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel className="text-sm font-medium md:text-base">
            {label}
          </FormLabel>
          <FormControl>
            <Component
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                defaultInputClass,
                inputClassName,
                disabled && "pointer-events-none select-none",
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
