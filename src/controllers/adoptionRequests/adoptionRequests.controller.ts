import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParams,
} from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
import { Animal } from "../../entities/animal.entity";
import { User } from "../../entities/user.entity";
import { AdoptionRequestsService } from "../../services/adoptionRequests/adoptionRequests.service";
import {
  ListParams,
  NewAdoptionRequest as NewAdoptionRequestBody,
} from "./adoptionRequests.type";

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

  @Get("/")
  @Authorized()
  list(@CurrentUser() user: User, @QueryParams() filterOptions: ListParams) {
    const { type, page, limit } = filterOptions;
    if (!type) {
      return this.adoptionRequestsService.list(user.id, { page, limit });
    } else if (type === "made") {
      return this.adoptionRequestsService.listMade(user.id, { page, limit });
    } else {
      return this.adoptionRequestsService.listReceived(user.id, {
        page,
        limit,
      });
    }
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
