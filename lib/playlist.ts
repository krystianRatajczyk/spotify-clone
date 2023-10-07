import { Track } from "@prisma/client";

export const addOrRemoveLikedPlaylist = (
  //@ts-ignore
  UserDispatch: ({ type: string, payload: Payload }) => void,
  isLiked: boolean,
  playlist: {
    id: string;
    name: string;
    image: string;
    author?: string;
    createdUser?: { id: string; name: string; tracks: Track[] };
    createdUserId?: string;
  }
) => {
  if (!isLiked) {
    UserDispatch({
      type: "ADD_LIKED_PLAYLIST",
      payload: { playlist },
    });
  } else {
    UserDispatch({
      type: "REMOVE_LIKED_PLAYLIST",
      payload: { id: playlist.id },
    });
  }
};
