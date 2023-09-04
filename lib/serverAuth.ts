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
          user: { select: { name: true } },
          tracks: true,
        },
      },
    },
  });

  if (!currentUser) {
    throw new Error("Not signed in");
  }

  return { currentUser };
};

export default serverAuth;
