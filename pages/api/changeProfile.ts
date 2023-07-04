import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/lib/serverAuth";
import prisma from "@/lib/prismadb";
import { checkImageExists } from "@/lib/checkImageExists";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { newName, url, user, action } = req.body;

    if (
      (newName != "" && (await checkImageExists(url)) && action == "save") ||
      (action == "delete" && url == "" && newName != "")
    ) {
      const update = await prisma.user.update({
        where: { email: user.email },
        data: { image: url, name: newName },
      });
      return res
        .status(200)
        .json({ message: "Profile changed successfully", update });
    }

    return res.status(410).json({ message: "Cannot update profile" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Cannot update profile" });
  }
}
