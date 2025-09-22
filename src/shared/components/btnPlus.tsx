import { Button } from "@/shadcn/button";

export function ButtonPlus(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="font-white sm:rounded-6 h-12 w-12 cursor-pointer rounded-full bg-green-500 p-0 text-center text-xl leading-7 font-bold tracking-[-0.03em] sm:h-16 sm:w-48.5"
    >
      <img src="/ic_plus.svg" alt="plus" className="h-8 w-8" />
      <span className="hidden sm:inline">모임 만들기</span>
    </Button>
  );
}
