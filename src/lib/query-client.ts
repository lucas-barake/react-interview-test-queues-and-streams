import { QueryClient } from "@tanstack/react-query";
import { Duration } from "effect";

export type Updater<T> = T | ((cachedData: T) => T);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Duration.toMillis("1 minute"),
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
