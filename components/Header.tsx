import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  className?: string;
  withDate?: boolean;
}

const Header: React.FC<HeaderProps> = ({ className, withDate }) => {
  return (
    <div
      className={twMerge(
        `w-full z-[100] mb-2 bg-transparent text-[#757575]`,
        className
      )}
    >
      <div className={`flex pl-8 p-1 pr-2`}>
        <div className={`flex gap-4 flex-[0.7]`}>
          <span>#</span>
          <h2>Title</h2>
        </div>
        <div
          className={`flex-[0.3] flex ${
            withDate ? "justify-between" : "justify-end"
          }`}
        >
          {withDate && <div>Release Date</div>}
          <AiOutlineClockCircle
            size={20}
            color={"#757575"}
          />
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#2a2a2a]" />
    </div>
  );
};

export default Header;
