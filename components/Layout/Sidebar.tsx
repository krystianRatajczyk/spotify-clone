import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { VscLibrary } from "react-icons/vsc";
import { RiHomeFill, RiHomeLine } from "react-icons/ri";
import { RiSearchFill, RiSearchLine } from "react-icons/ri";
import { BsPlus } from "react-icons/bs";
import Box from "./Box";
import Link from "next/link";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = useMemo(
    () => [
      {
        id: 1,
        label: "Home",
        active: pathname != "/search",
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

  return (
    <div className="flex w-[540px] flex-col gap-2">
      <div className="flex bg-darkGray px-5 py-4 flex-col w-full gap-5 rounded-xl ">
        {navLinks.map((navLink) => {
          return <SidebarItem {...navLink} key={navLink.id} />;
        })}
      </div>
      <div className="flex bg-darkGray p-4 flex-col h-full rounded-xl">
        <div className="flex justify-between items-center ">
          <div className="flex gap-4 items-center">
            <VscLibrary size={30} />
            <h3 className="font-bold text-lightGray">Library</h3>
          </div>
          <div>
            <BsPlus size={30} color="#B3B3B3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
