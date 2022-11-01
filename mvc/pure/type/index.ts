export type UserInfo = {
  user_id: string;
  desc: string;
  content: string;
};
export type UserDetail = {
  id: string;
  name: string;
  desc: string;
};

export type WithId<T> = {
  _id: unknown;
} & T;

export type DetailedUserMap = WithId<UserInfo> & {
  user_info: WithId<UserDetail>;
};
