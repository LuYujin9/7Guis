export type Unit = {
  name: string;
  toCelsius: (arg0: number) => number;
  fromCelsius: (arg0: number) => number;
};
export type Units = Unit[] & { 0: Unit };

export type User = {
  name: string;
  surname: string;
  id: string;
};

export type UserList<User> = [User, ...User[]];
