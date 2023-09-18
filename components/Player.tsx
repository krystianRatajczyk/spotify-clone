import React from "react";
import { SeekBar, Track, VolumeBar } from "@/components";

const Player = () => {
  return (
    <div className="w-full flex items-center justify-between text-white ">
      <Track />
      <SeekBar />
      <VolumeBar />
    </div>
  );
};

export default Player;
