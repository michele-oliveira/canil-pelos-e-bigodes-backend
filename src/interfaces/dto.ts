import { AnimalGender } from "../entities/enums/animalGender.enum";
import { AnimalType } from "../entities/enums/animalType.enum";

export interface NewAnimalDTO {
  name: string;
  breed: string;
  age: number;
  gender: AnimalGender;
  type: AnimalType;
  vaccineIds: string[];
  description: string;
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
}

export interface UpdateAnimalDTO extends NewAnimalDTO {
  id: string;
}

export type AnimalImageFilesDTO = {
  image_1: Express.Multer.File[];
  image_2: Express.Multer.File[];
};
