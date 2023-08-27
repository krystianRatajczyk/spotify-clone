import React, { useContext } from "react";
import { AiFillHeart, AiFillPushpin } from "react-icons/ai";
import { UserContext } from "@/context/UserContext";
import Link from "next/link";

interface LibraryProps {
  isLibraryOpened: boolean;
}

const Library: React.FC<LibraryProps> = ({ isLibraryOpened }) => {
  const { state: user } = useContext(UserContext);
  if (!isLibraryOpened)
    return (
      <div className="flex flex-col gap-2">
        <Link
          href={"/likedSongs"}
          className="w-[50px] h-[50px] rounded-xl 
      bg-gradient-to-br from-[#480df3] to-[#b7dbda] 
      flex items-center justify-center"
        >
          <AiFillHeart size={20} color="#fff" />
        </Link>
      </div>
    );

  return (
    // <div className="bg-[#2b2a2a] rounded-lg py-3 px-4 flex flex-col ">
    //   <h2 className="font-bold text-lg">Create your first playlist</h2>
    //   <p className="mt-2">It's simple, we will help you</p>
    //   <Button className="bg-white text-black mt-5 text-[16px] w-[fit-content] hover:scale-[1.04]">
    //     Create playlist
    //   </Button>
    // </div>

    <Link
      href={"/likedSongs"}
      className="hover:bg-[#1a1a1a] bg-transparent rounded-lg 
     flex w-full  items-center gap-2 p-2"
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
          {user.liked.songs.length} songs
        </p>
      </div>
    </Link>
  );
};

export default Library;
