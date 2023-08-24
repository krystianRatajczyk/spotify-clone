import { VerticalCard } from "@/components";
import { UserContext } from "@/context/UserContext";
import useClearRecentSearch from "@/hooks/useClearRecentSearch";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const recentSearches = () => {
  const { state: user } = useContext(UserContext);

  if (!user.recentSearches.length)
    return <div className="w-full h-full bg-darkGray" />;

  const router = useRouter();

  const [clearRecentSearch] = useClearRecentSearch();

  return (
    <div className="px-5 flex-1 bg-darkGray overflow-y-scroll no-scrollbar w-full h-full">
      <div className="w-full flex justify-between mt-3">
        <h2 className="font-bold text-2xl">Recent searches</h2>
        <h3
          className="font-semibold text-gray-300"
          onClick={() => {
            clearRecentSearch(() => router.push("/search"));
          }}
        >
          Clear recent searches
        </h3>
      </div>
      <div className="grid gap-6 grid-cols-7 mt-4 overflow-x-auto">
        {user.recentSearches.map((item: any, index: number) => {
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

export default recentSearches;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
