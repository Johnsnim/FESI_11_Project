//우측 하단 모임 만들기 버튼
import { Button } from "@/shadcn/button";
import Image from "next/image";

export function ButtonPlus(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className="font-white sm:rounded-6 fixed right-5 bottom-5 h-12 w-12 cursor-pointer rounded-full bg-green-500 p-0 text-center text-xl leading-7 font-bold tracking-[-0.03em] md:h-16 md:w-48.5"
    >
      <Image src="/image/ic_plus.svg" alt="plus" width={32} height={32} />
      <span className="hidden md:inline">모임 만들기</span>
    </Button>
  );
}
