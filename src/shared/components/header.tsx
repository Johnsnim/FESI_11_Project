"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/dropdown-menu";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="mx-auto flex h-12.5 w-full max-w-[1280px] items-center justify-between px-4 md:h-22">
      {/* 왼쪽 로고 + 메뉴 */}
      <div className="ml-4 flex items-center md:ml-2">
        <Link
          href="/"
          className="font-tenada relative h-[30px] w-[71px] p-2 text-5xl font-extrabold text-green-500 md:h-12 md:w-32"
        >
          <Image src={"/image/logo.svg"} alt="로고" fill />
        </Link>

        <div className="ml-5 flex gap-4 pt-1 text-xs font-semibold text-[#737373] md:ml-10 md:text-base">
          <Link
            href="/"
            className={
              pathname === "/" ? "text-green-500" : "hover:text-green-500"
            }
          >
            모임 찾기
          </Link>
          <Link
            href="/dibs"
            className={
              pathname.startsWith("/dibs")
                ? "text-green-500"
                : "hover:text-green-500"
            }
          >
            찜한 모임
          </Link>

          <Link
            href="/reviews"
            className={
              pathname.startsWith("/reviews")
                ? "text-green-500"
                : "hover:text-green-500"
            }
          >
            모든 리뷰
          </Link>
        </div>
      </div>

      <div className="mr-4 flex items-center md:mr-6 lg:mr-2">
        {status === "authenticated" ? (
          <>
            {/* 프로필 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-8.5 w-8.5 cursor-pointer overflow-hidden rounded-full border border-[#dddddd] md:h-13.5 md:w-13.5">
                  <Image
                    src={session?.user?.image ?? "/image/profile.svg"}
                    alt="프로필"
                    fill
                    className="object-cover"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40 rounded-xl p-2">
                <DropdownMenuLabel className="text-sm text-gray-500">
                  <span className="text-base font-semibold text-green-600">
                    {session?.user?.name}
                  </span>{" "}
                  님 <br /> 반갑습니다!
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer text-gray-500"
                >
                  <Link href="/mypage">마이페이지</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-gray-500"
                  onClick={handleLogout}
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link
            href="/login"
            className={`rounded-xl bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 ${
              pathname.startsWith("/login") ? "hidden" : ""
            }`}
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
