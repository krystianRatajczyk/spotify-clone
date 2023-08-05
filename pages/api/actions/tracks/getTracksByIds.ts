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
    const { ids, options } = req.body;
    const tracks = await prisma.track.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {...options},
    });

    if (tracks) {
      return res.status(200).json(tracks);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
