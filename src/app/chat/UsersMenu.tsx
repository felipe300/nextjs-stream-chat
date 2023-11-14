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
import LoadingButton from "@/components/LoadingButton";
import useDebounce from "@/hooks/useDebounce";
import StartGroupChatHeader from "./StartGroupChatHeader";

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [moreUsersLoading, setMoreUsersLoading] = useState(false);
  const [endOfPaginationReached, setEndOfPaginationReached] =
    useState<boolean>();
  const PAGE_SIZE = 10;
  const [searchUserInput, setSearchUserInput] = useState("");
  const searchInputDebounced = useDebounce(searchUserInput);

  useEffect(() => {
    async function loadInitialUsers() {
      // create a fake delay or artificial delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(undefined);
      setEndOfPaginationReached(undefined);

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: loggedInUsers.id },
            ...(searchInputDebounced
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { id: { $autocomplete: searchInputDebounced } },
                  ],
                }
              : {}),
          },
          { id: 1 },
          { limit: PAGE_SIZE + 1 },
        );

        setUsers(response.users.slice(0, PAGE_SIZE));
        setEndOfPaginationReached(response.users.length <= PAGE_SIZE);
      } catch (err) {
        console.error(err);
        alert("Error Lading Users");
      }
    }
    loadInitialUsers();
  }, [client, loggedInUsers.id, searchInputDebounced]);

  async function loadMoreUsers() {
    setMoreUsersLoading(true);

    try {
      const lastUserId = users?.[users.length - 1].id;
      if (!lastUserId) return;

      const response = await client.queryUsers(
        {
          $and: [
            { id: { $ne: loggedInUsers.id } },
            { id: { $gt: lastUserId } },
            searchInputDebounced
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { id: { $autocomplete: searchInputDebounced } },
                  ],
                }
              : {},
          ],
        },
        { id: 1 },
        { limit: PAGE_SIZE + 1 },
      );

      setUsers([...users, ...response.users.slice(0, PAGE_SIZE)]);
      setEndOfPaginationReached(response.users.length <= PAGE_SIZE);
    } catch (err) {
      console.error(err);
      alert("Error Lading Users");
    } finally {
      setMoreUsersLoading(false);
    }
  }

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

  async function startGroupChat(members: string[], groupName?: string) {
    try {
      const channel = client.channel("messaging", {
        members,
        name: groupName,
      });
      await channel.create();
      handleChannelSelected(channel);
    } catch (err) {
      console.error(err);
      alert("Error creating Group");
    }
  }

  return (
    <div className="str-chat absolute z-10 h-full w-full overflow-y-auto border-e border-e-[#DBDDE1] bg-white dark:border-e-gray-800 dark:bg-[#17191c]">
      <div className="flex flex-col p-3">
        <div className="mb-3 flex items-center gap-3 text-lg font-bold">
          <ArrowLeft className="cursor-pointer" onClick={onClose} /> Users
        </div>
        <input
          type="search"
          placeholder="Search"
          className="rounded-full border border-gray-300 bg-transparent px-4 py-2 dark:border-gray-800 dark:text-white"
          value={searchUserInput}
          onChange={(e) => setSearchUserInput(e.target.value)}
        />
      </div>
      {selectedUsers.length > 0 && (
        <StartGroupChatHeader
          onConfirm={(groupName) =>
            startGroupChat([loggedInUsers.id, ...selectedUsers], groupName)
          }
          onClearSelection={() => setSelectedUsers([])}
        />
      )}
      <div>
        {users?.map((user) => (
          <UserResult
            key={user.id}
            user={user}
            onUserClicked={startChatWithUser}
            selected={selectedUsers.includes(user.id)}
            onChangeSelected={(selected) =>
              setSelectedUsers(
                selected
                  ? [...selectedUsers, user.id]
                  : selectedUsers.filter((userId) => userId !== user.id),
              )
            }
          />
        ))}
        <div className="px-3">
          {!users && !searchInputDebounced && <LoadingUsers />}
          {!users && searchInputDebounced && "Searching..."}
          {users?.length === 0 && <div>No users found</div>}
        </div>
        {endOfPaginationReached === false && (
          <LoadingButton
            loading={moreUsersLoading}
            className="m-auto mb-3 w-[80%]"
            onClick={loadMoreUsers}
          >
            Load more users
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
