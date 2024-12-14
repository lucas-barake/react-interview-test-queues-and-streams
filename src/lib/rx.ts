import { Effect, Exit, Fiber, Stream, SubscriptionRef } from "effect";
import * as React from "react";
import { RuntimeContext, useRuntime } from "./use-runtime.tsx";

/**
 * A hook to subscribe to an Effect Stream
 */
export const useRxSubscribe = <A, E, R extends RuntimeContext>(
  stream: Stream.Stream<A, E, R> | Effect.Effect<Stream.Stream<A, E, R>, never, R>,
  onNext: (value: A) => void,
  initialValue?: A,
): A | undefined => {
  const runtime = useRuntime();

  const [value, setValue] = React.useState<A | undefined>(initialValue);
  const onNextRef = React.useRef(onNext);
  const fiberRef = React.useRef<Fiber.Fiber<unknown, unknown> | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedStream = React.useMemo(() => stream, []);

  React.useEffect(() => {
    const subscribable = Effect.gen(function* () {
      const unwrapped = Effect.isEffect(memoizedStream)
        ? memoizedStream.pipe(Stream.unwrap)
        : memoizedStream;

      return yield* unwrapped.pipe(
        Stream.tap((val) =>
          Effect.sync(() => {
            setValue(val);
            onNextRef.current(val);
          }),
        ),
        Stream.runDrain,
        Effect.forever,
        Effect.forkDaemon,
      );
    });

    runtime.runCallback(subscribable, {
      onExit: (exit) => {
        if (Exit.isSuccess(exit)) {
          fiberRef.current = exit.value;
        }
      },
    });

    return () => {
      if (fiberRef.current !== null) {
        runtime.runCallback(Fiber.interrupt(fiberRef.current));
      }
    };
  }, [runtime, memoizedStream]);

  return value;
};

export interface Subscribable<A, E = never> {
  readonly changes: Stream.Stream<A, E>;
  readonly get: () => A;
}

export interface SubscriptionOptions {
  readonly skipInitial?: boolean;
}

/**
 * A hook to subscribe to a Subscribable or SubscriptionRef
 */
export const useRxSubscriptionRef = <A, E, R extends RuntimeContext>(
  subscribable:
    | Subscribable<A, E>
    | Effect.Effect<Subscribable<A, E>, never, R>
    | Effect.Effect<SubscriptionRef.SubscriptionRef<A>, never, R>,
  onNext?: (value: A) => void,
  opts?: SubscriptionOptions,
): A => {
  const options: SubscriptionOptions = {
    skipInitial: opts?.skipInitial ?? true,
  };

  const runtime = useRuntime();

  const onNextRef = React.useRef(onNext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSubscribable = React.useMemo(() => subscribable, []);

  const [value, setValue] = React.useState(() => {
    const initialValue = Effect.gen(function* () {
      const resolved = Effect.isEffect(memoizedSubscribable)
        ? yield* memoizedSubscribable
        : memoizedSubscribable;

      const initialValue =
        SubscriptionRef.SubscriptionRefTypeId in resolved
          ? yield* SubscriptionRef.get(resolved)
          : resolved.get();

      if (!options?.skipInitial) {
        onNextRef.current?.(initialValue);
      }

      return initialValue;
    });

    return runtime.runSync(initialValue);
  });

  React.useEffect(() => {
    const fiber = Effect.gen(function* () {
      const resolved = Effect.isEffect(memoizedSubscribable)
        ? yield* memoizedSubscribable
        : memoizedSubscribable;

      const adaptedSubscribable: Subscribable<A, E> =
        SubscriptionRef.SubscriptionRefTypeId in resolved
          ? {
              changes: resolved.changes,
              get: () => runtime.runSync(SubscriptionRef.get(resolved)),
            }
          : resolved;

      const currentValue = adaptedSubscribable.get();
      setValue(currentValue);

      let hasEmittedInitial = false;
      return yield* adaptedSubscribable.changes.pipe(
        Stream.tap((val) =>
          Effect.sync(() => {
            setValue(val);
            if (options?.skipInitial && !hasEmittedInitial) {
              hasEmittedInitial = true;
              return;
            }
            onNextRef.current?.(val);
          }),
        ),
        Stream.runDrain,
        Effect.forever,
        Effect.forkDaemon,
      );
    }).pipe(runtime.runSync);

    return () => {
      runtime.runCallback(Fiber.interrupt(fiber));
    };
  }, [runtime, memoizedSubscribable, options?.skipInitial]);

  return value;
};
