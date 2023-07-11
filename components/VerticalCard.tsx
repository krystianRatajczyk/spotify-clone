import React, { useRef } from "react";
import CircularButton from "./Layout/CircularButton";
import { RxCross2 } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import useHover from "@/hooks/useHover";
import PlayPause from "./PlayPause";
import { GoPerson } from "react-icons/go";
import Picture from "./Picture";

interface VerticalCardProps {
  type: "profile" | "playlist" | "artist" | "track";
  name: string;
  image: string;
  imageClassName: string;
  modal: "playpause" | "cross" | "none";
}

const VerticalCard: React.FC<VerticalCardProps> = ({
  type,
  image,
  name,
  modal,
  imageClassName,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);

  return (
    <div
      className="bg-[#191919] p-4 rounded-md relative 
    hover:bg-[#282828] transition duration-300"
      ref={divRef}
    >
      {modal == "cross" && (
        <CircularButton
          className="absolute top-2 right-2 bg-[#121212] p-1 z-[100]"
          hoverClassName="scale-[1.1]"
        >
          <RxCross2 size={20} />
        </CircularButton>
      )}
      <div className="relative">
        {image == "" ? (
          <Picture className="w-[180px] h-[180px]">
            <GoPerson size={60} color="#B3B3B3" />
          </Picture>
        ) : (
          <img
            src={image}
            alt=""
            className={twMerge(
              `${
                type == "profile" || type === "artist"
                  ? "rounded-full "
                  : "rounded-md aspect-[1/1]"
              } object-cover drop-shadow-md`,
              imageClassName
            )}
          />
        )}

        {isHover && modal == "playpause" && (
          <PlayPause
            isVisible={isHover}
            isPlaying={true}
            className="absolute right-2 bottom-2"
          />
        )}
      </div>

      <div className="flex mt-3 gap-1 flex-col">
        <h2 className="font-bold text-lg">{name}</h2>
        <p className="font-semibold text-gray-500">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </p>
      </div>
    </div>
  );
};

export default VerticalCard;
