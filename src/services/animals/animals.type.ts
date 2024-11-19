import { AnimalType } from "../../entities/enums/animalType.enum";
import { AnimalGender } from "../../entities/enums/animalGender.enum";

export type NewAnimalForAdoption = {
  name: string;
  breed: string;
  age: number;
  gender: AnimalGender;
  type: AnimalType;
  vaccineIds: string[];
  description: string;
  ownerId: string;
  adopterId?: string;
};
