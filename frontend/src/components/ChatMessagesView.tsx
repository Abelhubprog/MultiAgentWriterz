import { Message } from "@langchain/langgraph-sdk";
import { InputForm } from "./InputForm";
import { AgentActivityStream } from "./AgentActivityStream";
import { ProcessedEvent } from "./ActivityTimeline";
import { ScrollArea } from "./ui/scroll-area";

interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onSubmit: (inputValue: string, writeupType: string, model: string, files: File[]) => void;
  onCancel: () => void;
  liveActivityEvents: ProcessedEvent[];
  historicalActivities: Record<string, ProcessedEvent[]>;
}

export const ChatMessagesView: React.FC<ChatMessagesViewProps> = ({
  messages,
  isLoading,
  scrollAreaRef,
  onSubmit,
  onCancel,
  liveActivityEvents,
  historicalActivities,
}) => {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg ${msg.type === 'human' ? 'bg-blue-500 text-white' : 'bg-neutral-700'}`}>
                {typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}
                {msg.type === 'ai' && msg.final && (
                  <a
                    href={`http://localhost:8000/api/download/${msg.conversation_id}/docx`}
                    download
                    className="mt-2 inline-block bg-blue-600 px-4 py-2 rounded-md"
                  >
                    Download .docx
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {isLoading && <AgentActivityStream events={liveActivityEvents} />}
      <div className="p-4">
        <InputForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={onCancel}
          hasHistory={messages.length > 0}
        />
      </div>
    </div>
  );
};
