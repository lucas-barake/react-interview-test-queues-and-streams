import { ManagedRuntime } from "effect";
import React from "react";
import type { LiveManagedRuntime } from "./services/live-layer.ts";

export type RuntimeContext = ManagedRuntime.ManagedRuntime.Context<LiveManagedRuntime>;
const RuntimeContext = React.createContext<LiveManagedRuntime | null>(null);

export const RuntimeProvider: React.FC<{
  children: React.ReactNode;
  runtime: LiveManagedRuntime;
}> = ({ children, runtime }) => {
  return <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>;
};

export const useRuntime = (): LiveManagedRuntime => {
  const context = React.useContext(RuntimeContext);
  if (context === null) throw new Error("useRuntime must be used within an AppRuntimeProvider");
  return context;
};
