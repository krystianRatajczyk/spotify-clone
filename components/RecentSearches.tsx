import React, { useContext } from "react";
import VerticalCard from "./VerticalCard";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";

const RecentSearches = () => {
  const { state: user } = useContext(UserContext);

  if (!user.recentSearches.length) return null;

  const router = useRouter();

  return (
    <div className="mt-3">
      <div className="w-full flex justify-between">
        <h2 className="font-bold text-2xl">Recent searches</h2>
        {user.recentSearches.length > 7 && (
          <h3
            className="font-semibold text-gray-300"
            onClick={() => router.push("/recentSearches")}
          >
            Show all
          </h3>
        )}
      </div>
      <div className="grid gap-6 grid-cols-7 mt-4 overflow-x-auto">
        {user.recentSearches.map((item: any, index: number) => {
          if (index > 6) {
            return null;
          }
          return (
            <div className="col-span-1" key={index}>
              <VerticalCard
                {...item}
                modal={item.type == "profile" ? "cross" : "both"}
                isRecentSearch
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentSearches;
