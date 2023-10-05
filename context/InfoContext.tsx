import { Track } from "@prisma/client";
import { usePathname } from "next/navigation";
import React, { Dispatch, useEffect, useReducer } from "react";

//State
type InfoState = {
  search: string;
  labelName: string;
  sortTab: string;
  scrollTop: number;
  absolute: boolean;
  scroll: boolean;
  notification: { message: string; color: string; display: boolean };
  songsToPlay: Track[];
  playlistId: string;
};

//Action Type

type ActionType =
  | { type: "CHANGE_SEARCH"; payload: string }
  | { type: "CHANGE_SORT_TAB"; payload: string }
  | { type: "CHANGE_SCROLL_TOP"; payload: number }
  | { type: "CHANGE_ABSOLUTE"; payload: boolean }
  | { type: "SET_SCROLL"; payload: boolean }
  | {
      type: "SET_SONGS_AND_LABEL";
      payload: { tracks: Track[]; playlistId: string; label: string };
    }
  | {
      type: "SET_NOTIFICATION";
      payload: { message?: string; color?: string; display?: boolean };
    };

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
    case "SET_SCROLL":
      return { ...state, scroll: action.payload };
    case "SET_SONGS_AND_LABEL":
      return {
        ...state,
        songsToPlay: action.payload.tracks,
        playlistId: action.payload.playlistId,
        labelName: action.payload.label,
      };
    case "SET_NOTIFICATION":
      return {
        ...state,
        notification: { ...state.notification, ...action.payload },
      };
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
    scroll: true,
    notification: { message: "", color: "", display: false },
    songsToPlay: [],
    playlistId: "",
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
    scroll: true,
    notification: { message: "", color: "", display: false },
    songsToPlay: [],
    playlistId: "",
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
    "/",
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
