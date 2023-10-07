import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const likedSongsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_LIKED_SONG": {
      return {
        ...state,
        likedSongs: [action.payload.track, ...state.likedSongs],
      };
    }

    case "REMOVE_LIKED_SONG": {
      return {
        ...state,
        likedSongs: state.likedSongs?.filter(
          (likedSong) => likedSong.id !== action.payload.id
        ),
      };
    }
    default:
      return {};
  }
};
