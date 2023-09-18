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

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

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
            <Layout>
              <Component {...pageProps} />
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
