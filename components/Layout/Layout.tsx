import React, {
  ReactNode,
  forwardRef,
  use,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/User/UserContext";
import { arrayEquals, findMissingElements } from "@/lib/track";
import axios from "axios";
import { Artist, Playlist, Track } from "@prisma/client";
import { User } from "@/constants/formattedTypesPrisma";
import { AnimatePresence } from "framer-motion";
import { Notification, Player } from "@/components";
import { MusicContext } from "@/context/MusicContext";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
  ref: React.RefObject<null>;
}

const Layout: React.FC<LayoutProps> = forwardRef(({ children }, ref) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [playlistsInitialized, setPlaylistInitialized] =
    useState<boolean>(false);
  const { state: info, dispatch } = useContext(InfoContext);
  const { state: user } = useContext(UserContext);
  const { state: music, dispatch: MusicDispatch } = useContext(MusicContext);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrolled = element.scrollTop;
    dispatch({ type: "CHANGE_SCROLL_TOP", payload: scrolled });
  };
  const [currentUser, setCurrentUser] = useState<User>();

  const likedSongsIds = user.likedSongs?.map((song) => song.id);
  const likedArtistsIds = user.likedArtists?.map((artist) => artist.id);
  const likedPlaylistsIds = user.likedPlaylists?.map((playlist) => playlist.id);
  const followingIds = user.following.map((f) => f.id);

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUser = await axios.get("/api/current");
      setCurrentUser(currentUser.data);
    };

    getCurrentUser();
  }, []);

  function playSongs(
    index: number,
    tracks: Track[],
    playlistId: string,
    playlistName: string,
    href: string
  ) {
    const convertedTracks = tracks?.map((track: Track) => {
      return {
        id: track.id,
        image: track.image,
        name: track.name,
        duration: track.duration,
        artists: track.artists.map((a: Artist) => ({
          id: a.id,
          name: a.name,
        })),
      };
    });
    if (music.playlistId !== playlistId && index != music.currentIndex) {
      MusicDispatch({
        type: "SET_SONGS",
        payload: {
          index: index!,
          tracks: convertedTracks || [],
          playlistId,
          playlistName,
          href,
        },
      });
    } else if (index != music.currentIndex) {
      MusicDispatch({
        type: "SET_INDEX",
        payload: index!,
      });
    } else if (music.playlistId === playlistId) {
      MusicDispatch({
        type: "PLAY_PAUSE",
      });
    } else {
      MusicDispatch({
        type: "SET_SONGS",
        payload: {
          index: 0,
          tracks: convertedTracks || [],
          playlistId: playlistId,
          playlistName,
          href,
        },
      });
    }
  }

  useImperativeHandle(ref, () => ({
    playSongs,
  }));

  useEffect(() => {
    if (initialized) {
      const timeout = setTimeout(async () => {
        const currentUserSongsIds =
          currentUser?.likedSongs.map((song) => song.id) || [];
        const currentUserArtistsIds =
          currentUser?.likedArtists.map((artist) => artist.id) || [];
        const currentUserPlaylistsIds =
          currentUser?.likedPlaylists.map((playlist) => playlist.id) || [];
        const currentUserFollowingIds =
          currentUser?.following.map((f) => f.id) || [];

        if (!arrayEquals(currentUserFollowingIds, followingIds)) {
          let options;
          if (followingIds.length > currentUserFollowingIds.length) {
            const missingSongs = findMissingElements(
              followingIds,
              currentUserFollowingIds
            );
            options = { ids: missingSongs, action: "connect" };
          } else {
            const missingSongs = findMissingElements(
              currentUserFollowingIds,
              followingIds
            );
            options = { ids: missingSongs, action: "disconnect" };
          }
          const res = await axios.post("/api/actions/follow/updateFollowing", {
            ...options,
          });
        }

        let options = {};
        // update document in db only if 2 seconds past and something changed
        if (!arrayEquals(currentUserSongsIds, likedSongsIds) && user.id) {
          if (likedSongsIds.length > currentUserSongsIds.length) {
            const missingSongs = findMissingElements(
              likedSongsIds,
              currentUserSongsIds
            );
            options = {
              ...options,
              songs: { ids: missingSongs, action: "connect" },
            };
          } else {
            const missingSongs = findMissingElements(
              currentUserSongsIds,
              likedSongsIds
            );
            options = {
              ...options,
              songs: { ids: missingSongs, action: "disconnect" },
            };
          }
        }
        if (!arrayEquals(currentUserArtistsIds, likedArtistsIds) && user.id) {
          if (likedArtistsIds.length > currentUserArtistsIds.length) {
            const missingSongs = findMissingElements(
              likedArtistsIds,
              currentUserArtistsIds
            );
            options = {
              ...options,
              artists: { ids: missingSongs, action: "connect" },
            };
          } else {
            const missingSongs = findMissingElements(
              currentUserArtistsIds,
              likedArtistsIds
            );
            options = {
              ...options,
              artists: { ids: missingSongs, action: "disconnect" },
            };
          }
        }
        if (
          !arrayEquals(currentUserPlaylistsIds, likedPlaylistsIds) &&
          user.id
        ) {
          if (likedPlaylistsIds.length > currentUserPlaylistsIds.length) {
            const missingSongs = findMissingElements(
              likedPlaylistsIds,
              currentUserPlaylistsIds
            );
            options = {
              ...options,
              playlists: { ids: missingSongs, action: "connect" },
            };
          } else {
            const missingSongs = findMissingElements(
              currentUserPlaylistsIds,
              likedPlaylistsIds
            );
            options = {
              ...options,
              playlists: { ids: missingSongs, action: "disconnect" },
            };
          }
        }
        const res = await axios.post("/api/actions/liked/updateLiked", {
          ...options,
        });
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

  const pathname = usePathname();
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    windowRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-screen flex-col p-2">
      <div className="w-full flex h-calc">
        <Sidebar />
        <div className="w-full h-full flex flex-col rounded-xl ml-2 overflow-hidden relative">
          <TopBar playSongs={playSongs} />

          <AnimatePresence>
            {info.notification.display && <Notification />}
          </AnimatePresence>
          <div
            className={`${
              info.scroll ? "overflow-y-scroll" : "overflow-y-hidden"
            }  no-scrollbar w-full h-full`}
            onScroll={(e) => handleScroll(e)}
            ref={windowRef}
          >
            {children}
          </div>
        </div>
      </div>

      <div className="w-full h-[80px] px-3 flex items-center">
        <Player />
      </div>
    </div>
  );
});

export default Layout;
