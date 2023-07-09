import React, { useMemo, useState } from "react";
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

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const [isLibraryOpened, setIsLibraryOpened] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [isPlusHover, setIsPlusHover] = useState(false);

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

  return (
    <div className={`flex ${isLibraryOpened && "w-[540px]"} flex-col gap-2`}>
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
      <div className="flex bg-darkGray py-4 px-3 flex-col h-full rounded-xl gap-4">
        <div className="flex justify-between items-center cursor-pointer px-2">
          <div
            className="flex gap-4 items-center justify-center"
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
              hoverClassName="bg-[#212121] "
              isHover={getHoverState}
            >
              <BsPlus size={30} color={!isPlusHover ? `#B3B3B3` : "#ffff"} />
            </CircularButton>
          )}
        </div>
        <Library isLibraryOpened={isLibraryOpened} />
      </div>
    </div>
  );
};

export default Sidebar;
