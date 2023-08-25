import { Track, User } from "@prisma/client";

// converts the time to format 0:00
export const convertTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
  return { formattedTime, hours, minutes, remainingSeconds };
};

export const timeReducer = (tracks: Track[]) => {
  const durations = tracks.map((track) => track.duration);
  const totalDuration = durations.reduce((prev, curr) => {
    return (prev += curr);
  }, 0);

  return convertTime(totalDuration);
};

export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString(16); // Convert current timestamp to hexadecimal
  const randomPart = Math.floor(Math.random() * 1000000).toString(16); // Generate a random number and convert to hexadecimal
  return `${timestamp}-${randomPart}`;
};

export const addOrRemoveLikedSong = (
  //@ts-ignore
  UserDispatch: ({ type: string, payload: { id: string } }) => void,
  isLiked: boolean,
  id: string
) => {
  let type: "REMOVE_LIKED_SONG" | "ADD_LIKED_SONG" = "REMOVE_LIKED_SONG";
  if (!isLiked) {
    type = "ADD_LIKED_SONG";
  }

  UserDispatch({
    type: type,
    payload: { id },
  });
};
