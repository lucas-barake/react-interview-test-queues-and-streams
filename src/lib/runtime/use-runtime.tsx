import React from "react";
import type { LiveManagedRuntime } from "../services/live-layer.ts";
import { RuntimeContext } from "./runtime-context.tsx";

export const useRuntime = (): LiveManagedRuntime => {
  const runtime = React.useContext(RuntimeContext);
  if (runtime === null) throw new Error("useRuntime must be used within an AppRuntimeProvider");
  return runtime;
};
