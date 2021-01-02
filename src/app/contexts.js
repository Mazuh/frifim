import React from 'react';

export const ViewportContext = React.createContext();

export const MonthContext = React.createContext();

export default function GlobalContextProvider({ children }) {
  const isMobile = window.innerWidth <= 575;

  const [month, setMonth] = React.useState((new Date()).getMonth());

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      <MonthContext.Provider value={{ month, setMonth }}>
        {children}
      </MonthContext.Provider>
    </ViewportContext.Provider>
  );
};
