import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBpIi9PjtxAUEN8mhDwPFAdrgwjBhzUt8I",
  authDomain: "bychef-5b6eb.firebaseapp.com",
  projectId: "bychef-5b6eb",
  storageBucket: "bychef-5b6eb.firebasestorage.app",
  messagingSenderId: "992212752325",
  appId: "1:992212752325:web:c1cec59eafe34977225dac",
  measurementId: "G-8HMR8PHY8W"
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);