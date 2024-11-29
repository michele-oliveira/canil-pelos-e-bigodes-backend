import path from "path";
import { In, Repository } from "typeorm";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "routing-controllers";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { Vaccine } from "../../entities/vaccine.entity";
import { compareFiles, deleteFile, IMAGES_PATH } from "../../utils/files";
import {
  AnimalImageFilesDTO,
  NewAnimalDTO,
  UpdateAnimalDTO,
} from "../../interfaces/dto";
import { AnimalImageNames } from "./animals.type";
import { AnimalType } from "../../entities/enums/animalType.enum";

export class AnimalsService {
  private readonly usersRepository: Repository<User>;
  private readonly animalsRepository: Repository<Animal>;
  private readonly vaccinesRepository: Repository<Vaccine>;

  constructor(
    usersRepository: Repository<User>,
    animalsRepository: Repository<Animal>,
    vaccinesRepository: Repository<Vaccine>
  ) {
    this.usersRepository = usersRepository;
    this.animalsRepository = animalsRepository;
    this.vaccinesRepository = vaccinesRepository;
  }

  async list(page: number, limit: number, animalType?: AnimalType) {
    if (limit <= 0 || page <= 0) {
      throw new BadRequestError("Invalid pagination params");
    }

    if (animalType && !Object.values(AnimalType).includes(animalType)) {
      throw new BadRequestError("Invalid animal type provided");
    }

    const skip = (page - 1) * limit;

    const [animals, total] = await this.animalsRepository.findAndCount({
      where: animalType
        ? {
            type: animalType,
          }
        : undefined,
      skip,
      take: limit,
    });

    return {
      animals,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async newAnimal(userId: string, animal: NewAnimalDTO) {
    try {
      const newAnimal = await this.validateAndFillAnimalDetails(userId, animal);

      await this.animalsRepository.insert(newAnimal);

      return newAnimal;
    } catch (error) {
      this.deleteImages({
        image_1: animal.image_1,
        image_2: animal.image_2,
      });

      throw error;
    }
  }

  async updateAnimal(userId: string, animal: UpdateAnimalDTO) {
    try {
      const existingAnimal = await this.validateAndFillAnimalDetails(
        userId,
        animal
      );

      await this.animalsRepository.save(existingAnimal);

      return existingAnimal;
    } catch (error) {
      this.deleteImages({
        image_1: animal.image_1,
        image_2: animal.image_2,
      });

      throw error;
    }
  }

  private async validateAndFillAnimalDetails(
    userId: string,
    animalDetails: NewAnimalDTO | UpdateAnimalDTO
  ) {
    let animal: Animal;
    if ("id" in animalDetails) {
      // Updating Animal entity
      const existingAnimal = await this.animalsRepository.findOne({
        where: {
          id: animalDetails.id,
        },
        relations: ["owner"],
      });
      if (!existingAnimal) {
        throw new NotFoundError("Animal not found");
      }

      if (userId !== existingAnimal.owner.id) {
        throw new UnauthorizedError("You cannot change this resource");
      }

      const animalImageNames = await this.updateImages(existingAnimal, {
        image_1: animalDetails.image_1,
        image_2: animalDetails.image_2,
      });

      animal = {
        ...existingAnimal,
        ...animalDetails,
        image_1: animalImageNames.image_1,
        image_2: animalImageNames.image_2,
      };
    } else {
      // Creating new Animal
      const { image_1: image1, image_2: image2 } = animalDetails;
      if (!image1?.[0] || !image2?.[0]) {
        throw new BadRequestError("'image_1' and 'image_2' are required");
      }

      const owner = await this.usersRepository.findOneBy({
        id: userId,
      });
      if (!owner) {
        throw new NotFoundError("Owner not found");
      }

      animal = this.animalsRepository.create({
        ...animalDetails,
        owner,
        image_1: animalDetails.image_1[0].filename,
        image_2: animalDetails.image_2[0].filename,
      });
    }

    const vaccines = await this.vaccinesRepository.findBy({
      id: In(animalDetails.vaccineIds),
    });
    const fetchedVacineIds = vaccines.map((vaccine) => vaccine.id);
    const invalidVaccineIds = animalDetails.vaccineIds.filter(
      (id) => !fetchedVacineIds.includes(id)
    );
    if (invalidVaccineIds.length > 0) {
      throw new NotFoundError(
        `One or more vaccines do not exist: ${invalidVaccineIds.join(", ")}`
      );
    }

    const incompatibleVaccines = vaccines.filter(
      (vaccine) => vaccine.type !== animal.type
    );
    if (incompatibleVaccines.length > 0) {
      const incompatibleVaccineIds = incompatibleVaccines.map(
        (vaccine) => vaccine.id
      );
      throw new BadRequestError(
        `One or more vaccines are incompatible with the provided animal type: ${incompatibleVaccineIds.join(
          ", "
        )}`
      );
    }

    animal.vaccines = vaccines;
    return animal;
  }

  private deleteImages(images: AnimalImageFilesDTO) {
    try {
      Object.values(images).forEach((image) => {
        if (image?.[0]) {
          deleteFile(path.join(IMAGES_PATH, image[0].filename));
        }
      });
    } catch (error) {
      console.error("Error during file deletion", error);
    }
  }

  private async updateImages(
    existingAnimal: Animal,
    newFiles: AnimalImageFilesDTO
  ) {
    let animalImageNames: AnimalImageNames = {
      image_1: existingAnimal.image_1,
      image_2: existingAnimal.image_2,
    };

    for (const [key, files] of Object.entries(newFiles)) {
      const newFile = files?.[0];

      if (newFile) {
        const oldFileName = existingAnimal[key as keyof AnimalImageFilesDTO];
        const isFileIdentical = await compareFiles(
          path.join(IMAGES_PATH, oldFileName),
          newFile.path
        );
        if (isFileIdentical) {
          deleteFile(newFile.path);
          animalImageNames[key as keyof AnimalImageFilesDTO] = oldFileName;
        } else {
          deleteFile(path.join(IMAGES_PATH, oldFileName));
          animalImageNames[key as keyof AnimalImageFilesDTO] = newFile.filename;
        }
      }
    }
    return animalImageNames;
  }
}
