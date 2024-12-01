import { Layer, Logger, ManagedRuntime } from "effect";
import { NetworkMonitor } from "@/lib/services/network-monitor.ts";

export const AppRuntime = ManagedRuntime.make(
  Layer.mergeAll(Logger.pretty, NetworkMonitor.Default),
);
