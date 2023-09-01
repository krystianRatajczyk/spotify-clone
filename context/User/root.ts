import { User as UserType } from "@/constants/formattedTypesPrisma";
import { Track } from "@prisma/client";
import { likedSongsReducer } from "./reducers/likedSongs/reducer";
import { likedArtistsReducer } from "./reducers/likedArtists/reducer";
import { recentSearchesReducer } from "./reducers/recentSearch/reducer";
import { userReducer } from "./reducers/user/reducer";
import { likedPlaylistsReducer } from "./reducers/likedPlaylists/reducer";

type UserState = UserType;

export type ActionType =
  | { type: "CHANGE_PROFILE"; payload: UserType }
  | {
      type: "ADD_RECENT_SEARCHES";
      payload: {
        item: { id: string; name: string; image: string; type: string };
      };
    }
  | { type: "REMOVE_RECENT_SEARCHES"; payload: { id: string } }
  | { type: "ADD_LIKED_SONG"; payload: { track: Track } }
  | { type: "REMOVE_LIKED_SONG"; payload: { id: string } }
  | { type: "CLEAR_RECENT_SEARCHES" }
  | {
      type: "ADD_LIKED_ARTIST";
      payload: { artist: { name: string; image: string; id: string } };
    }
  | { type: "REMOVE_LIKED_ARTIST"; payload: { id: string } }
  | {
      type: "ADD_LIKED_PLAYLIST";
      payload: {
        playlist: { id: string; name: string; author: string; image: string };
      };
    }
  | { type: "REMOVE_LIKED_PLAYLIST"; payload: { id: string } }
  | { type: "CREATE_PLAYLIST" }
  | { type: "DELETE_PLAYLIST"; payload: { id: string } }
  | { type: "CHANGE_PLAYLIST_ID"; payload: { newId: string } };

const rootReducer = (state: UserState, action: ActionType): UserState => {
  return {
    ...state,
    ...userReducer(state, action),
    ...recentSearchesReducer(state, action),
    ...likedArtistsReducer(state, action),
    ...likedSongsReducer(state, action),
    ...likedPlaylistsReducer(state, action),
  };
};

export default rootReducer;
