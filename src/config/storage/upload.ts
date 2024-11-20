import multer from "multer";
import { Request } from "express";
import { IMAGES_PATH } from "../../utils/files";
import { BadRequestError } from "routing-controllers";

const allowedMimetypes = ["image/png", "image/jpeg", "image/jpg"];

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, callback: any) => {
    callback(null, IMAGES_PATH);
  },
  filename: (req: Request, file: Express.Multer.File, callback: any) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueFileName);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, callback: any) => {
  if (allowedMimetypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        "Invalid uploaded file! Only PNG, JPG, and JPEG images are accepted"
      ),
      false
    );
  }
};

const limits: multer.Options["limits"] = {
  files: 2,
  fileSize: 5 * 1024 * 1024,
};

export const upload = multer({ storage, fileFilter, limits });
