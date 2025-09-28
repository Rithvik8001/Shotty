import React from "react";

interface ShottyLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const ShottyLogo: React.FC<ShottyLogoProps> = ({
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M75 25
           C 75 15, 65 10, 50 10
           C 35 10, 25 15, 25 25
           C 25 35, 35 40, 50 40
           C 65 40, 75 45, 75 55
           C 75 65, 65 70, 50 70
           C 35 70, 25 65, 25 55
           L 35 55
           C 35 60, 40 60, 50 60
           C 60 60, 65 60, 65 55
           C 65 50, 60 50, 50 50
           C 40 50, 35 45, 35 35
           C 35 25, 40 20, 50 20
           C 60 20, 65 25, 65 35
           L 75 25 Z"
        fill="black"
        stroke="black"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ShottyLogo;
