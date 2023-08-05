import Button from "@/components/Layout/Button";
import ProfileHeader from "@/components/ProfileHeader";
import { darkerAmount } from "@/constants/dummyData";
import { getDownGradient } from "@/constants/styles";
import { darkenColor } from "@/lib/darkerColor";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { User } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const UserDetail = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const res = await axios.post("/api/actions/users/getUserById", {
        id: router.query.userId,
        select: { id: true, name: true, image: true },
      });

      if (res.data) setUser(res.data);
    };
    loadUser();
  }, []);

  return (
    <Color src={user?.image || ""} crossOrigin="anonymous" format="hex">
      {({ data: dominantColor }) => {
        return (
          <div className="flex-1 bg-darkGray flex flex-col w-full h-full">
            {user && (
              <ProfileHeader
                {...user}
                dominantColor={dominantColor}
                darkerAmount={darkerAmount}
              />
            )}
            <div
              style={getDownGradient(dominantColor)}
              className="flex-1 drop-shadow-md p-5"
            >
              <Button className="font-bold px-4 py-1 border border-gray-600 hover:border-white rounded-md bg-transparent text-white text-[16px]">
                FOLLOW
              </Button>
            </div>
          </div>
        );
      }}
    </Color>
  );
};

export default UserDetail;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
  async (_ctx) => {
    return {
      props: { trackData: _ctx.query },
    };
  }
);
