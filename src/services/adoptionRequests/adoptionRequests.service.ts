import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
import { AdoptionRequestStatus } from "../../entities/enums/adoptionRequestStatus.enum";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import ConflictError from "../../errors/ConflictError.error";

export class AdoptionRequestsService {
  private readonly adoptionRequestsRepository: Repository<AdoptionRequest>;
  private readonly animalsRepository: Repository<Animal>;
  private readonly usersRepository: Repository<User>;

  constructor(
    adoptionRequestsRepository: Repository<AdoptionRequest>,
    animalsRepository: Repository<Animal>,
    usersRepository: Repository<User>
  ) {
    this.adoptionRequestsRepository = adoptionRequestsRepository;
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
      id: intenderId,
    });
    if (!intender) {
      throw new NotFoundError("Intender not found");
    }

    const adoptionRequest = this.adoptionRequestsRepository.create({
      animal,
      intender,
    });

    await this.adoptionRequestsRepository.insert(adoptionRequest);

    return adoptionRequest;
  }

  async deleteRequest(userId: string, requestId: string) {
    const request = await this.adoptionRequestsRepository.findOne({
      where: { id: requestId },
      relations: ["animal", "animal.owner"],
    });
    if (!request) {
      throw new NotFoundError("Adoption request not found");
    }

    if (request.animal.owner.id !== userId) {
      throw new UnauthorizedError("You cannot delete this resource");
    }

    if (request.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictError(
        `You cannot delete this request that is '${request.status}'`
      );
    }

    await this.adoptionRequestsRepository.remove(request);

    return null;
  }

  async rejectRequest(userId: string, requestId: string) {
    const request = await this.adoptionRequestsRepository.findOne({
      where: { id: requestId },
      relations: ["animal", "animal.owner"],
    });
    if (!request) {
      throw new NotFoundError("Adoption request not found");
    }

    if (request.animal.owner.id !== userId) {
      throw new UnauthorizedError("You cannot modify this resource");
    }

    if (request.status !== AdoptionRequestStatus.PENDING) {
      throw new ConflictError(
        `You cannot modify the status of a request that is '${request.status}'`
      );
    }

    request.status = AdoptionRequestStatus.REJECTED;
    await this.adoptionRequestsRepository.save(request);

    return null;
  }

  async acceptRequest(userId: string, requestId: string) {
    return await AppDataSource.transaction(async (manager) => {
      const request = await manager.findOne(AdoptionRequest, {
        where: { id: requestId },
        relations: ["animal", "animal.owner", "intender"],
      });
      if (!request) {
        throw new NotFoundError("Adoption request not found");
      }

      if (request.animal.owner.id !== userId) {
        throw new UnauthorizedError("You cannot modify this resource");
      }

      if (request.status !== AdoptionRequestStatus.PENDING) {
        throw new ConflictError(
          `You cannot modify the status of a request that is '${request.status}'`
        );
      }

      request.status = AdoptionRequestStatus.ACCEPTED;
      request.animal.adoptedBy = request.intender;

      await manager.save(AdoptionRequest, request);
      await manager.save(Animal, request.animal);

      return null;
    });
  }
}
