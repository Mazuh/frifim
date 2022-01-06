import React from 'react';
import { useSelector } from 'react-redux';
import { PeriodContext, ProjectContext } from './contexts';
import { firedb } from './firebase-configs';

export default function useBasicRequestData() {
  const { period } = React.useContext(PeriodContext);
  const { project } = React.useContext(ProjectContext);
  const user = useSelector((state) => state.auth.user) || firedb.app.auth().currentUser;

  return { month: period.month, year: period.year, project, user };
}
