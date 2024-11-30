import { ChatContainer } from "./components/chat";

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-screen w-full max-w-md">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;
