"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/form";
import { Input } from "@/shadcn/input";
import { Control } from "react-hook-form";
import { cn } from "@/shadcn/lib/utils";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  as?: React.ElementType;
  type?: string;
  placeholder?: string;
  className?: string; // FormItem 전체 스타일
  inputClassName?: string; // Input 컴포넌트 스타일
}

export function FormInput({
  control,
  name,
  label,
  as: Component = Input,
  type = "text",
  placeholder,
  className,
  inputClassName,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(className)}>
          <FormLabel className="text-sm md:text-base font-medium">{label}</FormLabel>
          <FormControl>
            <Component
              {...field}
              type={type}
              placeholder={placeholder}
              className={cn(inputClassName)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
