import { User as UserValue } from "@/constants/dummyData";
import { User as UserType } from "@/constants/formattedTypesPrisma";

import axios from "axios";
import React, { Dispatch, useEffect, useReducer } from "react";
import rootReducer, { ActionType } from "./root";
import { getFormattedObjects } from "@/lib/artist";
import {  useSession } from "next-auth/react";

//State
type UserState = UserType;

//context object type {state, dispatch}
type ContextType = {
  state: UserState;
  dispatch: Dispatch<ActionType>;
};

export const UserContext = React.createContext<ContextType>({
  state: UserValue,
  dispatch: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(rootReducer, UserValue);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (state.id == "" || session?.user) {
          // do it if user wasnt registered, usually on refresh and login
          const currentUser = await axios.get("/api/current");

          const likedArtists = await getFormattedObjects(
            "/api/actions/artists/getArtistsByIdsWithSelect",
            {
              select: {
                image: true,
                id: true,
                name: true,
              },
            },
            "artists"
          );

          const likedPlaylists = await getFormattedObjects(
            "/api/actions/playlist/getPlaylistsByIdsWithSelect",
            {
              select: {
                image: true,
                id: true,
                name: true,
                author: true,
              },
            },
            "playlists"
          );

          const likedTracks = await getFormattedObjects(
            "/api/actions/tracks/getTracksByIds",
            {
              options: { artists: true },
            },
            "songs"
          );
          
          const userObject = {
            ...currentUser.data,
            playlists: currentUser.data.playlists.reverse(),
            liked: {
              songs: likedTracks,
              artists: likedArtists,
              playlists: likedPlaylists,
            },
          };
        dispatch({ type: "CHANGE_PROFILE", payload: userObject });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [session]); // Empty dependency array to ensure the effect runs only once on app load

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
