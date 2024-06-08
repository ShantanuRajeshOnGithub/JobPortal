export interface User {
  _id: string;
  name: string;
}

export type HomePageProps = {
  users: User[];
};
