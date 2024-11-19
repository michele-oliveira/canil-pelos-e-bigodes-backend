import { Body, JsonController, Post } from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { Vaccine } from "../../entities/vaccine.entity";
import { AnimalsService } from "../../services/animals/animals.service";
import { NewAnimalForAdoption } from "./animals.type";

@JsonController("/animals")
export class AnimalsController {
  private readonly animalsService: AnimalsService;

  constructor() {
    const usersRepository = AppDataSource.getRepository(User);
    const animalsRepository = AppDataSource.getRepository(Animal);
    const vaccinesRepository = AppDataSource.getRepository(Vaccine);
    this.animalsService = new AnimalsService(
      usersRepository,
      animalsRepository,
      vaccinesRepository
    );
  }

  @Post("")
  newAdoption(@Body({ validate: true }) animal: NewAnimalForAdoption) {
    return this.animalsService.newAdoption(animal);
  }
}
