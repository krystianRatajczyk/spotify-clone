import React, { useContext, useRef } from "react";
import CircularButton from "./Layout/CircularButton";
import { RxCross2 } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import useHover from "@/hooks/useHover";
import PlayPause from "./PlayPause";
import { GoPerson } from "react-icons/go";
import Picture from "./Picture";
import { format } from "date-fns";
import Link from "next/link";
import useAddRecentSearch from "@/hooks/useAddRecentSearch";
import useRemoveRecentSearch from "@/hooks/useRemoveRecentSearch";
import { AnimatePresence } from "framer-motion";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { Artist, Track } from "@prisma/client";
import { MusicContext } from "@/context/MusicContext";
import PlaylistImage from "./PlaylistImage";

interface VerticalCardProps {
  id: string;
  type: "profile" | "playlist" | "artist" | "track" | "category";
  typeId: string;
  name: string;
  image: string;
  imageClassName: string;
  modal: "playpause" | "cross" | "both" | "none";
  releaseDate?: string;
  isRecentSearch?: boolean;
  authorId?: string;
  username?: string;
  tracks?: Track[];
}

const VerticalCard: React.FC<VerticalCardProps> = ({
  id,
  typeId,
  type,
  image,
  name,
  modal,
  imageClassName,
  releaseDate,
  isRecentSearch,
  authorId,
  username,
  tracks,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);
  const [addRecentSearch] = useAddRecentSearch();
  const [removeRecentSearch] = useRemoveRecentSearch();

  const { state: music, dispatch: MusicDispatch } = useContext(MusicContext);

  const links = {
    artist: "artist",
    track: "song",
    profile: "users",
    playlist: username == "Spotify" ? "category" : "playlist",
    category: "category",
  };

  const playSongs = (index: number) => {
    const convertedTracks = tracks?.map((track: Track) => {
      return {
        id: track.id,
        image: track.image,
        name: track.name,
        duration: track.duration,
        artists: track.artists.map((a: Artist) => ({ id: a.id, name: a.name })),
      };
    });
    if (music.playlistId !== id || index !== music.currentIndex) {
      MusicDispatch({
        type: "SET_SONGS",
        payload: {
          index: index,
          tracks: convertedTracks || [],
          playlistId: id,
          playlistName: name,
          href: `/${links[type]}/${typeId}`,
        },
      });
    } else {
      MusicDispatch({
        type: "PLAY_PAUSE",
      });
    }
  };

  return (
    <Link href={{ pathname: `/${links[type]}/${typeId}` }}>
      <div
        className={`bg-[#191919] p-4 rounded-md relative 
    hover:bg-[#282828] transition duration-300 ${
      (modal == "playpause" || (type == "profile" && !isRecentSearch)) &&
      "w-[210px]"
    }`}
        onClick={async () => {
          if (!isRecentSearch && addRecentSearch) {
            addRecentSearch({
              name,
              image,
              username,
              authorId,
              type: links[type],
              typeId,
            });
          }
        }}
        ref={divRef}
      >
        {(modal == "cross" || modal == "both") && (
          <CircularButton
            className="absolute top-2 right-2 bg-[#121212] p-1 z-[100]"
            hoverClassName="scale-[1.1]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeRecentSearch(id);
            }}
          >
            <RxCross2 size={20} />
          </CircularButton>
        )}
        <div className="relative">
          {image == "" && type !== "playlist" ? (
            <Picture className="w-full h-full aspect-[1/1]">
              <GoPerson size={60} color="#B3B3B3" />
            </Picture>
          ) : type === "playlist" && image === "" ? (
            tracks ? (
              <div>
                <PlaylistImage tracks={tracks} width={-1} rounded />
              </div>
            ) : (
              <div
                className="w-full aspect-[1/1] rounded-lg flex items-center
        justify-center bg-[#282828] shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
              >
                <BsMusicNoteBeamed size={60} color="#b3b3b3" />
              </div>
            )
          ) : (
            <img
              src={image}
              alt=""
              className={twMerge(
                `${
                  type == "profile" || type === "artist"
                    ? "rounded-full aspect-[1/1]"
                    : "rounded-md aspect-[1/1]"
                } object-cover drop-shadow-md`,
                imageClassName
              )}
            />
          )}
          <AnimatePresence>
            {isHover && (modal == "playpause" || modal == "both") && (
              <PlayPause
                isPlaying={music.playlistId === id}
                onClick={(e: any) => {
                  e.preventDefault();
                  playSongs(0);
                }}
                className="absolute right-2 bottom-2"
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex mt-3 gap-1 flex-col">
          <h2 className="font-bold text-lg truncate">{name}</h2>
          <p className="font-semibold text-gray-500">
            {!releaseDate ? (
              type == "playlist" || type == "category" ? (
                <div>
                  By{" "}
                  {username !== "Spotify" ? (
                    <Link href={`/users/${authorId}`}>{username}</Link>
                  ) : (
                    "Spotify"
                  )}
                </div>
              ) : (
                type.charAt(0).toUpperCase() + type.slice(1)
              )
            ) : (
              format(new Date(releaseDate), "yyyy")
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VerticalCard;
