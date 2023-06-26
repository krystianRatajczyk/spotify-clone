import Layout from "@/components/Layout/Layout";
import "@/styles/globals.css";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { AppProps } from "next/app";
import { authOptions } from "./api/auth/[...nextauth]";
import { usePathname } from "next/navigation";

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

  if (pathname == "/auth") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
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
