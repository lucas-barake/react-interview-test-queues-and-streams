import { ChatContainer } from "./components/chat";

function App() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="h-[600px] w-full max-w-md">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;
