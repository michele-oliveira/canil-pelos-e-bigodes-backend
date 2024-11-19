import { decode } from "jsonwebtoken";
import TokenizedUser from "../interfaces/tokenizedUser";

export const getJwtFromRequestHeaders = (headers: any) => {
  const [, token]: string = headers.authorization?.split(" ") ?? [
    undefined,
    null,
  ];
  return token;
};

export const decodeJwt = (token: string) => {
  return decode(token) as TokenizedUser;
};
