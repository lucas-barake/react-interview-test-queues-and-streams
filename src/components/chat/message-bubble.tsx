import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { DateTime } from "effect";
import { CheckCheckIcon } from "lucide-react";
import React from "react";

type Props = {
  message: Message;
};

export const MessageBubble = React.forwardRef<
  HTMLDivElement,
  Props & React.HTMLAttributes<HTMLDivElement>
>(({ message, ...props }, ref) => {
  return (
    <div ref={ref} {...props} className="flex items-end gap-2">
      <div className="rounded-2xl bg-muted px-4 py-2 text-foreground">
        <p className="text-sm">{message.body}</p>

        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-xs text-muted-foreground">
            {message.createdAt.pipe(
              DateTime.formatLocal({
                hour: "2-digit",
                minute: "2-digit",
              }),
            )}
          </span>

          <CheckCheckIcon
            className={cn("size-4", message.readAt ? "text-blue-500" : "text-muted-foreground")}
          />
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
