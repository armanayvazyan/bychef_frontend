importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging.js");
import { messaging } from "@/firebase/firebaseConfig";

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);

    // Customize the notification
    const notificationTitle = payload.notification?.title || "Default Title";
    const notificationOptions = {
        body: payload.notification?.body || "Default body text",
        icon: payload.notification?.icon || "/default-icon.png", // Adjust this path as needed
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

messaging.onMessage((payload) => {
    const { title, body, icon } = payload.notification;
    new Notification(title, { body, icon });
})