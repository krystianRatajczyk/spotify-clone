import Link from "next/link";
import React from "react";

interface SquareCardProps {
  name: string;
  color: string;
  url: string;
}

const SquareCard: React.FC<SquareCardProps> = ({ name, color, url }) => {
  return (
    <Link href={{ pathname: `/category/${name}`, query: url }}>
      <div
        className={`p-5 aspect-[1/1] rounded-md relative overflow-hidden cursor-pointer`}
        style={{ backgroundColor: color }}
      >
        <h2 className="font-bold text-2xl">{name}</h2>
        <img
          src={url}
          alt=""
          className="absolute -right-4 -bottom-4 
                    w-[60%] h-[60%] rotate-[25deg] rounded-md object-cover"
        />
      </div>
    </Link>
  );
};

export default SquareCard;
