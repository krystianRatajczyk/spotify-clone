import React, { useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { VscLibrary } from "react-icons/vsc";
import {
  RiHomeFill,
  RiHomeLine,
  RiSearchFill,
  RiSearchLine,
} from "react-icons/ri";
import { BiLibrary } from "react-icons/bi";
import { BsPlus } from "react-icons/bs";
import SidebarItem from "./SidebarItem";
import CircularButton from "./CircularButton";
import Library from "./Library";
import { UserContext } from "@/context/User/UserContext";
import axios from "axios";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const [isLibraryOpened, setIsLibraryOpened] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [isPlusHover, setIsPlusHover] = useState(false);
  const { state: user, dispatch } = useContext(UserContext);

  const navLinks = useMemo(
    () => [
      {
        id: 1,
        label: "Home",
        active: pathname == "/",
        href: "/",
        icon: RiHomeLine,
        activeIcon: RiHomeFill,
      },
      {
        id: 2,
        label: "Search",
        active: pathname == "/search",
        href: "/search",
        icon: RiSearchLine,
        activeIcon: RiSearchFill,
      },
    ],
    [pathname]
  );

  const getHoverState = (state: boolean) => {
    setIsPlusHover(state);
  };

  const createPlaylist = async () => {
    dispatch({ type: "CREATE_PLAYLIST" });
    const res = await axios.post("/api/actions/playlist/createPlaylist", {
      user,
    });

    dispatch({ type: "CHANGE_PLAYLIST_ID", payload: { newId: res.data.id } });
    
  };

  return (
    <div
      className={`flex ${isLibraryOpened && "w-[520px]"}
      flex-col gap-2 h-full`}
    >
      <div className="flex bg-darkGray px-5 py-4 flex-col w-full gap-5 rounded-xl ">
        {navLinks.map((navLink) => {
          return (
            <SidebarItem
              {...navLink}
              key={navLink.id}
              isLibraryOpened={isLibraryOpened}
            />
          );
        })}
      </div>
      <div className="flex flex-1 bg-darkGray overflow-auto py-4 flex-col rounded-xl gap-4">
        <div className="flex h-fit justify-between items-center cursor-pointer px-2">
          <div
            className="flex gap-4 px-3 items-center justify-center"
            onClick={() => setIsLibraryOpened((prev) => !prev)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {isLibraryOpened ? (
              <BiLibrary size={32} color={isHover ? `#ffff` : "#B3B3B3"} />
            ) : (
              <VscLibrary size={30} color={isHover ? `#ffff` : "#B3B3B3"} />
            )}
            {isLibraryOpened && (
              <h3
                className={`font-bold ${
                  isHover ? `text-[#ffff]` : "text-[#B3B3B3]"
                }`}
              >
                Library
              </h3>
            )}
          </div>
          {isLibraryOpened && (
            <CircularButton
              onClick={createPlaylist}
              hoverClassName="bg-[#212121] "
              isHover={getHoverState}
            >
              <BsPlus size={30} color={!isPlusHover ? `#B3B3B3` : "#ffff"} />
            </CircularButton>
          )}
        </div>
        <div className="px-2 flex-1 overflow-scroll no-scrollbar">
          <Library isLibraryOpened={isLibraryOpened} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
