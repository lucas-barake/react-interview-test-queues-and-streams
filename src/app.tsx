import { LiveLayer } from "@/lib/services/live-layer.ts";
import { RuntimeProvider } from "@/lib/use-runtime.tsx";
import { ManagedRuntime } from "effect";
import React from "react";
import { ChatContainer } from "./components/chat";

function App() {
  const runtime = React.useMemo(() => ManagedRuntime.make(LiveLayer), []);

  return (
    <RuntimeProvider runtime={runtime}>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-screen w-full max-w-md">
          <ChatContainer />
        </div>
      </div>
    </RuntimeProvider>
  );
}

export default App;
