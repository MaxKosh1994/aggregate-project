export type SignInDataType = {
  email: string;
  password: string;
};

export type SignUpDataType = SignInDataType & {
  firstName: string;
  lastName: string;
};

export type UserType = SignUpDataType & {
  id: number;
  avatarSrc: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithTokenType = {
  user: UserType;
  accessToken: string;
};
