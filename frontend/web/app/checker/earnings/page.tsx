"use client";

import { useState, useEffect } from 'react';
import { EarningsTable } from '@/components/checker/EarningsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data - replace with API call
const mockEarnings = {
  payouts: [
    { id: 1, chunk_id: 101, amount_pence: 18, status: 'paid', paid_at: '2023-10-26T10:00:00Z' },
    { id: 2, chunk_id: 102, amount_pence: 18, status: 'paid', paid_at: '2023-10-26T10:00:00Z' },
    { id: 3, chunk_id: 103, amount_pence: 18, status: 'pending' },
    { id: 4, chunk_id: 104, amount_pence: 18, status: 'failed' },
  ],
  summary: {
    total_earned_pence: 36,
    pending_payout_pence: 18,
  }
};

export default function EarningsPage() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/payouts/earnings
    const fetchEarnings = async () => {
      try {
        // const response = await fetch('/api/payouts/earnings');
        // if (!response.ok) {
        //   throw new Error('Failed to fetch earnings');
        // }
        // const data = await response.json();
        // setEarnings(data);
        setEarnings(mockEarnings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <div>Loading earnings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!earnings) return <div>No earnings data found.</div>;

  const formatPence = (pence) => `£${(pence / 100).toFixed(2)}`;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">My Earnings</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatPence(earnings.summary.total_earned_pence)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatPence(earnings.summary.pending_payout_pence)}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Scheduled for tonight at 2 AM.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsTable payouts={earnings.payouts} />
        </CardContent>
      </Card>
    </div>
  );
}