"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useWallet } from '@/hooks/useWallet';

export const WalletButton = ({ onPaymentSuccess }) => {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { isConnected, address, connect, disconnect, isConnecting, error, availableProviders } = useWallet();

  const handlePayment = async (wordCount) => {
    if (!isConnected) {
      try {
        await connect();
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        return;
      }
    }

    console.log("Processing payment...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (wordCount > 1000) {
      setShowUpgradeDialog(true);
    } else {
      onPaymentSuccess({ tier: 'standard' });
    }
  };

  const handleUpgradeChoice = (choice) => {
    setShowUpgradeDialog(false);
    onPaymentSuccess({ tier: choice });
  };

  return (
    <>
      <Button 
        onClick={() => handlePayment(1200)} 
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : isConnected ? `Pay with ${address?.slice(0,6)}...${address?.slice(-4)}` : 'Connect Wallet & Pay'}
      </Button>
      
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {availableProviders.length > 1 && (
        <p className="text-gray-500 text-xs mt-1">
          {availableProviders.length} wallet{availableProviders.length > 1 ? 's' : ''} detected
        </p>
      )}
      
      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Higher-Tier Compute?</AlertDialogTitle>
            <AlertDialogDescription>
              Your document is over 1000 words. For a higher quality result,
              we recommend upgrading to our Pro/Opus model tier. This will
              incur an additional cost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleUpgradeChoice('standard')}>
              Continue with Standard
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUpgradeChoice('pro')}>
              Upgrade to Pro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};