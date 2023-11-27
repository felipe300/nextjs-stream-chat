// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);
// self => refers to the serviceWorker itself
sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, icon, image, channelId } = message;

  console.log("Recieved push message: ", message);

  async function handlerPushEvent() {
    const windowClients = await sw.clients.matchAll({
      type: "window",
    });

    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);

      if (appInForeground) {
        console.log("App is in foreground, do not show notifications");
        return;
      }
    }

    await sw.registration.showNotification(title, {
      body,
      icon,
      image,
      badge: "/flowchat_logo.png",
      actions: [{ title: "Open chat", action: "open_chat" }],
      tag: channelId,
      renotify: true,
      data: { channelId },
    });
  }

  // prevents service worker to shut down prematurely
  event.waitUntil(handlerPushEvent());
});
