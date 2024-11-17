import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { NewUser } from "./users.type";
import { genSalt, hash } from "bcrypt";

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
}
