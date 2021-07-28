import React from 'react';
import range from 'lodash.range';
import capitalize from 'lodash.capitalize';
import { ProjectContext } from '../../app/contexts';
import { monthToString } from '../transactions/dates';

export default function useProjectPeriods() {
  const { project } = React.useContext(ProjectContext);
  if (!project) {
    return [];
  }

  const projectCreationMonth = new Date(project.createdAt).getMonth();
  const currentMonth = new Date().getMonth();
  return range(projectCreationMonth, currentMonth + 1).map((it) => ({ month: it, year: 2021 }));
}

export const periodToString = (period) => capitalize(monthToString(period.month));
