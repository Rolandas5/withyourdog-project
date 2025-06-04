export interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  ipAddress: string;
  avatarUrl?: string;
}
