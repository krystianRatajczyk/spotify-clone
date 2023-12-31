import React, { useContext } from "react";
import { AiFillHeart, AiFillPushpin } from "react-icons/ai";
import { UserContext } from "@/context/User/UserContext";
import Link from "next/link";
import LibraryItem from "./LibraryItem";
import PlaylistImage from "../PlaylistImage";

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
        {user.playlists.map((playlist) => (
          <Link
            href={
              playlist.author
                ? `category/${playlist.name}`
                : `/playlist/${playlist.id}`
            }
          >
            <PlaylistImage
              tracks={playlist.tracks}
              width={50}
              iconSize={30}
              rounded
            />
          </Link>
        ))}
        {user.likedPlaylists.map((playlist) => (
          <Link
            href={
              playlist.author === "Spotify" ? `/category/${playlist.name}` : ""
            }
          >
            <img
              src={playlist.image}
              alt=""
              className="w-[50px] h-[50px] rounded-lg
              object-cover"
            />
          </Link>
        ))}
        {user.likedArtists?.map((artist) => (
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
            {user.likedSongs?.length} songs
          </p>
        </div>
      </Link>
      {user.playlists.map((playlist) => (
        <LibraryItem
          key={playlist.id}
          href={`/playlist/${playlist.id}`}
          image={playlist.image!}
          name={playlist.name}
          tracks={playlist.tracks!}
          label={`Playlist • ${playlist.author || playlist.createdUser?.name}`}
        />
      ))}
      {user.likedPlaylists?.map((playlist) => (
        <LibraryItem
          key={playlist.id}
          href={
            playlist.author
              ? `/category/${playlist.name}`
              : `/playlist/${playlist.id}`
          }
          tracks={playlist.tracks || playlist.createdUser?.tracks}
          image={playlist.image}
          name={playlist.name}
          authorId={playlist.createdUser?.id}
          label={`Playlist • ${playlist.author || playlist.createdUser?.name}`}
        />
      ))}
      {user.likedArtists?.map((artist) => (
        <LibraryItem
          key={artist.id}
          href={`/artist/${artist.id}`}
          name={artist.name}
          image={artist.image}
          label="Artist"
        />
      ))}
    </div>
  );
};

export default Library;
