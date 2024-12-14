import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from "class-validator";
import { AnimalType } from "../../entities/enums/animalType.enum";
import { AnimalGender } from "../../entities/enums/animalGender.enum";
import { IsPositiveIntegerString } from "../../common/validators/numbers";
import { ANIMALS_PER_PAGE } from "../../common/constants/animalsControllerDefaultConfigs";

export class NewAnimal {
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
}

export class UpdateAnimal extends NewAnimal {
  @IsUUID()
  id: string;
}

export class ListAnimalsParams {
  @IsNumber()
  @Min(1)
  page = 1;

  @IsNumber()
  @Min(6)
  limit = ANIMALS_PER_PAGE;

  @IsEnum(AnimalType, {
    message: "animalType must be 'cat' or 'dog'",
  })
  @IsOptional()
  animalType?: AnimalType;
}

export class GetVaccinesParams {
  @IsEnum(AnimalType, {
    message: "type must be 'cat' or 'dog'",
  })
  type?: AnimalType;
}
