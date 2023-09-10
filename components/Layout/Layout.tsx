import React, { ReactNode, use, useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/User/UserContext";
import { arrayEquals, findMissingElements } from "@/lib/track";
import axios from "axios";
import { Playlist, Track, User } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { Notification } from "@/components";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [playlistsInitialized, setPlaylistInitialized] =
    useState<boolean>(false);
  const { state: info, dispatch } = useContext(InfoContext);
  const { state: user } = useContext(UserContext);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrolled = element.scrollTop;
    dispatch({ type: "CHANGE_SCROLL_TOP", payload: scrolled });
  };
  const [currentUser, setCurrentUser] = useState<User>();

  const likedSongsIds = user.liked.songs?.map((song) => song.id);
  const likedArtistsIds = user.liked.artists?.map((artist) => artist.id);
  const likedPlaylistsIds = user.liked.playlists?.map(
    (playlist) => playlist.id
  );

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await axios.get("/api/current");
      setCurrentUser(currentUser.data);
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    if (initialized) {
      const timeout = setTimeout(async () => {
        // update array of ids in db only if 2 seconds past and something changed
        if (
          (!arrayEquals(currentUser?.liked.songs, likedSongsIds) ||
            !arrayEquals(currentUser?.liked.artists, likedArtistsIds) ||
            !arrayEquals(currentUser?.liked.playlists, likedPlaylistsIds)) &&
          user.id // get rid of instant uploading empty arrays because of delay in deliver data
        ) {
          const res = await axios.post("/api/actions/liked/updateLiked", {
            songsIds: likedSongsIds || [],
            artistsIds: likedArtistsIds || [],
            playlistsIds: likedPlaylistsIds || [],
          });
        }
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setInitialized(true);
    }
  }, [likedSongsIds, likedArtistsIds, likedPlaylistsIds]);

  const allTracksInPlaylists = user.playlists.map(
    (playlist: Playlist) => playlist.tracks
  );

  useEffect(() => {
    if (playlistsInitialized) {
      const timeout = setTimeout(() => {
        user.playlists.forEach(async (playlist) => {
          const tracksFromDatabase = currentUser?.playlists.find(
            (p: Playlist) => p.id === playlist.id
          );
          const tracksIdsFromDatabase = tracksFromDatabase?.tracks?.map(
            (track: Track) => track.id
          );
          const tracksIds = playlist.tracks.map((track: Track) => track.id);

          if (tracksIds.length > tracksIdsFromDatabase?.length) {
            //connect new tracks
            const missingTracks = findMissingElements(
              tracksIds,
              tracksIdsFromDatabase
            );
            const res = await axios.post("/api/actions/playlist/changeSongs", {
              action: "connect",
              ids: missingTracks,
              playlistId: playlist.id,
            });
          } else if (tracksIds.length < tracksIdsFromDatabase?.length) {
            //disconnect
            const missingTracks = findMissingElements(
              tracksIdsFromDatabase,
              tracksIds
            );
            const res = await axios.post("/api/actions/playlist/changeSongs", {
              action: "disconnect",
              ids: missingTracks,
              playlistId: playlist.id,
            });
          } else return;
        });
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      setPlaylistInitialized(true);
    }
  }, [allTracksInPlaylists]);

  return (
    <div className="p-2 flex h-screen">
      <Sidebar />
      <div className="w-full h-full flex flex-col rounded-xl ml-2 overflow-hidden relative">
        <TopBar />

        <AnimatePresence>
          {info.notification.display && <Notification />}
        </AnimatePresence>
        <div
          className={`${
            info.scroll ? "overflow-y-scroll" : "overflow-y-hidden"
          }  no-scrollbar w-full h-full`}
          onScroll={(e) => handleScroll(e)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
