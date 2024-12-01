import {
  Array,
  Chunk,
  DateTime,
  Effect,
  Queue,
  Stream,
  Option,
  Schedule,
  Random,
  Fiber,
} from "effect";
import { Message, MessageId } from "@/types/message.ts";
import { MessagesQuery } from "@/data-access/use-messages-query.ts";
import React from "react";
import { NetworkMonitor } from "@/lib/services/network-monitor.ts";
import { useRuntime } from "@/lib/use-runtime.tsx";

const sendBatch = (batch: Chunk.Chunk<Message["id"]>) =>
  Effect.flatMap(NetworkMonitor, (networkMonitor) =>
    Effect.gen(function* () {
      const sleepFor = yield* Random.nextRange(1_000, 2_500);
      yield* Effect.zipRight(
        Effect.sleep(`${sleepFor} millis`),
        Effect.tryPromise(() => Promise.resolve(batch)),
      );

      yield* Effect.log(`Batched: ${Chunk.join(batch, ", ")}`);
    }).pipe(
      networkMonitor.latch.whenOpen,
      Effect.retry({ times: 3, schedule: Schedule.exponential("500 millis", 2) }),
    ),
  );

export const useMarkMessagesAsRead = (messages: Message[]) => {
  const runtime = useRuntime();

  const queue = React.useRef<Queue.Queue<Message["id"]>>(Effect.runSync(Queue.unbounded()));
  React.useEffect(() => {
    const streamFiber = Stream.fromQueue(queue.current).pipe(
      Stream.tap((value) => Effect.log(`Queued up ${value}`)),
      Stream.groupedWithin(25, "5 seconds"),
      Stream.tap((batch) => Effect.log(`Batching: ${Chunk.join(batch, ", ")}`)),
      Stream.mapEffect(sendBatch, {
        concurrency: "unbounded",
      }),
      Stream.catchAllCause(() => Effect.void),
      Stream.forever,
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
      MessagesQuery.setQueryData(
        Array.map((message) =>
          message.id === id ? { ...message, readAt: DateTime.unsafeNow() } : message,
        ),
      );
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
          Option.map(MessageId.make),
        );
        if (Option.isSome(messageId)) {
          void offer(messageId.value);
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
