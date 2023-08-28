import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";
import { User as UserValue } from "@/constants/dummyData";

type UserState = UserType;

export const recentSearchesReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "CLEAR_RECENT_SEARCHES": {
      return {
        ...state,
        recentSearches: [],
      };
    }
    case "ADD_RECENT_SEARCHES": {
      const newRecentSearches = [action.payload.item, ...state.recentSearches];

      return {
        ...state,
        recentSearches: newRecentSearches,
      };
    }
    case "REMOVE_RECENT_SEARCHES": {
      const newRecentSearches = state.recentSearches.filter(
        (item: { id: string }) => item.id !== action.payload.id
      );

      return {
        ...state,
        recentSearches: newRecentSearches,
      };
    }
    default:
      return {};
  }
};
