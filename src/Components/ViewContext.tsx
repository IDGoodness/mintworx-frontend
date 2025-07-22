import { useState, type ReactNode } from 'react';
import { ViewContext } from '../../lib/useView';

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState('connect');

  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};
