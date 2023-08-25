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
    const { ids } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (ids) {
      const result = await prisma.user.update({
        where: { email: currentUser.email },
        data: { likedSongsIds: ids },
      });

      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
