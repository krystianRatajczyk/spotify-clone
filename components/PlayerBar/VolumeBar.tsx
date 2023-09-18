import useHover from "@/hooks/useHover";
import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
  BsFillVolumeMuteFill,
  BsFillVolumeOffFill,
  BsFillVolumeUpFill,
  BsVolumeDownFill,
} from "react-icons/bs";
import { HiOutlineQueueList } from "react-icons/hi2";

const VolumeBar = () => {
  const [volume, setVolume] = useState<number>(50);
  const [Icon, setIcon] = useState<React.ReactNode>();

  const ref = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(ref);

  useEffect(() => {
    if (volume === 0) {
      setIcon(<BsFillVolumeMuteFill color="lightGray" size={22} />);
    } else if (volume < 33) {
      setIcon(<BsFillVolumeOffFill color="lightGray" size={22} />);
    } else if (volume < 66) {
      setIcon(<BsVolumeDownFill color="lightGray" size={22} />);
    } else {
      setIcon(<BsFillVolumeUpFill color="lightGray" size={22} />);
    }
  }, [volume]);

  return (
    <div className="flex gap-4 items-center flex-[0.3] justify-end">
      <div>
        <HiOutlineQueueList size={20} color="lightGray" />
      </div>
      <div className="flex gap-3 items-center ">
        {Icon}
        <div className="relative flex items-center flex-row" ref={ref}>
          <div
            className="z-[1] w-full absolute bg-[#4d4d4d] h-1
          rounded-full"
          />
          <input
            min={0}
            value={volume}
            max={100}
            onChange={(e) => setVolume(+e.target.value)}
            type="range"
            className={`${
              isHover ? " custom-range-show" : "custom-range-hidden"
            }  h-1 bg-transparent rounded-full
        appearance-none z-[3]`}
          />

          <div
            className={`z-[2] absolute ${
              isHover ? "bg-primary" : "bg-white"
            } h-1 rounded-full`}
            style={{ width: (ref.current?.clientWidth! / 100) * volume + "px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default VolumeBar;
