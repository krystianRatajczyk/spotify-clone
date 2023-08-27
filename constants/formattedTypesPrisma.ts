import { Track } from "@prisma/client";

export interface Search {
  id: string;
  name: string;
  image: string;
  type: string;
  typeId: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string | null;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  recentSearches: Search[];
  liked: { songs: Track[] };
}
