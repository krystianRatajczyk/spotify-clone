import { User as UserValue } from "@/constants/dummyData";
import { User as UserType } from "@/constants/formattedTypesPrisma";

import axios from "axios";
import React, { Dispatch, useEffect, useReducer } from "react";
import { Artist, Track } from "@prisma/client";
import rootReducer from "./root";
import { getFormattedObjects } from "@/lib/artist";

//State
type UserState = UserType;

//Action Type
type ActionType =
  | { type: "CHANGE_PROFILE"; payload: UserType }
  | {
      type: "ADD_RECENT_SEARCHES";
      payload: {
        item: { id: string; name: string; image: string; type: string };
      };
    }
  | { type: "REMOVE_RECENT_SEARCHES"; payload: { id: string } }
  | { type: "ADD_LIKED_SONG"; payload: { track: Track } }
  | { type: "REMOVE_LIKED_SONG"; payload: { id: string } }
  | { type: "CLEAR_RECENT_SEARCHES" }
  | {
      type: "ADD_LIKED_ARTIST";
      payload: { artist: { name: string; image: string; id: string } };
    }
  | { type: "REMOVE_LIKED_ARTIST"; payload: { id: string } };

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await axios.get("/api/current");

        const likedTracks = await getFormattedObjects(
          "/api/actions/tracks/getTracksByIds",
          {
            options: { artists: true },
          },
          "songs"
        );

        const likedArtists = await getFormattedObjects(
          "/api/actions/artists/getArtistsByIds",
          {
            selec: { image: true, id: true, name: true },
          },
          "artists"
        );

        const userObject = {
          ...currentUser.data,
          liked: { songs: likedTracks, artists: likedArtists },
        };
        
        dispatch({ type: "CHANGE_PROFILE", payload: userObject });
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []); // Empty dependency array to ensure the effect runs only once on app load

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
