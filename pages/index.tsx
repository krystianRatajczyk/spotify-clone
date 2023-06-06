import { requireAuthentication } from "@/lib/isAuthenticated";
import { GetServerSideProps } from "next";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black h-screen w-screen">
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
