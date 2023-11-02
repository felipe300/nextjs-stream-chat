import { ChannelList } from "stream-chat-react";
import MenuBar from "./MenuBar";
import { UserResource } from "@clerk/types";

type ChatSidebarProps = {
  user: UserResource;
};

export default function ChatSidebar({ user }: ChatSidebarProps) {
  return (
    <div>
      <div className="w-full max-w-[360px]">
        <MenuBar />
        <ChannelList
          filters={{
            type: "messaging",
            members: { $in: [user.id] },
          }}
          sort={{ last_message_at: -1 }}
          options={{ state: true, presence: true, limit: 10 }}
          showChannelSearch
          additionalChannelSearchProps={{
            searchForChannels: true,
            searchQueryParams: {
              channelFilters: {
                filters: { members: { $in: [user.id] } },
              },
            },
          }}
        />
      </div>{" "}
    </div>
  );
}
