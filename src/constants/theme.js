
/**
 * The localStorage key used to persist the user's theme preference.
 * 
 * @type {string}
 */
export const THEME_STORAGE_KEY = "devtrail-theme";

/**
 * Supported theme values.
 * 
 * @type {{ LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' }}
 */
export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
};

/**
 * Array of all valid theme values.
 * 
 * @type {Array<'light'|'dark'|'system'>}
 */
export const THEME_OPTIONS = [
    THEMES.LIGHT, 
    THEMES.DARK, 
    THEMES.SYSTEM
];
