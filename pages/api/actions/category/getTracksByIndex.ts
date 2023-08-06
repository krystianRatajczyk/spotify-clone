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
    const { skip, take } = req.body;
    const tracks = await prisma.track.findMany({
      skip,
      take,
      include: { artists: true },
    });

    if (tracks) {
      return res.status(200).json(tracks);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
