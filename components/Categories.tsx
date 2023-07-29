import { musicTypes } from "@/constants/dummyData";
import React from "react";
import SquareCard from "./SquareCard";

const Categories = () => {
  return (
    <div className="mb-[70px]">
      <h2 className="font-bold text-2xl my-3">Browse all</h2>
      <div className="grid grid-cols-6 gap-5">
        {musicTypes.map((music: any, index: number) => {
          return <SquareCard {...music} key={index}/>;
        })}
      </div>
    </div>
  );
};

export default Categories;
