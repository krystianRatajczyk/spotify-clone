import { lastSearches } from "@/constants/dummyData";
import React from "react";
import VerticalCard from "./VerticalCard";

const RecentSearches = () => {
  return (
    <div className="mt-3">
      <h2 className="font-bold text-2xl">Recent searches</h2>
      <div className="grid gap-6 grid-cols-7 mt-4 overflow-x-hidden">
        {lastSearches.map((lastSearch: any, index: number) => {
          return <VerticalCard {...lastSearch} modal="cross" key={index} />;
        })}
      </div>
    </div>
  );
};

export default RecentSearches;
