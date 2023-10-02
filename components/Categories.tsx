import { musicTypes } from "@/constants/dummyData";
import React, { useRef } from "react";
import SquareCard from "./SquareCard";
import useGrid from "@/hooks/useGrid";

const Categories = () => {
  const parent = useRef<HTMLDivElement>(null);
  const amount = useGrid(5, 230, parent);

  return (
    <div className="mb-[70px]" ref={parent}>
      <h2 className="font-bold text-2xl my-3">Browse all</h2>
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: `repeat(${amount}, minmax(0, 1fr))`,
        }}
      >
        {musicTypes.map((music: any, index: number) => {
          return <SquareCard {...music} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Categories;
