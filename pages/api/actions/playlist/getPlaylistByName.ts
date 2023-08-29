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
    let { name, author } = req.body;

    const playlist = await prisma.playlist.findFirst({
      where: {
        name,
        author,
      },
    });


    if (playlist) {
      return res.status(200).json(playlist);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
