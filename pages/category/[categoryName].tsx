import { Header, PlayPause, HorizontalSongCard } from "@/components";
import { musicTypes } from "@/constants/dummyData";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/User/UserContext";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { addOrRemoveLikedPlaylist } from "@/lib/playlist";
import { timeReducer } from "@/lib/track";
import { Playlist, Track } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const CategoryDetail = () => {
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [playlist, setPlaylist] = useState<Playlist | undefined>(undefined);

  const { dispatch } = useContext(InfoContext);
  const { state: user, dispatch: UserDispatch } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const loadTracks = async () => {
      const category = musicTypes.find(
        (category) => category.name === router.query.categoryName
      );

      const res = await axios.post("/api/actions/playlist/getPlaylistByName", {
        name: category?.name,
        author: "Spotify",
      });
      setPlaylist(res?.data);
      setTracks(res?.data.tracks);
    };
    loadTracks();

    router.query.categoryName &&
      dispatch({
        type: "CHANGE_LABEL_NAME",
        //@ts-ignore
        payload: router.query.categoryName,
      });
  }, [router.query.categoryName]);

  const getTime = (): string => {
    const time = timeReducer(tracks);

    if (time.hours) {
      return time.hours + " hr " + time.minutes + "min";
    }
    return time.minutes + " min";
  };

  const isPlaylistLiked = !!user.liked?.playlists?.find(
    (p) => p.id == playlist?.id
  );
  const handleHeartClick = () =>
    playlist &&
    addOrRemoveLikedPlaylist(UserDispatch, isPlaylistLiked, {
      id: playlist.id,
      author: playlist.author!, // we are sure there will be author
      name: playlist.name,
      image: playlist.image!, // we are sure there will be image because here is the only place where image will appear
    });

  const HeartIcon = isPlaylistLiked ? (
    <AiFillHeart size={40} color="#1ed860" onClick={handleHeartClick} />
  ) : (
    <AiOutlineHeart size={40} color={"lightGray"} onClick={handleHeartClick} />
  );

  return (
    <Color src={playlist?.image || ""} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div className="bg-darkGray w-full ">
            <div
              className={`p-5 h-[450px] bg-no-repeat flex items-end relative`}
              style={{
                backgroundImage: `url(${playlist?.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute left-5 bottom-5">
                <h4 className="font-semibold">Public Playlist</h4>
                <h2 className="text-[80px] font-bold">
                  {router.query.categoryName}
                </h2>
                <p className="font-semibold">
                  <span className="font-bold">Spotify</span>
                  <span> • </span> 304,899 likes <span> • </span>{" "}
                  {tracks.length} songs,{" "}
                  <span className="font-bold text-gray-400">{getTime()}</span>
                </p>
              </div>
            </div>
            <div
              className="w-full h-full pt-8 p-6"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dominantColor} 0, #121212 200px)`,
              }}
            >
              <div className="w-full flex gap-6 items-center pb-7">
                <PlayPause
                  isPlaying
                  className="w-[65px] h-[65px]"
                  iconSize={35}
                  animation={false}
                />
                {HeartIcon}
              </div>
              <Header withDate />
              <div className="pb-7">
                {tracks?.map((track, index: number) => (
                  //@ts-ignore
                  <HorizontalSongCard
                    {...track}
                    withRank
                    withNo
                    withDate
                    index={index + 1}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default CategoryDetail;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
