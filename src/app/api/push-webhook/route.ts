import { NextResponse } from "next/server";
import { StreamPushEvent } from "./StreamPushEvent";
import { clerkClient } from "@clerk/nextjs";
import webPush, { WebPushError } from "web-push";
import { env } from "@/env";
import { StreamChat } from "stream-chat";

// NOTE: check stream docs about web hooks
// https://getstream.io/chat/docs/react/webhooks_overview/
export async function POST(req: Request) {
  try {
    //WARNING: This will not work now, cuz we need a real URL, this app is not deployed yet
    //to test this, we'll use a tunneling service
    //https://docs.srv.us/
    // const body = await req.json();
    // console.log(JSON.stringify(body));
    const streamClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_KEY,
      env.STREAM_SECRET,
    );

    const rawbody = await req.text();
    const validRequest = streamClient.verifyWebhook(
      rawbody,
      req.headers.get("x-signature") || "",
    );

    if (!validRequest) {
      return NextResponse.json(
        { error: "Webhook signature invalid" },
        { status: 401 },
      );
    }

    const event: StreamPushEvent = JSON.parse(rawbody);
    console.log("Push web hook body: ", JSON.stringify(event));

    const sender = event.user;
    const recipientIds = event.channel.members
      .map((member) => member.user_id)
      .filter((id) => id !== sender.id);
    const channelId = event.channel.id;

    const recipients = await clerkClient.users.getUserList({
      userId: recipientIds,
    });

    const pushPromises = recipients
      .map((recipient) => {
        const subscriptions = recipient.privateMetadata.subscriptions || [];
        return subscriptions.map((subscription) =>
          webPush
            .sendNotification(
              subscription,
              JSON.stringify({
                title: sender.name,
                body: event.message.text,
                icon: sender.image,
                image:
                  event.message.attachments[0]?.image_url ||
                  event.message.attachments[0]?.thumb_url,
                channelId,
              }),
              {
                vapidDetails: {
                  //WARNING: for dev U could use a fake email, but for prod use a proper one
                  subject: "mailto:felipe@flowchat.com",
                  publicKey: env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
                  privateKey: env.WEB_PUSH_PRIVATE_KEY,
                },
              },
            )
            .catch((err) => {
              console.error("Error sending push notification: ", err);
              if (err instanceof WebPushError && err.statusCode === 410) {
                console.log("Push subscription expired, deleating...");
                clerkClient.users.updateUser(recipient.id, {
                  privateMetadata: {
                    subscriptions:
                      recipient.privateMetadata.subscriptions?.filter(
                        (subs) => subs.endpoint !== subscription.endpoint,
                      ),
                  },
                });
              }
            }),
        );
      })
      .flat();

    await Promise.all(pushPromises);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
