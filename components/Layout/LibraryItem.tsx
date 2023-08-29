import Link from "next/link";
import React from "react";

interface LibraryItemProps {
  href: string;
  image: string;
  name: string;
  label: string;
}

const LibraryItem: React.FC<LibraryItemProps> = ({
  href,
  image,
  name,
  label,
}) => {
  return (
    <Link
      href={href}
      className="hover:bg-[#1a1a1a] p-2 rounded-lg 
  flex w-full  gap-2 items-center"
    >
      <img
        src={image}
        className={`w-[50px] h-[50px] ${
          label == "Artist" ? "rounded-full" : "rounded-lg"
        } object-cover`}
        alt=""
      />
      <div>
        <h2 className="font-semibold text-[17px]">{name}</h2>
        <p className="text-[#929292] font-semibold text-[15px] ">{label}</p>
      </div>
    </Link>
  );
};

export default LibraryItem;
