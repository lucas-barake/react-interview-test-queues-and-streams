import { Layer, Logger, ManagedRuntime } from "effect";
import { NetworkMonitor } from "@/lib/services/network-monitor.ts";

export const LiveLayer = Layer.mergeAll(Logger.pretty, NetworkMonitor.Default);

export type LiveManagedRuntime = ManagedRuntime.ManagedRuntime<
  Layer.Layer.Success<typeof LiveLayer>,
  never
>;
