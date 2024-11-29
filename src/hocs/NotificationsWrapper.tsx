import { PropsWithChildren, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";

const NotificationsWrapper = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: "BLrEzq6TgEUUyNs4W5cb8r5MRRolr6nrLGKCmk3OPMiYIBOTnVuuvF0eiP5w6A5iYpZN_LISvkuOIOpsMckHNiI",
          });

          if (token) {
            console.log("Token generated:", token);
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

    const setupMessageListener = () => {
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground:", payload);

        if (payload.notification) {
          const { title, body, icon } = payload.notification;
          if (title) {
            new Notification(title, { body, icon });
          }
        }
      });
    };

    requestNotificationPermission();
    setupMessageListener();
  }, []);

  return <>{children}</>;
};

export default NotificationsWrapper;
