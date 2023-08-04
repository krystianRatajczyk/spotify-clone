import { usePathname } from "next/navigation";
import React, { Dispatch, useEffect, useReducer } from "react";

//State

type InfoState = {
  search: string;
  sortTab: string;
  scrollTop: number;
};

//Action Type

type ActionType =
  | { type: "CHANGE_SEARCH"; payload: string }
  | { type: "CHANGE_SORT_TAB"; payload: string }
  | { type: "CHANGE_SCROLL_TOP"; payload: number };

//reducer func
const reducer = (state: InfoState, action: ActionType): InfoState => {
  switch (action.type) {
    case "CHANGE_SEARCH":
      return { ...state, search: action.payload };
    case "CHANGE_SORT_TAB":
      return { ...state, sortTab: action.payload };
    case "CHANGE_SCROLL_TOP":
      return { ...state, scrollTop: action.payload };
    default:
      //@ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//context object type {state, dispatch}
type ContextType = {
  state: InfoState;
  dispatch: Dispatch<ActionType>;
};

export const InfoContext = React.createContext<ContextType>({
  state: {
    search: "",
    sortTab: "All",
    scrollTop: 0,
  },
  dispatch: () => {},
});

export const InfoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    search: "",
    sortTab: "All",
    scrollTop: 0,
  });

  const pathname = usePathname();

  useEffect(() => {
    dispatch({ type: "CHANGE_SEARCH", payload: "" });
  }, [pathname]);

  return (
    <InfoContext.Provider value={{ state, dispatch }}>
      {children}
    </InfoContext.Provider>
  );
};
