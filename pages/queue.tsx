import { Button, HorizontalSongCard } from "@/components";
import { MusicContext } from "@/context/MusicContext";
import Link from "next/link";
import React, { useContext, useEffect } from "react";

const Queue = () => {
  const { state: music, dispatch: MusicDispatch } = useContext(MusicContext);

  useEffect(() => {
    console.log(music.currentSongs, music.queue);
  }, [music.queue, music.currentSongs]);

  return (
    <div className="min-h-full  bg-darkGray px-6">
      <div>
        <h3 className="text-[25px] font-bold">Queue</h3>
      </div>
      {music.currentSongs.length > 0 && (
        <p className="text-[16px] font-bold text-gray-400 mt-3">Now playing</p>
      )}

      {music.currentSongs.length == 0 && music.queue.length == 0 ? (
        <div className="mt-2 text-gray-400 font-bold text-[16px] text-center">
          Nothing in queue
        </div>
      ) : (
        <div>
          <div className="mt-2">
            <HorizontalSongCard
              {...music.currentSongs[music.currentIndex]}
              withNo
              index={1}
              playSong={() => MusicDispatch({ type: "PLAY_PAUSE" })}
            />
          </div>

          {music.queue.length > 0 && (
            <>
              <div className="w-full flex justify-between items-center mt-2">
                <p className=" text-gray-400 font-bold text-[16px]">
                  Next in queue
                </p>
                <Button
                  className="bg-transparent text-white text-[14px] border 
                border-gray-600 hover:border-white transition-all duration-200"
                  onClick={() => {
                    MusicDispatch({ type: "CLEAR_QUEUE" });
                  }}
                >
                  Clear queue
                </Button>
              </div>
              <div className="mt-2">
                {music.queue.map((track, index) => {
                  return (
                    <HorizontalSongCard
                      {...track}
                      withNo
                      index={index + 2}
                      playSong={() => {
                        MusicDispatch({
                          type: "SET_INDEX",
                          payload: music.currentIndex + index + 1,
                        });
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
          {music.playlistName !== "" &&
          music.currentIndex < music.currentSongs.length - 1 ? (
            <div className="mt-2 text-gray-400 font-bold text-[16px]">
              Next from:{" "}
              <Link href={{ pathname: music.href }} className="">
                {music.playlistName}
              </Link>
            </div>
          ) : (
            music.playlistName === "" && (
              <p className="mt-2 text-gray-400 font-bold text-[16px]">Next</p>
            )
          )}
          <div className="mt-2">
            {music.currentSongs
              .slice(music.currentIndex + music.queue.length + 1)
              .map((track, index) => {
                return (
                  <HorizontalSongCard
                    {...track}
                    withNo
                    index={index + music.queue.length + 2}
                    playSong={() => {
                      if (
                        track.id === music.currentSongs[music.currentIndex].id
                      ) {
                        MusicDispatch({ type: "PLAY_PAUSE" });
                      } else {
                        MusicDispatch({
                          type: "SET_INDEX",
                          payload:
                            music.currentIndex + music.queue.length + index + 1,
                        });
                      }
                    }}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Queue;
