import { ProcessedEvent } from "./ActivityTimeline";

interface AgentActivityStreamProps {
  events: ProcessedEvent[];
}

export const AgentActivityStream: React.FC<AgentActivityStreamProps> = ({ events }) => {
  return (
    <div className="p-4 bg-neutral-700 rounded-lg">
      <h3 className="font-bold mb-2">Agent Activity</h3>
      <div className="space-y-2">
        {events.map((event, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span className="font-bold text-blue-400">{event.title}:</span>
            <span>{event.data}</span>
          </div>
        ))}
      </div>
    </div>
  );
};