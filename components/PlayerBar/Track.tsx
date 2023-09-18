import { MusicContext } from "@/context/MusicContext";
import { UserContext } from "@/context/User/UserContext";
import { addOrRemoveLikedSong } from "@/lib/track";
import Link from "next/link";
import React, { useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const Track = () => {
  const { state } = useContext(MusicContext);
  const { state: user, dispatch } = useContext(UserContext);
  const currentSong = state.currentSongs[state.currentIndex];

  const isLikedSong = user.liked.songs?.find(
    (s) => s.id === state.currentSongs[state.currentIndex]?.id
  );

  return (
    <div className="flex flex-row items-center gap-4 flex-[0.3]">
      {currentSong?.image && (
        <img
          src={currentSong.image}
          className="w-[60px] h-[60px] rounded-lg object-fit border-none"
        />
      )}
      <div className="flex flex-col">
        <Link
          href={{
            pathname: `/song/${currentSong?.id}`,
          }}
        >
          <h2 className="text-lg font-semibold">{currentSong?.name}</h2>
        </Link>
        <p className="text-lightGray text-[12px]">
          {currentSong?.artists.map((artist) => (
            <>
              <Link href={`/artist/${artist.id}`}>{artist.name}</Link>{" "}
            </>
          ))}
        </p>
      </div>
      {currentSong && (
        <div>
          {isLikedSong ? (
            <AiFillHeart
              size={20}
              color={"#1ed860"}
              onClick={() =>
                addOrRemoveLikedSong(
                  dispatch,
                  !!isLikedSong,
                  //@ts-ignore
                  state.currentSongs[state.currentIndex]
                )
              }
            />
          ) : (
            <AiOutlineHeart
              size={20}
              color={"#fff"}
              onClick={() =>
                addOrRemoveLikedSong(
                  dispatch,
                  !!isLikedSong,
                  //@ts-ignore
                  state.currentSongs[state.currentIndex]
                )
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Track;
