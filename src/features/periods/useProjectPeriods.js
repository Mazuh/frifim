import React from 'react';
import range from 'lodash.range';
import { ProjectContext } from '../../app/contexts';
import { makePeriod } from './period-lib';

export default function useProjectPeriods(maxMonths = 12) {
  const { project } = React.useContext(ProjectContext);
  if (!project) {
    return [];
  }

  const currentDate = new Date();
  const projectCreationDate = new Date(project.createdAt);
  const projectPeriods = range(0, maxMonths).reduce((periods, it) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
    date.setMonth(date.getMonth() - it);
    return date.valueOf() > projectCreationDate.valueOf()
      ? [...periods, makePeriod(date)]
      : periods;
  }, []);

  return projectPeriods;
}
