import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";
import { User as UserValue } from "@/constants/dummyData";

type UserState = UserType;

export const likedSongsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_LIKED_SONG": {
      return {
        ...state,
        liked: {
          ...state.liked,
          songs: [action.payload.track, ...state.liked.songs],
        },
      };
    }

    case "REMOVE_LIKED_SONG": {
      return {
        ...state,
        liked: {
          ...state.liked,
          songs: state.liked.songs?.filter(
            (likedSong) => likedSong.id !== action.payload.id
          ),
        },
      };
    }
    default:
      return {};
  }
};
