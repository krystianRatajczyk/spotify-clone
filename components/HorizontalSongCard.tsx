import { UserContext } from "@/context/UserContext";
import useAddRecentSearch from "@/hooks/useAddRecentSearch";
import useHover from "@/hooks/useHover";
import { convertTime, generateUniqueId } from "@/lib/track";
import { Artist } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useRef } from "react";
import { BsFillPlayFill } from "react-icons/bs";

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
  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);

  const [addRecentSearch] = useAddRecentSearch();

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
        className="w-full p-2 pl-5 rounded-md hover:bg-[rgba(0,0,0,0.4)] justify-between flex-row flex items-center"
        ref={divRef}
      >
        <div className="flex flex-row gap-4 items-center relative flex-[0.7]">
          {withNo && !isHover && (
            <div
              className={`font-semibold text-[#757575] justify-end flex w-[18px] gap-1 flex-col items-center`}
            >
              {index}
              {currentRank != previousRank && (
                <div
                  className={`w-[10px] h-[10px] relative ${
                    previousRank > currentRank && "rotate-[180deg]"
                  }`}
                >
                  <div
                    className={`${
                      previousRank > currentRank ? "bg-red-500" : "bg-green-500"
                    } w-full h-full rotate-[45deg]`}
                  />
                  <div className="absolute w-[20px] h-[10px] bg-darkGray -bottom-[5px] -left-[5px]" />
                </div>
              )}
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
            <h3 className="font-semibold ">{name}</h3>
            <p className="text-lightGray">
              {artists.map((artist: Artist, index: number) => {
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
          <div className="text-sm text-[#757575]">
            {convertTime(duration).formattedTime}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalSongCard;
