import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";

export default function Home() {
  return (
    <div className="px-5 py-4 flex-1 bg-darkGray w-full h-full"></div>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
