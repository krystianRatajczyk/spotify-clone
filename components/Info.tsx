import React from "react";

interface InfoProps {
  leftLabel: string;
  rightLabel?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const Info = ({ leftLabel, rightLabel, isFirst, isLast }: InfoProps) => {
  return (
    <div
      className={`${
        isFirst ? "mt-10" : "mt-2"
      } flex justify-between  items-center ${
        !isLast && "border-b"
      } border-gray-500 pb-2`}
    >
      <span className="text-lg font-semibold">{leftLabel}</span>
      <h2>{rightLabel}</h2>
    </div>
  );
};

export default Info;
