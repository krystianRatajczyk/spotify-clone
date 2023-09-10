import { User as UserType } from "@/constants/formattedTypesPrisma";
import { Track } from "@prisma/client";
import { likedSongsReducer } from "./reducers/likedSongs/reducer";
import { likedArtistsReducer } from "./reducers/likedArtists/reducer";
import { recentSearchesReducer } from "./reducers/recentSearch/reducer";
import { userReducer } from "./reducers/user/reducer";
import { likedPlaylistsReducer } from "./reducers/likedPlaylists/reducer";
import { userPlaylistsReducer } from "./reducers/userPlaylists/reducer";

type UserState = UserType;

export type ActionType =
  | ProfileActions
  | RecentSearchesActions
  | LikedSongsActions
  | LikedArtistsActions
  | LikedPlaylistsActions
  | PlaylistActions;

type ProfileActions = { type: "CHANGE_PROFILE"; payload: UserType | {} };

type RecentSearchesActions =
  | {
      type: "ADD_RECENT_SEARCHES";
      payload: {
        item: { id: string; name: string; image: string; type: string };
      };
    }
  | { type: "REMOVE_RECENT_SEARCHES"; payload: { id: string } }
  | { type: "CLEAR_RECENT_SEARCHES" };

type LikedSongsActions =
  | { type: "ADD_LIKED_SONG"; payload: { track: Track } }
  | { type: "REMOVE_LIKED_SONG"; payload: { id: string } };

type LikedArtistsActions =
  | {
      type: "ADD_LIKED_ARTIST";
      payload: { artist: { name: string; image: string; id: string } };
    }
  | { type: "REMOVE_LIKED_ARTIST"; payload: { id: string } };

type LikedPlaylistsActions =
  | {
      type: "ADD_LIKED_PLAYLIST";
      payload: {
        playlist: { id: string; name: string; author: string; image: string };
      };
    }
  | { type: "REMOVE_LIKED_PLAYLIST"; payload: { id: string } };

type PlaylistActions =
  | { type: "CREATE_PLAYLIST" }
  | { type: "DELETE_PLAYLIST"; payload: { id: string } }
  | { type: "CHANGE_PLAYLIST_ID"; payload: { newId: string } }
  | { type: "CHANGE_PLAYLIST_NAME"; payload: { id: string; newName: string } }
  | { type: "ADD_SONG_TO_PLAYLIST"; payload: { index: number; song: any } }
  | {
      type: "REMOVE_SONG_FROM_PLAYLIST";
      payload: { playlistId: string; songId: string };
    };

const rootReducer = (state: UserState, action: ActionType): UserState => {
  return {
    ...state,
    ...userReducer(state, action),
    ...recentSearchesReducer(state, action),
    ...likedArtistsReducer(state, action),
    ...likedSongsReducer(state, action),
    ...likedPlaylistsReducer(state, action),
    ...userPlaylistsReducer(state, action),
  };
};

export default rootReducer;
