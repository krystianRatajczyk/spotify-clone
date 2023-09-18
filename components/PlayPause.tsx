import React from "react";
import { BiPause } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { buttonSlide, hoverButton } from "@/motion/motion";

interface PlayPauseProps {
  isPlaying: boolean;
  className?: string;
  hoverClassName?: string;
  iconSize?: number;
  animation?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const PlayPause: React.FC<PlayPauseProps> = ({
  isPlaying,
  className,
  iconSize,
  onClick,
  hover = true,
  animation = true,
}) => {
  return (
    <motion.div
      onClick={onClick}
      variants={animation ? buttonSlide() : hoverButton()}
      animate="visible"
      exit="exit"
      initial="hidden"
      whileHover={hover ? "hover" : ""}
      className={twMerge(
        `w-[50px] h-[50px] 
        rounded-full 
        bg-primary 
        flex 
        items-center 
        justify-center
        transition-all
        ease-out 
        cursor-pointer
        `,
        className
      )}
    >
      {!isPlaying ? (
        <BsFillPlayFill size={iconSize || 30} color="#000" />
      ) : (
        <BiPause size={iconSize || 30} color="#000" />
      )}
    </motion.div>
  );
};

export default PlayPause;
