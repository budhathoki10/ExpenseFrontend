import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "./ToastProvider.jsx";
import { AUTH_STORAGE_KEY, getAuth } from "../constants/auth.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const showToast = useToast();
  const notifiedRef = useRef(false);

  const isAuthenticated = getAuth();

  useEffect(() => {
    if (!isAuthenticated && !notifiedRef.current) {
      notifiedRef.current = true;
      showToast("You need to log in first.", "error");
    }
  }, [isAuthenticated, showToast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
