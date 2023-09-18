import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/User/UserContext";
import { Artist } from "@prisma/client";
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import { BsSearch } from "react-icons/bs";
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
  song?: Song;
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
  const { dispatch: InfoDispatch } = useContext(InfoContext);
  const [search, setSearch] = useState<string>("");
  const [playlists, setPlaylists] = useState(user.playlists);

  useEffect(() => {
    if (search == "") {
      setPlaylists(user.playlists);
    } else {
      setPlaylists(
        user.playlists.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [translate, setTranslate] = useState<boolean>(false);

  useEffect(() => {
    if (open && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      if (buttonRect.bottom > window.innerHeight - 80) {
        // playlist list doesnt fit in screen
        setTranslate(true);
      }
    }
  }, [open, buttonRef]);

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
          ref={buttonRef}
          className={`absolute translate-x-[-101%] ${
            !translate && "translate-y-[-37px]"
          }
        flex flex-col  bg-[#282828] p-1 rounded-md`}
          style={translate ? { bottom: "-4px" } : {}}
        >
          <div className="bg-[#3e3e3e] mb-1 rounded-md p-2 flex gap-2 items-center">
            <BsSearch size={15} />
            <input
              onClick={(e) => e.preventDefault()}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Find a playlist"
              className="bg-transparent outline-none"
            />
          </div>
          {playlists?.map((playlist) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const index = user.playlists.findIndex(
                  (p) => p.id === playlist.id
                );
                const isExisting = !!user.playlists[index].tracks?.find(
                  (s: any) => s.id === song?.id
                );
                if (isExisting) {
                  InfoDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                      message: `Song is already in this playlist`,
                      color: "bg-red-600",
                      display: true,
                    },
                  });
                } else {
                  let songName = song?.name;
                  if (song?.name.length! > 45) {
                    songName = song?.name.slice(0, 45) + "...";
                  }
                  dispatch({
                    type: "ADD_SONG_TO_PLAYLIST",
                    payload: { song: song, index },
                  });

                  InfoDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                      message: `Added ${songName} to ${playlist.name}`,
                      color: "bg-blue",
                      display: true,
                    },
                  });
                }
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
  song?: Song;
  className: string;
  setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: RefObject<HTMLDivElement>;
  contextMenu: {
    id: number;
    label: string;
    icon?: IconType;
    closeIcon?: IconType;
    onClick: () => void;
    display: boolean;
  }[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  onClose,
  song,
  setOptionsOpen,
  buttonRef,
  className,
  contextMenu,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      !menuRef.current?.contains(e.target as Node) &&
      !buttonRef.current?.contains(e.target as Node)
    ) {
      // Clicked outside of the button, so close the context menu
      setOptionsOpen(false);
    }
  };

  // Add a click event listener to the document body when the component mounts
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`absolute ${className}
    z-[200] flex flex-col  bg-[#282828] p-1 rounded-md`}
    >
      {contextMenu?.map((contextItem) => {
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
