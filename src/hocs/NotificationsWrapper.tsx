import { PropsWithChildren, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";
import { FIREBASE_VAPID_KEY } from "@/configs/constants";

const NotificationsWrapper = ({ children }: PropsWithChildren) => {

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Received foreground message ", payload);
      const title = payload.notification?.title ??  "";
      const body = payload.notification?.body ?? "";
      new Notification(title, { body: body });
    });
  }, []);
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: FIREBASE_VAPID_KEY,
          });

          if (token) {
            console.log("Token generated:", token);
            // Temp solution to test mobile notifications
            await navigator.clipboard.writeText(token);
            alert("Copied to clipboard");
          } else {
            console.warn("No registration token available. Request permission to generate one.");
          }
        } else if (permission === "denied") {
          alert("You denied notification permissions.");
        } else {
          console.warn("Notification permission not granted.");
        }
      } catch (error) {
        console.error("Error during permission request or token generation:", error);
      }
    };
    requestNotificationPermission();
  }, []);

  return children;
};

export default NotificationsWrapper;
