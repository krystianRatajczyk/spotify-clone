import "@/styles/globals.css";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import type { AppProps } from "next/app";
import { authOptions } from "./api/auth/[...nextauth]";
import { usePathname } from "next/navigation";
import { UserContextProvider } from "@/context/User/UserContext";
import { InfoContextProvider } from "@/context/InfoContext";
import { Layout } from "@/components";
import { SessionProvider } from "next-auth/react";
import { MusicContextProvider } from "@/context/MusicContext";
import { Track } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const layoutRef = useRef(null);
  const [discover, setDiscover] = useState<Track[]>();
  const [tracks, setTracks] = useState<Track[]>();

  const day = new Date().getDay();

  const playSongs = (
    index: number,
    tracks: Track[],
    playlistId: string,
    playlistName: string,
    href: string
  ) => {
    layoutRef?.current?.playSongs(
      index,
      tracks,
      playlistId,
      playlistName,
      href
    );
  };

  useEffect(() => {
    const getDiscover = async () => {
      const disc = await axios.post("/api/actions/getObjectsWithQuery", {
        query: {
          skip: day * 20,
          take: 20,
          select: {
            id: true,
            image: true,
            name: true,
            duration: true,
            artists: { select: { id: true, name: true } },
          },
        },
        key: "track",
      });
      setDiscover(disc.data);

      const tracks = await axios.post("/api/actions/getObjectsWithQuery", {
        query: {
          take: 140,
          select: {
            id: true,
            image: true,
            name: true,
            duration: true,
            artists: { select: { id: true, name: true, image: true } },
          },
        },
        key: "track",
      });

      setTracks(tracks.data);
    };
    getDiscover();
  }, []);

  if (pathname == "/auth") {
    return (
      <SessionProvider>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <MusicContextProvider>
        <UserContextProvider>
          <InfoContextProvider>
            <Layout ref={layoutRef}>
              <Component
                {...pageProps}
                playSongs={playSongs}
                discover={discover}
                tracks={tracks}
              />
            </Layout>
          </InfoContextProvider>
        </UserContextProvider>
      </MusicContextProvider>
    </SessionProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionData = await getServerSession(req, res, authOptions);

  // Pass the session data as props to the App component
  return {
    props: {
      sessionData,
    },
  };
};
