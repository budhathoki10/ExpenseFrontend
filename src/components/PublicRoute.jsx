import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../constants/auth.js";

export default function PublicRoute({ children }) {
  const isAuthenticated = getAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
