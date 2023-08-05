import { UserContext } from "@/context/UserContext";
import { generateUniqueId } from "@/lib/track";
import axios from "axios";
import { useContext } from "react";

const useAddRecentSearch = () => {
  const { state: user, dispatch } = useContext(UserContext);

  const addRecentSearch = async (item: {
    name: string;
    type: string;
    image: string;
    typeId: string;
  }) => {
    if (user.recentSearches[0]?.name != item.name) {
      if (item.type == "users") item.type = "profile";
      const itemWithId = {
        ...item,
        id: generateUniqueId(),
      };

      dispatch({
        type: "ADD_RECENT_SEARCHES",
        payload: {
          item: { ...itemWithId },
        },
      });

      await axios.post("/api/actions/recentSearch/addRecentSearch", {
        item: itemWithId,
      });
    }
  };

  return [addRecentSearch];
};

export default useAddRecentSearch;
