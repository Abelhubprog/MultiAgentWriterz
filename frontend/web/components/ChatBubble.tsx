"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export const ChatBubble = ({ message }) => {
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEvidence = async (citeKey) => {
    if (evidence) return; // Don't refetch if already loaded
    setLoading(true);
    try {
      const response = await fetch(`/api/evidence?citeKey=${citeKey}`);
      const data = await response.json();
      setEvidence(data);
    } catch (error) {
      console.error("Failed to fetch evidence:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    const parts = message.content.split(/(\[\^[^\]]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/\[\^([^\]]+)\]/);
      if (match) {
        const citeKey = match[1];
        return (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <span 
                className="text-blue-500 cursor-pointer"
                onMouseEnter={() => fetchEvidence(citeKey)}
              >
                {part}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              {loading && <div>Loading evidence...</div>}
              {evidence && (
                <div>
                  <h4 className="font-bold">{evidence.title}</h4>
                  <p className="text-sm">{evidence.paragraph}</p>
                  <a href={evidence.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500">
                    Source
                  </a>
                </div>
              )}
            </HoverCardContent>
          </HoverCard>
        );
      }
      return part;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {renderContent()}
    </div>
  );
};