import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";
import { User as UserValue } from "@/constants/dummyData";

type UserState = UserType;

export const likedArtistsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_LIKED_ARTIST": {
      return {
        ...state,
        liked: {
          ...state.liked,
          artists: [action.payload.artist, ...state.liked.artists],
        },
      };
    }

    case "REMOVE_LIKED_ARTIST": {
      return {
        ...state,
        liked: {
          ...state.liked,
          artists: state.liked.artists?.filter(
            (likedArtist) => likedArtist.id !== action.payload.id
          ),
        },
      };
    }
    default:
      return {};
  }
};
