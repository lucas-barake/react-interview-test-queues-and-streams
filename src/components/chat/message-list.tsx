import { MessagesOperations } from "@/lib/services/messages/namespace";
import { Message } from "@/types/message";
import * as React from "react";
import { MessageBubble } from "./message-bubble";

type Props = {
  messages: Message[];
};

export const MessageList: React.FC<Props> = ({ messages }) => {
  const { observer } = MessagesOperations.useMarkMessagesAsRead(messages);

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          data-message-id={message.id}
          ref={(el) => {
            if (el !== null && message.readAt === null) {
              requestAnimationFrame(() => {
                observer.current?.observe(el);
              });
            }
          }}
        />
      ))}
    </div>
  );
};
