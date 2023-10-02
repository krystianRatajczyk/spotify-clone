import React, { useContext, useEffect, useRef, useState } from "react";
import VerticalCard from "./VerticalCard";
import { UserContext } from "@/context/User/UserContext";
import { useRouter } from "next/router";
import useGrid from "@/hooks/useGrid";

const RecentSearches = () => {
  const { state: user } = useContext(UserContext);

  if (!user.recentSearches.length) return null;

  const router = useRouter();
  const parent = useRef<HTMLDivElement>(null);

  const amount = useGrid(6, 200, parent);

  return (
    <div className="mt-3" ref={parent}>
      <div className="w-full flex justify-between">
        <h2 className="font-bold text-2xl">Recent searches</h2>
        {user.recentSearches.length > amount && (
          <h3
            className="font-semibold text-gray-300"
            onClick={() => router.push("/recentSearches")}
          >
            Show all
          </h3>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: `repeat(${amount}, minmax(0, 1fr))`,
          overflowX: "auto",
          marginTop: "1rem",
        }}
      >
        {user.recentSearches
          .slice(0, amount)
          .map((item: any, index: number) => (
            <div className="col-span-1" key={index}>
              <VerticalCard {...item} modal={"cross"} isRecentSearch />
            </div>
          ))}
      </div>
    </div>
  );
};

export default RecentSearches;
