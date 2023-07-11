import React, { useContext, useState } from "react";
import Button from "./Button";
import { UserContext } from "@/context/UserContext";

const sortTabsArray = ["All", "Artists", "Songs", "Playlists", "Profiles"];

const SortTabs = () => {
  const { state, dispatch } = useContext(UserContext);

  return (
    <div className="w-full flex gap-2 -mt-3 items-center mb-3">
      {sortTabsArray.map((tab: string) => {
        return (
          <Button
            onClick={() => dispatch({ type: "CHANGE_SORT_TAB", payload: tab })}
            className={`${
              tab != state.sortTab ? "bg-[#2a2a2a] text-white" : ""
            } text-base font-normal`}
          >
            {tab}
          </Button>
        );
      })}
    </div>
  );
};

export default SortTabs;
