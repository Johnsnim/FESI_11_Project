import Image from "next/image";

export function ReviewsHeader() {
    return <div className="flex gap-3 items-center mt-8 mb-[35px] px-4 md:px-6 md:mt-14 md:mb-14 lg:px-0 lg:mt-[67px] lg:mb-17">
  <div className="w-[70px] h-[57px] md:w-[97px] md:h-[91px] relative">
        <Image
          src="/image/img_head_note_lg.svg"
          alt="reviewnote"
          fill
          className="object-contain"
        />
      </div>        
        <div className="space-y-0.5 md:space-y-4 text-base md:text-xl font-medium text-[#a4a4a4]"><h1 className="text-lg font-semibold text-black md:text-[32px]">모든 리뷰</h1>같이달램을 이용자들은 이렇게 느꼈어요 🫶</div>
    </div>;
}