export interface notificationState {
  message: string;
  color: string;
}

export const errorState = {
  email: { message: null },
  password: { message: null },
  username: { message: null },
};

export const notificationState = {
  message: "",
  color: "",
};
