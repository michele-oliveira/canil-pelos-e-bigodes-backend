import { AppDataSource } from "./config/database/data-source";
import { Animal } from "./entities/animal.entity";
import { deleteMultipleImages, getAllStoredImages } from "./utils/files";

const cleanup = async () => {
  await AppDataSource.initialize();
  const animalsRepository = AppDataSource.getRepository(Animal);
  const animals = await animalsRepository.find();
  await AppDataSource.destroy();

  const imagesInUse = animals
    .map((animal) => [animal.image_1, animal.image_2])
    .flat()
    .filter(Boolean);
  const imagesToDelete = getAllStoredImages().filter(
    (image) => !imagesInUse.includes(image)
  );

  deleteMultipleImages(imagesToDelete);
};

cleanup();
