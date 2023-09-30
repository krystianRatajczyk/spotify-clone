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
  playlistName: string;
  href: string;
  queue: convertedTrack[];
  listenedQueue: string[];
};

//Action Type
type ActionType =
  | {
      type: "SET_SONGS";
      payload: {
        index: number;
        tracks: convertedTrack[];
        playlistId: string;
        playlistName: string;
        href: string;
      };
    }
  | { type: "SET_INDEX"; payload: number }
  | { type: "PREV_SONG" }
  | { type: "NEXT_SONG" }
  | { type: "LOOP_SONG"; payload: boolean }
  | { type: "SHUFFLE_SONG"; payload: string }
  | { type: "ADD_TO_QUEUE"; payload: convertedTrack }
  | { type: "CLEAR_QUEUE" }
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
        playlistName: action.payload.playlistName,
        href: action.payload.href,
      };

    case "NEXT_SONG":
      if (state.currentSongs.length - 1 > state.currentIndex) {
        const currentSongId = state.currentSongs[state.currentIndex + 1].id;
        const queueIds = state.queue.map((s) => s.id);
        const isSongInQueue = !!queueIds.includes(currentSongId);
        const wasSongInQueue = !!state.listenedQueue.includes(
          state.currentSongs[state.currentIndex].id
        );

        if (wasSongInQueue || isSongInQueue) {
          let songRemoved = false;

          const newQueue = state.queue.filter((s) => {
            if (!songRemoved && s.id === currentSongId) {
              songRemoved = true; // Set the flag to true to indicate that a song has been removed
              return false; // Filter out this song
            }
            return true; // Keep all other songs
          });

          let itemRemoved = false;

          const newListenedQueue = state.listenedQueue.filter((s) => {
            if (
              !itemRemoved &&
              s === state.currentSongs[state.currentIndex].id
            ) {
              itemRemoved = true; // Set the flag to true to indicate that an item has been removed
              return false; // Filter out this item
            }
            return true; // Keep all other items
          });

          return {
            ...state,
            currentIndex: wasSongInQueue
              ? state.currentIndex
              : state.currentIndex + 1,
            currentSongs: wasSongInQueue
              ? state.currentSongs
                  .slice(0, state.currentIndex)
                  .concat(state.currentSongs.slice(state.currentIndex + 1))
              : state.currentSongs,
            listenedQueue: newListenedQueue,
            queue: isSongInQueue ? newQueue : state.queue,
          };
        } else {
          return {
            ...state,
            currentIndex: state.currentIndex + 1,
            isPlaying: true,
          };
        }
      }
      return { ...state };

    case "PREV_SONG":
      if (0 < state.currentIndex) {
        const isSongInQueue = !!state.listenedQueue.includes(
          state.currentSongs[state.currentIndex].id
        );

        let newArrayOfSongs = state.currentSongs;
        if (state.queue.length > 0 && !isSongInQueue) {
          newArrayOfSongs = state.currentSongs
            .slice(0, state.currentIndex)
            .concat(
              state.currentSongs.slice(
                state.currentIndex + 1,
                state.currentIndex + state.queue.length + 1
              )
            )
            .concat([state.currentSongs[state.currentIndex]])
            .concat(
              state.currentSongs.slice(
                state.currentIndex + state.queue.length + 1
              )
            );

          return {
            ...state,
            currentIndex: state.currentIndex - 1,
            isPlaying: true,
            currentSongs: newArrayOfSongs,
          };
        } else if (isSongInQueue) {
          return {
            ...state,
            currentIndex: state.currentIndex - 1,
            isPlaying: true,
            currentSongs: state.currentSongs // remove track from queue
              .slice(0, state.currentIndex)
              .concat(state.currentSongs.slice(state.currentIndex + 1)),
            listenedQueue: state.listenedQueue.filter(
              (s) => s != state.currentSongs[state.currentIndex].id
            ),
          };
        }
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
      let newArrayOfSongs = state.currentSongs;
      let newIndex = action.payload;
      let queue = state.queue;

      if (state.queue.length > 0) {
        const isSongInQueue = state.listenedQueue.includes(
          state.currentSongs[state.currentIndex].id
        );

        const index = state.currentIndex;
        const songs = state.currentSongs;

        if (isSongInQueue) {
          newIndex -= state.queue.length + 1;
        } else {
          newIndex -= state.queue.length;
        }

        if (
          state.listenedQueue.includes(state.currentSongs[action.payload].id)
        ) {
          queue = state.queue.slice(action.payload - state.currentIndex);
          newArrayOfSongs = songs
            .slice(
              0,
              isSongInQueue ? state.currentIndex : state.currentIndex + 1
            )
            .concat(state.queue.slice(action.payload - state.currentIndex - 1))
            .concat(songs.slice(state.currentIndex + state.queue.length + 1));
          newIndex = isSongInQueue
            ? state.currentIndex
            : state.currentIndex + 1;
        } else {
          newArrayOfSongs = songs
            .slice(0, isSongInQueue ? index : index + 1)
            .concat(
              songs.slice(index + state.queue.length + 1, action.payload + 1)
            )
            .concat(state.queue)
            .concat(songs.slice(action.payload + 1));
        }
      }
      return {
        ...state,
        currentIndex: newIndex,
        isPlaying: true,
        currentSongs: newArrayOfSongs,
        queue,
      };

    case "ADD_TO_QUEUE":
      return {
        ...state,
        queue: [...state.queue, action.payload],
        listenedQueue: [...state.listenedQueue, action.payload.id],
        currentSongs: state.currentSongs
          .slice(0, state.currentIndex + 1)
          .concat([...state.queue, action.payload])
          .concat(
            state.currentSongs.slice(
              state.currentIndex + 1 + state.queue.length
            )
          ),
      };
    case "CLEAR_QUEUE":
      return { ...state, queue: [], listenedQueue: [] };
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
    playlistName: "",
    href: "",
    queue: [],
    listenedQueue: [],
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
    playlistName: "",
    href: "",
    queue: [],
    listenedQueue: [],
  });

  return (
    <MusicContext.Provider value={{ state, dispatch }}>
      {children}
    </MusicContext.Provider>
  );
};
