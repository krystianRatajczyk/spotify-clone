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
  hoverClassName,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      className={
        !isHover
          ? twMerge(`px-4 py-1 rounded-full text-xl font-bold`, className)
          : twMerge(
              `px-4 py-1 rounded-full text-xl font-bold transition duration-300`,
              className,
              hoverClassName
            )
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
