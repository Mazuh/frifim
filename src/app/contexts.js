import React from 'react';

export const ViewportContext = React.createContext();

export const MonthContext = React.createContext();

export const ProjectContext = React.createContext();

export default function GlobalContextProvider({ children }) {
  const isMobile = window.innerWidth <= 575;

  const [month, setMonth] = React.useState((new Date()).getMonth());

  const [project, setProject] = React.useState();

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      <MonthContext.Provider value={{ month, setMonth }}>
        <ProjectContext.Provider value={{ project, setProject }}>
          {children}
        </ProjectContext.Provider>
      </MonthContext.Provider>
    </ViewportContext.Provider>
  );
};
