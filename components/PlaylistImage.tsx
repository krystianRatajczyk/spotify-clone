import { Playlist, Track } from "@prisma/client";
import React from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";

interface PlaylistImageProps {
  width: number;
  tracks: Track[];
  iconSize?: number;
  rounded?: boolean;
}

const PlaylistImage: React.FC<PlaylistImageProps> = ({
  tracks,
  width,
  iconSize = 100,
  rounded,
}) => {
  return (
    <div>
      {tracks?.length === 0 ? (
        <div
          style={{
            width: width.toString() + "px",
            height: width.toString() + "px",
          }}
          className={`
            bg-[#282828]
            flex items-center justify-center shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]
            ${rounded && "rounded-lg"}`}
        >
          <BsMusicNoteBeamed size={iconSize} color="#b3b3b3" />
        </div>
      ) : (
        <div
          className={`${rounded && "rounded-lg overflow-hidden"} `}
          style={{
            width: width.toString() + "px",
            height: width.toString() + "px",
          }}
        >
          {tracks?.length < 4 && (
            <img
              className="w-full h-full object-contain"
              src={tracks[0]?.image}
            />
          )}
          {tracks?.length >= 4 && (
            <div
              className="w-full h-full 
                    grid grid-cols-2 grid-rows-2 items-center"
            >
              {tracks?.slice(0, 4).map((track) => (
                <img
                  src={track.image}
                  className="object-contain"
                  style={{ width: width / 2, height: width / 2 }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistImage;
