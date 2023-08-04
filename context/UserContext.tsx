import { User as UserValue } from "@/constants/dummyData";
import { User as UserType } from "@/constants/formattedTypesPrisma";

import axios from "axios";
import React, { Dispatch, useEffect, useReducer } from "react";

//State

type UserState = UserType;

//Action Type
type ActionType =
  | { type: "CHANGE_PROFILE"; payload: UserType }
  | {
      type: "ADD_RECENT_SEARCHES";
      payload: {
        item: { id: string; name: string; image: string; type: string };
      };
    }
  | { type: "REMOVE_RECENT_SEARCHES"; payload: { id: string } }
  | { type: "CLEAR_RECENT_SEARCHES" };

//reducer func
const reducer = (state: UserState, action: ActionType): UserState => {
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
        (item: { id: string }) => item.id != action.payload.id
      );

      return {
        ...state,
        recentSearches: newRecentSearches,
      };
    }
    case "CHANGE_PROFILE":
      return action.payload;
    default:
      //@ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//context object type {state, dispatch}
type ContextType = {
  state: UserState;
  dispatch: Dispatch<ActionType>;
};

export const UserContext = React.createContext<ContextType>({
  state: UserValue,
  dispatch: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, UserValue);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await axios.get("/api/current");

        dispatch({ type: "CHANGE_PROFILE", payload: currentUser.data });
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []); // Empty dependency array to ensure the effect runs only once on app load

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
