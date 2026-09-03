import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/app/providers/ThemeProvider";
import { THEMES } from "@/constants/theme";
import { cn } from "@/lib/utils";

/**
 * Theme options for the dropdown: light, dark, and system.
 * Each option includes a display label and a corresponding icon component.
 * 
 * @type {Array<{ value: 'light'|'dark'|'system', label: string, Icon: React.ComponentType }>}
 */
const OPTIONS = [
    { value: THEMES.LIGHT, label: "Light", Icon: Sun },
    { value: THEMES.DARK, label: "Dark", Icon: Moon },
    { value: THEMES.SYSTEM, label: "System", Icon: Monitor },
];

/**
 * An icon‑button dropdown that switches between light, dark, and system themes.
 * Uses `useTheme` from `ThemeProvider` and must be rendered inside it.
 * 
 * @returns {JSX.Element}
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle theme" className="relative">
                    <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {OPTIONS.map(({ value, label, Icon }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className={cn("gap-2", theme === value && "font-medium text-primary")}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
