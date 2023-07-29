import { emptyTrackState } from "@/constants/initialStates";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { convertTime } from "@/lib/track";
import { Artist, Track } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Color from "color-thief-react";
import React, { useContext, useEffect, useState } from "react";
import PlayPause from "@/components/PlayPause";
import { AiOutlineHeart } from "react-icons/ai";
import Header from "@/components/Header";
import HorizontalSongCard from "@/components/HorizontalSongCard";
import VerticalCard from "@/components/VerticalCard";
import { UserContext } from "@/context/UserContext";

interface SongDetailProps {
  trackData: Track;
}

const SongDetail = ({ trackData }: SongDetailProps) => {
  const [track, setTrack] = useState(emptyTrackState);
  const [artists, setArtists] = useState([]);
  const router = useRouter();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const getTrack = async () => {
      try {
        if (!trackData.artistsIds) {
          const track = await axios.post("/api/actions/getTrackById", {
            id: router.query.songId,
          }); //load full track when going back in history

          setTrack(track.data);
          let ids = track.data.artists.map((artist: Artist) => artist.id);

          const artistsWithTracks = await axios.post(
            "/api/actions/getArtistsByIds",
            {
              ids,
              take: 6,
            }
          );
          setArtists(artistsWithTracks.data);
        } else {
          const artists = await axios.post("/api/actions/getArtistsByIds", {
            ids: trackData.artistsIds,
            take: 6,
          });
          //@ts-ignore
          setArtists(artists.data);
          const { artistsIds, ...rest } = trackData;

          const track = { ...rest, artists: artists.data };

          //@ts-ignore
          setTrack(track);
          //load only artists because rest we have
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTrack();
  }, [router.query.songId]);

  if (!track?.id) return null;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrolled = element.scrollTop;
    dispatch({ type: "CHANGE_SCROLL_TOP", payload: scrolled });
  };

  return (
    <Color src={track?.image} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div
            className="w-full h-full overflow-x-scroll no-scrollbar bg-[#1b1b1b]"
            onScroll={(e) => handleScroll(e)}
          >
            <div
              className={`p-5 pt-[70px] pb-[350px]`}
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dominantColor}, ${dominantColor}, #1b1b1b)`,
                width: "100%",
              }}
            >
              <div className="flex gap-5 items-end">
                {track?.image ? (
                  <img
                    src={track?.image}
                    alt=""
                    className="
                    w-[260px] h-[260px] object-contain
                    shadow-[0_35px_60px_5px_rgba(0,0,0,0.6)]"
                  />
                ) : (
                  <div className="w-[260px] h-[260px] bg-gray" />
                )}
                <div className="flex flex-col ">
                  <h3 className="font-semibold">Track</h3>
                  <h2 className="font-bold text-[60px] leading-[60px]">
                    {track?.name}
                  </h2>
                  <p className="mt-5">
                    {track?.artists?.map((artist: Artist) => {
                      return (
                        <span className="font-bold" key={artist.id}>
                          {artist.name + " • "}
                        </span>
                      );
                    })}
                    <span className="font-semibold">
                      {format(new Date(track?.releaseDate), "MMMM d yyyy") +
                        ", "}
                    </span>
                    <span className="text-gray-100">
                      {convertTime(track?.duration).minutes +
                        " min " +
                        convertTime(track?.duration).remainingSeconds +
                        " sec"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full bg-[rgba(0,0,0,0.3)] -mt-[325px] p-5 ">
              <div className="flex gap-7 items-center">
                <PlayPause
                  isPlaying
                  isVisible
                  className="w-[65px] h-[65px]"
                  iconSize={35}
                  animation={false}
                />
                <AiOutlineHeart size={50} color={"#fff"} />
                <p className="bg-primary rounded-full px-4 py-2 text-black font-semibold">
                  Add to queue
                </p>
              </div>
              <Header className={"bg-transparent mt-6"} />
              {track?.artists && (
                <HorizontalSongCard
                  {...track}
                  key={track.id}
                  withNo
                  index={1}
                  redirect={false}
                />
              )}
              {artists &&
                artists.map((artist: Artist) => {
                  return (
                    <div key={artist.name} className="flex flex-col gap-5">
                      <h2 className="font-bold text-2xl mt-4">
                        More by {artist.name}
                      </h2>
                      <div className="flex gap-5">
                        {artist.tracks?.map((track: Track) => {
                          return (
                            <VerticalCard
                              type="track"
                              {...track}
                              modal="playpause"
                              imageClassName="w-[180px] h-[180px]"
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default SongDetail;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: { trackData: _ctx.query },
    };
  }
);
