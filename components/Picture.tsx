import React from "react";
import { twMerge } from "tailwind-merge";

interface PictureProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
}

const Picture = React.forwardRef<HTMLDivElement, PictureProps>(
  ({ children, className, onClick }, ref) => {
    return (
      <div
        className={twMerge(
          `
            w-[170px] h-[170px] 
            drop-shadow-2xl 
            rounded-full 
            bg-mediumGray 
            flex 
            justify-center 
            items-center
            overflow-hidden`,
          className
        )}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default Picture;
