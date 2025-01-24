import React from "react";
import { LiveManagedRuntime } from "../services/live-layer";
import { RuntimeContext } from "./runtime-context";

export const RuntimeProvider: React.FC<{
  children: React.ReactNode;
  runtime: LiveManagedRuntime;
}> = ({ children, runtime }) => {
  const mountRef = React.useRef(false);

  React.useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true;
      return;
    }

    return () => {
      runtime.dispose();
    };
  }, [runtime]);

  return <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>;
};
