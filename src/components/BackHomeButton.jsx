import React from "react";
import { Link } from "react-router-dom";

export default function BackHomeButton() {
  return (
    <Link to="/" aria-label="Back to home" className="home-arrow-button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="home-arrow-icon"
      >
        <circle cx="12" cy="12" r="11" opacity="0.08" />
        <path d="M15 7l-5 5 5 5" />
      </svg>
    </Link>
  );
}
