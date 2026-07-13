/* eslint-disable no-undef */

importScripts(
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw] Background message:", payload);

    const notification = payload.notification || {};

    self.registration.showNotification(notification.title || "Notification", {
        body: notification.body || "",
        icon: "/logo192.png",
        badge: "/logo192.png",
        data: payload.data,
    });
});