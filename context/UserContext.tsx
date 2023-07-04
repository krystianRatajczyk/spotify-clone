import { User } from "@prisma/client";
import axios from "axios";
import React, { Dispatch, useEffect, useReducer } from "react";

//State

type UserState = User | { name: ""; image: "" };

//Action Type

type ActionType = { type: "CHANGE_PROFILE"; payload: User };

//reducer func
const reducer = (state: UserState, action: ActionType): UserState => {
  switch (action.type) {
    case "CHANGE_PROFILE":
      return action.payload;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//context object type {state, dispatch}
type ContextType = {
  state: UserState;
  dispatch: Dispatch<ActionType>;
};

export const UserContext = React.createContext<ContextType>({
  state: { name: "", image: "" },
  dispatch: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, { name: "", image: "" });

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
