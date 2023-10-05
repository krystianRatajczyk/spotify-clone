import { Discover, PlayPause, PlaylistImage } from "@/components";
import { madeForUser, popularForUser } from "@/constants/dummyData";
import { InfoContext } from "@/context/InfoContext";
import { MusicContext } from "@/context/MusicContext";
import { UserContext } from "@/context/User/UserContext";
import useHover from "@/hooks/useHover";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { Track } from "@prisma/client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { GetServerSideProps } from "next";
import { useContext, useEffect, useRef, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

type PlaySongs = (
  index: number,
  tracks: Track[],
  playlistId: string,
  playlistName: string,
  href: string
) => void;

interface PlaylistCardProps {
  title: string;
  tracks: Track[];
  playSongs: PlaySongs;
  percentage: string;
  id: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  tracks,
  playSongs,
  id,
  percentage,
}) => {
  const ref = useRef(null);
  const [isHover] = useHover(ref);
  const { state: music } = useContext(MusicContext);

  return (
    <div
      ref={ref}
      className={`flex-grow-[1] overflow-hidden rounded-lg bg-[#313131] hover:bg-[#414141]
transition duration-300 flex items-center gap-3 min-w-[420px] ${percentage} relative`}
    >
      <PlaylistImage tracks={tracks} width={80} iconSize={30} />
      <h2 className="text-[18px] font-semibold">{title}</h2>

      <AnimatePresence>
        {isHover && (
          <div className="absolute right-2">
            <PlayPause
              onClick={() => {
                tracks.length > 0 &&
                  playSongs(
                    music.currentIndex,
                    tracks,
                    id,
                    title,
                    `/playlist/${id}`
                  );
              }}
              isPlaying={music.playlistId == id && music.isPlaying}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface PopularCardProps {
  title: string;
  color: string | null;
  tracks: Track[];
  playSongs: PlaySongs;
}

const PopularCard: React.FC<PopularCardProps> = ({
  title,
  color,
  playSongs,
  tracks,
}) => {
  const divRef = useRef(null);
  const [isHover] = useHover(divRef);
  const { state: music } = useContext(MusicContext);

  const artists = tracks?.slice(0, 4).map((track) => {
    return track.artists[0].name + " ";
  });

  const authors = [...new Set(artists)];
  const animate = { background: ["#313131", "#363636", "#313131"] };
  const transition = {
    repeat: Infinity,
    duration: 1.5,
  };

  return (
    <div
      className="bg-[#191919] p-4 rounded-md relative 
    hover:bg-[#282828] transition duration-300 w-[180px] min-h-[244px]"
      ref={divRef}
    >
      {tracks ? (
        <>
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={tracks[color ? 8 : 15]?.artists[0].image}
              className="object-cover aspect-square"
            />
            {color && (
              <>
                <svg
                  width="100%"
                  id="svg"
                  viewBox="0 0 1440 690"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -top-5 -left-6"
                >
                  <path
                    d="M 0,700 C 0,700 0,350 0,350 C 76.54615384615386,357.9307692307692 153.0923076923077,365.8615384615385 237,340 C 320.9076923076923,314.1384615384615 412.176923076923,254.48461538461538 491,268 C 569.823076923077,281.5153846153846 636.2,368.19999999999993 709,425 C 781.8,481.80000000000007 861.023076923077,508.71538461538466 941,461 C 1020.976923076923,413.28461538461534 1101.7076923076922,290.9384615384615 1185,260 C 1268.2923076923078,229.06153846153848 1354.146153846154,289.53076923076924 1440,350 C 1440,350 1440,700 1440,700 Z"
                    stroke="none"
                    stroke-width="0"
                    fill={color}
                    fill-opacity="0.8"
                    transform="rotate(-210 720 350)"
                  ></path>
                </svg>

                <svg
                  width="100%"
                  id="svg"
                  viewBox="0 0 1440 690"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute bottom-0"
                >
                  <path
                    d="M 0,700 C 0,700 0,350 0,350 C 66.11817244933013,300.36963242871866 132.23634489866026,250.73926485743732 203,229 C 273.76365510133974,207.26073514256268 349.172792854689,213.41257299896944 411,234 C 472.827207145311,254.58742700103056 521.0724836825833,289.610443146685 596,341 C 670.9275163174167,392.389556853315 772.5372724149778,460.1456544142906 853,428 C 933.4627275850222,395.8543455857094 992.7784266575059,263.80693919615254 1053,234 C 1113.2215733424941,204.19306080384746 1174.3490209549982,276.6265888010993 1239,313 C 1303.6509790450018,349.3734111989007 1371.825489522501,349.68670559945036 1440,350 C 1440,350 1440,700 1440,700 Z"
                    stroke="none"
                    stroke-width="0"
                    fill={color}
                    fill-opacity="0.8"
                  ></path>
                </svg>
              </>
            )}
            <h2
              className={`absolute z-[100] bottom-1 left-2 ${
                color ? "text-black font-[800]" : "text-white font-bold"
              } `}
            >
              {title}
            </h2>
            <AnimatePresence>
              {isHover && (
                <div className="absolute z-[200] bottom-3 right-3">
                  <PlayPause
                    isPlaying={title == music.playlistId && music.isPlaying}
                    onClick={() =>
                      playSongs(music.currentIndex, tracks, title, title, "")
                    }
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold mt-4">{title}</h2>
            <p className="truncate text-gray-500 font-medium">{authors}</p>
          </div>
        </>
      ) : (
        <>
          <motion.div
            className="w-full aspect-square rounded-lg"
            animate={animate}
            transition={transition}
          ></motion.div>
          <div className="mt-4">
            <motion.div
              animate={animate}
              className="w-full py-2 rounded-full bg-[#313131]"
            ></motion.div>
            <motion.div
              animate={animate}
              className="w-full py-3 rounded-lg mt-1 bg-[#313131]"
            ></motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default function Home({ playSongs }: { playSongs: PlaySongs }) {
  const [discover, setDiscover] = useState<Track[]>();
  const [tracks, setTracks] = useState<Track[]>();

  const hours = new Date().getHours();
  const day = new Date().getDay();

  let greeting;

  if (hours <= 12) {
    greeting = "Good Morning";
  } else if (hours <= 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  const { state: user } = useContext(UserContext);
  const { state: music } = useContext(MusicContext);
  const { dispatch } = useContext(InfoContext);

  const playlistsToDisplay =
    user.playlists.length % 2 == 0
      ? user.playlists.slice(0, user.playlists.length - 1)
      : user.playlists.slice(0, 5);

  const ref = useRef(null);
  const [isHover] = useHover(ref);

  let percentage: string = "basis-[30%]";

  if (playlistsToDisplay.length == 1 || playlistsToDisplay.length == 3) {
    percentage = "basis-[45%]";
  }

  useEffect(() => {
    const getDiscover = async () => {
      const disc = await axios.post("/api/actions/getObjectsWithQuery", {
        query: {
          skip: day * 20,
          take: 20,
          select: {
            id: true,
            image: true,
            name: true,
            duration: true,
            artists: { select: { id: true, name: true } },
          },
        },
        key: "track",
      });
      setDiscover(disc.data);

      const tracks = await axios.post("/api/actions/getObjectsWithQuery", {
        query: {
          take: 140,
          select: {
            id: true,
            image: true,
            name: true,
            duration: true,
            artists: { select: { id: true, name: true, image: true } },
          },
        },
        key: "track",
      });

      setTracks(tracks.data);
    };
    dispatch({
      type: "SET_SONGS_AND_LABEL",
      payload: { label: "", playlistId: "", tracks: [] },
    });
    getDiscover();
  }, []);

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #221f1f,#121212 40%)",
      }}
      className="px-5 py-4 flex-1 w-full pt-[100px] min-h-full"
    >
      <Discover
        play={() => {
          discover &&
            playSongs(
              music.currentIndex,
              discover,
              "discover",
              "Discover Today",
              ""
            );
        }}
      />
      <h2 className="text-[30px] font-bold mt-5">{greeting}</h2>
      <div className="flex gap-4 mt-3 flex-wrap w-full">
        <div
          ref={ref}
          className={`flex-grow-[1] overflow-hidden rounded-lg bg-[#313131] hover:bg-[#414141]
        transition duration-300 flex items-center gap-3 min-w-[420px] ${percentage} relative`}
        >
          <div
            className=" h-[80px] aspect-[1/1]
            bg-gradient-to-br from-[#480df3] to-[#b7dbda]
            flex items-center justify-center shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px]"
          >
            <AiFillHeart size={20} color="#fff" />
          </div>
          <h2 className="text-[18px] font-semibold">Liked Songs</h2>

          <AnimatePresence>
            {isHover && (
              <div className="absolute right-2">
                <PlayPause
                  onClick={() => {
                    user?.liked.songs.length > 0 &&
                      playSongs(
                        music.currentIndex,
                        user?.liked.songs,
                        "likedSongs",
                        "Liked Songs",
                        `/likedSongs`
                      );
                  }}
                  isPlaying={
                    music.playlistId == "likedSongs" && music.isPlaying
                  }
                />
              </div>
            )}
          </AnimatePresence>
        </div>
        {playlistsToDisplay.map((playlist) => {
          return (
            <PlaylistCard
              title={playlist.name}
              tracks={playlist.tracks}
              percentage={percentage}
              id={playlist.id}
              playSongs={playSongs}
            />
          );
        })}
      </div>
      <div className="mt-5">
        <h2 className="text-[22px] font-bold">Made For {user.name}</h2>
        <div className="flex gap-5 flex-wrap mt-2">
          {madeForUser.map((mix, index) => {
            return (
              <PopularCard
                title={mix.title}
                key={mix.title}
                color={mix.color}
                tracks={tracks?.slice(index * 20, index * 20 + 20)}
                playSongs={playSongs}
              />
            );
          })}
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-[22px] font-bold">Popular</h2>
        <div className="flex gap-5 flex-wrap mt-2">
          {popularForUser.map((mix, index) => {
            return (
              <PopularCard
                title={mix.title}
                key={mix.title}
                color={null}
                tracks={tracks?.slice(
                  140 - (index * 20 + 20),
                  140 - (index * 20 + 20) + 20
                )}
                playSongs={playSongs}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
