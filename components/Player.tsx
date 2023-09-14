import React from "react";
import { Controls, SeekBar, Track, VolumeBar } from "@/components";

const Player = () => {
  return (
    <div className="w-full flex items-center justify-between text-white ">
      <Track />
      <SeekBar />
      <div className="flex gap-1">
        <VolumeBar />
      </div>
    </div>
  );
};

export default Player;
