import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AUTH_STORAGE_KEY, getAuth } from "../constants/auth.js";

const Navbar = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAuth());

  useEffect(() => {
    setIsAuthenticated(getAuth());
  }, [location.pathname]);

  useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(getAuth());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const hideAuthButtons =
    isAuthenticated || location.pathname.startsWith("/dashboard");

  return (
    <nav className="fixed top-0 left-0 right-0 bg-transparent text-white z-20">
      <div className="max-w-7xl mx-auto px-10 relative">
        <div className="flex items-center justify-between h-28">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-[28px] font-serif tracking-wide relative z-10 font-bold"
            >
              Spend Wise
            </Link>
          </div>

          <div className="hidden md:flex space-x-14 text-[15px] text-[#a0a0a0]">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
            ].map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative transition-colors ${
                    isActive ? "text-white" : "hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute left-0 -bottom-2 h-[2px] w-full bg-[#5d8d5a] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {!hideAuthButtons && (
            <div className="flex items-center space-x-5">
              <Link
                to="/login"
                className="auth-button auth-button--dark px-6 py-2.5 rounded-[12px] text-[16px]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="auth-button auth-button--light px-6 py-2.5 rounded-[12px] font-medium text-[16px]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
