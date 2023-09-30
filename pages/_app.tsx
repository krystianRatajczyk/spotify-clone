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
import { useRef } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const layoutRef = useRef(null);

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
              <Component {...pageProps} playSongs={playSongs} />
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
