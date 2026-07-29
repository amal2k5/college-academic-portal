export const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
        console.warn("Service Workers are not supported in this browser.");
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
                scope: "/",
                updateViaCache: "none",
            }
        );

        if (import.meta.env.DEV) {
            console.debug(
                "Service Worker registered successfully:",
                registration.scope
            );
        }

        return registration;
    } catch (error) {
        console.error("Service Worker registration failed:", error);
        return null;
    }
};