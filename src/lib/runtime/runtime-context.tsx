import { ManagedRuntime } from "effect";
import React from "react";
import { LiveManagedRuntime } from "../services/live-layer";

export type RuntimeContext = ManagedRuntime.ManagedRuntime.Context<LiveManagedRuntime>;
export const RuntimeContext = React.createContext<LiveManagedRuntime | null>(null);
