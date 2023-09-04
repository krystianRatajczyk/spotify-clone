import { UserContext } from "@/context/User/UserContext";
import { arrayEquals } from "@/lib/track";
import axios from "axios";
import { useContext, useEffect } from "react";

const useRemoveRecentSearch = () => {
  const { state, dispatch } = useContext(UserContext);

  const removeRecentSearch = async (id: string) => {
    dispatch({
      type: "REMOVE_RECENT_SEARCHES",
      payload: { id },
    });

    await axios.post("/api/actions/recentSearch/removeRecentSearch", {
      updateRecentSearches: state.recentSearches,
    });
  };

  // useEffect(() => {
  //   console.log("run");
  //   const timeout = setTimeout(async () => {
  //     const user = await axios.get("/api/current");

  //     const databaseRecentSearchIds = user.data.recentSearches.map(
  //       (r: any) => r.id
  //     );
  //     console.log(userRecentSearchIds, databaseRecentSearchIds);
  //     if (!arrayEquals(userRecentSearchIds, databaseRecentSearchIds)) {
  //       console.log("udapting");
  //
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timeout);
  // }, [userRecentSearchIds]);

  return [removeRecentSearch];
};

export default useRemoveRecentSearch;
