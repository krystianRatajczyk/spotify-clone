export interface notificationState {
  message: string;
  color: string;
}

export type errorType = {
  name: boolean;
  url: { value: boolean; message: string };
};

export const profileErrorState = {
  name: false,
  url: { value: false, message: "" },
};

export const authErrorState = {
  email: { message: null },
  password: { message: null },
  username: { message: null },
};

export const notificationState = {
  message: "",
  color: "",
};

export const UserEmptyState = {
  //did it to avoid annoying errors :(
  id: "",
  name: "",
  email: "",
  emailVerified: "",
  image: "",
  hashedPassword: "",
  createdAt: "",
  updatedAt: "",
};

export const emptyTrackState = {
  id: "",
  name: "",
  image: "",
  releaseDate: "",
  currentRank: 0,
  previousRank: 0,
  artistsIds: [],
  artists: [],
  duration: 0,
  genre: "",
};
