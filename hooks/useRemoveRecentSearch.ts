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

  return [removeRecentSearch];
};

export default useRemoveRecentSearch;
