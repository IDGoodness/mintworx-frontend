import { useEffect, useState, useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { AuthContext } from '../../lib/useAut'; // import from new file

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    const storedAddress = localStorage.getItem('auth_wal');
    const expired = token ? isTokenExpired(token) : true;
    const mismatch = storedAddress && address && storedAddress !== address;

    if (!token || expired || mismatch) {
      localStorage.clear(); 
      disconnect();
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [address, disconnect]);

  useEffect(() => {
    if (isConnected) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [isConnected, checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshAuth: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
