import React from "react";
import { useSelector } from "react-redux";
import { MonthContext, ProjectContext } from "./contexts";
import { firedb } from "./firebase-configs";

export default function useBasicRequestData() {
  const { month } = React.useContext(MonthContext);
  const year = (new Date()).getFullYear();
  const { project } = React.useContext(ProjectContext);
  const user = useSelector(state => state.auth.user) || firedb.app.auth().currentUser;

  return { month, project, user, year };
}
