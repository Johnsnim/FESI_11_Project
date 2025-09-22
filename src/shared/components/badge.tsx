import { Badge } from "@/shadcn/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shadcn/lib/utils";

const AlertBadgeVariants = cva(
  "pt-1 rounded-2xl text-center font-semibold text-white bg-green-500",
  {
    variants: {
      variant: {
        md: "gap-2.5 px-2 h-4 w-5 text-xs leading-xs",
        sm: "gap-1 h-3 w-3 text-2xs leading-11px"
      },
    },
    defaultVariants: {
      variant: "md",
    },
  }
);

interface AlertBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, 'variant'>,
    VariantProps<typeof AlertBadgeVariants> {}

export function AlertBadge({ variant, className, ...props }: AlertBadgeProps) {
  return (
    <Badge
      {...props}
      className={cn(AlertBadgeVariants({ variant }), className)}
    >
      {props.children}
    </Badge>
  );
}
