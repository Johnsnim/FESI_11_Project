import { Badge } from "@/shadcn/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shadcn/lib/utils";
import Image from "next/image";

const TagVariants = cva(
  "pr-2 pl-1 gap-1 rounded-md text-sm text-center text-blue-600 leading-sm font-semibold bg-[#18DCFF]/20",
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
    VariantProps<typeof TagVariants> {
  icon?: string; // SVG 아이콘 경로
}

export function Tag({ variant, className, children, icon, ...props }: TagProps) {
  const iconSize = variant === "sm" ? 16 : 20;

  return (
    <Badge
      {...props}
      className={cn(TagVariants({ variant }), className)}
    >
      {icon && (
        <Image
          src={icon}
          alt="아이콘"
          width={iconSize}
          height={iconSize}
          className="[filter:brightness(0)_saturate(100%)_invert(37%)_sepia(84%)_saturate(2498%)_hue-rotate(213deg)_brightness(95%)_contrast(87%)]"
        />
      )}
      {children}
    </Badge>
  );
}
