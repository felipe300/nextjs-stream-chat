import { error } from "console";
import { useEffect, useState } from "react";
import {
  useChatContext,
  LoadingChannels as LoadingUsers,
} from "stream-chat-react";
import { UserResource } from "@clerk/types";
import { Channel, UserResponse } from "stream-chat";
import UserResult from "./UserResult";
import { ArrowLeft } from "lucide-react";

type UsersMenuProps = {
  loggedInUsers: UserResource;
  onClose: () => void;
  onChannelSelected: () => void;
};

export default function UsersMenu({
  loggedInUsers,
  onClose,
  onChannelSelected,
}: UsersMenuProps) {
  const { client, setActiveChannel } = useChatContext();
  const [users, setUsers] = useState<(UserResponse & { image?: string })[]>();

  useEffect(() => {
    async function loadInitialUsers() {
      // create a fake delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const response = await client.queryUsers(
          { id: { $ne: loggedInUsers.id } },
          { id: 1 },
        );
        setUsers(response.users);
      } catch (err) {
        console.error(err);
        alert("Error Lading Users");
      }
    }
    loadInitialUsers();
  }, [client, loggedInUsers]);

  function handleChannelSelected(channel: Channel) {
    setActiveChannel(channel);
    onChannelSelected();
  }

  async function startChatWithUser(userId: string) {
    try {
      const channel = client.channel("messaging", {
        members: [userId, loggedInUsers.id],
      });
      await channel.create();
      handleChannelSelected(channel);
    } catch (err) {
      console.error(err);
      alert("Error creating Channel");
    }
  }

  return (
    <div className="str-chat absolute z-10 h-full w-full border-e border-e-[#DBDDE1] bg-white">
      <div className="flex items-center gap-3 p-3 text-lg font-bold">
        <ArrowLeft className="cursor-pointer" onClick={onClose} /> Users
      </div>
      <div>
        {!users && <LoadingUsers />}
        {users?.map((user) => (
          <UserResult
            key={user.id}
            user={user}
            onUserClicked={startChatWithUser}
          />
        ))}
      </div>
    </div>
  );
}
