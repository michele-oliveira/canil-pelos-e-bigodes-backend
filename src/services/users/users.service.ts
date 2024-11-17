import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { User } from "../../entities/user.entity";
import { genSalt, hash } from "bcrypt";
import { UnauthorizedError } from "routing-controllers";
import TokenizedUser from "../../interfaces/tokenizedUser";
import { NewUser, UserCredentials } from "./users.type";

export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async createUser(user: NewUser) {
    const newUser = this.usersRepository.create(user);
    newUser.salt = await genSalt();
    newUser.password = await hash(user.password, newUser.salt);
    return this.usersRepository.insert(newUser);
  }

  async login(credentials: UserCredentials) {
    const { email, password } = credentials;

    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const hashedPassword = await hash(password, user.salt);
    if (hashedPassword !== user.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokenizedUser: TokenizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
    const jwt = sign(tokenizedUser, process.env.JWT_SECRET!);

    return {
      accessToken: jwt,
    };
  }
}
