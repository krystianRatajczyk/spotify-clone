import { Track } from "@prisma/client";

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
  const durations = tracks?.map((track) => track.duration);
  const totalDuration = durations?.reduce((prev, curr) => {
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
  UserDispatch: ({ type: string, payload: Payload }) => void,
  isLiked: boolean,
  track: Track
) => {
  if (!isLiked) {
    UserDispatch({
      type: "ADD_LIKED_SONG",
      payload: { track },
    });
  } else {
    UserDispatch({
      type: "REMOVE_LIKED_SONG",
      payload: { id: track.id },
    });
  }
};

export const arrayEquals = (a: string[], b: string[]) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
};

export const findMissingElements = (a: string[], b: string[]) => {
  const missingElements = [];

  for (const element of a) {
    if (!b?.includes(element)) {
      missingElements.push(element);
    }
  }

  return missingElements;
};
