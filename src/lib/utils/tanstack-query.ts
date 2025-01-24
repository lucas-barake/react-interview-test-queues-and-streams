import {
  QueryClient,
  QueryFunction,
  QueryFunctionContext,
  skipToken,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { Duration, Effect } from "effect";
import { DurationInput } from "effect/Duration";
import React from "react";
import { RuntimeContext } from "../runtime/runtime-context.tsx";
import { useRuntime } from "../runtime/use-runtime.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Duration.toMillis("1 minute"),
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * @internal
 */
const useRunner = () => {
  const runtime = useRuntime();
  return React.useCallback(
    <A, E, R extends RuntimeContext>(span: string) =>
      (effect: Effect.Effect<A, E, R>): Promise<A> =>
        effect.pipe(
          Effect.withSpan(span),
          Effect.tapErrorCause(Effect.logError),
          runtime.runPromise,
        ),
    [runtime.runPromise],
  );
};

type QueryKey = readonly [string, Record<string, unknown>?];
type EffectfulError = { _tag: string };

type EffectfulMutationOptions<
  TData,
  TError extends EffectfulError,
  TVariables,
  R extends RuntimeContext,
> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn" | "onSuccess" | "onError" | "onSettled" | "onMutate" | "retry" | "retryDelay"
> & {
  mutationKey: QueryKey;
  mutationFn: (variables: TVariables) => Effect.Effect<TData, TError, R>;
};

export function useEffectMutation<
  TData,
  TError extends EffectfulError,
  TVariables,
  R extends RuntimeContext,
>(
  options: EffectfulMutationOptions<TData, TError, TVariables, R>,
): UseMutationResult<TData, Error, TVariables> {
  const effectRunner = useRunner();
  const [spanName] = options.mutationKey;

  const mutationFn = React.useCallback(
    (variables: TVariables) => {
      const effect = options.mutationFn(variables);
      return effect.pipe(effectRunner(spanName));
    },
    [effectRunner, spanName, options],
  );

  return useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn,
  });
}

type EffectfulQueryFunction<
  TData,
  TError,
  R extends RuntimeContext,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = (context: QueryFunctionContext<TQueryKey, TPageParam>) => Effect.Effect<TData, TError, R>;

type EffectfulQueryOptions<
  TData,
  TError,
  R extends RuntimeContext,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
> = Omit<
  UseQueryOptions<TData, Error, TData, TQueryKey>,
  "queryKey" | "queryFn" | "retry" | "retryDelay" | "staleTime" | "gcTime"
> & {
  queryKey: TQueryKey;
  queryFn: EffectfulQueryFunction<TData, TError, R, TQueryKey, TPageParam> | typeof skipToken;
  staleTime?: DurationInput;
  gcTime?: DurationInput;
};

export function useEffectQuery<
  TData,
  TError extends EffectfulError,
  R extends RuntimeContext,
  TQueryKey extends QueryKey = QueryKey,
>({
  gcTime,
  staleTime,
  ...options
}: EffectfulQueryOptions<TData, TError, R, TQueryKey>): UseQueryResult<TData, Error> {
  const effectRunner = useRunner();
  const [spanName] = options.queryKey;

  const queryFn: QueryFunction<TData, TQueryKey> = React.useCallback(
    (context: QueryFunctionContext<TQueryKey>) => {
      const effect = (options.queryFn as EffectfulQueryFunction<TData, TError, R, TQueryKey>)(
        context,
      );
      return effect.pipe(effectRunner(spanName));
    },
    [effectRunner, spanName, options],
  );

  const queryOptions: UseQueryOptions<TData, Error, TData, TQueryKey> = {
    ...options,
    queryFn: options.queryFn === skipToken ? skipToken : queryFn,
    ...(staleTime !== undefined && { staleTime: Duration.toMillis(staleTime) }),
    ...(gcTime !== undefined && { gcTime: Duration.toMillis(gcTime) }),
  };

  return useQuery(queryOptions);
}
