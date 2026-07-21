import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from "firebase/messaging";
import app from "./firebase";

let messagingInstance = null;
let initializationPromise = null;

/**
 * Initialize Firebase Messaging once.
 * Returns the same messaging instance throughout the application.
 */
export const initializeMessaging = async () => {
    if (messagingInstance) {
        return messagingInstance;
    }

    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        try {
            const supported = await isSupported();

            if (!supported) {
                console.warn("Firebase Messaging is not supported in this browser.");
                return null;
            }

            messagingInstance = getMessaging(app);
            return messagingInstance;
        } catch (error) {
            console.error("Failed to initialize Firebase Messaging:", error);
            return null;
        }
    })();

    return initializationPromise;
};

/**
 * Request browser notification permission.
 * This should be called by the UI (e.g. after login),
 * not automatically during token generation.
 */
export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.warn("This browser does not support notifications.");
        return "denied";
    }

    try {
        return await Notification.requestPermission();
    } catch (error) {
        console.error("Notification permission request failed:", error);
        return "denied";
    }
};

/**
 * Generate an FCM device token.
 * Assumes notification permission has already been granted.
 */
export const generateFCMToken = async () => {
    try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

        if (!vapidKey) {
            throw new Error(
                "Missing VITE_FIREBASE_VAPID_KEY environment variable."
            );
        }

        if (Notification.permission !== "granted") {
            console.warn("Notification permission has not been granted.");
            return null;
        }

        const messaging = await initializeMessaging();

        if (!messaging) {
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey,
        });

        if (!token) {
            console.warn("Firebase did not return an FCM token.");
            return null;
        }

        if (import.meta.env.DEV) {
            console.debug("FCM token generated successfully.");
        }

        return token;
    } catch (error) {
        console.error("Failed to generate FCM token:", error);
        return null;
    }
};

/**
 * Listen for foreground notifications.
 * Returns the unsubscribe function from Firebase.
 */
export const onForegroundMessage = async (callback) => {
    const messaging = await initializeMessaging();

    if (!messaging) {
        return () => { };
    }

    return onMessage(messaging, (payload) => {
        if (import.meta.env.DEV) {
            console.debug("Foreground notification received.", payload);
        }

        callback(payload);
    });
};