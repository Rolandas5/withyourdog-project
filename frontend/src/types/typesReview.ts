export interface Review {
  _id?: string;
  user: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  ip?: string;
}
