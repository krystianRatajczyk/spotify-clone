import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={twMerge(
        `px-4 py-1 rounded-full text-xl font-bold `,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Button;
