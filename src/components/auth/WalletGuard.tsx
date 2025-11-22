'use client';

import React, { useEffect, useState } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { EnhancedCard, Button } from '@/components/unified';
import { Wallet, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { shouldBypassAuth } from '@/lib/env';

interface WalletGuardProps {
  children: React.ReactNode;
  className?: string;
}

export const WalletGuard: React.FC<WalletGuardProps> = ({ 
  children, 
  className 
}) => {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [isClient, setIsClient] = useState(false);

  // Ensure we only run this on the client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If not client yet, render nothing or a loading state to prevent flash
  if (!isClient) {
    return null;
  }

  // Bypass authentication in local/test environments
  if (shouldBypassAuth) {
    return <>{children}</>;
  }

  // If connected, allow access
  if (isConnected) {
    return <>{children}</>;
  }

  // Access denied state
  return (
    <div className={`flex min-h-[60vh] items-center justify-center p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <EnhancedCard variant="glow" className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-blue-500/10 p-4 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
              <ShieldCheck className="h-12 w-12" />
            </div>
          </div>
          
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Access Restricted
          </h2>
          
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Please connect your wallet to access the AI Roadmap Community. This ensures a secure and verified environment for all members.
          </p>

          <Button 
            onClick={() => open()} 
            className="w-full py-6 text-lg"
            variant="default"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>

          <p className="mt-4 text-xs text-gray-400">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </EnhancedCard>
      </motion.div>
    </div>
  );
};