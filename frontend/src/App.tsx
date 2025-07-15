import { useState, useEffect, useRef, useCallback } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Routes, Route, useNavigate } from "react-router-dom";
import type { Message } from "@langchain/langgraph-sdk";
import { useStream } from "@langchain/langgraph-sdk/react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { Button } from "@/components/ui/button";
import LandingPage from "./pages/LandingPage";
import { ChatHistory } from "./components/ChatHistory";

export default function App() {
  const { user } = useDynamicContext();
  const navigate = useNavigate();
  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const [chatHistory, setChatHistory] = useState<any[]>([]);


  useEffect(() => {
    // Fetch chat history on component mount
    const fetchChatHistory = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:8000/api/users/${user.userId}/conversations`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.conversations);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };
    fetchChatHistory();
  }, [user]);

  const scrollAreaRef = useRef<HTMLDivElement>(null!);
  const hasFinalizeEventOccurredRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const thread = useStream<{
    messages: Message[];
    initial_search_query_count: number;
    max_research_loops: number;
    reasoning_model: string;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",
    onUpdateEvent: (event: any) => {
      let processedEvent: ProcessedEvent | null = null;
      if (event.generate_query) {
        processedEvent = {
          title: "Generating Search Queries",
          data: event.generate_query?.search_query?.join(", ") || "",
        };
      } else if (event.web_research) {
        const sources = event.web_research.sources_gathered || [];
        const numSources = sources.length;
        const uniqueLabels = [
          ...new Set(sources.map((s: any) => s.label).filter(Boolean)),
        ];
        const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
        processedEvent = {
          title: "Web Research",
          data: `Gathered ${numSources} sources. Related to: ${
            exampleLabels || "N/A"
          }.`,
        };
      } else if (event.reflection) {
        processedEvent = {
          title: "Reflection",
          data: "Analysing Web Research Results",
        };
      } else if (event.finalize_answer) {
        processedEvent = {
          title: "Finalizing Answer",
          data: "Composing and presenting the final answer.",
        };
        hasFinalizeEventOccurredRef.current = true;
      }
      if (processedEvent) {
        setProcessedEventsTimeline((prevEvents) => [
          ...prevEvents,
          processedEvent!,
        ]);
      }
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [thread.messages]);

  useEffect(() => {
    if (
      hasFinalizeEventOccurredRef.current &&
      !thread.isLoading &&
      thread.messages.length > 0
    ) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.id) {
        setHistoricalActivities((prev) => ({
          ...prev,
          [lastMessage.id!]: [...processedEventsTimeline],
        }));
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline]);

  const handleSubmit = useCallback(
    async (submittedInputValue: string, effort: string, model: string, files: File[]) => {
      if (!submittedInputValue.trim() && files.length === 0) return;
      setProcessedEventsTimeline([]);
      hasFinalizeEventOccurredRef.current = false;

      const formData = new FormData();
      formData.append("message", submittedInputValue);
      formData.append("effort", effort);
      formData.append("model", model);
      files.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const response = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to submit chat");
        }

        const result = await response.json();
        // Handle the response from the backend
        console.log("Backend response:", result);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    },
    [thread]
  );

  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  return (
    <Routes>
        <Route path="/app" element={<LandingPage />} />
        <Route
          path="/app/chat"
          element={
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
                <div className="flex-grow">
                  {thread.messages.length === 0 ? (
                    <WelcomeScreen
                      handleSubmit={handleSubmit}
                      isLoading={thread.isLoading}
                      onCancel={handleCancel}
                    />
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className="text-2xl text-red-400 font-bold">Error</h1>
                        <p className="text-red-400">{JSON.stringify(error)}</p>

                        <Button
                          variant="destructive"
                          onClick={() => window.location.reload()}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <ChatMessagesView
                      messages={thread.messages}
                      isLoading={thread.isLoading}
                      scrollAreaRef={scrollAreaRef}
                      onSubmit={handleSubmit}
                      onCancel={handleCancel}
                      liveActivityEvents={processedEventsTimeline}
                      historicalActivities={historicalActivities}
                    />
                  )}
                </div>
              </main>
            </div>
          }
        />
      </Routes>
  );
}
