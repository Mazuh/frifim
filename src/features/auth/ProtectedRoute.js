import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ProtectedRoute(props) {
  const isAuthorized = useSelector(s => s.auth.isAuthorized);
  const location = useLocation();

  if (!isAuthorized && location.pathname !== '/login') {
    return <Redirect to="/login" />
  }

  return (
    <Route {...props} />
  );
}
