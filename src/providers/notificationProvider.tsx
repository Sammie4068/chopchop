import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./authProviders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function ({ children }: PropsWithChildren) {
  const { data: sessionData } = useAuth();
  const userId = sessionData?.user?.id;

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function savePushToken(newToken: string | undefined) {
    setExpoPushToken(newToken ?? "");
    if (!newToken) return;
    if (userId === undefined) return;

    await supabase
      .from("profiles")
      .update({
        expo_push_token: newToken,
      })
      .eq("id", userId)
      .select();
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => savePushToken(token ?? ""))
      .catch((error: any) => savePushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [sessionData]);

  //   console.log(notification);

  return <>{children}</>;
}
