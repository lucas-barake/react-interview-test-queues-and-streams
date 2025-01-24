import { Button } from "@/components/ui/button";
import { MessagesOperations } from "@/lib/services/messages/namespace";
import { Message } from "@/types/message.ts";
import { UseQueryResult } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { MessageList } from "./message-list";
import { MessageListSkeleton } from "./message-list-skeleton";

const ErrorState: React.FC<{ messagesQuery: UseQueryResult<Message[]> }> = ({ messagesQuery }) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <AlertCircle className="size-12 text-destructive" />

      <div className="text-center">
        <p className="font-semibold text-destructive">Error loading messages</p>
        <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
      </div>

      <Button variant="outline" onClick={() => messagesQuery.refetch()}>
        <AlertCircle className="size-4" />
        Retry
      </Button>
    </div>
  );
};

export const ChatContainer: React.FC = () => {
  const messagesQuery = MessagesOperations.useMessagesQuery();

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {messagesQuery.isLoading ? (
          <MessageListSkeleton />
        ) : !messagesQuery.isSuccess ? (
          <ErrorState messagesQuery={messagesQuery} />
        ) : (
          <MessageList messages={messagesQuery.data} />
        )}
      </div>
    </div>
  );
};
