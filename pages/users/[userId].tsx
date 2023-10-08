import { Button, ProfileHeader, VerticalCard } from "@/components";
import { darkerAmount } from "@/constants/dummyData";
import { getDownGradient } from "@/constants/styles";
import { UserContext } from "@/context/User/UserContext";
import { requireAuthentication } from "@/lib/isAuthenticated";
import { User } from "@prisma/client";
import axios from "axios";
import Color from "color-thief-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const UserDetail = () => {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    image: string;
    followers: User[];
    following: User[];
  } | null>(null);

  const router = useRouter();
  const { state: currentUser, dispatch } = useContext(UserContext);

  useEffect(() => {
    const loadUser = async () => {
      const res = await axios.post("/api/actions/users/getUserById", {
        id: router.query.userId,
        options: {
          select: {
            id: true,
            name: true,
            image: true,
            followers: {
              select: { id: true, name: true, image: true },
            },
            following: {
              select: { id: true, name: true, image: true },
            },
          },
        },
      });

      if (res.data) setUser(res.data);
    };
    loadUser();
  }, []);

  const isFollowing = !!currentUser.following.find((f) => f.id === user?.id);

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
              style={{
                background:
                  "linear-gradient(to bottom, #242424, #121212 150px)",
              }}
              className="flex-1 drop-shadow-md p-5"
            >
              {currentUser.id && user?.id !== currentUser.id && (
                <Button
                  className="font-bold px-4 py-1 border 
                border-[rgba(77,74,74,0.88)] hover:border-white 
                rounded-md bg-transparent text-white text-[16px]"
                  onClick={() => {
                    if (!isFollowing) {
                      dispatch({
                        type: "ADD_FOLLOWING",
                        payload: {
                          ...user,
                        },
                      });
                    } else {
                      console.log("here");
                      dispatch({
                        type: "REMOVE_FOLLOWING",
                        payload: {
                          id: user?.id,
                        },
                      });
                    }
                  }}
                >
                  {isFollowing ? "UNFOLLOW" : "FOLLOW"}
                </Button>
              )}
              {user?.followers.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-[20px] font-bold">Followers</h2>
                  <div className="flex gap-2 items-center mt-5 flex-wrap">
                    {user?.followers.map((f) => {
                      return (
                        <VerticalCard
                          {...f}
                          type="profile"
                          typeId={f.id}
                          imageClassName=""
                          modal="none"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {user?.following.length > 0 && (
                <div className="flex flex-col gap-2 mt-5">
                  <h2 className="text-[20px] font-bold">Following</h2>
                  <div className="flex gap-2 items-center mt-5 flex-wrap">
                    {user?.following.map((f) => {
                      return (
                        <VerticalCard
                          {...f}
                          type="profile"
                          typeId={f.id}
                          imageClassName=""
                          modal="none"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
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
