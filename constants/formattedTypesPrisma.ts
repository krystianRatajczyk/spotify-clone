import { Playlist, Track } from "@prisma/client";

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
  playlists: Playlist[];
  recentSearches: Search[];
  likedSongs: Track[];
  likedArtists: { name: string; image: string; id: string }[];
  likedPlaylists: {
    id: string;
    name: string;
    author?: string;
    image: string;
  user: { id: string; name: string; tracks: Track[] };
    userId: string;
  }[];
}
