import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const likedPlaylistsReducer = (
  state: UserState,
  action: ActionType
): UserState | {} => {
  switch (action.type) {
    case "CREATE_PLAYLIST": {
      const index = state.playlists.length + 1;

      return {
        ...state,
        playlists: [
          {
            id: index,
            name: `My Playlist #${index}`,
            author: state.name,
            image: "",
          },
          ...state.playlists,
        ],
      };
    }

    case "DELETE_PLAYLIST": {
      return state;
    }

    case "CHANGE_PLAYLIST_ID": {
      const { newId } = action.payload;
      const updatedPlaylist = { ...state.playlists[0], id: newId };
      const updatedPlaylists = [
        updatedPlaylist,
        ...state.playlists.slice(1),
      ];
      return { ...state, playlists: updatedPlaylists };
    }

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
