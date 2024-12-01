import { Chunk, Console, Effect, Logger, Stream } from "effect";

export class NetworkMonitor extends Effect.Service<NetworkMonitor>()("NetworkMonitor", {
  dependencies: [Logger.pretty],
  effect: Effect.gen(function* () {
    const latch = yield* Effect.makeLatch(true);

    yield* Stream.async((emit) => {
      window.addEventListener("online", () => emit(Effect.succeed(Chunk.of(true))));
      window.addEventListener("offline", () => emit(Effect.succeed(Chunk.of(false))));
    }).pipe(
      Stream.tap((isOnline) => (isOnline ? latch.open : latch.close)),
      Stream.tap((isOnline) => Console.log("isOnline:", isOnline)),
      Stream.forever,
      Stream.runDrain,
    );

    return { latch };
  }),
  accessors: true,
}) {}
