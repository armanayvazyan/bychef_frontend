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

self.addEventListener('notificationclick', (event) => {
    console.log('On notification click: ', event);
    event.notification.close(); // CLosing the notification when clicked
    const urlToOpen = event?.notification?.fcmOptions?.link || 'https://bychef.am';
    event.waitUntil(
        clients.matchAll({
            type: 'window',
        })
            .then((windowClients) => {
                // Check if there is already a window/tab open with the target URL
                for (const client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, open a new window/tab with the target URL
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
