import { User as UserValue } from "@/constants/dummyData";
import { User as UserType } from "@prisma/client";
import axios from "axios";
import { usePathname } from "next/navigation";
import React, { Dispatch, useEffect, useReducer } from "react";

//State

type UserState = {
  user: UserType;
  search: string;
  sortTab: string;
};

//Action Type

type ActionType =
  | { type: "CHANGE_PROFILE"; payload: UserType }
  | { type: "CHANGE_SEARCH"; payload: string }
  | { type: "CHANGE_SORT_TAB"; payload: string };

//reducer func
const reducer = (state: UserState, action: ActionType): UserState => {
  switch (action.type) {
    case "CHANGE_PROFILE":
      return { ...state, user: action.payload };
    case "CHANGE_SEARCH":
      return { ...state, search: action.payload };
    case "CHANGE_SORT_TAB":
      return { ...state, sortTab: action.payload };
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
  state: {
    user: UserValue,
    search: "",
    sortTab: "All",
  },
  dispatch: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    user: UserValue,
    search: "",
    sortTab: "All",
  });

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

  const pathname = usePathname();

  useEffect(() => {
    dispatch({ type: "CHANGE_SEARCH", payload: "" });
  }, [pathname]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
