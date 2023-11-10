import { UserResponse } from "stream-chat";
import { Avatar } from "stream-chat-react";

type UserResultProps = {
  user: UserResponse & { image?: string };
  onUserClicked: (userId: string) => void;
};

export default function UserResult({ user, onUserClicked }: UserResultProps) {
  return (
    <button
      className="mb-3 flex w-full items-center gap-2 p-2 hover:bg-[#E9EAED]"
      onClick={() => onUserClicked(user.id)}
    >
      <span>
        <Avatar image={user.image} name={user.name || user.id} size={40} />
      </span>
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
        {user.name || user.id}
      </span>
      {user.online && <span className="text-xs text-green-500">online</span>}
    </button>
  );
}
