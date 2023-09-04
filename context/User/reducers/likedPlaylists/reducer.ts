import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const likedPlaylistsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_LIKED_PLAYLIST": {
      return {
        ...state,
        liked: {
          ...state.liked,
          playlists: [action.payload.playlist, ...state.liked?.playlists],
        },
      };
    }

    case "REMOVE_LIKED_PLAYLIST": {
      return {
        ...state,
        liked: {
          ...state.liked,
          playlists: state.liked?.playlists?.filter(
            (likedPlaylist) => likedPlaylist.id !== action.payload.id
          ),
        },
      };
    }
    default:
      return {};
  }
};
