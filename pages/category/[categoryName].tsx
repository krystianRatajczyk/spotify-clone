import { Header, PlayPause, HorizontalSongCard } from "@/components";
import { musicTypes } from "@/constants/dummyData";
import { InfoContext } from "@/context/InfoContext";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { timeReducer } from "@/lib/track";
import { Track } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";

interface CategoryDetailProps {
  url: string;
}

const CategoryDetail = ({ url }: CategoryDetailProps) => {
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [image, setImage] = useState<string | undefined>("");

  const { dispatch } = useContext(InfoContext);

  const router = useRouter();

  useEffect(() => {
    const loadTracks = async () => {
      const category = musicTypes.find(
        (category) => category.name === router.query.categoryName
      );
      let res;
      if (category?.start! >= 0 && category?.end) {
        res = await axios.post("/api/actions/category/getTracksByIndex", {
          skip: category.start,
          take: category.end - category.start,
        });
      } else {
        res = await axios.post("/api/actions/category/getTracksByGenre", {
          genre: router.query.categoryName,
        });
      }

      setTracks(res?.data);
      setImage(category?.url);
    };
    loadTracks();

    router.query.categoryName &&
      dispatch({
        type: "CHANGE_LABEL_NAME",
        //@ts-ignore
        payload: router.query.categoryName,
      });
  }, []);

  const getTime = (): string => {
    const time = timeReducer(tracks);

    if (time.hours) {
      return time.hours + " hr " + time.minutes + "min";
    }
    return time.minutes + " min";
  };

  return (
    <Color src={image || ""} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div className="bg-darkGray w-full ">
            <div
              className={`p-5 h-[450px] bg-no-repeat flex items-end relative`}
              style={{
                backgroundImage: `url(${image})`,
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
                <AiOutlineHeart size={40} color={"darkGray"} />
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
      props: { url: _ctx.query },
    };
  }
);
