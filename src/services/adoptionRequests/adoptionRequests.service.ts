import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database/data-source";
import { User } from "../../entities/user.entity";
import { Animal } from "../../entities/animal.entity";
import { AdoptionRequest } from "../../entities/adoptionRequest.entity";
import { AdoptionRequestStatus } from "../../entities/enums/adoptionRequestStatus.enum";
import { NotFoundError, UnauthorizedError } from "routing-controllers";
import ConflictError from "../../errors/ConflictError.error";
import { FilterOptions } from "./adoptionRequests.type";
import { getPublicImageUrl } from "../../utils/files";

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

  async list(userId: string, filterOptions: FilterOptions) {
    const { limit, page } = filterOptions;

    const skip = (page - 1) * limit;

    const [adoptionRequests, total] =
      await this.adoptionRequestsRepository.findAndCount({
        relations: ["animal", "animal.owner", "intender"],
        order: {
          createdAt: "DESC",
        },
        skip,
        take: limit,
      });

    const adoptionRequestsWithType = adoptionRequests.map(
      (adoptionRequest) => ({
        ...adoptionRequest,
        type: adoptionRequest.intender.id === userId ? "made" : "received",
      })
    );
    adoptionRequestsWithType.forEach((adoptionRequest) => {
      adoptionRequest.animal.image_1 = getPublicImageUrl(
        adoptionRequest.animal.image_1
      );
      adoptionRequest.animal.image_2 = getPublicImageUrl(
        adoptionRequest.animal.image_2
      );
    });

    return {
      adoptionRequests: adoptionRequestsWithType,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listMade(userId: string, filterOptions: FilterOptions) {
    const { limit, page } = filterOptions;

    const skip = (page - 1) * limit;

    const [adoptionRequests, total] =
      await this.adoptionRequestsRepository.findAndCount({
        relations: ["animal", "animal.owner", "intender"],
        where: {
          intender: {
            id: userId,
          },
        },
        order: {
          createdAt: "DESC",
        },
        skip,
        take: limit,
      });

    adoptionRequests.forEach((adoptionRequest) => {
      adoptionRequest.animal.image_1 = getPublicImageUrl(
        adoptionRequest.animal.image_1
      );
      adoptionRequest.animal.image_2 = getPublicImageUrl(
        adoptionRequest.animal.image_2
      );
    });

    return {
      adoptionRequests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async listReceived(userId: string, filterOptions: FilterOptions) {
    const { limit, page } = filterOptions;

    const skip = (page - 1) * limit;

    const [adoptionRequests, total] =
      await this.adoptionRequestsRepository.findAndCount({
        relations: ["animal", "animal.owner", "intender"],
        where: {
          animal: {
            owner: {
              id: userId,
            },
          },
        },
        order: {
          createdAt: "DESC",
        },
        skip,
        take: limit,
      });

    adoptionRequests.forEach((adoptionRequest) => {
      adoptionRequest.animal.image_1 = getPublicImageUrl(
        adoptionRequest.animal.image_1
      );
      adoptionRequest.animal.image_2 = getPublicImageUrl(
        adoptionRequest.animal.image_2
      );
    });

    return {
      adoptionRequests,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async newRequest(animalId: string, intenderId: string) {
    const animal = await this.animalsRepository.findOne({
      where: { id: animalId },
      relations: ["owner"],
    });
    if (!animal) {
      throw new NotFoundError("Animal not found");
    }

    if (animal.adoptedBy) {
      throw new ConflictError("This animal was already adopted");
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

    const existingAdoptionRequest =
      await this.adoptionRequestsRepository.findOne({
        relations: ["animal", "intender"],
        where: {
          status: AdoptionRequestStatus.PENDING,
          animal: {
            id: animalId,
          },
          intender: {
            id: intenderId,
          },
        },
      });
    if (existingAdoptionRequest) {
      throw new ConflictError(
        "You already have a pending adoption request for this animal"
      );
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
