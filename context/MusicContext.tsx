import React, { Dispatch, useReducer } from "react";

type convertedTrack = {
  id: string;
  image: string;
  name: string;
  duration: number;
  artists: { id: string; name: string }[];
};

//State
type State = {
  currentSongs: convertedTrack[];
  currentIndex: number;
  isPlaying: boolean;
  playlistId?: string;
};

//Action Type
type ActionType =
  | {
      type: "SET_SONGS";
      payload: {
        index: number;
        tracks: convertedTrack[];
        playlistId: string;
      };
    }
  | { type: "SET_INDEX"; payload: number }
  | { type: "PREV_SONG" }
  | { type: "NEXT_SONG" }
  | { type: "LOOP_SONG"; payload: boolean }
  | { type: "SHUFFLE_SONG"; payload: string }
  | { type: "PLAY_PAUSE" };

//reducer func
const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case "SET_SONGS":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSongs: [...action.payload.tracks],
        playlistId: action.payload.playlistId,
        isPlaying: true,
      };

    case "NEXT_SONG":
      if (state.currentSongs.length - 1 > state.currentIndex) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          isPlaying: true,
        };
      }
      return { ...state };

    case "PREV_SONG":
      if (0 < state.currentIndex) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1,
          isPlaying: true,
        };
      }
      return { ...state };

    case "PLAY_PAUSE":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_INDEX":
      return { ...state, currentIndex: action.payload, isPlaying: true };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

//context object type {state, dispatch}
type ContextType = {
  state: State;
  dispatch: Dispatch<ActionType>;
};

export const MusicContext = React.createContext<ContextType>({
  state: {
    currentSongs: [],
    currentIndex: 0,
    isPlaying: false,
  },
  dispatch: () => {},
});

export const MusicContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    currentSongs: [],
    currentIndex: 0,
    isPlaying: false,
  });

  return (
    <MusicContext.Provider value={{ state, dispatch }}>
      {children}
    </MusicContext.Provider>
  );
};
