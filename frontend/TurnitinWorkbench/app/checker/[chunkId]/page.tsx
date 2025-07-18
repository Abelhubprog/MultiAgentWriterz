"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { UploadZone } from '@/components/checker/UploadZone';
import { FlagTextarea } from '@/components/checker/FlagTextarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

// Mock data - replace with API call
const mockChunkDetail = {
  id: 3,
  lotId: 'L002',
  chunkIndex: 1,
  words: 380,
  bounty: 18,
  status: 'checking',
  content: `
# The Future of Renewable Energy

The transition to renewable energy sources is one of the most critical challenges of our time. This section explores the future of solar power, focusing on advancements in photovoltaic technology.

## Perovskite Solar Cells

A promising area of research is perovskite solar cells. These cells have shown remarkable efficiency gains in recent years, with some lab-scale devices exceeding 25% efficiency. Their low manufacturing cost and flexibility make them a strong candidate for future solar applications. However, long-term stability remains a significant hurdle to commercialization.

## Bifacial Solar Panels

Bifacial solar panels can capture sunlight from both sides, increasing energy yield by up to 30% compared to their monofacial counterparts. They are particularly effective in large-scale solar farms where light reflects off the ground (albedo). As manufacturing processes improve, the cost premium for bifacial panels is decreasing, making them an increasingly popular choice.
  `
};

export default function CheckerWorkbench() {
  const params = useParams();
  const { chunkId } = params;
  const [chunk, setChunk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [simPdf, setSimPdf] = useState(null);
  const [aiPdf, setAiPdf] = useState(null);
  const [flags, setFlags] = useState('');

  useEffect(() => {
    if (chunkId) {
      // TODO: Replace with actual API call to get chunk details
      setChunk(mockChunkDetail);
      setLoading(false);
    }
  }, [chunkId]);

  const handleSubmit = async () => {
    if (!simPdf || !aiPdf || !flags) {
      alert("Please upload both PDF reports and add flagged text.");
      return;
    }
    
    const formData = new FormData();
    formData.append('sim_pdf', simPdf);
    formData.append('ai_pdf', aiPdf);
    // The backend expects a list for 'flagged'
    const flaggedList = flags.split('\n').filter(line => line.trim() !== '');
    flaggedList.forEach(flag => formData.append('flagged', flag));

    try {
      const response = await fetch(`/api/checker/submit/${chunkId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      const result = await response.json();
      alert(`Submission successful! New status: ${result.chunk_status}`);
      // TODO: Redirect or update UI
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div>Loading workbench...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!chunk) return <div>Chunk not found.</div>;

  const isSubmitDisabled = !simPdf || !aiPdf || !flags;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workbench: Lot {chunk.lotId} - Chunk {chunk.chunkIndex}</h1>
        <Badge variant="secondary">{chunk.status.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Chunk Content</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <ReactMarkdown>{chunk.content}</ReactMarkdown>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone onSimPdfUpload={setSimPdf} onAiPdfUpload={setAiPdf} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flagged Text</CardTitle>
            </CardHeader>
            <CardContent>
              <FlagTextarea value={flags} onChange={setFlags} />
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={isSubmitDisabled} className="w-full">
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  );
}