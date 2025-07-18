"use client"

import { useState } from "react";
import { 
  ChatHistory, 
  Button 
} from "@workspace/ui";

export default function ChatPage() {
  const [chatHistory] = useState<any[]>([]);
  
  const handleSubmit = async (submittedInputValue: string) => {
    console.log("Chat submitted:", submittedInputValue);
  };

  const handleCancel = () => {
    console.log("Chat cancelled");
  };

  return (
    <div className="flex h-screen bg-neutral-800 text-neutral-100 font-sans antialiased">
      <aside className="w-1/4 p-4 border-r border-neutral-700 flex flex-col">
        <div className="flex-grow">
          <ChatHistory history={chatHistory} onSelectConversation={(id) => console.log(id)} />
        </div>
        <div className="mt-auto">
          {/* User Profile and Settings */}
        </div>
      </aside>
      <main className="h-full w-full flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Chat Interface</h1>
            <p className="text-neutral-400 mb-6">
              The chat interface has been successfully migrated to Next.js!
            </p>
            <Button onClick={() => handleSubmit("Test message")}>
              Test Chat
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}