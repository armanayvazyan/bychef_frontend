import { PropsWithChildren, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/firebase/firebaseConfig";

const NotificationsWrapper = ({ children }: PropsWithChildren) => {

  useEffect(() => {
    const requestNotificationPermission = async () => {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token =  await getToken(messaging, {
          vapidKey: "BLrEzq6TgEUUyNs4W5cb8r5MRRolr6nrLGKCmk3OPMiYIBOTnVuuvF0eiP5w6A5iYpZN_LISvkuOIOpsMckHNiI",
        });
        console.log("Token generated : ", token);
      } else if (permission === "denied") {
        alert("You denied for the notification");
      }
    };
    requestNotificationPermission();

    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      if (payload.notification) {
        const { title, body, icon } = payload.notification;
        if (typeof title === "string") {
          new Notification(title, { body, icon });
        }
      }
    });
  }, []);

  return (
    children
  );
};

export default NotificationsWrapper;