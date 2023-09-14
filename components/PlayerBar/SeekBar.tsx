import { convertTime } from "@/lib/track";
import React, { useState } from "react";
import { BiShuffle, BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { PlayPause } from "@/components";
import { TfiLoop } from "react-icons/tfi";

const SeekBar = () => {
  const [time, setTime] = useState<number>(0);

  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center gap-6">
        <BiShuffle size={20} color="lightGray" />
        <BiSkipPrevious size={29} />
        <PlayPause
          isPlaying={true}
          className="bg-white w-[30px] h-[30px]"
          iconSize={23}
        />
        <BiSkipNext size={29} />
        <TfiLoop size={20} color="lightGray" />
      </div>
      <div className="flex flex-row items-center mt-1 gap-3">
        <p className="text-gray-400 text-[13px]">{convertTime(305).formattedTime}</p>
        <input
          type="range"
          className="w-[500px] h-1 bg-gray-200 rounded-lg 
        appearance-none cursor-pointer range-sm dark:bg-gray-700"
        />
        <p className="text-gray-400 text-[13px]">{convertTime(400).formattedTime}</p>
      </div>
    </div>
  );
};

export default SeekBar;
