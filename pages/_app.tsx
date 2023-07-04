import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import type { AppProps } from "next/app";
import { authOptions } from "./api/auth/[...nextauth]";
import { usePathname } from "next/navigation";
import { UserContextProvider } from "@/context/UserContext";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

  if (pathname == "/auth") {
    return <Component {...pageProps} />;
  }

  return (
    <UserContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
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
