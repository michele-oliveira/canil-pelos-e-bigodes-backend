import { In, Repository } from "typeorm";
import { BadRequestError, NotFoundError } from "routing-controllers";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { Vaccine } from "../../entities/vaccine.entity";
import { NewAnimalForAdoption } from "./animals.type";

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

  async newAdoption(animal: NewAnimalForAdoption) {
    const owner = await this.usersRepository.findOneBy({ id: animal.ownerId });
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
      name: animal.name,
      breed: animal.breed,
      age: animal.age,
      gender: animal.gender,
      type: animal.type,
      description: animal.description,
      owner,
      vaccines,
    });

    await this.animalsRepository.insert(newAnimal);

    return newAnimal;
  }
}
