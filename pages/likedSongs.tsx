import { Header, HorizontalSongCard, PlayPause } from "@/components";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/UserContext";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { Track } from "@prisma/client";
import axios from "axios";
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

const likedSongs = () => {
  const { state: user, dispatch: UserDispatch } = useContext(UserContext);
  const { dispatch: InfoDispatch } = useContext(InfoContext);

  useEffect(() => {
    InfoDispatch({ type: "CHANGE_LABEL_NAME", payload: "Liked Songs" });
    const getTracks = async () => {
      const receivedTracks = await axios.post(
        "/api/actions/tracks/getTracksByIds",
        {
          ids: user.likedSongsIds,
          options: { artists: true },
        }
      );
      const tracksMap = new Map();
      receivedTracks.data.forEach((track: Track) => {
        tracksMap.set(track.id, track); // setting key value pairs "id" -> track
      });
      const likedTracks = user.likedSongsIds.map((id) => tracksMap.get(id)); // getting certain tracks in user likes songs order

      UserDispatch({
        type: "ADD_FULL_LIKED_SONGS",
        payload: likedTracks,
      });
    };

    getTracks();
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
              <span> • </span> {user.likedSongsIds.length} songs
            </p>
          </div>
        </div>
      </div>
      <div
        className="w-full min-h-full flex-1 -mt-[325px] bg-[rgba(0,0,0,0.3)] p-5
         "
      >
        {user.likedSongs?.length ? (
          <div className="h-full">
            <div className="pl-3">
              <PlayPause
                isPlaying
                className="w-[65px] h-[65px]"
                iconSize={35}
                animation={false}
              />
            </div>
            <div className="mt-3">
              <Header withDate />
            </div>
            <div className="h-full">
              {user.likedSongs.map((track, index) => (
                <HorizontalSongCard
                  {...track}
                  artists={track.artists}
                  withNo
                  withDate
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center font-bold text-lg ">
            You dont have any liked songs <br />
            Click heart to add one!
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
