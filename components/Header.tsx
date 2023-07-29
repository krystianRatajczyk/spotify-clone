import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        `w-full z-[100] mb-2 bg-darkGray text-[#757575]`,
        className
      )}
    >
      <div className="flex justify-between pl-8 p-1 pr-2">
        <div className="flex gap-4">
          <span>#</span>
          <h2>Title</h2>
        </div>
        <AiOutlineClockCircle size={20} color={"#757575"} />
      </div>
      <div className="w-full h-[1px] bg-[#2a2a2a]" />
    </div>
  );
};

export default Header;
