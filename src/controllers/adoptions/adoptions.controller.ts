import { CurrentUser, JsonController, Param, Post } from "routing-controllers";
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
}
