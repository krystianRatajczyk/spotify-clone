import React, { ReactNode, useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { InfoContext } from "@/context/InfoContext";
import { UserContext } from "@/context/UserContext";
import { arrayEquals } from "@/lib/track";
import axios from "axios";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const { dispatch } = useContext(InfoContext);
  const { state: user } = useContext(UserContext);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrolled = element.scrollTop;
    dispatch({ type: "CHANGE_SCROLL_TOP", payload: scrolled });
  };
  const likedSongsIds = user.liked.songs.map((song) => song.id);

  useEffect(() => {
    if (initialized) {
      const timeout = setTimeout(async () => {
        const currentUser = await axios.get("/api/current");
        // update array of ids in db only if 2 seconds past and something changed
        if (!arrayEquals(currentUser.data.liked.songs, likedSongsIds)) {
          const res = await axios.post(
            "/api/actions/likedSongs/updateLikedSongs",
            { ids: likedSongsIds }
          );
        }
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      setInitialized(true);
    }
  }, [likedSongsIds]);

  return (
    <div className="p-2 flex h-screen">
      <Sidebar />
      <div className="w-full h-full flex flex-col rounded-xl ml-2 overflow-hidden relative">
        <TopBar />
        <div
          className="overflow-y-scroll no-scrollbar w-full h-full"
          onScroll={(e) => handleScroll(e)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
