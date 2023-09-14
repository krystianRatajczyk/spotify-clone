import React from "react";
import { ImVolumeHigh } from "react-icons/im";
import {HiOutlineQueueList} from 'react-icons/hi2'

const VolumeBar = () => {
  return (
    <div className="flex gap-4 items-center">
      <div>
        <HiOutlineQueueList size={20}/>
      </div>
      <div className="flex gap-3 items-center ">
        <ImVolumeHigh color="lightGray" size={20}/>
        <input type="range"  className="w-full h-1 bg-gray-200 rounded-lg 
        appearance-none cursor-pointer range-sm dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default VolumeBar;
