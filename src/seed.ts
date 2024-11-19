import { AppDataSource } from "./config/database/data-source";
import { Vaccine } from "./entities/vaccine.entity";
import { AnimalType } from "./entities/enums/animalType.enum";

const createVaccines = async () => {
  const vaccinesRepository = AppDataSource.getRepository(Vaccine);

  const catVaccines = vaccinesRepository.create([
    {
      id: "f8469159-1899-416f-bb16-75d65f41e881",
      name: "Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia (FVRCP) Vaccine",
      type: AnimalType.CAT,
    },
    {
      id: "0dca9e20-af51-4b7e-baa0-4cc1d0b1b944",
      name: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia, and Chlamydia (FVRCP-C) Vaccine",
      type: AnimalType.CAT,
    },
    {
      id: "b8fd598c-8ce6-464d-8684-048e1ecd484d",
      name: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia, Chlamydia, and Feline Leukemia (FVRCP-C-FeLV) Vaccine",
      type: AnimalType.CAT,
    },
    {
      id: "25e5cda9-fa4d-44eb-8779-71ec0ba83067",
      name: "Rabies Vaccine",
      type: AnimalType.CAT,
    },
  ]);

  const dogVaccines = vaccinesRepository.create([
    {
      id: "090f60d5-0777-4767-81b3-da9c87168649",
      name: "Canine 8-in-1 Vaccine",
      type: AnimalType.DOG,
    },
    {
      id: "83b260db-47bd-4645-b63a-723272dfa60c",
      name: "Canine 10-in-1 Vaccine",
      type: AnimalType.DOG,
    },
    {
      id: "e53e5527-abff-40f3-a766-7135888c348e",
      name: "Rabies Vaccine",
      type: AnimalType.DOG,
    },
    {
      id: "8d0cfbb5-f328-4336-9f1f-9f7a724c460a",
      name: "Giardia Vaccine",
      type: AnimalType.DOG,
    },
  ]);

  await vaccinesRepository.save([...catVaccines, ...dogVaccines]);
};

const seed = async () => {
  await AppDataSource.initialize();
  await createVaccines();
  await AppDataSource.destroy();
};

seed();
