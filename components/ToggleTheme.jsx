"use client";
import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
const ToggleTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div
      className="size-12 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-slate-400 "
      onClick={() => setTheme((prev) => prev === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <MoonStar color="white" size={24}  />
      ) : (
        <Sun color="white" size={24} />
      )}
    </div>
  );
};

export default ToggleTheme;
