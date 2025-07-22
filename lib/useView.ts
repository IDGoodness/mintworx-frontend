import { createContext, useContext } from 'react';

export const ViewContext = createContext<{
  view: string;
  setView: (v: string) => void;
}>({
  view: 'connect',
  setView: () => {},
});

export const useView = () => useContext(ViewContext);
