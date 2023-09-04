import { UserContext } from "@/context/User/UserContext";
import { addOrRemoveLikedSong } from "@/lib/track";
import { Artist } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { IconType } from "react-icons";
import { BsSearch } from "react-icons/bs";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

type Song = {
  id: string;
  name: string;
  image: string;
  duration: number;
  artists: Artist[];
  previousRank: number;
  currentRank: number;
  releaseDate: string;
};

interface ContextMenuItemProps {
  contextItem: {
    icon?: IconType;
    closeIcon?: IconType;
    label: string;
    id: number;
    display?: boolean;
  };
  onClose: () => void;
  song: Song;
  onClick: () => void;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  contextItem,
  onClose,
  song,
  onClick,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const { state: user, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState<string>("");
  const [playlist, setPlaylist] = useState(user.playlists);

  useEffect(() => {
    if (search == "") {
      setPlaylist(user.playlists);
    } else {
      setPlaylist(
        user.playlists.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  return (
    <div className="relative">
      <div
        className="flex p-2 gap-2 items-center hover:bg-[#3e3e3e]"
        onClick={(e) => {
          e.preventDefault();
          if (!contextItem.icon) {
            onClick();
            onClose();
          }

          contextItem.icon && setOpen((prev) => !prev);
        }}
      >
        <h2
          className="text-white whitespace-nowrap 
  text-[16px] font-semibold"
        >
          {contextItem.label}
        </h2>
        {contextItem.icon && open ? (
          <contextItem.icon size={16} color="#fff" />
        ) : (
          contextItem.closeIcon &&
          !open && <contextItem.closeIcon size={16} color="#fff" />
        )}
      </div>
      {open && contextItem.icon && (
        <div
          className="absolute translate-x-[-101%] translate-y-[-37px]
        flex flex-col  bg-[#282828] p-1 rounded-md"
        >
          <div className="bg-[#3e3e3e] mb-1 rounded-md p-2 flex gap-2 items-center">
            <BsSearch size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Find a playlist"
              className="bg-transparent outline-none"
            />
          </div>
          {playlist?.map((playlist) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                onClose();
                dispatch({
                  type: "ADD_SONG_TO_PLAYLIST",
                  payload: { playlistId: playlist.id, song: song },
                });
              }}
              key={playlist.id}
              className="flex p-2 gap-2 items-center hover:bg-[#3e3e3e] relative"
            >
              <h2
                className="text-white whitespace-nowrap 
            text-[16px] font-medium"
              >
                {playlist.name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ContextMenuProps {
  onClose: () => void;
  song: Song;
  isSongLiked: boolean;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  onClose,
  song,
  isSongLiked,
}) => {
  const { state: user, dispatch } = useContext(UserContext);
  const pathname = usePathname();

  const getLikeSongsLabel = () => {
    let likedLabel = "";

    if (isSongLiked) likedLabel = "Remove from ";
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
      onClick: () => {},
      display: true,
    },
    {
      id: 2,
      label: "Remove from this playlist",
      onClick: () => {
        playlist &&
          dispatch({
            type: "REMOVE_SONG_FROM_PLAYLIST",
            payload: { songId: song.id, playlistId: playlist.id },
          });
      },
      display: displayRemoveFromPlaylist(),
    },
    {
      id: 3,
      label: getLikeSongsLabel(),
      //@ts-ignore
      onClick: addOrRemoveLikedSong.bind(null, dispatch, isSongLiked, song),
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
    <div
      className="absolute translate-x-[-90%] translate-y-[-100%] 
    z-[200] flex flex-col  bg-[#282828] p-1 rounded-md"
    >
      {contextMenu.map((contextItem) => {
        if (contextItem.display) {
          return (
            <ContextMenuItem
              key={contextItem.id}
              contextItem={contextItem}
              onClose={onClose}
              song={song}
              onClick={contextItem.onClick}
            />
          );
        }
      })}
    </div>
  );
};

export default ContextMenu;
