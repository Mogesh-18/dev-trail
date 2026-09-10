import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/features/notifications/hooks/usePushNotifications";

/**
 * Push notification toggle — bell icon swaps with a spring pop instead
 * of an instant swap, mirroring ThemeToggle's sun/moon transition.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {JSX.Element|null}
 */
export function NotificationToggle({ className }) {
    const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

    if (!isSupported) return null;

    return (
        <Button
            variant="ghost"
            size="sm"
            className={className}
            onClick={() => (isSubscribed ? unsubscribe() : subscribe())}
            disabled={isLoading}
        >
            <span className="relative flex h-4 w-4 items-center justify-center">
                <Bell className={`absolute h-4 w-4 transition-all duration-base ease-spring ${isSubscribed ? "scale-100 opacity-100" : "scale-50 opacity-0"}`} />
                <BellOff className={`absolute h-4 w-4 transition-all duration-base ease-spring ${isSubscribed ? "scale-50 opacity-0" : "scale-100 opacity-100"}`} />
            </span>
            {isSubscribed ? "Notifications on" : "Enable notifications"}
        </Button>
    );
}