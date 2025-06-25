"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition duration-200 w-full h-full flex justify-center items-center rounded-lg cursor-pointer hover:bg-slate-400 ${
        isActive
          ? "bg-indigo-400 text-white font-semibold"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </Link>
  );
}
