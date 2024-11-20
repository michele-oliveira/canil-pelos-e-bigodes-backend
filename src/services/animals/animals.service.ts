import path from "path";
import { In, Repository } from "typeorm";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { Vaccine } from "../../entities/vaccine.entity";
import { deleteFile, IMAGES_PATH } from "../../utils/files";
import {
  AnimalImageFilesDTO,
  NewAnimalForAdoptionDTO,
} from "../../interfaces/dto";

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

  async newAdoption(animal: NewAnimalForAdoptionDTO) {
    try {
      const { image_1: image1, image_2: image2 } = animal;
      if (!image1?.[0] || !image2?.[0]) {
        throw new BadRequestError("'image_1' and 'image_2' are required");
      }

      const owner = await this.usersRepository.findOneBy({
        id: animal.ownerId,
      });
      if (!owner) {
        throw new NotFoundError("Owner does not exist");
      }

      const vaccines = await this.vaccinesRepository.findBy({
        id: In(animal.vaccineIds),
      });
      const fetchedVacineIds = vaccines.map((vaccine) => vaccine.id);
      const invalidVaccineIds = animal.vaccineIds.filter(
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

      const newAnimal = this.animalsRepository.create({
        ...animal,
        owner,
        vaccines,
        image_1: image1[0].filename,
        image_2: image2[0].filename,
      });

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
}
