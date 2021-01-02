import React from "react";
import { useSelector } from "react-redux";
import { MonthContext } from "./contexts";

export default function useBasicRequestData() {
  const { month } = React.useContext(MonthContext);
  const user = useSelector(state => state.auth.user);

  return { month, user };
}
