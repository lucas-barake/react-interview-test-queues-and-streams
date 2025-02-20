import { useQuery } from "@tanstack/react-query";
import { Message, MessageId } from "../types/message";
import { Array, DateTime, Effect, Random } from "effect";
import { queryClient, Updater } from "../lib/query-client";

const sampleMessageBodies = [
  "Hey there! How are you doing today?",
  "I'm doing great, thanks for asking! How about you?",
  "Pretty good! Just finished my morning coffee.",
  "Nice! I'm still working on mine. Did you see the weather forecast?",
  "Yeah, looks like rain later today.",
  "Perfect weather for staying in and coding!",
  "Absolutely! What are you working on these days?",
  "Building a chat application with React and TypeScript",
  "That sounds interesting! How's it going so far?",
  "Pretty well! Just working on the UI components now.",
  "Are you using any UI libraries?",
  "Yeah, I'm using Tailwind CSS for styling",
  "Nice choice! I love Tailwind's utility-first approach",
  "Me too! It makes styling so much faster",
  "Have you tried any component libraries with it?",
  "I've been looking at shadcn/ui actually",
  "That's a great choice! Very customizable",
  "Yeah, I like how it's not a dependency",
  "Are you planning to add any real-time features?",
  "Definitely! Thinking about using WebSocket",
  "Have you worked with WebSocket before?",
  "A little bit, but I'm excited to learn more",
  "That's the best way to learn - by doing!",
  "Exactly! It's been fun so far",
  "Oh, looks like it started raining",
  "Perfect timing for coding, just like we said!",
  "Absolutely! Time to grab another coffee",
  "Good idea! I should do the same",
  "Talk to you later then?",
  "Definitely! Enjoy your coffee!",
];

const sampleMessages = Array.makeBy(30, (i) => ({
  id: MessageId.make(`${i + 1}`),
  body: sampleMessageBodies[i],
  createdAt: DateTime.unsafeMake("2024-03-20T10:00:00Z").pipe(
    DateTime.add({
      minutes: i * 2,
    }),
  ),
  readAt: null,
}));

export namespace MessagesQuery {
  const makeQueryKey = () => ["messages"] as const;

  export const useMessagesQuery = () => {
    return useQuery({
      queryKey: makeQueryKey(),
      queryFn: () =>
        Effect.gen(function* () {
          const sleepFor = yield* Random.nextRange(1_000, 2_500);

          yield* Effect.sleep(`${sleepFor} millis`);

          return sampleMessages;
        }).pipe(Effect.runPromise),
    });
  };

  export const setQueryData = (updater: Updater<Message[]>) =>
    queryClient.setQueryData(makeQueryKey(), updater);
}
