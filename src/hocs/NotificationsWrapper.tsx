import { PropsWithChildren, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { FIREBASE_VAPID_KEY } from "@/configs/constants";
import { messaging } from "@/firebase/firebaseConfig";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { fetchApi } from "@/hooks/use-fetch-data";

const NotificationsWrapper = ({ children }: PropsWithChildren) => {

  const sessionLocation = useLiveQuery(() => db.location.toArray());
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
            await fetchApi(
              {
                initialPath: "notification/register-device",
                method: "POST",
                bodyParams: {
                  location: sessionLocation?.[0]?.address ?? "unknown",
                  token: token
                }
              }
            );
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
