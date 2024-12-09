import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
// import { NewAdoptionRequestDTO } from "../../interfaces/dto";
import ConflictError from "../../errors/ConflictError.error";
import { NotFoundError } from "routing-controllers";

export class AdoptionsService {
  private readonly adoptionsRepository: Repository<AdoptionRequest>;
  private readonly animalsRepository: Repository<Animal>;
  private readonly usersRepository: Repository<User>;

  constructor(
    adoptionsRepository: Repository<AdoptionRequest>,
    animalsRepository: Repository<Animal>,
    usersRepository: Repository<User>
  ) {
    this.adoptionsRepository = adoptionsRepository;
    this.animalsRepository = animalsRepository;
    this.usersRepository = usersRepository;
  }

  async newRequest(animalId: string, intenderId: string) {
    const animal = await this.animalsRepository.findOne({
      where: { id: animalId },
      relations: ["owner"],
    });
    if (!animal) {
      throw new NotFoundError("Animal not found");
    }

    if (intenderId === animal.owner.id) {
      throw new ConflictError("Animal cannot be adopted by its owner");
    }

    const intender = await this.usersRepository.findOneBy({
      id: intenderId
    });
    if (!intender) {
      throw new NotFoundError("Intender not found");
    }

    const adoptionRequest = this.adoptionsRepository.create({
      animal,
      intender,
    });

    await this.adoptionsRepository.insert(adoptionRequest);

    return adoptionRequest;
  }
}
