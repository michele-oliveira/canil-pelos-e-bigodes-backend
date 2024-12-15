import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { AnimalType } from "../../entities/enums/animalType.enum";

@ValidatorConstraint({ name: "isAnimalType", async: false })
export class IsAnimalType implements ValidatorConstraintInterface {
  validate(value: AnimalType, args: ValidationArguments) {
    return Object.values(AnimalType).includes(value);
  }

  defaultMessage(args: ValidationArguments) {
    const enumValues = Object.values(AnimalType);
    const joinedValues =
      enumValues.length === 2
        ? `'${enumValues[0]}' or '${enumValues[1]}'`
        : enumValues
            .slice(0, -1)
            .map((v) => `'${v}'`)
            .join(", ") + `, or '${enumValues.at(-1)}'`;

    return `${args.property} must be ${joinedValues}`;
  }
}
