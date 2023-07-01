import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  hoverClassName?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <button
      className={twMerge(
        `px-4 py-1 rounded-full  font-bold bg-white text-black text-lg`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
