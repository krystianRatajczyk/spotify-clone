export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string | undefined;
  hashedPassword: string;
  createdAt: string;
  updatedAt: string;
}
