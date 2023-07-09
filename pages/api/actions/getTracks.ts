import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/lib/serverAuth";
import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }
  try {
    const { currentUser } = await serverAuth(req, res);

    if (!currentUser?.id) {
      return res.status(400).end();
    }

    const tracks = await prisma.track.findMany({ include: { artists: true } });

    if (tracks) {
      return res.status(200).json(tracks);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
