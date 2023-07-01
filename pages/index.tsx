import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-5 py-4 flex-1 bg-darkGray">
      <Link href="/profile">Profile</Link>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
