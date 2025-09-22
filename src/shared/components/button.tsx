import { Button } from "@/shadcn/button";

export function AppButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="font-pretendard rounded-5 text-5 h-15 w-118.5 gap-2.5 bg-green-500 px-7.5 py-4 text-center leading-7 font-bold text-white shadow-md transition-colors duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:bg-gray-50"
    >
      {props.children}
    </Button>
  );
}
