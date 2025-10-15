import { Badge } from "@/shadcn/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shadcn/lib/utils";
import Image from "next/image";

const ChipVariants = cva(
  "h-10 px-4 py-2 gap-2.5 rounded-xl text-base text-center text-white leading-base font-medium inline-flex items-center",
  {
    variants: {
      variant: {
        dark: "bg-[#333333] font-semibold",
        light: "text-[#333333] bg-gray-50 ",
        infomd:
          "px-2 py-0.5 h-6 w-fit rounded-md text-gray-600 text-sm leading-sm bg-[#FFFFFF] border-[#DDDDDD]",
        infosm:
          "px-2 py-0.5 h-5 w-11.5 rounded-sm text-gray-600 text-xs leading-xs bg-[#FFFFFF] border-[#DDDDDD]",
        stateexp:
          "py-1.5 h-8 w-19 rounded-2xl text-green-600 text-sm font-semibold leading-sm bg-[#DFFAEB]",
        statewait:
          "py-1.5 h-8 w-18 rounded-2xl text-[#6B7280] text-sm leading-sm bg-[#FFFFFF] border-[#6B7280] border-1px",
        stateused:
          "py-1.5 h-8 w-19 rounded-2xl text-gray-600 text-sm leading-sm bg-gray-50",
        statedone:
          "gap-0.5 bg-transparent pl-2 pr-3 py-1.5 h-8 w-26 text-green-600 text-sm leading-sm p-0 w-fit",
      },
    },
    defaultVariants: {
      variant: "dark",
    },
  },
);

interface ChipProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant">,
    VariantProps<typeof ChipVariants> {
  icon?: string; // SVG 아이콘 경로
}

export function Chip({ variant, className, icon, ...props }: ChipProps) {
  const iconSize = variant === "statedone" ? 24 : 20;
  return (
    <Badge {...props} className={cn(ChipVariants({ variant }), className)}>
      {icon && (
        <Image src={icon} alt="아이콘" width={iconSize} height={iconSize} />
      )}
      {props.children}
    </Badge>
  );
}
