interface ChatHistoryProps {
  history: any[];
  onSelectConversation: (conversationId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ history, onSelectConversation }) => {
  return (
    <div className="p-4 bg-neutral-700 rounded-lg">
      <h3 className="font-bold mb-2">Chat History</h3>
      <div className="space-y-2">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="p-2 bg-neutral-600 rounded-md cursor-pointer hover:bg-neutral-500"
            onClick={() => onSelectConversation(item.id)}
          >
            <p className="font-bold">{item.title}</p>
            <p className="text-xs text-neutral-400">{new Date(item.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};