import Image from "next/image";

export default function AuthBanner() {
  return (
    <>
      <Image
        src="/image/img_login_sm.svg"
        alt="로그인이미지(작은 화면)"
        width={272}
        height={212}
        unoptimized
        className="block w-[272px] md:hidden h-auto"
      />
      <Image
        src="/image/img_login_lg.svg"
        alt="로그인이미지(큰 화면)"
        width={451}
        height={321}
        unoptimized
        className="hidden w-[451px] md:block lg:w-[533px] h-auto"
      />
    </>
  );
}
