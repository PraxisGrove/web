import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';

export interface User {
  address: string;
  isConnected: boolean;
  name?: string;
}

export function useAuth() {
  const { address, isConnected } = useAppKitAccount();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setUser({
        address,
        isConnected,
        name: address.slice(0, 6) + '...' + address.slice(-4),
      });
    } else {
      setUser(null);
    }
  }, [address, isConnected]);

  return {
    user,
    isAuthenticated: isConnected,
    isLoading: false, // AppKit handles loading state internally
  };
}