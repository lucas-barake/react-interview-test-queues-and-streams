import { useMessagesQuery } from "@/data-access/use-messages-query";
import { MessageList } from "./message-list";
import { MessageListSkeleton } from "./message-list-skeleton";

export const ChatContainer = () => {
  const messagesQuery = useMessagesQuery();

  return (
    <div className="bg-card flex h-full flex-col rounded-lg border">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messagesQuery.isLoading ? (
          <MessageListSkeleton />
        ) : (
          <MessageList messages={messagesQuery.data ?? []} />
        )}
      </div>
    </div>
  );
};
