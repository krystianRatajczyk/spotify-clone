import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const likedArtistsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_LIKED_ARTIST": {
      return {
        ...state,
        likedArtists: [action.payload.artist, ...state.likedArtists],
      };
    }

    case "REMOVE_LIKED_ARTIST": {
      return {
        ...state,
        likedArtists: state.likedArtists?.filter(
          (likedArtist) => likedArtist.id !== action.payload.id
        ),
      };
    }
    default:
      return {};
  }
};
