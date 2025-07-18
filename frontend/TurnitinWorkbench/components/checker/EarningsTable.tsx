import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const EarningsTable = ({ payouts }) => {
  const formatPence = (pence) => `£${(pence / 100).toFixed(2)}`;
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chunk ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payouts.map((payout) => (
          <TableRow key={payout.id}>
            <TableCell>{payout.chunk_id}</TableCell>
            <TableCell>{formatPence(payout.amount_pence)}</TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(payout.status)}>
                {payout.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(payout.paid_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};