import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from "firebase/messaging";
import app from "./firebase";
import { registerServiceWorker } from "./serviceWorker";

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

        const registration = await registerServiceWorker();

        if (!registration) {
            throw new Error("Failed to register service worker.");
        }

        await navigator.serviceWorker.ready;

        console.log("SW state:", registration.active?.state);
        console.log("SW scope:", registration.scope);
        console.log("PushManager available:", !!registration.pushManager);

        console.log("Notification:", Notification.permission);
        console.log("Registration:", registration);
        console.log("Messaging:", messaging);
        console.log("VAPID:", vapidKey);

        console.log("Before getToken");
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        console.log("After getToken");
        if (token) {
            console.log("FCM Token:", token);
        } else {
            console.warn("No FCM token was returned.");
        }

        if (import.meta.env.DEV) {
            console.debug("FCM token generated successfully.");
        }

        return token;
    } catch (error) {
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error(error);
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

