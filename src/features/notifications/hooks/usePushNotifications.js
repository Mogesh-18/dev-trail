import { useState, useEffect, useCallback } from "react";
import { PushService } from "@/features/notifications/services/push.service";

/**
 * Hook that manages push notification subscription state and actions.
 * 
 * @returns {{
 *   isSupported: boolean,
 *   isSubscribed: boolean,
 *   isLoading: boolean,
 *   subscribe: () => Promise<void>,
 *   unsubscribe: () => Promise<void>
 * }}
 */
export function usePushNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSupported] = useState(PushService.isSupported());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isSupported) return;
        PushService.getCurrentSubscription().then((sub) => setIsSubscribed(!!sub));
    }, [isSupported]);

    const subscribe = useCallback(async () => {
        setIsLoading(true);
        try {
            await PushService.subscribe();
            setIsSubscribed(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        setIsLoading(true);
        try {
            await PushService.unsubscribe();
            setIsSubscribed(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { 
        isSupported, 
        isSubscribed, 
        isLoading, 
        subscribe, 
        unsubscribe 
    };
}