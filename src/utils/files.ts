import { createHash } from "crypto";
import { createReadStream, existsSync, mkdirSync, readdirSync, unlink, unlinkSync } from "fs";
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

export const getAllStoredImages = () => readdirSync(IMAGES_PATH);

export const deleteMultipleImages = (imageNames: string[]) => {
  imageNames.forEach((imageName) => {
    const imagePath = path.join(IMAGES_PATH, imageName);
    unlinkSync(imagePath);
  })
}

export const deleteFile = (filePath: string) => {
  if (filePath && existsSync(filePath)) {
    unlink(filePath, (err) => {
      if (err) {
        console.error(`Error while deleting file ${filePath}`, err);
      }
    });
  }
};

export const generateFileHash = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
};

export const compareFiles = async (filePath1: string, filePath2: string) => {
  const hash1 = await generateFileHash(filePath1);
  const hash2 = await generateFileHash(filePath2);
  return hash1 === hash2;
};
