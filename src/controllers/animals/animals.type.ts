import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { AnimalType } from "../../entities/enums/animalType.enum";
import { AnimalGender } from "../../entities/enums/animalGender.enum";

export class NewAnimalForAdoption {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  breed: string;

  @IsInt()
  @Min(1)
  age: number;

  @IsEnum(AnimalGender)
  gender: AnimalGender;

  @IsEnum(AnimalType)
  type: AnimalType;

  @IsArray()
  @IsString({ each: true })
  vaccineIds: string[];

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
