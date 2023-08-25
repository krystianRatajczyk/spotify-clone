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
    const { query, key } = req.body;

    //@ts-ignore
    const tracks = await prisma[key].findMany(query);
    if (tracks) {
      return res.status(200).json(tracks);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
