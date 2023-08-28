import React, { useContext } from "react";
import { AiFillHeart, AiFillPushpin } from "react-icons/ai";
import { UserContext } from "@/context/User/UserContext";
import Link from "next/link";

interface LibraryProps {
  isLibraryOpened: boolean;
}

const Library: React.FC<LibraryProps> = ({ isLibraryOpened }) => {
  const { state: user } = useContext(UserContext);
  if (!isLibraryOpened)
    return (
      <div className="flex-1 flex flex-col gap-6 overflow-y-scroll no-scrollbar">
        <Link
          href={"/likedSongs"}
          className="w-[50px] h-[50px] rounded-xl 
      bg-gradient-to-br from-[#480df3] to-[#b7dbda] 
      flex items-center justify-center"
        >
          <AiFillHeart size={20} color="#fff" />
        </Link>
        {user.liked.artists?.map((artist) => (
          <Link href={`/artist/${artist.id}`}>
            <img
              src={artist.image}
              alt=""
              className="w-[50px] h-[50px] rounded-full
          object-cover"
            />
          </Link>
        ))}
      </div>
    );

  return (
    <div className="flex-1 flex flex-col gap-2 overflow-auto">
      <Link
        href={"/likedSongs"}
        className="hover:bg-[#1a1a1a] bg-transparent rounded-lg 
   flex w-full  items-center gap-2 p-2 "
      >
        <div
          className="w-[50px] h-[50px] rounded-xl 
    bg-gradient-to-br from-[#480df3] to-[#b7dbda] 
    flex items-center justify-center"
        >
          <AiFillHeart size={20} color="#fff" />
        </div>
        <div>
          <h2 className="font-bold ">Liked Songs</h2>
          <p
            className="text-[#929292] font-semibold flex gap-1
      items-center"
          >
            <AiFillPushpin color="#1ed760" /> Playlist <span> • </span>{" "}
            {user.liked.songs?.length} songs
          </p>
        </div>
      </Link>
      {user.liked.artists?.map((artist) => (
        <Link
          key={artist.id}
          href={`/artist/${artist.id}`}
          className="hover:bg-[#1a1a1a] p-2 rounded-lg 
        flex w-full  gap-2 items-center"
        >
          <img
            src={artist.image}
            alt=""
            className="w-[50px] h-[50px] rounded-full
          object-cover"
          />
          <div>
            <h2 className="font-semibold text-[17px]">{artist.name}</h2>
            <p className="text-[#929292] font-semibold text-[15px] ">Artist</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Library;
