export const isUsernameValid = (user: string): boolean => {
  if (user) {
    return true;
  }
  throw new Error("Username is required", { cause: "username" });
};

export const isEmailValid = (email: string): boolean => {
  if (email) {
    if (email.trim().includes("@")) {
      return true;
    }
    throw new Error("Email is invalid", { cause: "email" });
  }
  throw new Error("Email is required", { cause: "email" });
};

export const isPasswordValid = (password: string): boolean => {
  if (!password) {
    throw new Error("Password is required", { cause: "password" });
  }
  if (password.length >= 6) {
    for (let i = 0; i < password.length; i++) {
      const ascii = password.charCodeAt(i);
      if (
        ascii < 48 ||
        (ascii > 57 && ascii < 65) ||
        (ascii > 90 && ascii < 97) ||
        ascii > 122
      ) {
        throw new Error("Password contains special characters", {
          cause: "password",
        });
      }
    }
    return true;
  }
  throw new Error("Password is too short", { cause: "password" });
};
