import Link from "next/link";

export function Header() {
  return (
    <header className="mx-auto flex h-22 w-full max-w-[1280px] items-center">
      <Link
        href="/"
        className="font-tenada p-2 text-5xl font-extrabold text-green-500"
      >
        같이달램
      </Link>
    </header>
  );
}
