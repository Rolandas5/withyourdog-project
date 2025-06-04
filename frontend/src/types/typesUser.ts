export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  ipAddress?: string;
  createdAt?: string;
  updatedAt: string;
}
