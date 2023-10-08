import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const serverAuth = async (
  req: NextApiRequest | any,
  res: NextApiResponse | any
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    throw new Error("Session not found");
  }

  const currentUser = await prismadb.user.findUnique({
    where: { email: session.user.email },
    include: {
      playlists: {
        include: {
          createdUser: { select: { name: true } },
          tracks: {
            include: { artists: { select: { name: true, id: true } } },
          },
        },
      },
      likedPlaylists: {
        select: {
          id: true,
          name: true,
          author: true,
          image: true,
          tracks: { include: { artists: true } },
          createdUser: { select: { id: true, name: true } },
        },
      },
      likedSongs: { include: { artists: true } },
      likedArtists: { select: { id: true, name: true, image: true } },
      followers: { select: { id: true, image: true, name: true } },
      following: { select: { id: true, image: true, name: true } },
    },
  });

  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
