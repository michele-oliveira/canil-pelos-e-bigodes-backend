import { Request } from "express";
import {
  Authorized,
  Body,
  CurrentUser,
  JsonController,
  Post,
  Put,
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
import {
  NewAnimal as NewAnimalBody,
  UpdateAnimal as UpdateAnimalBody,
} from "./animals.type";
import {
  AnimalImageFilesDTO,
  NewAnimalDTO,
  UpdateAnimalDTO,
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
  @Authorized()
  @UseBefore(
    upload.fields([
      { name: "image_1", maxCount: 1 },
      { name: "image_2", maxCount: 1 },
    ])
  )
  @UseAfter(FailedUploadsMiddleware)
  newAdoption(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Body({ validate: true }) body: NewAnimalBody
  ) {
    const files = req.files as unknown as AnimalImageFilesDTO;

    const newAnimalForAdoption: NewAnimalDTO = {
      ...body,
      ...files,
      age: parseInt(body.age),
      vaccineIds: body.vaccineIds ?? [],
    };

    return this.animalsService.newAnimal(user.id, newAnimalForAdoption);
  }

  @Put("")
  @Authorized()
  @UseBefore(
    upload.fields([
      { name: "image_1", maxCount: 1 },
      { name: "image_2", maxCount: 1 },
    ])
  )
  @UseAfter(FailedUploadsMiddleware)
  updateAdoption(
    @CurrentUser() user: User,
    @Req() req: Request,
    @Body({ validate: true }) body: UpdateAnimalBody
  ) {
    const files = req.files as unknown as AnimalImageFilesDTO;

    const existingAnimalForAdoption: UpdateAnimalDTO = {
      ...body,
      ...files,
      age: parseInt(body.age),
      vaccineIds: body.vaccineIds ?? [],
    };

    return this.animalsService.updateAnimal(user.id, existingAnimalForAdoption);
  }
}
