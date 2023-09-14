import Link from "next/link";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";

const Track = () => {
  return (
    <div className="flex flex-row items-center  gap-4">
      <div className={`w-[60px] h-[60px] rounded-lg bg-darkGray`} />
      <div className="flex flex-col">
        <Link
          href={{
            pathname: `/songs/songId`,
          }}
        >
          <h2 className="text-lg font-semibold">BURN IT DOWN</h2>
        </Link>
        <p className="text-lightGray text-[12px]">Linkin Park</p>
      </div>
      <div>
        <AiOutlineHeart size={20} color={"lightGray"} className=""/>
      </div>
    </div>
  );
};

export default Track;
