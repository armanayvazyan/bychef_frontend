importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js");

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

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    const { title, body, icon } = payload.notification || {};
    self.registration.showNotification(title, { body, icon });
});
