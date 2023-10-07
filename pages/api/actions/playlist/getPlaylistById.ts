import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    let { id } = req.body;
    const playlist = await prisma.playlist.findUnique({
      where: {
        id,
      },
      include: {
        createdUser: { select: { id: true, name: true } },
        tracks: { include: { artists: true } },
      },
    });

    if (playlist) {
      return res.status(200).json(playlist);
    } else {
      return res.status(200).json("");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
