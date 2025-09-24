export default function AuthBanner() {
  return (
    <>
      <img
        src="/image/img_login_sm.svg"
        alt="로그인이미지(작은 화면)"
        className="block w-[272px] md:hidden"
      />
      <img
        src="/image/img_login_lg.svg"
        alt="로그인이미지(큰 화면)"
        className="hidden w-[451px] md:block lg:w-[533px]"
      />
    </>
  );
}
