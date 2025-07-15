import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const ChunkCard = ({ chunk }) => {
  const { id, lotId, chunkIndex, words, bounty, status } = chunk;

  const handleClaim = async () => {
    // TODO: Implement API call to POST /api/checker/claim/{id}
    alert(`Claiming chunk ${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lot {lotId} - Chunk {chunkIndex}</CardTitle>
        <div className="flex items-center space-x-2 pt-2">
          <Badge variant="outline">{words} words</Badge>
          <Badge variant="secondary">Bounty: £{(bounty / 100).toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          This chunk is ready for review. Please claim it to begin the Turnitin checking process.
        </p>
      </CardContent>
      <CardFooter>
        {status === 'open' && (
          <Button onClick={handleClaim} className="w-full">Claim Chunk</Button>
        )}
        {status !== 'open' && (
          <Link href={`/checker/${id}`} passHref className="w-full">
            <Button className="w-full">View Workbench</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};