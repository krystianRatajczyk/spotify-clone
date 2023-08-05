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
    let { ids, options } = req.body;

    if (typeof ids === "string") {
      ids = [ids];
    }
    
    const artists = await prisma.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        ...options,
      },
    });
    if (artists) {
      return res.status(200).json(artists);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
