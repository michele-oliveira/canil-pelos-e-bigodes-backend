import { Request } from "express";
import {
  Body,
  HttpCode,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseBefore,
} from "routing-controllers";
import { UsersService } from "../../services/users/users.service";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { FailedUploadsMiddleware } from "../../middlewares/failedUploads.middleware";
import { NewUser as NewUserBody, UserCredentials } from "./users.type";
import { upload } from "../../config/storage/upload";
import { NewUserDTO, UserImageFileDTO } from "../../interfaces/dto";

@JsonController("/users")
export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    this.usersService = new UsersService(usersRepository);
  }

  @Post("/register")
  @HttpCode(201)
  @UseBefore(upload.fields([{ name: "profile_picture", maxCount: 1 }]))
  @UseAfter(FailedUploadsMiddleware)
  async register(
    @Req() req: Request,
    @Body({ validate: true }) newUser: NewUserBody
  ) {
    const files = req.files as unknown as UserImageFileDTO;

    const registerUserBody: NewUserDTO = { ...newUser, ...files };

    return this.usersService.createUser(registerUserBody);
  }

  @Post("/login")
  async login(@Body({ validate: true }) credentials: UserCredentials) {
    return this.usersService.login(credentials);
  }
}
