import { useEffect } from "react";

/**
 * Hook that listens for a keyboard shortcut (e.g., `cmd+n`).
 * Ignores keystrokes inside form fields.
 * 
 * @param {Object} shortcut - Shortcut definition.
 * @param {string} shortcut.key - The key to listen for.
 * @param {boolean} [shortcut.meta] - Requires meta/ctrl key.
 * @param {boolean} [shortcut.ctrl] - Requires ctrl key (if meta is not used).
 * @param {() => void} handler - Callback when the shortcut is triggered.
 * @param {boolean} [enabled=true] - Whether the shortcut is active.
 */
export function useKeyboardShortcut(shortcut, handler, enabled = true) {
    useEffect(() => {
        if (!enabled) return undefined;

        function onKeyDown(e) {
            const target = e.target;
            const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
            const isInsideModal = !!target.closest('[role="dialog"], [role="alertdialog"]');
            if (isTyping || isInsideModal) return;

            const metaOk = shortcut.meta ? e.metaKey || e.ctrlKey : true;
            const ctrlOk = shortcut.ctrl ? e.ctrlKey : true;
            if (e.key.toLowerCase() === shortcut.key.toLowerCase() && metaOk && ctrlOk) {
                e.preventDefault();
                handler();
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [shortcut.key, shortcut.meta, shortcut.ctrl, handler, enabled]);
}