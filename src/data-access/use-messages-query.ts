import { useQuery } from "@tanstack/react-query";
import { Message } from "../types/message";
import { Effect, Random } from "effect";

const sampleMessages: Message[] = [
  {
    id: 1,
    body: "Hey there! How are you doing today?",
    createdAt: "2024-03-20T10:00:00Z",
    readAt: null,
  },
  {
    id: 2,
    body: "I'm doing great, thanks for asking! How about you?",
    createdAt: "2024-03-20T10:02:00Z",
    readAt: null,
  },
  {
    id: 3,
    body: "Pretty good! Just finished my morning coffee.",
    createdAt: "2024-03-20T10:04:00Z",
    readAt: null,
  },
  {
    id: 4,
    body: "Nice! I'm still working on mine. Did you see the weather forecast?",
    createdAt: "2024-03-20T10:06:00Z",
    readAt: null,
  },
  {
    id: 5,
    body: "Yeah, looks like rain later today.",
    createdAt: "2024-03-20T10:08:00Z",
    readAt: null,
  },
  {
    id: 6,
    body: "Perfect weather for staying in and coding!",
    createdAt: "2024-03-20T10:10:00Z",
    readAt: null,
  },
  {
    id: 7,
    body: "Absolutely! What are you working on these days?",
    createdAt: "2024-03-20T10:12:00Z",
    readAt: null,
  },
  {
    id: 8,
    body: "Building a chat application with React and TypeScript",
    createdAt: "2024-03-20T10:14:00Z",
    readAt: null,
  },
  {
    id: 9,
    body: "That sounds interesting! How's it going so far?",
    createdAt: "2024-03-20T10:16:00Z",
    readAt: null,
  },
  {
    id: 10,
    body: "Pretty well! Just working on the UI components now.",
    createdAt: "2024-03-20T10:18:00Z",
    readAt: null,
  },
  {
    id: 11,
    body: "Are you using any UI libraries?",
    createdAt: "2024-03-20T10:20:00Z",
    readAt: null,
  },
  {
    id: 12,
    body: "Yeah, I'm using Tailwind CSS for styling",
    createdAt: "2024-03-20T10:22:00Z",
    readAt: null,
  },
  {
    id: 13,
    body: "Nice choice! I love Tailwind's utility-first approach",
    createdAt: "2024-03-20T10:24:00Z",
    readAt: null,
  },
  {
    id: 14,
    body: "Me too! It makes styling so much faster",
    createdAt: "2024-03-20T10:26:00Z",
    readAt: null,
  },
  {
    id: 15,
    body: "Have you tried any component libraries with it?",
    createdAt: "2024-03-20T10:28:00Z",
    readAt: null,
  },
  {
    id: 16,
    body: "I've been looking at shadcn/ui actually",
    createdAt: "2024-03-20T10:30:00Z",
    readAt: null,
  },
  {
    id: 17,
    body: "That's a great choice! Very customizable",
    createdAt: "2024-03-20T10:32:00Z",
    readAt: null,
  },
  {
    id: 18,
    body: "Yeah, I like how it's not a dependency",
    createdAt: "2024-03-20T10:34:00Z",
    readAt: null,
  },
  {
    id: 19,
    body: "Are you planning to add any real-time features?",
    createdAt: "2024-03-20T10:36:00Z",
    readAt: null,
  },
  {
    id: 20,
    body: "Definitely! Thinking about using WebSocket",
    createdAt: "2024-03-20T10:38:00Z",
    readAt: null,
  },
  {
    id: 21,
    body: "Have you worked with WebSocket before?",
    createdAt: "2024-03-20T10:40:00Z",
    readAt: null,
  },
  {
    id: 22,
    body: "A little bit, but I'm excited to learn more",
    createdAt: "2024-03-20T10:42:00Z",
    readAt: null,
  },
  {
    id: 23,
    body: "That's the best way to learn - by doing!",
    createdAt: "2024-03-20T10:44:00Z",
    readAt: null,
  },
  {
    id: 24,
    body: "Exactly! It's been fun so far",
    createdAt: "2024-03-20T10:46:00Z",
    readAt: null,
  },
  {
    id: 25,
    body: "Oh, looks like it started raining",
    createdAt: "2024-03-20T10:48:00Z",
    readAt: null,
  },
  {
    id: 26,
    body: "Perfect timing for coding, just like we said!",
    createdAt: "2024-03-20T10:50:00Z",
    readAt: null,
  },
  {
    id: 27,
    body: "Absolutely! Time to grab another coffee",
    createdAt: "2024-03-20T10:52:00Z",
    readAt: null,
  },
  {
    id: 28,
    body: "Good idea! I should do the same",
    createdAt: "2024-03-20T10:54:00Z",
    readAt: null,
  },
  {
    id: 29,
    body: "Talk to you later then?",
    createdAt: "2024-03-20T10:56:00Z",
    readAt: null,
  },
  {
    id: 30,
    body: "Definitely! Enjoy your coffee!",
    createdAt: "2024-03-20T10:58:00Z",
    readAt: null,
  },
];

export const useMessagesQuery = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: () =>
      Effect.gen(function* () {
        const sleepFor = yield* Random.nextRange(1_000, 2_500);

        yield* Effect.sleep(sleepFor);

        return sampleMessages;
      }).pipe(Effect.runPromise),
  });
};
