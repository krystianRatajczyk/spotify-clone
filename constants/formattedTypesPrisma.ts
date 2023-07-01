export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image: string | null;
  hashedPassword: string;
  createdAt: string;
  updatedAt: string;
}
