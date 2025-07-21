import { createContext, useContext } from 'react';

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  refreshAuth: () => void;
}>({
  isAuthenticated: false,
  refreshAuth: () => {},
});

export const useAuthStatus = () => useContext(AuthContext);
