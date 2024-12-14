import { AppDataSource } from "./config/database/data-source";
import { Vaccine } from "./entities/vaccine.entity";
import { AnimalType } from "./entities/enums/animalType.enum";

const createVaccines = async () => {
  const vaccinesRepository = AppDataSource.getRepository(Vaccine);

  const catVaccines = vaccinesRepository.create([
    {
      id: "f8469159-1899-416f-bb16-75d65f41e881",
      name: "Vacina tríplice felina (V3)",
      type: AnimalType.CAT,
    },
    {
      id: "0dca9e20-af51-4b7e-baa0-4cc1d0b1b944",
      name: "Vacina quádrupla feline (V4)",
      type: AnimalType.CAT,
    },
    {
      id: "b8fd598c-8ce6-464d-8684-048e1ecd484d",
      name: "Vacina quíntupla felina (V5)",
      type: AnimalType.CAT,
    },
    {
      id: "25e5cda9-fa4d-44eb-8779-71ec0ba83067",
      name: "Vacina antirrábica",
      type: AnimalType.CAT,
    },
  ]);

  const dogVaccines = vaccinesRepository.create([
    {
      id: "090f60d5-0777-4767-81b3-da9c87168649",
      name: "Vacina V8",
      type: AnimalType.DOG,
    },
    {
      id: "83b260db-47bd-4645-b63a-723272dfa60c",
      name: "Vacina V10",
      type: AnimalType.DOG,
    },
    {
      id: "e53e5527-abff-40f3-a766-7135888c348e",
      name: "Vacina contra raiva",
      type: AnimalType.DOG,
    },
    {
      id: "8d0cfbb5-f328-4336-9f1f-9f7a724c460a",
      name: "Vacina contra giárdia",
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
