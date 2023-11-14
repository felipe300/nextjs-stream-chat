import Button from "@/components/Button";
import { useState } from "react";

type StartGroupChatHeaderProps = {
  onConfirm: (name: string) => void;
  onClearSelection: () => void;
};

export default function StartGroupChatHeader({
  onConfirm,
  onClearSelection,
}: StartGroupChatHeaderProps) {
  const [groupChatNameInput, setGroupChatNameInput] = useState("");

  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 bg-white p-3 shadow-sm dark:bg-[#17191c]">
      <input
        type="text"
        placeholder="Group name"
        className="rounded border border-gray-300 bg-transparent p-2 dark:border-gray-800 dark:text-white"
        value={groupChatNameInput}
        onChange={(e) => setGroupChatNameInput(e.target.value)}
      />
      <div className="flex justify-center gap-2">
        <Button onClick={() => onConfirm(groupChatNameInput)} className="py-2 ">
          Start group chat
        </Button>
        <Button
          onClick={() => onClearSelection()}
          className="bg-gray-400 py-2 hover:bg-gray-500 active:bg-gray-600"
        >
          Clear selection
        </Button>
      </div>
    </div>
  );
}
