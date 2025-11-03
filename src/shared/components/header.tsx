"use client";

import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useCallback } from "react";

const DropdownMenu = dynamic(
  () => import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenu),
  { ssr: false },
);
const DropdownMenuContent = dynamic(
  () => import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenuContent),
  { ssr: false },
);
const DropdownMenuItem = dynamic(
  () => import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenuItem),
  { ssr: false },
);
const DropdownMenuLabel = dynamic(
  () => import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenuLabel),
  { ssr: false },
);
const DropdownMenuSeparator = dynamic(
  () =>
    import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenuSeparator),
  { ssr: false },
);
const DropdownMenuTrigger = dynamic(
  () => import("@/shadcn/dropdown-menu").then((mod) => mod.DropdownMenuTrigger),
  { ssr: false },
);

const NavLink = memo(function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={isActive ? "text-green-500" : "hover:text-green-500"}
    >
      {children}
    </Link>
  );
});

const ProfileDropdown = memo(function ProfileDropdown({
  user,
}: {
  user: { name?: string | null; image?: string | null };
}) {
  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8.5 w-8.5 cursor-pointer overflow-hidden rounded-full border border-[#dddddd] md:h-13.5 md:w-13.5">
          <Image
            src={user?.image ?? "/image/profile.svg"}
            alt="프로필"
            fill
            sizes="54px"
            className="object-cover"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 rounded-xl p-2">
        <DropdownMenuLabel className="text-sm text-gray-500">
          <span className="text-base font-semibold text-green-600">
            {user?.name}
          </span>{" "}
          님 <br /> 반갑습니다!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer text-gray-500">
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
  );
});

export const Header = memo(function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isRootPath = pathname === "/";
  const isDibsPath = pathname.startsWith("/dibs");
  const isReviewsPath = pathname.startsWith("/reviews");
  const isLoginPath = pathname.startsWith("/login");

  const isAuthenticated = status === "authenticated";

  return (
    <header className="mx-auto flex h-12.5 w-full max-w-[1280px] items-center justify-between px-4 md:h-22">
      {/* 왼쪽 로고 + 메뉴 */}
      <div className="ml-4 flex items-center md:ml-2">
        <Link
          href="/"
          className="relative h-[30px] w-[71px] p-2 text-5xl font-extrabold text-green-500 md:h-12 md:w-32"
          aria-label="홈으로 이동"
        >
          <Image
            src="/image/logo.svg"
            alt="같이달램 로고"
            fill
            sizes="(max-width: 768px) 71px, 128px"
            priority
          />
        </Link>

        <nav className="ml-5 flex gap-4 pt-1 text-xs font-semibold text-[#737373] md:ml-10 md:text-base">
          <NavLink href="/" isActive={isRootPath}>
            모임 찾기
          </NavLink>
          <NavLink href="/dibs" isActive={isDibsPath}>
            찜한 모임
          </NavLink>
          <NavLink href="/reviews" isActive={isReviewsPath}>
            모든 리뷰
          </NavLink>
        </nav>
      </div>

      <div className="mr-4 flex items-center md:mr-6 lg:mr-2">
        {isAuthenticated ? (
          <ProfileDropdown user={session?.user ?? {}} />
        ) : (
          !isLoginPath && (
            <Link
              href="/login"
              className="rounded-xl bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600"
            >
              로그인
            </Link>
          )
        )}
      </div>
    </header>
  );
});
