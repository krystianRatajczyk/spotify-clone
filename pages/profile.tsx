import Info from "@/components/Info";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useRouter } from "next/router";
import React from "react";
import { MdDone } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { GetServerSideProps } from "next";
import { requireAuthentication } from "@/lib/isAuthenticated";

const Profile = () => {
  const { user } = useCurrentUser();
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="px-20 py-16 bg-lightGray rounded-lg flex justify-center items-center flex-col">
        <nav className="flex w-full items-center">
          <p
            className="self-start"
            onClick={() => {
              router.back();
            }}
          >
            <IoIosArrowBack />
          </p>
          <h2 className="text-2xl font-bold self-center">Your account</h2>
        </nav>
        <img
          src={user?.image || "/images/person.png"}
          alt="person"
          className="
            w-[150px]
            h-[150px]
            rounded-full
            mt-10"
        />
        <h2 className="text-4xl font-bold text-white mt-5">{user?.name}</h2>
        <div className="w-[500px] flex flex-col">
          <Info leftLabel="Account Id" rightLabel={user?.id} isFirst />
          <Info leftLabel="Name" rightLabel={user?.name} />
          <Info leftLabel="Email" rightLabel={user?.email} />
          <Info leftLabel="Created At" rightLabel={user?.createdAt} />

          <p className="mt-3 text-gray-500 font-semibold text-lg">
            Complete the rest of fields
          </p>
          <Info leftLabel="Birthday" rightLabel="Complete" />
          <Info leftLabel="Sex" rightLabel="Complete" />
          <Info leftLabel="Phone" rightLabel="Complete" />
          <Info leftLabel="Address" rightLabel="Complete" isLast />
          <div className="mt-4 flex justify-end gap-4">
            <button
              className="
                    bg-primary 
                    rounded-lg 
                    px-3 py-1 
                    hover:bg-darkPrimary 
                    transition 
                    flex
                    items-center
                    gap-1
                    "
            >
              <MdDone /> Save
            </button>
            <button
              className="
                    rounded-lg 
                    px-4 py-1
                    hover:bg-gray-700 
                    transition border border-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: {},
    };
  }
);
