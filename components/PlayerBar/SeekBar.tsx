import { convertTime } from "@/lib/track";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiShuffle, BiSkipPrevious, BiSkipNext } from "react-icons/bi";
import { PlayPause } from "@/components";
import { TfiLoop } from "react-icons/tfi";
import { MusicContext } from "@/context/MusicContext";
import useHover from "@/hooks/useHover";

const SeekBar = () => {
  const [time, setTime] = useState<number>(0);
  const { state, dispatch } = useContext(MusicContext);

  const inputRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(inputRef);

  useEffect(() => {
    if (time == state.currentSongs[state.currentIndex]?.duration) {
      setTime(0);
      dispatch({ type: "NEXT_SONG" });
    }
    if (state.isPlaying) {
      const timer = setTimeout(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [time, state.isPlaying]);

  useEffect(() => {
    setTime(0);
  }, [state.playlistId, state.currentIndex]);

  const playPause = () => {
    dispatch({ type: "PLAY_PAUSE" });
  };

  const prevSong = () => {
    dispatch({ type: "PREV_SONG" });
    setTime(0);
  };
  const nextSong = () => {
    dispatch({ type: "NEXT_SONG" });
    setTime(0);
  };

  const trackDuration = state.currentSongs[state.currentIndex]?.duration;

  return (
    <div className="flex items-center flex-col flex-[0.3]">
      <div className="flex items-center gap-6">
        <BiShuffle size={20} color="lightGray" />
        <BiSkipPrevious
          size={29}
          onClick={prevSong}
          color={state.currentIndex > 0 ? "white" : "#9ca3af"}
        />
        <PlayPause
          onClick={state.currentSongs.length > 0 ? playPause : () => {}}
          hover={false}
          isPlaying={state.isPlaying}
          className={`${
            state.currentSongs.length > 0 ? "bg-white" : "bg-gray-400"
          } w-[30px] h-[30px]`}
          iconSize={22}
          animation={false}
        />

        <BiSkipNext
          size={29}
          onClick={nextSong}
          color={
            state.currentIndex < state.currentSongs.length - 1
              ? "white"
              : "#9ca3af"
          }
        />
        <TfiLoop size={20} color="lightGray" />
      </div>
      <div className="flex flex-row items-center mt-1 gap-3">
        <p className="text-gray-400 text-[13px]">
          {convertTime(time).formattedTime}
        </p>
        <div className="relative flex items-center flex-row" ref={inputRef}>
          <div
            className="z-[1] w-[500px] absolute bg-[#4d4d4d] h-1 
          rounded-full"
          />
          <input
            min={0}
            value={time}
            max={trackDuration || 0}
            onChange={(e) => setTime(+e.target.value)}
            type="range"
            className={`${
              isHover ? " custom-range-show" : "custom-range-hidden"
            }  w-[500px] h-1 bg-transparent rounded-full
        appearance-none z-[3]`}
          />
          {trackDuration && (
            <div
              className={`z-[2] absolute hover:bg-primary ${
                isHover ? "bg-primary" : "bg-white"
              } 
              h-1 rounded-full`}
              style={{ width: (time / trackDuration) * 500 + "px" }}
            />
          )}
        </div>

        <p className="text-gray-400 text-[13px]">
          {convertTime(trackDuration || 0).formattedTime}
        </p>
      </div>
    </div>
  );
};

export default SeekBar;
