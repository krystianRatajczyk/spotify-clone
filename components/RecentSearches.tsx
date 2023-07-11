import { lastSearches } from "@/constants/dummyData";
import React from "react";
import VerticalCard from "./VerticalCard";

const RecentSearches = () => {
  return (
    <div>
      <h2 className="font-bold text-2xl">Recent searches</h2>
      <div className="grid gap-6 grid-cols-7 mt-4 overflow-x-hidden">
        {lastSearches.map((lastSearch: any) => {
          return <VerticalCard {...lastSearch} modal="cross" />;
        })}
      </div>
    </div>
  );
};

export default RecentSearches;
