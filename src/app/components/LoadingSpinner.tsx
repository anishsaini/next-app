import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "white" | "gray";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  color = "blue",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const colorClasses = {
    blue: "border-gray-300 border-t-blue-600",
    white: "border-gray-400 border-t-white",
    gray: "border-gray-500 border-t-gray-300"
  };
  
  return (
    <div 
      className={`animate-spin rounded-full border-2 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    ></div>
  );
};

export default LoadingSpinner; 