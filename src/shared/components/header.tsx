"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="mx-auto flex h-22 w-full max-w-[1280px] items-center justify-between px-4">
      <Link
        href="/"
        className="font-tenada p-2 text-5xl font-extrabold text-green-500"
      >
        같이달램
      </Link>

      <div className="flex items-center gap-4">
        {status === "authenticated" ? (
          <>
            {session?.user?.name}

            <button
              onClick={handleLogout}
              className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
