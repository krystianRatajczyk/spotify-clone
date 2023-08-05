import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useContext } from "react";

const useClearRecentSearch = () => {
  const { dispatch } = useContext(UserContext);

  const clearRecentSearch = async (callback?: () => void) => {
    dispatch({
      type: "CLEAR_RECENT_SEARCHES",
    });

    callback && callback();

    await axios.get("/api/actions/recentSearch/clearRecentSearch");
  };

  return [clearRecentSearch];
};

export default useClearRecentSearch;
