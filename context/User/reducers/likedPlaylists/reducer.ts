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
        likedPlaylists: [action.payload.playlist, ...state.likedPlaylists],
      };
    }

    case "REMOVE_LIKED_PLAYLIST": {
      return {
        ...state,
        likedPlaylists: state.likedPlaylists?.filter(
          (likedPlaylist) => likedPlaylist.id !== action.payload.id
        ),
      };
    }
    default:
      return {};
  }
};
