import {
  Authorized,
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

  @Post("/new-request/:animal_id")
  newRequest(@CurrentUser() user: User, @Param("animal_id") animalId: string) {
    return this.adoptionsService.newRequest(animalId, user.id);
  }

  @Delete("/delete-request/:request_id")
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
