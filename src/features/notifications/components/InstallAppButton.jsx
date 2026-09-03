import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Detects whether the current device is an iPhone, iPad, or iPod.
 * 
 * @returns {boolean} `true` if the user agent indicates an iOS device.
 */
const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

/**
 * Detects whether the app is running in standalone mode (PWA installed).
 * 
 * @returns {boolean} `true` if the display mode is standalone or if running in iOS standalone mode.
 */
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

/**
 * Button that triggers the browser's PWA install prompt (or shows an iOS tip).
 * 
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element|null} Null if app is already installed or dismissed.
 */
export function InstallAppButton({ className }) {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [showIosTip, setShowIosTip] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (isStandalone()) return undefined;

        function handleBeforeInstallPrompt(e) {
            e.preventDefault();
            setInstallPrompt(e);
        }
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, []);

    if (dismissed || isStandalone()) return null;
    if (!installPrompt && !isIos()) return null;

    async function handleClick() {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === "accepted") setDismissed(true);
            setInstallPrompt(null);
            return;
        }
        setShowIosTip(true);
    }

    return (
        <div className={className}>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleClick}>
                <Download className="h-4 w-4" />
                Install app
            </Button>
            {showIosTip && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                    Tap the Share icon, then "Add to Home Screen."
                </p>
            )}
        </div>
    );
}