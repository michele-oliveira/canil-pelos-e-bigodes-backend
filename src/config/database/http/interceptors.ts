import { JsonWebTokenError, verify } from "jsonwebtoken";
import { Action, UnauthorizedError } from "routing-controllers";
import { AppDataSource } from "../data-source";
import { User } from "../../../entities/user.entity";
import { decodeJwt, getJwtFromRequestHeaders } from "../../../utils/jwt";

export const authorizationInterceptor = async (
  action: Action,
  roles: string[] = []
) => {
  try {
    const token = getJwtFromRequestHeaders(action.request.headers);
    if (!token) {
      throw new UnauthorizedError("User's access token not provided");
    }

    const verifiedToken = verify(token, process.env.JWT_SECRET!);
    if (!verifiedToken) {
      throw new UnauthorizedError("Invalid access token");
    }

    const decodedUserToken = decodeJwt(token);
    await AppDataSource.getRepository(User).findOneByOrFail({
      id: decodedUserToken.id,
    });
    return true;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid access token");
    }
    throw new UnauthorizedError();
  }
};
