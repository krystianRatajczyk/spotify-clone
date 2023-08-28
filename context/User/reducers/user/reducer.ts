import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";
import { User as UserValue } from "@/constants/dummyData";
type UserState = UserType;

export const userReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "CHANGE_PROFILE":
      return action.payload;
    default:
      return {};
  }
};
