import useAddRecentSearch from "@/hooks/useAddRecentSearch";
import useHover from "@/hooks/useHover";
import { addOrRemoveLikedSong, convertTime } from "@/lib/track";
import { Artist } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import Triangle from "./Layout/Triangle";
import { UserContext } from "@/context/User/UserContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CircularButton from "./Layout/CircularButton";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import ContextMenu from "./ContextMenu";

interface HorizontalSongCardProps {
  id: string;
  image: string;
  name: string;
  duration: number;
  currentRank: number;
  previousRank: number;
  releaseDate: string;
  artists: Artist[];
  withNo?: boolean;
  withDate?: boolean;
  withRank?: boolean;
  index?: number;
  isSearchCard?: boolean;
}

const HorizontalSongCard: React.FC<HorizontalSongCardProps> = ({
  id,
  image,
  name,
  duration,
  artists,
  withNo,
  index,
  isSearchCard,
  releaseDate,
  withDate,
  currentRank,
  previousRank,
}) => {
  const track = {
    id,
    image,
    name,
    duration,
    artists,
    releaseDate,
    currentRank,
    previousRank,
  };
  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  const { state: user, dispatch } = useContext(UserContext);
  const [addRecentSearch] = useAddRecentSearch();

  const isLikedSong = user.liked.songs?.find((s) => s.id === id);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      !menuRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      // Clicked outside of the button, so close the context menu
      setOptionsOpen(false);
    }
  };

  // Add a click event listener to the document body when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <Link
      href={{ pathname: `/song/${id}`, query: { id } }}
      onClick={async () => {
        if (isSearchCard && addRecentSearch) {
          await addRecentSearch({
            name,
            image,
            type: "track",
            typeId: id,
          });
        }
      }}
    >
      <div
        className={`w-full p-2 pl-5 rounded-md ${
          !optionsOpen && "hover:bg-[rgba(0,0,0,0.4)]"
        } justify-between 
        flex-row flex items-center ${optionsOpen && "bg-[#313131]"}`}
        ref={divRef}
      >
        <div className="flex flex-row gap-4 items-center relative flex-[0.7]">
          {withNo && !isHover && (
            <div
              className={`font-semibold text-[#757575] justify-end flex w-[18px] gap-1 flex-col items-center`}
            >
              {index}
              <Triangle previousRank={previousRank} currentRank={currentRank} />
            </div>
          )}
          {withNo && isHover && (
            <div className="w-[18px]">
              <BsFillPlayFill size={19} />
            </div>
          )}
          <div className="relative flex items-center justify-center">
            <img src={image} alt="" className="w-[40px] h-[40px]" />
            {isHover && !withNo && (
              <BsFillPlayFill size={25} className="absolute" />
            )}
          </div>

          <div className="flex flex-col justify-between">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-lightGray">
              {artists?.map((artist: Artist, index: number) => {
                if (index == artists.length - 1) {
                  return (
                    <Link
                      href={{ pathname: `/artist/${artist.id}`, query: artist }}
                    >
                      {artist.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    href={{ pathname: `/artist/${artist.id}`, query: artist }}
                  >
                    {artist.name + " • "}
                  </Link>
                );
              })}
            </p>
          </div>
        </div>
        <div
          className={`flex flex-row flex-[0.3] items-center ${
            withDate ? "justify-between" : "justify-end"
          } `}
        >
          {withDate && (
            <div className="text-[#757575] font-semibold text-sm">
              {format(new Date(releaseDate), "d MMM yyyy")}
            </div>
          )}
          <div className="text-sm text-[#757575] flex items-center gap-6">
            {isLikedSong ? (
              <AiFillHeart
                color="#1ed860"
                size={25}
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  addOrRemoveLikedSong(dispatch, !!isLikedSong, track);
                }}
              />
            ) : (
              isHover && (
                <AiOutlineHeart
                  color="#fff"
                  size={25}
                  onClick={(e) => {
                    e.preventDefault();
                    //@ts-ignore
                    addOrRemoveLikedSong(dispatch, !!isLikedSong, track);
                  }}
                />
              )
            )}
            <div>{convertTime(duration).formattedTime}</div>
            {
              <div className="relative">
                {optionsOpen && (
                  <div ref={menuRef}>
                    <ContextMenu
                      isSongLiked={!!isLikedSong}
                      onClose={() => setOptionsOpen(false)}
                      song={{
                        id,
                        image,
                        name,
                        duration,
                        artists,
                        releaseDate,
                        currentRank,
                        previousRank,
                      }}
                    />
                  </div>
                )}
                <div ref={buttonRef}>
                  <CircularButton
                    hoverClassName="bg-[#212121]"
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle the options menu
                      setOptionsOpen(!optionsOpen);
                    }}
                  >
                    <BiDotsHorizontalRounded
                      size={30}
                      color={isHover ? `#B3B3B3` : "rgba(0,0,0,0)"}
                    />
                  </CircularButton>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalSongCard;
