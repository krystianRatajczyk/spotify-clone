import React from "react";

interface TriangleProps {
  previousRank: number;
  currentRank: number;
}

const Triangle: React.FC<TriangleProps> = ({ previousRank, currentRank }) => {
  return (
    <div
      className={` w-0 h-0 border-x-[6px] border-x-transparent  
      ${
        previousRank > currentRank
          ? `border-t-[7px] border-t-[#f00]`
          : "border-b-[7px] border-b-[#0aa712]"
      }`}
    />
  );
};

export default Triangle;
