import Categories from "@/components/Categories";
import HorizontalSongCard from "@/components/HorizontalSongCard";
import PlayPause from "@/components/PlayPause";
import RecentSearches from "@/components/RecentSearches";
import VerticalCard from "@/components/VerticalCard";

import { UserContext } from "@/context/UserContext";
import useHover from "@/hooks/useHover";
import prisma from "@/lib/prismadb";
import { Artist, Track, User } from "@prisma/client";
import axios from "axios";

import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

const types = ["track", "artist", "user"];

const Search = () => {
  const {
    state: { search, sortTab },
    dispatch,
  } = useContext(UserContext);

  const [initialized, setInitialized] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // const divRef = useRef<HTMLDivElement>(null);
  // const [isHover] = useHover(divRef);

  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    if (initialized) {
      const timeout = setTimeout(async () => {
        if (search != "") {
          let users = [];
          let tracks = [];
          let artists = [];
          for (const type of types) {
            setLoading(true);
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
          setLoading(false);
          setTracks(tracks);
          setArtists(artists);
          setUsers(users);
        } else {
          setLoading(true);
          setTracks([]);
          setArtists([]);
          setUsers([]);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
    setInitialized(true);
  }, [search, initialized]);

  return (
    <div
      className={`px-5  ${
        sortTab == "Songs" ? "px-8" : "px-5"
      }py-4 flex-1 bg-darkGray overflow-y-scroll no-scrollbar`}
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
                <div className="flex-[.4]">
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
              )}
              {tracks.length > 0 &&
                (sortTab == "All" || sortTab == "Songs") && (
                  <div
                    className={` ${
                      sortTab == "Songs" ? "flex-1 relative" : "flex-[0.6]"
                    }`}
                  >
                    {sortTab == "All" && (
                      <h2 className="font-bold text-2xl mb-4">Songs</h2>
                    )}
                    {sortTab == "Songs" && (
                      <div className="w-full sticky top-0 z-[100] mb-2 bg-darkGray text-[#757575]">
                        <div className="flex justify-between pl-8 p-1 pr-2">
                          <div className="flex gap-4">
                            <span>#</span>
                            <h2>Title</h2>
                          </div>
                          <AiOutlineClockCircle size={20} color={"#757575"} />
                        </div>
                        <div className="w-full h-[1px] bg-[#2a2a2a]" />
                      </div>
                    )}
                    {tracks.map((track: Track, index: number) => {
                      if (index > 4 && sortTab != "Songs") {
                        return;
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
                          type="artist"
                          name={artist.name}
                          image={artist.image}
                          modal="playpause"
                          imageClassName="w-[180px] h-[180px]"
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
                          type="profile"
                          name={user.name}
                          image={user.image ? user.image : ""}
                          modal="none"
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
    </div>
  );
};

export default Search;
