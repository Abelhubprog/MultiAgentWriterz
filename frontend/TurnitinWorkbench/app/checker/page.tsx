"use client";

import { useState, useEffect } from 'react';
import { ChunkCard } from '@/components/checker/ChunkCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with API call
const mockChunks = [
  { id: 1, lotId: 'L001', chunkIndex: 1, words: 345, bounty: 18, status: 'open' },
  { id: 2, lotId: 'L001', chunkIndex: 2, words: 321, bounty: 18, status: 'open' },
  { id: 3, lotId: 'L002', chunkIndex: 1, words: 380, bounty: 18, status: 'checking', checkerId: 1 },
  { id: 4, lotId: 'L003', chunkIndex: 1, words: 355, bounty: 18, status: 'needs_edit', checkerId: 1 },
];

export default function CheckerDashboard() {
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/checker/chunks
    const fetchChunks = async () => {
      try {
        // const response = await fetch('/api/checker/chunks?status=open');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch chunks');
        // }
        // const data = await response.json();
        // setChunks(data);
        setChunks(mockChunks); // Using mock data for now
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChunks();
  }, []);

  if (loading) return <div>Loading chunks...</div>;
  if (error) return <div>Error: {error}</div>;

  const openChunks = chunks.filter(c => c.status === 'open');
  const myChunks = chunks.filter(c => c.checkerId === 1); // Assuming current checkerId is 1

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Checker Dashboard</h1>
        <Badge variant="outline">3 Active Claims</Badge>
      </div>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available Chunks</TabsTrigger>
          <TabsTrigger value="my-claims">My Claims</TabsTrigger>
        </TabsList>
        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {openChunks.map(chunk => (
              <ChunkCard key={chunk.id} chunk={chunk} />
            ))}
          </div>
           {openChunks.length === 0 && <p className="text-center mt-8 text-gray-500">No available chunks at the moment.</p>}
        </TabsContent>
        <TabsContent value="my-claims">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {myChunks.map(chunk => (
              <ChunkCard key={chunk.id} chunk={chunk} />
            ))}
          </div>
          {myChunks.length === 0 && <p className="text-center mt-8 text-gray-500">You have no active claims.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}