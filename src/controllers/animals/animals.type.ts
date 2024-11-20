import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { AnimalType } from "../../entities/enums/animalType.enum";
import { AnimalGender } from "../../entities/enums/animalGender.enum";
import { IsPositiveIntegerString } from "../../common/validators/numbers";

export class NewAnimalForAdoption {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  breed: string;

  @Validate(IsPositiveIntegerString, {
    message: "age must be a positive whole number",
  })
  age: string;

  @IsEnum(AnimalGender)
  gender: AnimalGender;

  @IsEnum(AnimalType)
  type: AnimalType;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  vaccineIds?: string[];

  @IsString()
  @MinLength(24)
  @MaxLength(3584)
  description: string;

  @IsUUID()
  ownerId: string;

  @IsOptional()
  @IsUUID()
  adopterId?: string;
}
