/* eslint-disable no-undef */

importScripts(
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyDFXG9rqe7EtxWfTODYHmW452nbV-8S-DM",
    authDomain: "college-academic-portal-c39f8.firebaseapp.com",
    projectId: "college-academic-portal-c39f8",
    storageBucket: "college-academic-portal-c39f8.firebasestorage.app",
    messagingSenderId: "493150370387",
    appId: "1:493150370387:web:ed7ad364269644f1af64a6",
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