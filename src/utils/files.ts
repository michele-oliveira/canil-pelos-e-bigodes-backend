import { existsSync, mkdirSync, unlink } from "fs";
import path from "path";

export const IMAGES_PATH = path.resolve(
  __dirname,
  "..",
  "..",
  "public",
  "images"
);

export const getPublicImageUrl = (imageName: string) =>
  `${process.env.APP_URL}/images/${imageName}`;

export const createImagesDirectoryIfNotExists = () => {
  if (!existsSync(IMAGES_PATH)) {
    mkdirSync(IMAGES_PATH, { recursive: true });
    console.info("Images directory created successfully");
  } else {
    console.info("Images directory already exists, skipping its creation");
  }
};

export const deleteFile = (filePath: string) => {
  if (filePath && existsSync(filePath)) {
    unlink(filePath, (err) => {
      if (err) {
        console.error(`Error while deleting file ${filePath}`, err);
      }
    });
  }
};
