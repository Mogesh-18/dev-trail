import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { THEME_STORAGE_KEY, THEMES } from "@/constants/theme";

/**
 * React context for theme state (light/dark/system).
 * 
 * @type {React.Context<{ theme: string, resolvedTheme: string, setTheme: Function } | undefined>}
 */
const ThemeContext = createContext(undefined);

/**
 * Detects the current system color scheme preference.
 * 
 * @returns {'light' | 'dark'} The system's preferred theme.
 */
function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEMES.DARK : THEMES.LIGHT;
}

/**
 * Reads the stored theme preference from localStorage.
 * Returns `THEMES.SYSTEM` if no valid value is found or window is undefined.
 * 
 * @returns {'light' | 'dark' | 'system'} The stored theme preference.
 */
function readStoredTheme() {
    if (typeof window === "undefined") return THEMES.SYSTEM;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === THEMES.LIGHT || stored === THEMES.DARK || stored === THEMES.SYSTEM ? stored : THEMES.SYSTEM;
}

/**
 * Provides theme state (light/dark/system) and applies the resolved theme
 * as a class on `<html>` so Tailwind dark variants and CSS variables respond.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that can consume the theme.
 * @returns {React.ReactNode} The provider's children.
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

    const value = useMemo(() => ({ 
        theme, 
        resolvedTheme, 
        setTheme 
    }), [theme, resolvedTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Custom hook that returns the current theme context.
 * 
 * @returns {{ theme: 'light'|'dark'|'system', resolvedTheme: 'light'|'dark', setTheme: (theme: 'light'|'dark'|'system') => void }}
 * @throws {Error} If used outside of a `ThemeProvider`.
 */
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
