import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { ExpressErrorMiddlewareInterface } from "routing-controllers";
import { deleteFile } from "../utils/files";
import { MulterFilesObject } from "../interfaces/files";

export class FailedUploadsMiddleware
  implements ExpressErrorMiddlewareInterface
{
  error(error: any, request: Request, response: Response, next: NextFunction) {
    if (
      Array.isArray(error.errors) &&
      error.errors?.[0] instanceof ValidationError
    ) {
      try {
        const files = request.files as unknown as MulterFilesObject;
        Object.values(files).forEach((file) => {
          deleteFile(file[0].path);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }
}
