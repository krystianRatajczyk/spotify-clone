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
    let { action, ids, playlistId } = req.body;
    const updatedPlaylist = await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        tracks: {
          [action]: ids.map((id: string) => {
            return { id };
          }),
        },
      },
      include: { tracks: true },
    });

    if (updatedPlaylist) {
      return res.status(200).json(updatedPlaylist);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
