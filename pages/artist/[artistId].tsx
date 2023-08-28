import { HorizontalSongCard, PlayPause, Button } from "@/components";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/User/UserContext";
import { addOrRemoveLikedArtist } from "@/lib/artist";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { Artist, Track } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { MdVerified } from "react-icons/md";

interface ArtistDetailProps {
  artistData: Artist;
}

const ArtistDetail = ({ artistData }: ArtistDetailProps) => {
  const [artist, setArtist] = useState<Artist>();
  const [tracks, setTracks] = useState<Track[]>();
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { dispatch } = useContext(InfoContext);
  const { state: user, dispatch: UserDispatch } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    const getArtist = async () => {
      try {
        const artist = await axios.post(
          "/api/actions/artists/getArtistsByIds",
          {
            ids: [artistData.id || router.query.artistId],
            options: { tracks: false },
          }
        );
        dispatch({ type: "CHANGE_LABEL_NAME", payload: artist.data[0]?.name });

        const { tracksIds, ...rest } = artist.data[0];
        setArtist(rest);

        const tracksWithArtists = await axios.post(
          "/api/actions/tracks/getTracksByIds",
          {
            ids: tracksIds,
            options: { artists: true },
          }
        );

        setTracks(tracksWithArtists.data);
      } catch (error) {
        console.log(error);
      }
    };

    getArtist();
  }, [router.query.artistId]);

  useEffect(() => {
    if (artist) {
      const following = !!user.liked.artists?.find(
        (a) => a.id == artist.id
      );

      setIsFollowing(following);
    }
  }, [user.liked.artists, artist]);

  return (
    <Color src={artist?.image || ""} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div className="text-white w-full bg-darkGray">
            <div
              className={`p-5 h-[450px] bg-no-repeat flex items-end relative`}
              style={{
                backgroundImage: `url(${artist?.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute left-5 bottom-5 flex flex-col ">
                <div className="flex gap-2 items-center">
                  <MdVerified size={40} color={"#3d91f4"} />
                  <p className="font-semibold text-lg">Verified Artist</p>
                </div>
                <span className="text-white font-bold text-[100px] mb-10 leading-[100px]">
                  {artist?.name}
                </span>
                <div className="font-semibold ">
                  34,010,502 monthly listeners
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundImage: `linear-gradient(to bottom, ${dominantColor} 0, #121212 150px)`,
              }}
            >
              <div className="w-full h-full p-6">
                <div className="w-full flex gap-6 items-center pb-4 p-6">
                  <PlayPause
                    isPlaying
                    animation={false}
                    className="w-[60px] h-[60px]"
                  />
                  <Button
                    onClick={() => {
                      artist &&
                        addOrRemoveLikedArtist(UserDispatch, !!isFollowing, {
                          id: artist.id,
                          name: artist.name,
                          image: artist.image,
                        });
                    }}
                    className="font-bold px-4 py-1 border border-gray-600 hover:border-white 
                    rounded-full bg-transparent text-white text-[16px]"
                  >
                    {isFollowing ? "FOLLOWING" : "FOLLOW"}
                  </Button>
                </div>
                <p className="text-white font-bold text-2xl">Popular</p>
                <div className="w-full h-full mt-2">
                  {tracks &&
                    tracks.map((track: Track, index: number) => {
                      if (index > 4 && !showMore) {
                        return null;
                      }
                      return (
                        <HorizontalSongCard
                          {...track}
                          //@ts-ignore
                          artists={track.artists}
                          key={track.id}
                          withNo
                          index={index + 1}
                        />
                      );
                    })}
                  {tracks?.length! > 5 && (
                    <h2
                      className="hover:text-white text-gray-500 font-semibold pl-4"
                      onClick={() => {
                        setShowMore((prev) => !prev);
                      }}
                    >
                      See {showMore ? "less" : "more"}
                    </h2>
                  )}
                </div>
                <div className="w-full flex h-[500px] gap-3 my-6">
                  <div className="flex-[0.6] flex flex-col">
                    <p className="text-white font-bold text-2xl">About</p>
                    <div
                      className={`bg-no-repeat 
                                  flex-1 
                                  rounded-xl 
                                  hover:scale-[1.01] 
                                  transition 
                                  duration-300
                                  relative
                                  p-10 mt-4`}
                      style={{
                        backgroundImage: `url(${artist?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div
                        className="
                                absolute top-10 right-10 
                                bg-[#0d72ea] 
                                flex 
                                flex-col 
                                items-center 
                                justify-center 
                                rounded-full p-3
                                aspect-[1/1]
                                "
                      >
                        <h2 className="text-2xl font-bold">
                          #{artist?.currentRank}
                        </h2>
                        <p className="text-center text-[11px] font-semibold">
                          in the world
                        </p>
                      </div>
                      <div className="absolute bottom-10 font-semibold">
                        <h2 className="mb-2 font-bold">
                          34,010,502 monthly listeners
                        </h2>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Fugiat doloribus, architecto maxime doloremque
                        dolorem commodi molestias cumque ducimus blanditiis
                        neque ratione iusto quaerat enim similique voluptatum
                        recusandae, adipisci hic, repellat quis necessitatibus
                        minima! Exercitationem voluptatum modi officia
                        similique, placeat dolorum. Nostrum labore alias quas
                        perferendis! Animi quasi quas necessitatibus placeat id
                        dicta quidem eaque veniam dignissimos cumque, velit
                        culpa, voluptates sed officia, minima et! Dicta magnam
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default ArtistDetail;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: { artistData: _ctx.query },
    };
  }
);
