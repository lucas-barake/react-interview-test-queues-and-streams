import { MessagesService } from "@/data-access/messages/service.ts";
import { NetworkMonitor } from "@/lib/services/network-monitor.ts";
import { Layer, Logger, ManagedRuntime } from "effect";

export const LiveLayer = Layer.mergeAll(NetworkMonitor.Default, MessagesService.Default).pipe(
  Layer.provide(Logger.pretty),
);

export type LiveManagedRuntime = ManagedRuntime.ManagedRuntime<
  Layer.Layer.Success<typeof LiveLayer>,
  never
>;
