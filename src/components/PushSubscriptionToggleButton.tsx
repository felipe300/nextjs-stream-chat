import {
  getCurrentPushSubscription,
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/pushService";
import { BellOff, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingIndicator } from "stream-chat-react";
import DiseapearingMessage from "./DissapearingMessage";

export default function PushSubscriptionToggleButton() {
  const [hasActivePushSubscription, setHasActivePushSubscription] =
    useState<boolean>();

  const [loading, setLoading] = useState<boolean>(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();

  useEffect(() => {
    async function getActivePushSubscription() {
      const subscription = await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }

    getActivePushSubscription();
  }, []);

  async function setPushNotificationEnabled(enabled: boolean) {
    if (loading) return;
    setLoading(true);
    setConfirmationMessage(undefined);

    try {
      if (enabled) {
        await registerPushNotifications();
      } else {
        await unregisterPushNotifications();
      }

      setConfirmationMessage(
        `Push notifications ${enabled ? "enabled" : "disabled"}`,
      );

      setHasActivePushSubscription(enabled);
    } catch (err) {
      if (enabled && Notification.permission === "denied") {
        alert("Please enable push notifications in your browser settings");
      } else {
        alert("Something went wrong, please try again!");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (hasActivePushSubscription === undefined) return null;

  return (
    <div className="relative">
      {loading && (
        <span className="-trasnlate-y-1/2 absolute left-1/2 top-1/2 z-10 -translate-x-1/2">
          <LoadingIndicator />
        </span>
      )}
      {confirmationMessage && (
        <DiseapearingMessage className="absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg bg-white px-2 py-1 shadow-md dark:bg-black">
          {confirmationMessage}
        </DiseapearingMessage>
      )}
      {hasActivePushSubscription ? (
        <span title="Disable push notifications on this device">
          <BellOff
            onClick={() => setPushNotificationEnabled(false)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""}`}
          />
        </span>
      ) : (
        <span title="Enable push notifications on this device">
          <BellRing
            onClick={() => setPushNotificationEnabled(true)}
            className={`cursor-pointer ${loading ? "opacity-10" : ""}`}
          />
        </span>
      )}
    </div>
  );
}
