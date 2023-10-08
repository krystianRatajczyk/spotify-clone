import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const followingReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "ADD_FOLLOWING": {
      return {
        ...state,
        following: [action.payload, ...state.following],
      };
    }

    case "REMOVE_FOLLOWING": {
      return {
        ...state,
        following: state.following?.filter(
          (following) => following.id !== action.payload.id
        ),
      };
    }
    default:
      return {};
  }
};
