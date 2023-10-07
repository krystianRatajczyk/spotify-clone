import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prismadb";
import serverAuth from "@/lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { songs, artists, playlists } = req.body;
    const { currentUser } = await serverAuth(req, res);
    
    if (songs || artists || playlists) {
      const result = await prisma.user.update({
        where: { email: currentUser.email },
        data: {
          likedSongs: songs && {
            [songs.action]: songs.ids.map((id: string) => ({ id: id })),
          },
          likedArtists: artists && {
            [artists.action]: artists.ids.map((id: string) => ({ id: id })),
          },
          likedPlaylists: playlists && {
            [playlists.action]: playlists.ids.map((id: string) => ({ id: id })),
          },
        },
      });

      return res.status(200).json(result);
    } else {
      return res.status(200).json("");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
