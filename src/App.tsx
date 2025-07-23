// App.tsx
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {  WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './wagmiConfig';
import { useAuthStatus } from '../lib/useAut.ts';
import { AuthProvider } from './Components/AuthProvider';



import { Suspense, lazy, useEffect } from 'react';
import { ViewProvider } from './Components/ViewContext';
import { useView } from '../lib/useView'


const ConnectView = lazy(() => import('../Connect'));
const MintDashboard = lazy(() => import('../MintBotDashboard'));

function AppContent() {
  const { view, setView } = useView();
  const { isAuthenticated } = useAuthStatus();

  useEffect(() => {
    setView(isAuthenticated ? 'dashboard' : 'connect');
  }, [isAuthenticated, setView]);

return (
  <Suspense
    fallback={
      <div className="fixed inset-0 bg-[#0a0a3c] flex items-center justify-center z-50">
        <h1 className="text-white text-4xl font-bold tracking-wide">MintxWorx</h1>
      </div>
    }
  >
    {view === 'connect' ? <ConnectView /> : <MintDashboard />}
  </Suspense>
);

}


const config = wagmiConfig;
const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <AuthProvider>
            <ViewProvider>
              <AppContent />
            </ViewProvider>
          </AuthProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

