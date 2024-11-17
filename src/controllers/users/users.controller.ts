import { Body, JsonController, Post } from "routing-controllers";
import { UsersService } from "../../services/users/users.service";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { NewUser, UserCredentials } from "./users.type";

@JsonController("/users")
export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    this.usersService = new UsersService(usersRepository);
  }

  @Post("/register")
  async register(@Body({ validate: true }) newUser: NewUser) {
    return this.usersService.createUser(newUser);
  }

  @Post("/login")
  async login(@Body({ validate: true }) credentials: UserCredentials) {
    return this.usersService.login(credentials);
  }
}
