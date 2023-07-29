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
    const { id } = req.body;
    const track = await prisma.track.findUnique({
      where: { id },
      include: { artists: true },
    });

    if (track) {
      return res.status(200).json(track);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
