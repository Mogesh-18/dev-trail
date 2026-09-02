import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY, THEMES } from "@/constants/theme";

const ThemeContext = createContext(undefined);

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
}

function readStoredTheme() {
    if (typeof window === "undefined") return THEMES.SYSTEM;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === THEMES.LIGHT || stored === THEMES.DARK || stored === THEMES.SYSTEM
        ? stored
        : THEMES.SYSTEM;
}

/**
 * Provides `theme` (the user's stored preference: light | dark | system) and
 * `resolvedTheme` (the actual light|dark currently applied), plus `setTheme`.
 * Applies the resolved theme as a class on <html> so every Tailwind
 * `dark:` variant and every shadcn CSS variable in index.css responds.
 */
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(readStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState(() =>
        theme === THEMES.SYSTEM ? getSystemTheme() : theme
    );

    useEffect(() => {
        const next = theme === THEMES.SYSTEM ? getSystemTheme() : theme;
        setResolvedTheme(next);

        const root = document.documentElement;
        root.classList.remove(THEMES.LIGHT, THEMES.DARK);
        root.classList.add(next);
        root.style.colorScheme = next;
    }, [theme]);

    // Follow OS changes live only while the user is on "system".
    useEffect(() => {
        if (theme !== THEMES.SYSTEM) return undefined;
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const next = getSystemTheme();
            setResolvedTheme(next);
            const root = document.documentElement;
            root.classList.remove(THEMES.LIGHT, THEMES.DARK);
            root.classList.add(next);
            root.style.colorScheme = next;
        };
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, [theme]);

    const setTheme = (next) => {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
        setThemeState(next);
    };

    const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
