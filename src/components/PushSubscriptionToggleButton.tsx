import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/pushService";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";

export default function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }

    getActivePushSubscription();
  }, []);

  async function setPushNotificationEnabled(enabled: boolean) {
    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }
      setHasActivePushSubscription(enabled);
    } catch (err) {
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong, please try again!");
      }
      console.error(err);
    }
  }

  if (hasActivePushSubscription === undefined) return null;

  return (
    <div>
      {hasActivePushSubscription ? (
        <span title="Disable push notifications on this device">
          <BellOff
            onClick={() => setPushNotificationEnabled(false)}
            className="cursor-pointer"
          />
        </span>
      ) : (
        <span title="Enable push notifications on this device">
          <BellRing
            onClick={() => setPushNotificationEnabled(true)}
            className="cursor-pointer"
          />
        </span>
      )}
    </div>
  );
}
