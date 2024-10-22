export type SmallMedia = {
  id: string;
  name: string;
};

export type Media = {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
  images?: Image[];
};

export interface Image {
  id: string;
  media_id: string;
  url: string;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
}