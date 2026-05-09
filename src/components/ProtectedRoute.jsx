import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "./ToastProvider.jsx";
import { AUTH_STORAGE_KEY, getAuth, setAuth, setToken } from "../constants/auth.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const showToast = useToast();
  const notifiedRef = useRef(false);

  // Check for token in URL params (for OAuth redirects)
  const urlParams = new URLSearchParams(location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    // Set auth and token from URL
    setAuth(true);
    setToken(tokenFromUrl);
    // Clean up URL
    window.history.replaceState({}, document.title, location.pathname);
  }

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
