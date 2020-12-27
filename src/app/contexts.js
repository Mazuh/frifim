import React from 'react';

export const ViewportContext = React.createContext();

export default function GlobalContextProvider({ children }) {
  const isMobile = window.innerWidth <= 575;

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
};
