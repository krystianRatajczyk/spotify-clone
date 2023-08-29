import bcrypt from "bcrypt";
import { NextApiResponse, NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import { Track } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    let { image, author, tracks, name } = req.body;

    
    const updatedPlaylist = await prismadb.playlist.create({
      data: {
        image,
        name,
        author,
        tracks,
      },
    });
    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
