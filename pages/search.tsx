import Categories from "@/components/Categories";
import HorizontalSongCard from "@/components/HorizontalSongCard";
import PlayPause from "@/components/PlayPause";
import RecentSearches from "@/components/RecentSearches";
import VerticalCard from "@/components/VerticalCard";

import prisma from "@/lib/prismadb";
import { Artist, Track, User } from "@prisma/client";
import axios from "axios";

import { SyncLoader } from "react-spinners";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { InfoContext } from "@/context/InfoContext";
import useAddRecentSearch from "@/hooks/useAddRecentSearch";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";

const types = ["track", "artist", "user"];

const Search = () => {
  const {
    state: { search, sortTab },
  } = useContext(InfoContext);

  const [initialized, setInitialized] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [isHover, setIsHover] = useState<boolean>(false);

  const setStates = (
    loading: boolean,
    tracks: Track[] | [],
    artists: Artist[] | [],
    users: User[] | []
  ) => {
    setLoading(loading);
    setTracks(tracks);
    setArtists(artists);
    setUsers(users);
  };

  useEffect(() => {
    if (initialized) {
      const timeout = setTimeout(async () => {
        if (search != "") {
          let users = [];
          let tracks = [];
          let artists = [];
          setStates(true, [], [], []);
          for (const type of types) {
            //@ts-ignore
            const key: keyof typeof prisma = type;
            const res = await axios.post("/api/actions/getObjectsWithQuery", {
              query: {
                where: {
                  name: { contains: search, mode: "insensitive" },
                },
                include: type == "track" ? { artists: true } : null,
              },
              key,
            });
            if (type == "track") {
              tracks = res.data;
            } else if (type == "artist") {
              artists = res.data;
            } else {
              users = res.data;
            }
          }
          setStates(false, tracks, artists, users);
        } else {
          setStates(true, [], [], []);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
    setInitialized(true);
  }, [search, initialized]);

  const [addRecentSearch] = useAddRecentSearch();

  return (
    <div
      className={`px-5  ${
        sortTab == "Songs" ? "px-8" : "px-5"
      } flex-1 bg-darkGray overflow-y-scroll no-scrollbar w-full h-full`}
    >
      {search === "" ? (
        <React.Fragment>
          <RecentSearches />
          <Categories />
        </React.Fragment>
      ) : (
        (users.length > 0 || artists.length > 0 || tracks.length > 0) && (
          <div className="w-full ">
            <div className="w-full flex flex-row gap-5">
              {sortTab == "All" && (
                <Link
                  href={{
                    pathname: `${
                      tracks[0]
                        ? `/song/${tracks[0].id}`
                        : artists[0]
                        ? `/artist/${artists[0].id}`
                        : `/users/${users[0].id}`
                    }`,
                    query: tracks[0],
                  }}
                  className="flex-[0.4]"
                >
                  <div
                    onClick={async () => {
                      let arg;
                      if (tracks[0]) {
                        arg = {
                          name: tracks[0].name,
                          image: tracks[0].image,
                          type: "track",
                          typeId: tracks[0].id,
                        };
                      } else if (artists[0]) {
                        arg = {
                          name: artists[0].name,
                          image: artists[0].image,
                          type: "artist",
                          typeId: artists[0].id,
                        };
                      }

                      if (arg && addRecentSearch) {
                        await addRecentSearch(arg);
                      }
                    }}
                  >
                    <h2 className="font-bold text-2xl">Top result</h2>
                    <div
                      onMouseEnter={() => setIsHover(true)}
                      onMouseLeave={() => setIsHover(false)}
                      // ref={divRef}
                      className="w-full p-6 
                            bg-[#181818] 
                            rounded-md 
                            mt-4 
                            flex 
                            gap-4 
                            flex-col 
                            transition-all 
                            duration-300 
                            hover:bg-[#282828]
                            relative
                            cursor-pointer"
                    >
                      {/* Top song */}
                      <img
                        src={
                          tracks[0]?.image ||
                          artists[0]?.image ||
                          (users[0]?.image ? users[0]?.image : "")
                        }
                        alt=""
                        className="object-cover rounded-full w-[100px] h-[100px]"
                      />
                      <h2 className="font-bold text-3xl">
                        {tracks[0]?.name || artists[0]?.name || users[0]?.name}
                      </h2>
                      <p className="font-semibold px-4 py-1 bg-[#0f0f0f] w-fit rounded-full">
                        {tracks.length
                          ? "Song"
                          : artists.length
                          ? "Artist"
                          : users.length
                          ? "Profile"
                          : ""}
                      </p>

                      {isHover && (tracks.length > 0 || artists.length > 0) && (
                        <PlayPause
                          className="absolute right-5 bottom-5 drop-shadow-2xl"
                          hoverClassName="scale-[1.1]"
                          isPlaying={true}
                          isVisible={isHover}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              )}
              {tracks.length > 0 &&
                (sortTab == "All" || sortTab == "Songs") && (
                  <div
                    className={` ${
                      sortTab == "Songs" ? "flex-1 relative " : "flex-[0.6]"
                    }`}
                  >
                    {sortTab == "All" && (
                      <h2 className="font-bold text-2xl mb-4">Songs</h2>
                    )}
                    {sortTab == "Songs" && <Header className="sticky top-0" />}
                    {tracks.map((track: Track, index: number) => {
                      if (index > 3 && sortTab != "Songs") {
                        return;
                      }

                      return (
                        <HorizontalSongCard
                          {...track}
                          //@ts-ignore
                          artists={track.artists}
                          key={track.id}
                          withNo={sortTab == "Songs"}
                          index={index + 1}
                          isSearchCard
                        />
                      );
                    })}
                  </div>
                )}
            </div>
            {artists.length > 0 &&
              (sortTab == "All" || sortTab == "Artists") && (
                <div className="w-full mt-5">
                  {sortTab == "All" && (
                    <h2 className="font-bold text-2xl">Artists</h2>
                  )}
                  <div className="flex flex-wrap mt-4 w-full flex-row gap-5">
                    {artists.map((artist: Artist, index: number) => {
                      if (index > 5 && sortTab != "Artists") {
                        return;
                      }

                      return (
                        <VerticalCard
                          isRecentSearch={false}
                          typeId={artist.id}
                          type="artist"
                          {...artist}
                          modal="playpause"
                          key={index}
                          imageClassName="w-[90%] aspect-[1/1]"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

            {users.length > 0 &&
              (sortTab == "All" || sortTab == "Profiles") && (
                <div className="w-full mt-5">
                  {sortTab == "All" && (
                    <h2 className="font-bold text-2xl">Profiles</h2>
                  )}
                  <div className="flex flex-wrap mt-4 w-full flex-row gap-5">
                    {users.map((user: User, index: number) => {
                      if (index > 5) {
                        return;
                      }
                      return (
                        <VerticalCard
                          isRecentSearch={false}
                          typeId={user.id}
                          type="profile"
                          id={user.name}
                          name={user.name}
                          image={user.image ? user.image : ""}
                          modal="none"
                          key={index}
                          imageClassName="w-[180px] h-[180px]"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )
      )}
      {!loading &&
        users.length == 0 &&
        tracks.length == 0 &&
        artists.length == 0 && (
          <div className="font-bold text-xl flex items-center justify-center h-full">
            No results found for '{search}'
          </div>
        )}
      {loading && search != "" && (
        <div className="w-full h-full flex items-center justify-center">
          <SyncLoader size={20} color={"#fff"} />
        </div>
      )}
    </div>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
