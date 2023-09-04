import { NextApiResponse, NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { user } = req.body;
    const playlistName = `My Playlist #${user.playlists.length + 1}`;

    const createdPlaylist = await prismadb.playlist.create({
      data: {
        name: playlistName,
        user: { connect: { id: user.id } },
        image: "",
      },
    });

    if (user) {
      const result = await prismadb.user.update({
        where: { id: user.id },
        data: {
          playlists: { connect: { id: createdPlaylist.id } },
        },
      });
    }

    return res.status(200).json(createdPlaylist);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
