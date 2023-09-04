import bcrypt from "bcrypt";
import { NextApiResponse, NextApiRequest } from "next";
import prismadb from "@/lib/prismadb";
import { Playlist } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { email, name, password } = req.body;
    const existingUser = await prismadb.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(422)
        .json({ error: "Email is already taken", cause: "email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
        recentSearches: [],
        liked: { songs: [], artists: [], playlists: [] },
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
}
