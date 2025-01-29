import path from "path";
import { Repository } from "typeorm";
import { UnauthorizedError } from "routing-controllers";
import { sign } from "jsonwebtoken";
import { genSalt, hash } from "bcrypt";
import { User } from "../../entities/user.entity";
import { deleteFile, IMAGES_PATH } from "../../utils/files";
import TokenizedUser from "../../interfaces/tokenizedUser";
import { NewUserDTO, UserImageFileDTO } from "../../interfaces/dto";
import { UserCredentials } from "./users.type";
import ConflictError from "../../errors/ConflictError.error";

export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async createUser(user: NewUserDTO) {
    try {
      const existingUser = await this.usersRepository.findOneBy({
        email: user.email,
      });
      if (existingUser) {
        throw new ConflictError("Email is already registered");
      }

      const profilePicture = user.profile_picture?.[0];

      const newUser = this.usersRepository.create(user);
      newUser.salt = await genSalt();
      newUser.password = await hash(user.password, newUser.salt);
      if (profilePicture) {
        newUser.profilePicture = profilePicture.filename;
      }

      await this.usersRepository.insert(newUser);

      return { id: newUser.id };
    } catch (error) {
      this.deleteImage(user.profile_picture);

      throw error;
    }
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

  private deleteImage(image: UserImageFileDTO["profile_picture"]) {
    try {
      if (image?.[0]) {
        deleteFile(path.join(IMAGES_PATH, image[0].filename));
      }
    } catch (error) {
      console.error("Error during file deletion", error);
    }
  }
}
