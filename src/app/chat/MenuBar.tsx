import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { dark } from "@clerk/themes";

type MenuBarProps = {
  onUserMenuClick: () => void;
};

export default function MenuBar({ onUserMenuClick }: MenuBarProps) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-row items-center justify-between gap-3 border-e border-e-[#DBDDE1] bg-white p-3 dark:border-e-gray-800 dark:bg-[#17191C]">
      <UserButton
        afterSignOutUrl="/"
        appearance={{ baseTheme: theme === "dark" ? dark : undefined }}
      />
      <div className="flex gap-6">
        <span title="Show users">
          <Users className="cursor-pointer" onClick={onUserMenuClick} />
        </span>
        <ThemeToggleButton />
      </div>
    </div>
  );
}
