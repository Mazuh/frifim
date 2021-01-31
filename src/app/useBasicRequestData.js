import React from "react";
import { useSelector } from "react-redux";
import { MonthContext, ProjectContext } from "./contexts";

export default function useBasicRequestData() {
  const { month } = React.useContext(MonthContext);
  const { project } = React.useContext(ProjectContext);
  const user = useSelector(state => state.auth.user);

  return { month, project, user };
}
