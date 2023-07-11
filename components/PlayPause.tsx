import React, { useEffect, useState } from "react";
import { BiPause } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

interface PlayPauseProps {
  isPlaying: boolean;
  className?: string;
  hoverClassName?: string;
  isVisible: boolean;
}

const PlayPause: React.FC<PlayPauseProps> = ({
  isPlaying,
  className,
  isVisible: visible,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(visible);

  return (
    <div
      className={twMerge(
        `w-[50px] h-[50px] 
        rounded-full 
        bg-primary 
        flex 
        items-center 
        justify-center
        transition-all
        ease-out 
        duration-150
        hover:scale-[1.1]
        cursor-pointer
        `,
        isVisible ? "animate-slide_bottom" : "",
        className
      )}
    >
      {isPlaying ? (
        <BsFillPlayFill size={30} color="#000" />
      ) : (
        <BiPause size={30} color="#000" />
      )}
    </div>
  );
};

export default PlayPause;
