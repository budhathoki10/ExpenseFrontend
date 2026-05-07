import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AUTH_STORAGE_KEY, getAuth } from "../constants/auth.js";

const Navbar = ({ overlay }) => {
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
    <nav
      className={
        overlay
          ? "w-full bg-transparent text-white z-30 transition-all duration-300"
          : "sticky top-0 left-0 w-full bg-white/95 backdrop-blur shadow-md text-[#222] z-30 transition-all duration-300"
      }
    >
      <div className="max-w-7xl mx-auto px-10 relative">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center">
            <Link
              to="/"
              className={
                overlay
                  ? "text-[28px] font-serif tracking-wide relative z-10 font-bold text-white drop-shadow"
                  : "text-[28px] font-serif tracking-wide relative z-10 font-bold text-[#222]"
              }
            >
              Spend Wise
            </Link>
          </div>

          <div className={
            overlay
              ? "hidden md:flex space-x-14 text-[15px] text-[#f5f1f1] drop-shadow"
              : "hidden md:flex space-x-14 text-[15px] text-[#666]"
          }>
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "contact", label: "Contact" },
            ].map((link) => {
              return <NavLinkAnchor key={link.id} id={link.id} label={link.label} />;
            })}
          </div>

          {!hideAuthButtons && (
            <div className="flex items-center space-x-5">
              <Link
                to="/login"
                className={
                  overlay
                    ? "auth-button auth-button--dark px-6 py-2.5 rounded-[12px] text-[16px] bg-white/80 text-[#111] shadow hover:bg-white hover:text-[#111] border border-[#eee] transition"
                    : "auth-button auth-button--dark px-6 py-2.5 rounded-[12px] text-[16px] bg-[#111] text-white shadow hover:bg-[#333] transition"
                }
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={
                  overlay
                    ? "auth-button auth-button--light px-6 py-2.5 rounded-[12px] font-medium text-[16px] bg-white/90 text-[#111] shadow hover:bg-white border border-[#eee] transition"
                    : "auth-button auth-button--light px-6 py-2.5 rounded-[12px] font-medium text-[16px] bg-white text-[#111] shadow hover:bg-[#f5f5f5] border border-[#eee] transition"
                }
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

function NavLinkAnchor({ id, label }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    const goHomeAndScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      // wait for Home to mount
      setTimeout(goHomeAndScroll, 120);
    } else {
      goHomeAndScroll();
    }
  };

  return (
    <a href={`#${id}`} onClick={handleClick} className="relative transition-colors hover:text-white">
      {label}
    </a>
  );
}

export default Navbar;
