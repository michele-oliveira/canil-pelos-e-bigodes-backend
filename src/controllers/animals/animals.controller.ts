import { Request } from "express";
import {
  Body,
  JsonController,
  Post,
  Req,
  UseAfter,
  UseBefore,
} from "routing-controllers";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { Vaccine } from "../../entities/vaccine.entity";
import { AnimalsService } from "../../services/animals/animals.service";
import { upload } from "../../config/storage/upload";
import { FailedUploadsMiddleware } from "../../middlewares/failedUploads.middleware";
import { NewAnimalForAdoption as NewAnimalForAdoptionBody } from "./animals.type";
import {
  AnimalImageFilesDTO,
  NewAnimalForAdoptionDTO,
} from "../../interfaces/dto";

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
  @UseBefore(
    upload.fields([
      { name: "image_1", maxCount: 1 },
      { name: "image_2", maxCount: 1 },
    ])
  )
  @UseAfter(FailedUploadsMiddleware)
  newAdoption(
    @Req() req: Request,
    @Body({ validate: true }) body: NewAnimalForAdoptionBody
  ) {
    const files = req.files as unknown as AnimalImageFilesDTO;

    const newAnimalForAdoption: NewAnimalForAdoptionDTO = {
      ...body,
      ...files,
      age: parseInt(body.age),
      vaccineIds: body.vaccineIds ?? [],
    };

    return this.animalsService.newAdoption(newAnimalForAdoption);
  }
}
