import Image from "next/image";
import UserEditModal from "./user-edit-modal";

interface User {
  id: number;
  email: string;
  name: string;
  companyName: string;
  image?: string;
}
export default function Info({ user }: { user: User }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between md:mb-6 lg:mb-11">
        <h1 className="ml-2 text-center text-base font-semibold md:ml-0 md:text-3xl lg:ml-2.5 lg:text-[32px]">
          마이페이지
        </h1>
        <button className="relative block size-7 md:hidden">
          <Image alt="프로필수정버튼" src="/image/ic_edit_lg.svg" fill />
        </button>
      </div>

      <div className="flex h-25 w-full items-center rounded-2xl border border-green-300 bg-gradient-to-r from-[#E5FCF0] to-[#D9F6F4] px-4 py-6 md:h-31 md:px-6 lg:h-fit lg:flex-col lg:rounded-3xl lg:pt-5 lg:pb-10">
        <button className="relative mb-2.5 ml-auto hidden size-10 lg:block">
          <Image
            alt="프로필수정버튼"
            src="/image/ic_edit_lg.svg"
            fill
            className="object-cover"
          />
        </button>
        <div className="flex flex-row items-center gap-2 py-2 lg:flex-col lg:gap-[19px] lg:px-15">
          <div className="relative size-10 md:size-12.5 lg:size-28.5">
            <Image
              src={user.image || "/image/profile.svg"}
              alt="프로필이미지"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <p className="text-sm font-semibold md:text-lg">{user.name}</p>
        </div>

        <div className="ml-4 flex gap-2 border-l-[1.5px] pl-4 text-sm font-medium text-[#a4a4a4] md:ml-7 md:pl-7.5 md:text-base lg:mt-7 lg:ml-0 lg:border-t-[1.5px] lg:border-l-0 lg:px-2 lg:pt-7.5 lg:pl-0">
          <p className="flex flex-col gap-2 text-[#a4a4a4]">
            회사<span>이메일</span>
          </p>
          <p className="flex flex-col gap-2 text-[#333333]">
            {user.companyName}
            <span>{user.email}</span>
          </p>
        </div>
        <button className="relative ml-auto hidden size-10 self-start md:block lg:hidden">
          <Image
            alt="프로필수정버튼"
            src="/image/ic_edit_lg.svg"
            fill
            className="object-cover"
          />
        </button>
      </div>
      <UserEditModal />
    </div>
  );
}
