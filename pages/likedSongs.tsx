import { Header, HorizontalSongCard, PlayPause } from "@/components";
import { InfoContext } from "@/context/InfoContext";
import { MusicContext } from "@/context/MusicContext";
import { UserContext } from "@/context/User/UserContext";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { Artist, Track } from "@prisma/client";
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

interface LikedSongsProps {
  playSongs: (
    index: number,
    tracks: Track[],
    playlistId: string,
    playlistName: string,
    href: string
  ) => void;
}

const likedSongs: React.FC<LikedSongsProps> = ({ playSongs }) => {
  const { state: user } = useContext(UserContext);
  const { dispatch } = useContext(InfoContext);
  const { state: music } = useContext(MusicContext);

  useEffect(() => {
    dispatch({
      type: "SET_SONGS_AND_LABEL",
      payload: {
        tracks: user.liked.songs,
        label: "Liked Songs",
        playlistId: "likedSongs",
      },
    });
  }, []);

  return (
    <div className="min-h-full bg-[#1b1b1b] flex flex-col">
      <div
        className={`h-fit bg-gradient-to-b
    from-[#21183e] via-[#2a1e52] to-[#1b1b1b] pt-[70px] pb-[350px] p-5`}
      >
        <div className="flex gap-5 items-end">
          <div
            className="w-[230px] h-[230px]
            bg-gradient-to-br from-[#480df3] to-[#b7dbda]
            flex items-center justify-center shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
          >
            <AiFillHeart size={100} color="#fff" />
          </div>
          <div>
            <h4 className="font-semibold">Playlist</h4>
            <h2 className="text-[90px] font-bold">Liked Songs</h2>
            <p className="font-semibold">
              <span className="font-bold">{user.name}</span>
              <span> • </span> {user.liked.songs.length} songs
            </p>
          </div>
        </div>
      </div>
      <div
        className="w-full min-h-full flex-1 -mt-[325px] bg-[rgba(0,0,0,0.3)] p-5
         "
      >
        {user.liked.songs?.length > 0 && (
          <div className="h-full">
            <div className="pl-3">
              <PlayPause
                onClick={() =>
                  playSongs(
                    music.currentIndex,
                    user.liked.songs,
                    "likedSongs",
                    "Liked Songs",
                    "/likedSongs"
                  )
                }
                isPlaying={music.playlistId === "likedSongs" && music.isPlaying}
                className="w-[65px] h-[65px]"
                iconSize={35}
                animation={false}
              />
            </div>
            <div className="mt-3">
              <Header withDate />
            </div>
            <div className="h-full">
              {user.liked.songs?.map((track, index) => (
                <HorizontalSongCard
                  key={index}
                  {...track}
                  //@ts-ignore
                  artists={track.artists}
                  withNo
                  withDate
                  index={index + 1}
                  playSong={() =>
                    playSongs(
                      index,
                      user.liked.songs,
                      "likedSongs",
                      "Liked Songs",
                      "/likedSongs"
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default likedSongs;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
