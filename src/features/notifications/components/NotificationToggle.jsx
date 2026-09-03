import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/features/notifications/hooks/usePushNotifications";

/**
 * Toggle button for enabling/disabling push notifications.
 * Uses `usePushNotifications` to manage state.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element|null} Null if push is not supported.
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
            {isSubscribed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            {isSubscribed ? "Notifications on" : "Enable notifications"}
        </Button>
    );
}