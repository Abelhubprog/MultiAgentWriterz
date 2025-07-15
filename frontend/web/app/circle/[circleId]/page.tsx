"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSupabaseClient } from '@/lib/supabase'; // Assuming you have a supabase client helper

export default function CirclePage() {
  const params = useParams();
  const { circleId } = params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const supabase = getSupabaseClient();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!circleId || !supabase) return;

    const channel = supabase.channel(`study_circle_${circleId}`);

    const handleNewMessage = (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload.payload]);
    };

    channel
      .on('broadcast', { event: 'new_message' }, handleNewMessage)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circleId, supabase]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !supabase) return;

    // In a real app, this would call the backend API endpoint
    // For now, we'll just broadcast directly for demonstration
    const channel = supabase.channel(`study_circle_${circleId}`);
    await channel.send({
      type: 'broadcast',
      event: 'new_message',
      payload: {
        user_id: 'current_user_id', // Replace with actual user ID
        message: newMessage,
        timestamp: new Date().toISOString(),
      },
    });

    setNewMessage('');
  };

  return (
    <div className="container mx-auto p-4 md:p-8 h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Study Circle: {circleId}</h1>
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Live Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className="flex flex-col">
                  <span className="font-bold text-sm">{msg.user_id}</span>
                  <p className="text-md p-2 bg-gray-100 rounded-md">{msg.message}</p>
                  <span className="text-xs text-gray-400 self-end">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}