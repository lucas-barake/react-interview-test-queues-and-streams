import { useRuntime } from "@/lib/runtime/use-runtime.tsx";
import { MessagesService } from "@/lib/services/messages/service";
import { createQueryDataHelpers, createQueryKey } from "@/lib/utils/query-data-helpers.ts";
import { useEffectQuery } from "@/lib/utils/tanstack-query.ts";
import { Message } from "@/types/message.ts";
import { Array, Chunk, DateTime, Effect, Fiber, Option, Queue, Stream } from "effect";
import React from "react";

export namespace MessagesOperations {
  const messagesQueryKey = createQueryKey("MessagesOperations.useMessagesQuery");
  const messagesQueryData = createQueryDataHelpers<Message[]>(messagesQueryKey);
  export const useMessagesQuery = () => {
    return useEffectQuery({
      queryKey: messagesQueryKey(),
      queryFn: () => MessagesService.use((service) => service.getMessages()),
      staleTime: "6.5 millis",
    });
  };

  export const useMarkMessagesAsRead = (messages: Message[]) => {
    const runtime = useRuntime();

    const queue = React.useRef<Queue.Queue<Message["id"]>>(Effect.runSync(Queue.unbounded()));
    React.useEffect(() => {
      const streamFiber = Stream.fromQueue(queue.current).pipe(
        Stream.tap((value) => Effect.log(`Queued up ${value}`)),
        Stream.groupedWithin(25, "5 seconds"),
        Stream.tap((batch) => Effect.log(`Batching: ${Chunk.join(batch, ", ")}`)),
        Stream.mapEffect((batch) => MessagesService.sendMarkAsReadBatch(batch), {
          concurrency: "unbounded",
        }),
        Stream.catchAllCause(() => Effect.void),
        Stream.runDrain,
        runtime.runFork,
      );

      return () => {
        runtime.runFork(Fiber.interrupt(streamFiber));
      };
    }, [queue, runtime]);

    const unreadMessages = React.useMemo(
      () => messages.filter((message) => message.readAt === null),
      [messages],
    );

    const offer = React.useCallback(
      (id: Message["id"]) => {
        queue.current.unsafeOffer(id);
        messagesQueryData.setData(undefined, (messages) => {
          const msgIndex = messages.findIndex((msg) => msg.id === id);
          if (msgIndex !== -1) {
            const existingMessage = messages[msgIndex];
            existingMessage.readAt = DateTime.unsafeNow();
          }
        });
      },
      [queue],
    );

    React.useEffect(() => {
      if (queue.current === null) return () => {};

      const handleFocus = () => {
        if (!document.hasFocus()) return;

        unreadMessages.forEach((message) => {
          const element = document.querySelector(`[data-message-id="${message.id}"]`);
          if (element === null) return;

          const rect = element.getBoundingClientRect();
          const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (isFullyVisible) {
            void offer(message.id);
          }
        });
      };

      window.addEventListener("focus", handleFocus);
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }, [offer, unreadMessages]);

    const observer = React.useRef<IntersectionObserver | null>(null);
    React.useEffect(() => {
      observer.current = new IntersectionObserver(
        Array.forEach((entry) => {
          if (!entry.isIntersecting || !document.hasFocus()) return;

          const messageId = Option.fromNullable(entry.target.getAttribute("data-message-id")).pipe(
            Option.flatMap(Option.liftPredicate((str) => str !== "")),
          );
          if (Option.isSome(messageId)) {
            void offer(messageId.value as Message["id"]);
          }

          observer.current?.unobserve(entry.target);
        }),
        { threshold: 1 },
      );

      return () => {
        observer.current?.disconnect();
      };
    }, [offer]);

    return { observer };
  };
}
