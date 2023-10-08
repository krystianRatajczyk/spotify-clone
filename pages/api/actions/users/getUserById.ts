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
    const { id, options } = req.body;
    const user = await prisma.user.findUnique({
      where: { id },
      ...options,
    });

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).end();
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
