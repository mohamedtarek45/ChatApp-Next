"use client";

import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isMessagePage = pathname.startsWith("/message/");
  return (
    <div
      className={`grid
        ${
          isMessagePage
            ? "grid-cols-[0_1fr] sm:grid-cols-[300px_1fr]"
            : "grid-cols-[1fr_0] sm:grid-cols-[300px_1fr]"
        }
      `}
    >
      {children}
    </div>
  );
}
