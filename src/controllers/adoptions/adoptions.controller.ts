import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import { AdoptionsService } from "../../services/adoptions/adoptions.service";
import { AppDataSource } from "../../config/database/data-source";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
import { Animal } from "../../entities/animal.entity";
import { User } from "../../entities/user.entity";
import { NewAdoptionRequest as NewAdoptionRequestBody } from "./adoptions.type";

@JsonController("/adoptions")
export class AdoptionsController {
  private readonly adoptionsService: AdoptionsService;

  constructor() {
    const adoptionsRepository = AppDataSource.getRepository(AdoptionRequest);
    const animalsRepository = AppDataSource.getRepository(Animal);
    const usersRepository = AppDataSource.getRepository(User);

    this.adoptionsService = new AdoptionsService(
      adoptionsRepository,
      animalsRepository,
      usersRepository
    );
  }

  @Post("/")
  newRequest(
    @CurrentUser() user: User,
    @Body({ validate: true }) body: NewAdoptionRequestBody
  ) {
    return this.adoptionsService.newRequest(body.animal_id, user.id);
  }

  @Delete("/:request_id")
  @Authorized()
  deleteRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionsService.deleteRequest(user.id, requestId);
  }

  @Patch("/:request_id/reject-request")
  @Authorized()
  rejectRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionsService.rejectRequest(user.id, requestId);
  }

  @Patch("/:request_id/accept-request")
  @Authorized()
  acceptRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionsService.acceptRequest(user.id, requestId);
  }
}
