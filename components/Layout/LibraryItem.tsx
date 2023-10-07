import Link from "next/link";
import React from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import PlaylistImage from "../PlaylistImage";
import { Track } from "@prisma/client";

interface LibraryItemProps {
  href: string;
  image: string;
  name: string;
  label: string;
  tracks?: Track[];
  authorId?: string;
}

const LibraryItem: React.FC<LibraryItemProps> = ({
  href,
  image,
  name,
  label,
  tracks,
  authorId,
}) => {
  return (
    <Link
      href={href}
      className="hover:bg-[#1a1a1a] p-2 rounded-lg 
  flex w-full  gap-2 items-center"
    >
      {image != "" ? (
        <img
          src={image}
          className={`w-[50px] h-[50px] ${
            label == "Artist" ? "rounded-full" : "rounded-lg"
          } object-cover`}
          alt=""
        />
      ) : (
        <PlaylistImage tracks={tracks} width={50} iconSize={30} rounded />
      )}

      <div>
        <h2 className="font-semibold text-[17px]">{name}</h2>
        {!authorId ? (
          <p className="text-[#929292] font-semibold text-[15px] ">{label}</p>
        ) : (
          <Link
            href={`/users/${authorId}`}
            className="text-[#929292] font-semibold text-[15px] "
          >
            {label}
          </Link>
        )}
      </div>
    </Link>
  );
};

export default LibraryItem;
