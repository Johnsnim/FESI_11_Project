import { Badge } from "@/shadcn/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shadcn/lib/utils";

const TagVariants = cva(
  "pr-2 pl-1 gap-2.5 rounded-md text-sm text-center text-blue-600 leading-sm font-semibold bg-[#18DCFF]/20",
  {
    variants: {
      variant: {
        md: "h-6 w-30",
        sm: "h-5 w-27 text-xs leading-xs"
      },
    },
    defaultVariants: {
      variant: "md",
    },
  }
);

interface TagProps
  extends Omit<React.ComponentProps<typeof Badge>, 'variant'>,
    VariantProps<typeof TagVariants> {}

export function Tag({ variant, className, ...props }: TagProps) {
  return (
    <Badge
      {...props}
      className={cn(TagVariants({ variant }), className)}
    >
      {props.children}
    </Badge>
  );
}
