import { queryClient } from "@/lib/query-client.ts";
import * as mutative from "mutative";

type DeepMutable<T> = {
  -readonly [P in keyof T]: T[P] extends object ? DeepMutable<T[P]> : T[P];
};

type QueryKeyMaker<TKey extends string> = {
  <TVariables>(requiresVariables: true): (variables: TVariables) => readonly [TKey, TVariables];
  (requiresVariables: false): readonly [TKey];
};

export function createQueryKeyMaker<const TKey extends string>(key: TKey): QueryKeyMaker<TKey> {
  return (<TVariables = never>(requiresVariables: boolean) => {
    if (!requiresVariables) {
      return [key] as const;
    }
    return (variables: TVariables) => [key, variables] as const;
  }) as QueryKeyMaker<TKey>;
}

type QueryKey<TVariables> = (variables: TVariables) => readonly [string, TVariables];
type QueryKeyNoVariables = () => readonly [string];

type QueryDataHelpers<TData> = {
  removeQuery: () => void;
  setData: (updater: (draft: mutative.Draft<DeepMutable<TData>>) => void) => void;
};

type QueryDataHelpersWithVariables<TVariables, TData> = {
  removeQuery: (variables: TVariables) => void;
  setData: (
    variables: TVariables,
    updater: (draft: mutative.Draft<DeepMutable<TData>>) => void,
  ) => void;
};

export function createQueryDataHelpers<TData>(
  makeQueryKey: QueryKeyNoVariables,
): QueryDataHelpers<TData>;

export function createQueryDataHelpers<TVariables, TData>(
  makeQueryKey: QueryKey<TVariables>,
): QueryDataHelpersWithVariables<TVariables, TData>;

export function createQueryDataHelpers<TVariables, TData>(
  makeQueryKey: QueryKey<TVariables> | QueryKeyNoVariables,
) {
  return {
    removeQuery: (variables?: TVariables) => {
      if (variables !== undefined) {
        const queryKey = (makeQueryKey as QueryKey<TVariables>)(variables);
        queryClient.removeQueries({ queryKey });
      } else {
        const queryKey = (makeQueryKey as QueryKeyNoVariables)();
        queryClient.removeQueries({ queryKey });
      }
    },

    setData: (
      variablesOrUpdater: TVariables | ((draft: mutative.Draft<DeepMutable<TData>>) => void),
      maybeUpdater?: (draft: mutative.Draft<DeepMutable<TData>>) => void,
    ) => {
      if (maybeUpdater !== undefined) {
        const variables = variablesOrUpdater as TVariables;
        const updater = maybeUpdater;
        const queryKey = (makeQueryKey as QueryKey<TVariables>)(variables);

        queryClient.setQueryData<TData>(queryKey, (oldData) => {
          if (oldData === undefined) return oldData;
          return mutative.create(oldData, (draft) => {
            updater(draft);
          });
        });
      } else {
        const updater = variablesOrUpdater as (draft: mutative.Draft<DeepMutable<TData>>) => void;
        const queryKey = (makeQueryKey as QueryKeyNoVariables)();

        queryClient.setQueryData<TData>(queryKey, (oldData) => {
          if (oldData === undefined) return oldData;
          return mutative.create(oldData, (draft) => {
            updater(draft);
          });
        });
      }
    },
  };
}
