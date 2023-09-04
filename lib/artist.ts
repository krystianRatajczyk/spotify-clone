import { Track } from "@prisma/client";
import axios from "axios";

type Payload =
  | { artist: { id: string; name: string; image: string } }
  | { id: string };

export const addOrRemoveLikedArtist = (
  //@ts-ignore
  UserDispatch: ({ type: string, payload: Payload }) => void,
  isFollowing: boolean,
  artist: { id: string; name: string; image: string }
) => {
  if (!isFollowing) {
    UserDispatch({
      type: "ADD_LIKED_ARTIST",
      payload: { artist },
    });
  } else {
    UserDispatch({
      type: "REMOVE_LIKED_ARTIST",
      payload: { id: artist.id },
    });
  }
};

export const getFormattedObjects = async (
  path: string,
  body: {},
  type: "songs" | "artists" | "playlists"
) => {
  const currentUser = await axios.get("/api/current");

  try {
    const received = await axios.post(path, {
      ids: currentUser.data.liked[type],
      ...body,
    });
    const map = new Map();
    received.data.forEach((obj: Track) => {
      map.set(obj.id, obj); // setting key value pairs "id" -> doc
    });

    const liked = currentUser.data.liked[type].map((id: string) => map.get(id)); // getting certain tracks in user likes songs order
    // getting certain tracks in user likes songs order

    return liked;
  } catch (error) {
    console.log(error);
  }
};
