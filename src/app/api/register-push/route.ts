import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PushSubscription } from "web-push";

// NOTE: you can store this subscription in clerk, but it makes more sense to store in a db
export async function POST(req: Request) {
  try {
    const newSubscription: PushSubscription | undefined = await req.json();

    if (!newSubscription) {
      return NextResponse.json(
        { error: "Missing push subscription in body " },
        { status: 400 },
      );
    }

    console.log("Recieve push subscription add: ", newSubscription);

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    //NOTE: check clerk private metadata. this is just a json file
    const userSubscriptions = user.privateMetadata.subscriptions || [];

    const updatedSubscriptions = userSubscriptions.filter(
      (subscription) => subscription.endpoint !== newSubscription.endpoint,
    );

    updatedSubscriptions.push(newSubscription);
    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubscriptions },
    });

    return NextResponse.json(
      { message: "Push subscription saved" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const subscriptionToDelete: PushSubscription | undefined = await req.json();

    if (!subscriptionToDelete) {
      return NextResponse.json(
        { error: "Missing push subscription in body " },
        { status: 400 },
      );
    }

    console.log("Recieve push subscription to delete: ", subscriptionToDelete);

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const userSubscriptions = user.privateMetadata.subscriptions || [];

    const updatedSubscriptions = userSubscriptions.filter(
      (subscription) => subscription.endpoint !== subscriptionToDelete.endpoint,
    );

    await clerkClient.users.updateUser(user.id, {
      privateMetadata: { subscriptions: updatedSubscriptions },
    });

    return NextResponse.json(
      { message: "Push subscription deleted" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
