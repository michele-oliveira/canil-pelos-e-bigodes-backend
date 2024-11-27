import { AnimalImageFilesDTO } from "../../interfaces/dto";

export type AnimalImageNames = {
  [K in keyof AnimalImageFilesDTO]: string;
};
