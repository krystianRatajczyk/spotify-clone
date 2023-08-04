import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface CircularButtonProps {
  className?: string;
  children: React.ReactNode;
  hoverClassName?: string;
  isHover?: (state: boolean) => void;
  onClick?: (e:React.MouseEvent) => void;
}

const CircularButton: React.FC<CircularButtonProps> = ({
  className,
  children,
  hoverClassName,
  isHover: getIsHover,
  onClick,
}) => {
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    getIsHover && getIsHover(isHover);
  }, [isHover]);

  return (
    <div
      onClick={onClick}
      className={
        !isHover
          ? twMerge("rounded-full", className)
          : twMerge(
              "rounded-full transition duration-300",
              hoverClassName,
              className
            )
      }
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </div>
  );
};

export default CircularButton;
