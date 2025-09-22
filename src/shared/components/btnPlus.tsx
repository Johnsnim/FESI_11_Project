import { Button } from "@/shadcn/button";

export function ButtonPlus(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="font-pretendard h-[60px] w-[474px] gap-[10px] rounded-[20px] bg-green-500 px-[30px] py-[16px] text-center text-[20px] leading-[28px] font-bold text-white shadow-md transition-colors duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:bg-gray-50"
    >
      {props.children}
    </Button>
  );
}
