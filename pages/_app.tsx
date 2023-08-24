import "@/styles/globals.css";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import type { AppProps } from "next/app";
import { authOptions } from "./api/auth/[...nextauth]";
import { usePathname } from "next/navigation";
import { UserContextProvider } from "@/context/UserContext";
import { InfoContextProvider } from "@/context/InfoContext";
import { Layout } from "@/components";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

  if (pathname == "/auth") {
    return <Component {...pageProps} />;
  }

  return (
    <UserContextProvider>
      <InfoContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </InfoContextProvider>
    </UserContextProvider>
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
