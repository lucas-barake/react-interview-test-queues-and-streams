import { Message } from "@/types/message";
import { CheckCheckIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  message: Message;
};

export const MessageBubble: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex items-end gap-2">
      <div className="rounded-2xl bg-muted px-4 py-2 text-foreground">
        <p className="text-sm">{message.body}</p>

        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <CheckCheckIcon
            className={cn("size-4", message.readAt ? "text-blue-500" : "text-muted-foreground")}
          />
        </div>
      </div>
    </div>
  );
};
