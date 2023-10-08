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
    const { ids, action } = req.body;
    const { currentUser } = await serverAuth(req, res);

    if (ids) {
      const result = await prisma.user.update({
        where: { email: currentUser.email },
        data: {
          following: {
            [action]: ids.map((id: string) => ({ id: id })),
          },
        },
      });

      for (const id in ids) {
        const result = await prisma.user.update({
          where: { id: ids[id] },
          data: {
            followers: {
              [action]: { id: currentUser.id },
            },
          },
        });
      }

      return res.status(200).json(result);
    } else {
      return res.status(200).json("");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
