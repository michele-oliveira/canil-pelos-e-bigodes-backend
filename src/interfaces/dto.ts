import { AnimalGender } from "../entities/enums/animalGender.enum";
import { AnimalType } from "../entities/enums/animalType.enum";

export interface NewAnimalForAdoptionDTO {
  name: string;
  breed: string;
  age: number;
  gender: AnimalGender;
  type: AnimalType;
  vaccineIds: string[];
  description: string;
  ownerId: string;
  adopterId?: string;
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
}

export type AnimalImageFilesDTO = {
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
};
