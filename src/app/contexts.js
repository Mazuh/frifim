import React from 'react';
import { makePeriod } from '../features/periods/period-lib';

export const ViewportContext = React.createContext();

export const PeriodContext = React.createContext();

export const ProjectContext = React.createContext();

export const LastUpdateContext = React.createContext();

export default function GlobalContextProvider({ children }) {
  const isMobile = window.innerWidth <= 575;

  const [period, setPeriod] = React.useState(makePeriod());

  const [project, setProject] = React.useState(null);

  const [lastUpdate, setLastUpdate] = React.useState(new Date());

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      <PeriodContext.Provider value={{ period, setPeriod }}>
        <ProjectContext.Provider value={{ project, setProject }}>
          <LastUpdateContext.Provider value={{ lastUpdate, setLastUpdate }}>
            {children}
          </LastUpdateContext.Provider>
        </ProjectContext.Provider>
      </PeriodContext.Provider>
    </ViewportContext.Provider>
  );
}
