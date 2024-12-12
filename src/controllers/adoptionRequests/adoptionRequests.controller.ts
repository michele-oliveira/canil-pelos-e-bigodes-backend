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
import { AppDataSource } from "../../config/database/data-source";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
import { Animal } from "../../entities/animal.entity";
import { User } from "../../entities/user.entity";
import { AdoptionRequestsService } from "../../services/adoptionRequests/adoptionRequests.service";
import { NewAdoptionRequest as NewAdoptionRequestBody } from "./adoptionRequests.type";

@JsonController("/adoption-requests")
export class AdoptionRequestsController {
  private readonly adoptionRequestsService: AdoptionRequestsService;

  constructor() {
    const adoptionRequestsRepository =
      AppDataSource.getRepository(AdoptionRequest);
    const animalsRepository = AppDataSource.getRepository(Animal);
    const usersRepository = AppDataSource.getRepository(User);

    this.adoptionRequestsService = new AdoptionRequestsService(
      adoptionRequestsRepository,
      animalsRepository,
      usersRepository
    );
  }

  @Post("/")
  newRequest(
    @CurrentUser() user: User,
    @Body({ validate: true }) body: NewAdoptionRequestBody
  ) {
    return this.adoptionRequestsService.newRequest(body.animal_id, user.id);
  }

  @Delete("/:request_id")
  @Authorized()
  deleteRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionRequestsService.deleteRequest(user.id, requestId);
  }

  @Patch("/:request_id/reject")
  @Authorized()
  rejectRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionRequestsService.rejectRequest(user.id, requestId);
  }

  @Patch("/:request_id/accept")
  @Authorized()
  acceptRequest(
    @CurrentUser() user: User,
    @Param("request_id") requestId: string
  ) {
    return this.adoptionRequestsService.acceptRequest(user.id, requestId);
  }
}
