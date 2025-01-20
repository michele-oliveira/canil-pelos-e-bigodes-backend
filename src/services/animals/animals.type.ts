import { AnimalType } from "../../entities/enums/animalType.enum";
import { AnimalImageFilesDTO } from "../../interfaces/dto";

export interface FilterOptions {
  page: number;
  limit: number;
  animalType?: AnimalType;
}

export type AnimalImageNames = {
  [K in keyof AnimalImageFilesDTO]: string;
};
