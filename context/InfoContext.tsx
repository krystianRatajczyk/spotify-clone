import { usePathname } from "next/navigation";
import React, { Dispatch, useEffect, useReducer } from "react";

//State
type InfoState = {
  search: string;
  labelName: string;
  sortTab: string;
  scrollTop: number;
  absolute: boolean;
};

//Action Type

type ActionType =
  | { type: "CHANGE_SEARCH"; payload: string }
  | { type: "CHANGE_SORT_TAB"; payload: string }
  | { type: "CHANGE_SCROLL_TOP"; payload: number }
  | { type: "CHANGE_ABSOLUTE"; payload: boolean }
  | { type: "CHANGE_LABEL_NAME"; payload: string };

//reducer func
const reducer = (state: InfoState, action: ActionType): InfoState => {
  switch (action.type) {
    case "CHANGE_SEARCH":
      return { ...state, search: action.payload };
    case "CHANGE_SORT_TAB":
      return { ...state, sortTab: action.payload };
    case "CHANGE_SCROLL_TOP":
      return { ...state, scrollTop: action.payload };
    case "CHANGE_ABSOLUTE":
      return { ...state, absolute: action.payload };
    case "CHANGE_LABEL_NAME":
      return { ...state, labelName: action.payload };

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
    absolute: false,
    labelName: "",
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
    labelName: "",
    search: "",
    sortTab: "All",
    scrollTop: 0,
    absolute: false,
  });

  const pathname = usePathname();

  const absolutePathnames = [
    "/profile",
    "/song",
    "/artist",
    "/users",
    "/category",
    "/likedSongs",
    "/playlist",
  ];

  useEffect(() => {
    dispatch({ type: "CHANGE_SEARCH", payload: "" });

    const parts = pathname.split("/");
    const firstPart = "/" + parts[1];
    dispatch({
      type: "CHANGE_ABSOLUTE",
      payload: absolutePathnames.includes(firstPart),
    });
  }, [pathname]);

  return (
    <InfoContext.Provider value={{ state, dispatch }}>
      {children}
    </InfoContext.Provider>
  );
};
