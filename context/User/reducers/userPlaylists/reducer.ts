import { User as UserType } from "@/constants/formattedTypesPrisma";
import { ActionType } from "../../root";

type UserState = UserType;

export const userPlaylistsReducer = (
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
            image: "",
            tracks: [],
            user: { name: state.name },
          },
          ...state.playlists,
        ],
      };
    }

    case "DELETE_PLAYLIST": {
      return {
        ...state,
        playlists: state.playlists.filter((p) => p.id !== action.payload.id),
      };
    }

    case "CHANGE_PLAYLIST_ID": {
      const { newId } = action.payload;
      const updatedPlaylist = { ...state.playlists[0], id: newId };
      const updatedPlaylists = [updatedPlaylist, ...state.playlists.slice(1)];
      return { ...state, playlists: updatedPlaylists };
    }

    case "CHANGE_PLAYLIST_NAME": {
      const { id, newName } = action.payload;

      // Find the index of the playlist with the given ID
      const index = state.playlists.findIndex((p) => p.id === id);

      if (index !== -1) {
        // Create a copy of the playlists array to avoid mutating state directly
        const updatedPlaylists = [...state.playlists];

        // Update the name of the playlist at the found index
        updatedPlaylists[index] = {
          ...updatedPlaylists[index],
          name: newName,
        };

        // Return the updated state
        return {
          ...state,
          playlists: updatedPlaylists,
        };
      }

      // If the playlist with the given ID was not found, return the original state
      return state;
    }

    case "ADD_SONG_TO_PLAYLIST": {
      const { song, index } = action.payload;

      if (index !== -1) {
        const updatedPlaylists = [...state.playlists];
        updatedPlaylists[index] = {
          ...updatedPlaylists[index],
          //@ts-ignore
          tracks: [{ ...song }, ...updatedPlaylists[index].tracks],
        };

        return {
          ...state,
          playlists: updatedPlaylists,
        };
      }
      return state;
    }

    case "REMOVE_SONG_FROM_PLAYLIST": {
      const { playlistId, songId } = action.payload;
      const index = state.playlists.findIndex((p) => p.id === playlistId);
      const updatedPlaylist = [...state.playlists];
      updatedPlaylist[index] = {
        ...updatedPlaylist[index],
        //@ts-ignore
        tracks: updatedPlaylist[index].tracks.filter((t) => t.id !== songId),
      };

      return {
        ...state,
        playlists: updatedPlaylist,
      };
    }
    default:
      return {};
  }
};
