import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AiFillHome, AiOutlineSearch } from "react-icons/ai";
import { VscLibrary } from "react-icons/vsc";
import { BsPlus } from "react-icons/bs";
import Box from "./Box";
import Link from "next/link";

const Sidebar: React.FC = () => {

  //const navLinks = {};

  return (
    <div className="flex w-[540px] flex-col gap-2">
      <div className="flex bg-darkGray px-5 py-4 flex-col w-full gap-5 rounded-xl ">
        <Link href="/">
          <div className="flex gap-4 items-center ">
            <AiFillHome size={30} color="#B3B3B3" />
            <h3 className="font-bold ">Home</h3>
          </div>
        </Link>

        <Link href="/search">
          <div className="flex gap-4 items-center ">
            <AiOutlineSearch size={30} />
            <h3 className="font-bold text-lightGray">Search</h3>
          </div>
        </Link>
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
