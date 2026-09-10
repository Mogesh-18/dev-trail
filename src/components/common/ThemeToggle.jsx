import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/providers/ThemeProvider";

/**
 * Light/dark toggle. Icon swap now crossfades with a rotate instead of
 * an instant swap — a small detail, but it's tapped constantly so it's
 * worth making feel deliberate.
 *
 * @returns {JSX.Element}
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative overflow-hidden"
        >
            <Sun
                className={`absolute h-4 w-4 transition-all duration-base ease-spring ${isDark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                    }`}
            />
            <Moon
                className={`absolute h-4 w-4 transition-all duration-base ease-spring ${isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                    }`}
            />
        </Button>
    );
}