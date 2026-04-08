import { Button } from "@heroui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
    </Button>
  );
}