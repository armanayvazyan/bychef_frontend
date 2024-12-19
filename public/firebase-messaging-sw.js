importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


const firebaseConfig = {
    apiKey: "AIzaSyBpIi9PjtxAUEN8mhDwPFAdrgwjBhzUt8I",
    authDomain: "bychef-5b6eb.firebaseapp.com",
    projectId: "bychef-5b6eb",
    storageBucket: "bychef-5b6eb.firebasestorage.app",
    messagingSenderId: "992212752325",
    appId: "1:992212752325:web:c1cec59eafe34977225dac",
    measurementId: "G-8HMR8PHY8W"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
    console.log("On notification click: ", event.notification.tag);
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url === "/" && "focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow("/");
            }),
    );
});

