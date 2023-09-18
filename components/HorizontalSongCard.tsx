import useAddRecentSearch from "@/hooks/useAddRecentSearch";
import useHover from "@/hooks/useHover";
import { addOrRemoveLikedSong, convertTime } from "@/lib/track";
import { Artist } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import Triangle from "./Layout/Triangle";
import { UserContext } from "@/context/User/UserContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import CircularButton from "./Layout/CircularButton";
import { BiDotsHorizontalRounded, BiPause } from "react-icons/bi";
import ContextMenu from "./ContextMenu";
import { InfoContext } from "@/context/InfoContext";
import { usePathname } from "next/navigation";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { MusicContext } from "@/context/MusicContext";

interface HorizontalSongCardProps {
  id: string;
  image: string;
  name: string;
  duration: number;
  currentRank: number;
  previousRank: number;
  releaseDate: string;
  artists: Artist[];
  withNo?: boolean;
  withDate?: boolean;
  withRank?: boolean;
  index?: number;
  isSearchCard?: boolean;
  playSong?: () => void;
}

const HorizontalSongCard: React.FC<HorizontalSongCardProps> = ({
  id,
  image,
  name,
  duration,
  artists,
  withNo,
  index,
  isSearchCard,
  releaseDate,
  withDate,
  currentRank,
  previousRank,
  playSong,
}) => {
  const track = {
    id,
    image,
    name,
    duration,
    artists,
    releaseDate,
    currentRank,
    previousRank,
  };
  const divRef = useRef<HTMLDivElement>(null);
  const [isHover] = useHover(divRef);
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  const { state: user, dispatch } = useContext(UserContext);
  const { dispatch: InfoDispatch } = useContext(InfoContext);
  const { state: music, dispatch: MusicDispatch } = useContext(MusicContext);

  const [addRecentSearch] = useAddRecentSearch();
  const isLikedSong = user.liked.songs?.find((s) => s.id === id);

  const buttonRef = useRef<HTMLDivElement>(null);

  const [initialize, setInitialize] = useState<boolean>(false);

  useEffect(() => {
    if (initialize) {
      InfoDispatch({ type: "SET_SCROLL", payload: !optionsOpen });
    } else {
      setInitialize(true);
    }
  }, [optionsOpen]);
  const pathname = usePathname();
  const getLikeSongsLabel = () => {
    let likedLabel = "";

    if (isLikedSong) likedLabel = "Remove from ";
    else likedLabel = "Save to ";
    return likedLabel + "your liked songs";
  };

  const playlist = user.playlists.find((p) => p.id === pathname.split("/")[2]);

  const displayRemoveFromPlaylist = () => {
    const isInPlaylists = pathname.includes("/playlist") && playlist;

    return !!isInPlaylists;
  };

  const contextMenu = [
    {
      id: 1,
      label: "Add to queue",
      onClick: () => {
        InfoDispatch({
          type: "SET_NOTIFICATION",
          payload: {
            message: "Added to queue",
            color: "bg-blue",
            display: true,
          },
        });
      },
      display: true,
    },
    {
      id: 2,
      label: "Remove from this playlist",
      onClick: () => {
        if (playlist) {
          let songName = name;
          if (name.length > 45) {
            songName = name.slice(0, 45) + "...";
          }
          dispatch({
            type: "REMOVE_SONG_FROM_PLAYLIST",
            payload: { songId: id, playlistId: playlist.id },
          });
          InfoDispatch({
            type: "SET_NOTIFICATION",
            payload: {
              message: `Removed ${songName} from ${playlist.name}`,
              color: "bg-blue",
              display: true,
            },
          });
        }
      },
      display: displayRemoveFromPlaylist(),
    },
    {
      id: 3,
      label: getLikeSongsLabel(),
      //@ts-ignore
      onClick: () => {
        addOrRemoveLikedSong(dispatch, !!isLikedSong, track);
        InfoDispatch({
          type: "SET_NOTIFICATION",
          payload: {
            message: `${
              isLikedSong ? `Removed from ` : `Added to `
            } your liked songs`,
            color: "bg-blue",
            display: true,
          },
        });
      },
      display: true,
    },
    {
      id: 4,
      label: "Add to playlist",
      icon: MdArrowForwardIos,
      closeIcon: MdArrowBackIos,
      onClick: () => {},
      display: true,
    },
  ];

  return (
    <Link
      href={{ pathname: `/song/${id}`, query: { id } }}
      onClick={async () => {
        if (isSearchCard && addRecentSearch) {
          await addRecentSearch({
            name,
            image,
            type: "track",
            typeId: id,
          });
        }
      }}
    >
      <div
        className={`w-full p-2 pl-5 rounded-md ${
          !optionsOpen && "hover:bg-[rgba(0,0,0,0.4)]"
        } justify-between 
        flex-row flex items-center ${optionsOpen && "bg-[#313131]"}`}
        ref={divRef}
      >
        <div className="flex flex-row gap-4 items-center relative flex-[0.7]">
          {withNo && !isHover && (
            <div
              className={`${
                music.currentSongs[music.currentIndex]?.id == id
                  ? "text-primary"
                  : "text-[#757575]"
              } font-semibold  justify-end flex w-[18px] gap-1 flex-col items-center`}
            >
              {index}
              <Triangle previousRank={previousRank} currentRank={currentRank} />
            </div>
          )}
          {withNo && isHover && (
            <div
              className="w-[18px]"
              onClick={(e) => {
                e.preventDefault();
                playSong && playSong();
              }}
            >
              {music.currentSongs[music.currentIndex]?.id === id ? (
                <BiPause size={19} />
              ) : (
                <BsFillPlayFill size={19} />
              )}
            </div>
          )}
          <div className="relative flex items-center justify-center">
            <img src={image} alt="" className="w-[40px] h-[40px]" />
            {isHover && !withNo && (
              <BsFillPlayFill size={25} className="absolute" />
            )}
          </div>

          <div className="flex flex-col justify-between">
            <h3
              className={`font-semibold ${
                music.currentSongs[music.currentIndex]?.id == id &&
                "text-primary"
              }`}
            >
              {name}
            </h3>
            <p className="text-lightGray">
              {artists?.map((artist: Artist, index: number) => {
                if (index == artists.length - 1) {
                  return (
                    <Link
                      href={{
                        pathname: `/artist/${artist.id}`,
                        query: artist,
                      }}
                    >
                      {artist.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    href={{ pathname: `/artist/${artist.id}`, query: artist }}
                  >
                    {artist.name + " • "}
                  </Link>
                );
              })}
            </p>
          </div>
        </div>

        <div
          className={`flex flex-row flex-[0.3] items-center ${
            withDate ? "justify-between" : "justify-end"
          } `}
        >
          {withDate && (
            <div className="text-[#757575] font-semibold text-sm">
              {format(new Date(releaseDate), "d MMM yyyy")}
            </div>
          )}
          <div className="text-sm text-[#757575] flex items-center gap-6">
            {isLikedSong ? (
              <AiFillHeart
                color="#1ed860"
                size={25}
                onClick={(e) => {
                  e.preventDefault();
                  //@ts-ignore
                  addOrRemoveLikedSong(dispatch, !!isLikedSong, track);
                }}
              />
            ) : (
              isHover && (
                <AiOutlineHeart
                  color="#fff"
                  size={25}
                  onClick={(e) => {
                    e.preventDefault();
                    //@ts-ignore
                    addOrRemoveLikedSong(dispatch, !!isLikedSong, track);
                  }}
                />
              )
            )}
            <div>{convertTime(duration).formattedTime}</div>
            {
              <div className="relative">
                {optionsOpen && (
                  <ContextMenu
                    onClose={() => setOptionsOpen(false)}
                    song={{
                      id,
                      image,
                      name,
                      duration,
                      artists,
                      releaseDate,
                      currentRank,
                      previousRank,
                    }}
                    contextMenu={contextMenu}
                    className="translate-x-[-90%] translate-y-[-100%] "
                    buttonRef={buttonRef}
                    setOptionsOpen={setOptionsOpen}
                  />
                )}
                <div ref={buttonRef}>
                  <CircularButton
                    hoverClassName="bg-[#212121]"
                    onClick={(e) => {
                      e.preventDefault();
                      // Toggle the options menu
                      setOptionsOpen(!optionsOpen);
                    }}
                  >
                    <BiDotsHorizontalRounded
                      size={30}
                      color={isHover ? `#B3B3B3` : "rgba(0,0,0,0)"}
                    />
                  </CircularButton>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalSongCard;
