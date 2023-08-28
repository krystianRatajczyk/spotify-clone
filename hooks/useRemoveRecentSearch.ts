import { UserContext } from "@/context/User/UserContext";
import axios from "axios";
import { useContext } from "react";

const useRemoveRecentSearch = () => {
  const { dispatch } = useContext(UserContext);

  const removeRecentSearch = async (id: string) => {
    dispatch({
      type: "REMOVE_RECENT_SEARCHES",
      payload: { id },
    });

    await axios.post("/api/actions/recentSearch/removeRecentSearch", {
      id,
    });
  };

  return [removeRecentSearch];
};

export default useRemoveRecentSearch;
